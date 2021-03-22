/* eslint-disable @typescript-eslint/no-explicit-any */

import Electron from 'electron';
const { ipcRenderer } = Electron;
import _ from 'lodash';
import crypto from 'crypto';
import {
  DEBUG_IPC_CALLS,
  DEBUG_IPC_CALLS_GET_STATUS,
  IPC_CHANNEL_KEY
} from '../../sharedIpc';

const IPC_UPDATE_TIMEOUT = 1000; // 5 minutes

const channelsToMake = {
  getUpTimeAndVersion,
  getStatus,
  addExit,
  deleteExit,
  setConfig,
  doStartLokinetProcess,
  doStopLokinetProcess
};
const channels = {} as any;
const _jobs = Object.create(null);

export const POLLING_STATUS_INTERVAL_MS = 500;
export const POLLING_GENERAL_INFOS_INTERVAL_MS = 1000;

// shutting down clean handling
let _shuttingDown = false;
let _shutdownCallback: any = null;
let _shutdownPromise: any = null;

export async function getUpTimeAndVersion(): Promise<string> {
  return channels.getUpTimeAndVersion();
}

export async function getStatus(): Promise<string> {
  return channels.getStatus();
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

export async function doStartLokinetProcess(): Promise<boolean> {
  return channels.doStartLokinetProcess();
}

export async function doStopLokinetProcess(): Promise<boolean> {
  return channels.doStopLokinetProcess();
}
export async function setConfig(
  section: string,
  key: string,
  value: string
): Promise<string> {
  return channels.setConfig(section, key, value);
}

export function initializeIpcRendererSide(): void {
  // We listen to a lot of events on ipcRenderer, often on the same channel. This prevents
  //   any warnings that might be sent to the console in that case.
  ipcRenderer.setMaxListeners(0);

  _.forEach(channelsToMake, (fn) => {
    if (_.isFunction(fn)) {
      makeChannel(fn.name);
    }
  });

  ipcRenderer.on(
    `${IPC_CHANNEL_KEY}-done`,
    (event, jobId, errorForDisplay, result) => {
      const job = _getJob(jobId);
      if (!job) {
        console.warn(
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

      if (
        (fnName === 'getStatus' && DEBUG_IPC_CALLS_GET_STATUS) ||
        (fnName !== 'getStatus' && DEBUG_IPC_CALLS)
      ) {
        // console.log(
        //   `IPC channel job ${jobId} (${fnName}) finished with: ${result}`
        // );
      }

      return resolve(result);
    }
  );
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
  if (_shuttingDown && fnName !== 'close') {
    throw new Error(
      `Rejecting IPC channel job (${fnName}); application is shutting down`
    );
  }

  const jobId = crypto.randomBytes(15).toString('hex');

  if (DEBUG_IPC_CALLS) {
    // console.log(`IPC channel job ${jobId} (${fnName}) started`);
  }
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
  if (DEBUG_IPC_CALLS) {
    _jobs[id].complete = true;
    return;
  }

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

      _jobs[jobId].timer = setTimeout(
        () =>
          reject(new Error(`IPC channel job ${jobId} (${fnName}) timed out`)),
        IPC_UPDATE_TIMEOUT
      );
    });
  };
}

export async function shutdown(): Promise<void> {
  // Stop accepting new SQL jobs, flush outstanding queue
  await _shutdown();
  await close();
}
// Note: will need to restart the app after calling this, to set up afresh
export async function close(): Promise<void> {
  await channels.close();
}

const forEachSession = (visit: any, stats: any) => {
  const st = stats.result;
  for (const idx in st.links) {
    if (!st.links[idx]) continue;
    else {
      const links = st.links[idx];
      for (const l_idx in links) {
        const link = links[l_idx];
        if (!link) continue;
        const peers = link.sessions.established;
        for (const p_idx in peers) {
          visit(peers[p_idx]);
        }
      }
    }
  }
};

export interface DaemonStatus {
  isRunning: boolean;
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

export interface ParsedGeneralInfosFromDaemon {
  uptime: number;
  version: string;
}

export const defaultDaemonStatus = {
  isRunning: false,
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

export const defaultParsedGeneralInfosFromDaemon = {
  version: '',
  uptime: 0
};

export const parseStateResults = (
  payload: string,
  error?: string
): DaemonStatus => {
  let stats = null;
  const parsedState: DaemonStatus = defaultDaemonStatus;

  // We can either have an error of communication, or an error on the returned JSON
  if (!error) {
    try {
      stats = JSON.parse(payload);
    } catch (e) {
      console.log("Couldn't parse 'stateResult' JSON-RPC payload", e);
    }
  }

  // if we got an error, just return isRunning false.
  // the redux store will reset all values to their default.
  if (error || stats.error) {
    console.warn('We got an error for Status: ', error || stats.error);
    return parsedState;
  }

  let txRate = 0;
  let rxRate = 0;
  let peers = 0;
  try {
    forEachSession((s: any) => {
      txRate += s.tx;
      rxRate += s.rx;
      peers += 1;
    }, stats);
    parsedState.numPeersConnected = peers;
  } catch (err) {
    parsedState.numPeersConnected = 0;
    console.log("Couldn't pull tx/rx of payload", err);
  }

  // we're polling every 500ms, so our per-second rate is half of the
  // rate we tallied up in this sample
  parsedState.uploadUsage = (txRate * POLLING_STATUS_INTERVAL_MS) / 1000;
  parsedState.downloadUsage = (rxRate * POLLING_STATUS_INTERVAL_MS) / 1000;

  parsedState.isRunning = stats?.result?.running || false;
  parsedState.numRoutersKnown = stats?.result?.numNodesKnown || 0;

  parsedState.lokiAddress = stats?.result?.services?.default?.identity || '';
  parsedState.numPathsBuilt = stats?.result?.services?.default?.identity || '';

  const exitMap = stats?.result?.services?.default?.exitMap;
  if (exitMap) {
    // exitMap should be of length 1 only, but it's an object with keys an IP (not as string)
    // so easier to parse it like this
    for (const k in exitMap) {
      parsedState.exitNode = exitMap[k];
    }
  } else {
    parsedState.exitNode = undefined;
  }
  const authCodes = stats?.result?.services?.default?.authCodes || undefined;

  if (authCodes) {
    for (const lokiExit in authCodes) {
      const auth = stats?.result?.services?.default?.authCodes[lokiExit];
      parsedState.exitAuthCode = auth;
    }
  } else {
    parsedState.exitAuthCode = undefined;
  }

  // compute all stats on all path builders on the default endpoint
  // Merge snodeSessions, remoteSessions and default into a single array
  const builders = new Array<any>();
  const snodeSessions = stats?.result?.services?.default?.snodeSessions || [];
  snodeSessions.forEach((session: any) => {
    builders.push(session);
  });

  const remoteSessions = stats?.result?.services?.default?.remoteSessions || [];
  remoteSessions.forEach((session: any) => {
    builders.push(session);
  });

  const defaultService = stats?.result?.services?.default;
  if (defaultService) {
    builders.push(defaultService);
  }

  // Iterate over all items on this array to build the global pathStats
  const pathStats = builders.reduce(
    (accumulator, currentItem) => {
      accumulator.paths += currentItem?.paths?.length || 0;
      accumulator.success += currentItem?.buildStats?.success || 0;
      accumulator.attempts += currentItem?.buildStats?.attempts || 0;
      return accumulator;
    },
    {
      paths: 0,
      success: 0,
      attempts: 0
    }
  );
  const ratio = (pathStats.success * 100) / (pathStats.attempts + 1);
  parsedState.ratio = `${Math.ceil(ratio)}%`;

  parsedState.numPathsBuilt = pathStats.paths;
  return parsedState;
};

export const parseGeneralInfos = (
  payload: string,
  error?: string
): ParsedGeneralInfosFromDaemon => {
  let stats = null;
  const parsedGeneralsInfos: ParsedGeneralInfosFromDaemon = defaultParsedGeneralInfosFromDaemon;

  if (!error) {
    try {
      stats = JSON.parse(payload);
    } catch (e) {
      console.log("Couldn't parse 'stateResult' JSON-RPC payload", e);
    }
  }

  // if we got an error, just return isRunning false.
  // the redux store will reset all values to their default.
  if (error || stats.error) {
    console.warn('We got an error for GeneralsInfos: ', error || stats.error);
    return parsedGeneralsInfos;
  }

  parsedGeneralsInfos.uptime = stats?.result?.uptime || 0;
  parsedGeneralsInfos.version = stats?.result?.version || '';
  return parsedGeneralsInfos;
};
