/* eslint-disable @typescript-eslint/no-explicit-any */

import Electron from 'electron';
const { ipcRenderer } = Electron;
import { clone, forEach, isEmpty, isFunction, isString } from 'lodash';
import crypto from 'crypto';
import {
  IPC_CHANNEL_KEY,
  IPC_GLOBAL_ERROR,
  IPC_LOG_LINE,
  StatusErrorType
} from '../../sharedIpc';
import { appendToAppLogsOutsideRedux, setErrorOutsideRedux } from '../app/app';
import { store } from '../app/store';
import {
  markAsStopped,
  markDaemonIsTurningOn,
  markInitialDaemonStartDone
} from '../features/statusSlice';
import { startLokinetDaemon } from '../features/thunk';

const channelsFromRendererToMainToMake = {
  // rpc calls (zeromq calls)
  getSummaryStatus,
  addExit,
  deleteExit,
  // lokinet process manager calls
  doStartLokinetProcess,
  doStopLokinetProcess,
  // utility calls
  markRendererReadyOnNodeSide,
  minimizeToTray
};
const channels = {} as any;
const _jobs = Object.create(null);

export const POLLING_STATUS_INTERVAL_MS = 500;

// shutting down clean handling
let _shuttingDown = false;
let _shutdownCallback: any = null;
let _shutdownPromise: any = null;

export async function getSummaryStatus(): Promise<string> {
  return channels.getSummaryStatus();
}

export async function addExit(
  exitAddress: string,
  exitToken?: string
): Promise<string> {
  console.info(
    `Triggering exit node set with node ${exitAddress}, authCode:${exitToken}`
  );
  return channels.addExit(clone(exitAddress), clone(exitToken));
}

export async function deleteExit(): Promise<string> {
  return channels.deleteExit();
}

export async function doStopLokinetProcess(): Promise<string | null> {
  return channels.doStopLokinetProcess('doStopLokinetProcess');
}

export async function doStartLokinetProcess(): Promise<string | null> {
  return channels.doStartLokinetProcess('doStartLokinetProcess');
}

export async function markRendererReadyOnNodeSide(): Promise<void> {
  channels.markRendererReadyOnNodeSide('renderer-is-ready-job-id');
}

export async function minimizeToTray(): Promise<void> {
  channels.minimizeToTray('minimizeToTray');
}

export async function checkIfDaemonRunning(): Promise<boolean> {
  try {
    // this calls timeouts after TIMEOUT_GET_SUMMARY_STATUS ms.
    // if it does timeout, an exception is thrown

    appendToAppLogsOutsideRedux(`checking if the lokinet daemon replies...`);
    const statusAsString = await getSummaryStatus();
    if (!isEmpty(statusAsString)) {
      appendToAppLogsOutsideRedux(`Lokinet daemon did reply.`);

      return true;
    }
    throw new Error('empty status for checkIfDaemonRunning ');
  } catch (e) {
    appendToAppLogsOutsideRedux(`Lokinet daemon did not reply.`);

    return false;
  }
}

/**
 * When the renderer starts, we need to initialize the IPC listeners before we can communicate from node <-> renderer.
 *
 *
 * This function creates all the channels needed for communication, and then sends an event to the node side so the node side do what could not be done before the renderer was ready.
 * This includes for instance subscribing the lokinet logs. We need the listeners to be set in the rendere for the subscribing to make sense.
 */
export async function initializeIpcRendererSide(): Promise<void> {
  // We listen to a lot of events on ipcRenderer, often on the same channel. This prevents
  //   any warnings that might be sent to the console in that case.
  ipcRenderer.setMaxListeners(0);

  forEach(channelsFromRendererToMainToMake, (fn) => {
    if (isFunction(fn)) {
      makeChannel(fn.name);
    }
  });

  ipcRenderer.on(IPC_LOG_LINE, (_event, logLine: string) => {
    if (isString(logLine) && !isEmpty(logLine)) {
      appendToAppLogsOutsideRedux(logLine);
    }
  });

  ipcRenderer.on(IPC_GLOBAL_ERROR, (_event, globalError: StatusErrorType) => {
    setErrorOutsideRedux(globalError);
  });

  ipcRenderer.on(
    `${IPC_CHANNEL_KEY}-done`,
    (_event, jobId, errorForDisplay, result: string | null) => {
      const job = _getJob(jobId);
      if (!job) {
        console.info(
          `Received IPC channel reply to job ${jobId}, but did not have it in our registry!`
        );
        return;
      }
      const { resolve, reject, fnName } = job;

      if (errorForDisplay) {
        return reject(
          new Error(
            `Error received from IPC channel job ${jobId} (${fnName}): ${errorForDisplay}`
          )
        );
      }

      return resolve(result);
    }
  );

  const isDaemonAlreadyRunning = await checkIfDaemonRunning();
  if (!isDaemonAlreadyRunning) {
    await startLokinetDaemon();
  }
  // this starts the subscribing of the logs from the lokinet daemon
  await markRendererReadyOnNodeSide();
  // unlock the polls of getSummaryStatus on the main app, as the daemon should be running now
  store.dispatch(markInitialDaemonStartDone());
  store.dispatch(markDaemonIsTurningOn(false));

}

async function _shutdown() {
  if (_shutdownPromise) {
    return _shutdownPromise;
  }

  _shuttingDown = true;

  const jobKeys = Object.keys(_jobs);
  console.log(
    `data.shutdown: starting process. ${jobKeys.length} jobs outstanding`
  );

  // No outstanding jobs, return immediately
  if (jobKeys.length === 0) {
    return null;
  }

  // Outstanding jobs; we need to wait until the last one is done
  _shutdownPromise = new Promise((resolve, reject) => {
    _shutdownCallback = (error: any) => {
      console.log('data.shutdown: process complete');
      if (error) {
        return reject(error);
      }

      return resolve(undefined);
    };
  });

  return _shutdownPromise;
}

function _makeJob(fnName: string) {
  if (_shuttingDown && fnName !== 'closeRpcConnection') {
    throw new Error(
      `Rejecting IPC channel job (${fnName}); application is shutting down`
    );
  }

  const jobId = crypto.randomBytes(15).toString('hex');

  _jobs[jobId] = {
    fnName
  };

  return jobId;
}

function _updateJob(
  id: string,
  data: {
    resolve: (value: any) => void;
    reject: (error: any) => void;
    args: any;
  }
) {
  const { resolve, reject } = data;

  _jobs[id] = {
    ..._jobs[id],
    ...data,
    resolve: (value: any) => {
      _removeJob(id);
      return resolve(value);
    },
    reject: (error: any) => {
      _removeJob(id);
      return reject(error);
    }
  };
}

function _removeJob(id: string) {
  if (_jobs[id].timer) {
    clearTimeout(_jobs[id].timer);
    _jobs[id].timer = null;
  }

  // tslint:disable-next-line: no-dynamic-delete
  delete _jobs[id];

  if (_shutdownCallback) {
    const keys = Object.keys(_jobs);
    if (keys.length === 0) {
      _shutdownCallback();
    }
  }
}

function _getJob(id: string) {
  return _jobs[id];
}

const TIMEOUT_GET_SUMMARY_STATUS = 1000;
const TIMEOUT_GET_OTHER_CALLS = 20000;

function makeChannel(fnName: string) {
  channels[fnName] = async (...args: any) => {
    const jobId = _makeJob(fnName);

    return new Promise((resolve, reject) => {
      ipcRenderer?.send(IPC_CHANNEL_KEY, jobId, fnName, ...args);

      _updateJob(jobId, {
        resolve,
        reject,
        args
      });

      /**
       * We want getSummaryStatus to timeout quickly. (TIMEOUT_GET_SUMMARY_STATUS ms)
       * All other calls can take up to TIMEOUT_GET_OTHER_CALLS ms to timeout
       */
      const timerForThisCall =
        fnName === 'getSummaryStatus'
          ? TIMEOUT_GET_SUMMARY_STATUS
          : TIMEOUT_GET_OTHER_CALLS;

      _jobs[jobId].timer = setTimeout(() => {
        const logline = `IPC channel job ${jobId}: ${fnName} timed out after ${timerForThisCall}ms`;
        appendToAppLogsOutsideRedux(logline);

        // if you ever find that this is run because one of your called timedout, it's because you need to send the ipc reply (look at `sendIpcReplyAndDeleteJob`)
        if (fnName === 'getSummaryStatus') {
          console.log(logline);

          store.dispatch(markAsStopped());
        }
        _removeJob(jobId);
        reject(`${fnName}: timedout after ${timerForThisCall} `);
      }, timerForThisCall);
    });
  };
}

export async function shutdown(): Promise<void> {
  // Stop accepting new SQL jobs, flush outstanding queue
  await _shutdown();
  await closeRpcConnection();
}
// Note: will need to restart the app after calling this, to set up afresh
export async function closeRpcConnection(): Promise<void> {
  await channels.closeRpcConnection();
}

/**
 * This interface defines what we get when parsing the status from the daemon itself.
 */
export interface DaemonSummaryStatus {
  isRunning: boolean;
  initialDaemonStartDone: boolean;
  globalError: StatusErrorType;
  uptime?: number;
  version?: string;
  numPeersConnected: number;
  uploadUsage: number;
  downloadUsage: number;
  lokiAddress: string;
  numPathsBuilt: number;
  numRoutersKnown: number;
  ratio: string;

  // those 2 fields will be set once exitLoading is done loading with what the daemon gave us back.
  exitNodeFromDaemon?: string;
  exitAuthCodeFromDaemon?: string;
}

export const defaultDaemonSummaryStatus: DaemonSummaryStatus = {
  isRunning: false,
  initialDaemonStartDone: false,
  globalError: undefined,
  uptime: undefined,
  version: undefined,
  numPeersConnected: 0,
  uploadUsage: 0,
  downloadUsage: 0,
  lokiAddress: '',
  numPathsBuilt: 0,
  numRoutersKnown: 0,
  ratio: '',
  exitNodeFromDaemon: undefined,
  exitAuthCodeFromDaemon: undefined
};

export const parseSummaryStatus = (
  payload: string,
  error?: string
): DaemonSummaryStatus => {
  let stats = null;

  if (!payload || isEmpty(payload)) {
    return defaultDaemonSummaryStatus;
  }

  // We can either have an error of communication, or an error on the returned JSON
  if (!error) {
    try {
      stats = JSON.parse(payload);
    } catch (e) {
      console.log("Couldn't parse 'summaryStatus' JSON-RPC payload", e);
    }
  }
  // if we got an error, just return isRunning false.
  // the redux store will reset all values to their default.
  if (error || stats.error) {
    console.info('We got an error for Status: ', error || stats.error);
    return defaultDaemonSummaryStatus;
  }
  const statsResult = stats.result;
  const parsedSummaryStatus: DaemonSummaryStatus = defaultDaemonSummaryStatus;

  if (!statsResult || isEmpty(statsResult)) {
    console.info('We got an empty statsResult');
    return parsedSummaryStatus;
  }

  parsedSummaryStatus.numPeersConnected = statsResult.numPeersConnected;
  // we're polling every 500ms, so our per-second rate is half of the
  // rate we tallied up in this sample
  const txRate = statsResult.txRate || 0;
  const rxRate = statsResult.rxRate || 0;
  parsedSummaryStatus.uploadUsage =
    (txRate * POLLING_STATUS_INTERVAL_MS) / 1000;
  parsedSummaryStatus.downloadUsage =
    (rxRate * POLLING_STATUS_INTERVAL_MS) / 1000;

  parsedSummaryStatus.isRunning = statsResult.running || false;
  parsedSummaryStatus.numRoutersKnown = statsResult.numRoutersKnown || 0;

  parsedSummaryStatus.lokiAddress = statsResult.lokiAddress || '';
  parsedSummaryStatus.uptime = statsResult.uptime || 0;
  parsedSummaryStatus.version = statsResult.version || '';

  const exitMap = statsResult.exitMap;
  if (exitMap) {
    // exitMap should be of length 1 only, but it's an object with keys an IP (not as string)
    // so easier to parse it like this
    for (const k in exitMap) {
      parsedSummaryStatus.exitNodeFromDaemon = exitMap[k];
    }
  } else {
    parsedSummaryStatus.exitNodeFromDaemon = undefined;
  }
  const authCodes = statsResult?.authCodes || undefined;

  if (authCodes) {
    for (const lokiExit in authCodes) {
      const auth = statsResult?.authCodes[lokiExit];
      parsedSummaryStatus.exitAuthCodeFromDaemon = auth;
    }
  } else {
    parsedSummaryStatus.exitAuthCodeFromDaemon = undefined;
  }

  parsedSummaryStatus.ratio = `${Math.ceil(statsResult?.ratio * 100 || 0)}%`;

  parsedSummaryStatus.numPathsBuilt = statsResult.numPathsBuilt;
  return parsedSummaryStatus;
};
