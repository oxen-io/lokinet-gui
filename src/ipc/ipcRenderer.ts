/* eslint-disable @typescript-eslint/no-explicit-any */

import Electron from 'electron';
const { ipcRenderer } = Electron;
import _ from 'lodash';
import crypto from 'crypto';
import {
  DEBUG_IPC_CALLS,
  IPC_CHANNEL_KEY,
  IPC_GLOBAL_ERROR,
  IPC_LOG_LINE,
  StatusErrorType
} from '../../sharedIpc';
import {
  appendToAppLogsOutsideRedux,
  markAsStoppedOutsideRedux,
  setErrorOutsideRedux
} from '../app/app';

const IPC_UPDATE_TIMEOUT = 10000; // 10 secs

const channelsFromRendererToMainToMake = {
  // rpc calls (zeromq calls)
  getSummaryStatus,
  addExit,
  deleteExit,
  setConfig,
  // lokinet process manager calls
  doStopLokinetProcess,
  // utility calls
  markRendererReady,
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
  return channels.addExit(exitAddress, exitToken);
}

export async function deleteExit(): Promise<string> {
  return channels.deleteExit();
}

export async function doStopLokinetProcess(
  duringAppExit?: boolean
): Promise<string | null> {
  return channels.doStopLokinetProcess(duringAppExit);
}

export async function markRendererReady(): Promise<void> {
  channels.markRendererReady();
}

export async function minimizeToTray(): Promise<void> {
  channels.minimizeToTray();
}
export async function setConfig(
  section: string,
  key: string,
  value: string
): Promise<string> {
  return channels.setConfig(section, key, value);
}

export async function initializeIpcRendererSide(): Promise<void> {
  // We listen to a lot of events on ipcRenderer, often on the same channel. This prevents
  //   any warnings that might be sent to the console in that case.
  ipcRenderer.setMaxListeners(0);

  _.forEach(channelsFromRendererToMainToMake, (fn) => {
    if (_.isFunction(fn)) {
      makeChannel(fn.name);
    }
  });

  ipcRenderer.on(IPC_LOG_LINE, (_event, logLine: string) => {
    if (_.isString(logLine) && !_.isEmpty(logLine)) {
      appendToAppLogsOutsideRedux(logLine);
    }
  });

  ipcRenderer.on(IPC_GLOBAL_ERROR, (_event, globalError: StatusErrorType) => {
    setErrorOutsideRedux(globalError);
  });

  ipcRenderer.on(
    `${IPC_CHANNEL_KEY}-done`,
    (event, jobId, errorForDisplay, result: string | null) => {
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

  const jobId = `markRendererReady-${Date.now()}`;
  channels.markRendererReady(jobId);
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

function _updateJob(id: string, data: any) {
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

function makeChannel(fnName: string) {
  channels[fnName] = async (...args: any) => {
    const jobId = _makeJob(fnName);

    return new Promise((resolve, reject) => {
      ipcRenderer.send(IPC_CHANNEL_KEY, jobId, fnName, ...args);

      _updateJob(jobId, {
        resolve,
        reject,
        args: DEBUG_IPC_CALLS ? args : null
      });

      _jobs[jobId].timer = setTimeout(() => {
        const logline = `IPC channel job ${jobId}: ${fnName} timed out at ${Date.now()}`;
        appendToAppLogsOutsideRedux(logline);
        // except if that was our stop call, consider that this means the lokinet daemon is not running
        if (fnName !== 'doStopLokinetProcess') {
          markAsStoppedOutsideRedux();
        }

        // reject(new Error(logline));
      }, IPC_UPDATE_TIMEOUT);
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

export interface DaemonSummaryStatus {
  isRunning: boolean;
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
  exitNode?: string;
  exitAuthCode?: string;
}

export const defaultDaemonSummaryStatus: DaemonSummaryStatus = {
  isRunning: false,
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
  exitNode: undefined,
  exitAuthCode: undefined
};

export const parseSummaryStatus = (
  payload: string,
  error?: string
): DaemonSummaryStatus => {
  let stats = null;

  if (!payload || _.isEmpty(payload)) {
    console.info('Empty payload for summary status');
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

  if (!statsResult || _.isEmpty(statsResult)) {
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
      parsedSummaryStatus.exitNode = exitMap[k];
    }
  } else {
    parsedSummaryStatus.exitNode = undefined;
  }
  const authCodes = statsResult?.authCodes || undefined;

  if (authCodes) {
    for (const lokiExit in authCodes) {
      const auth = statsResult?.authCodes[lokiExit];
      parsedSummaryStatus.exitAuthCode = auth;
    }
  } else {
    parsedSummaryStatus.exitAuthCode = undefined;
  }

  parsedSummaryStatus.ratio = `${Math.ceil(statsResult?.ratio * 100 || 0)}%`;

  parsedSummaryStatus.numPathsBuilt = statsResult.numPathsBuilt;
  return parsedSummaryStatus;
};
