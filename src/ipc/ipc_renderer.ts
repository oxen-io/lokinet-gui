/* eslint-disable @typescript-eslint/no-explicit-any */

import Electron from 'electron';
const { ipcRenderer } = Electron;
import _ from 'lodash';
import crypto from 'crypto';
import { IPC_CHANNEL_KEY } from '../../electron/shared_ipc';

const DEBUG_IPC_CALLS = true;
const IPC_UPDATE_TIMEOUT = 5 * 1000; // 5 secs

const channelsToMake = {
  getVersion,
  getStatus
};
const channels = {} as any;
export const _jobs = Object.create(null);

// shutting down clean handling
let _shuttingDown = false;
let _shutdownCallback: any = null;
let _shutdownPromise: any = null;

export async function getVersion(): Promise<string> {
  return channels.getVersion();
}

export async function getStatus(): Promise<string> {
  return channels.getStatus();
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
      console.warn('IPC_CHANNEL_KEY}-done called');
      const job = _getJob(jobId);
      if (!job) {
        throw new Error(
          `Received IPC channel reply to job ${jobId}, but did not have it in our registry!`
        );
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
    console.log(`IPC channel job ${jobId} (${fnName}) started`);
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

// const forEachSession = (visit, stats) => {
//   const st = stats.result;
//   for (const idx in st.links) {
//     if (!st.links[idx]) continue;
//     else {
//       const links = st.links[idx];
//       for (const l_idx in links) {
//         const link = links[l_idx];
//         if (!link) continue;
//         const peers = link.sessions.established;
//         for (const p_idx in peers) {
//           visit(peers[p_idx]);
//         }
//       }
//     }
//   }
// };

// export const parseStateResults = (payload: string, error?: string) => {
//   let stats = null;

//   const toReturn = new Object(null) as any;

//   if (!error) {
//     try {
//       stats = JSON.parse(payload);
//     } catch (e) {
//       console.log("Couldn't parse 'stateResult' JSON-RPC payload", err);
//     }
//   }

//   // if we got an error, just return isRunning false.
//   // the redux store will reset all values to their default.
//   if (error) {
//     toReturn.isRunning = false;
//     return toReturn;
//   }

//   // calculate our new state in local scope before updating global scope
//   let newConnected = !error && stats != null;
//   let newRunning = false;
//   let newLokiAddress = '';
//   let newLokiExit = '';
//   let newNumRouters = 0;
//   let newNumPaths = 0;
//   let txRate = 0;
//   let rxRate = 0;
//   let peers = 0;
//   let ratio = 0;

//   try {
//     forEachSession((s: any) => {
//       txRate += s.tx;
//       rxRate += s.rx;
//       peers += 1;
//     }, stats);
//   } catch (err) {
//     txRate = 0;
//     rxRate = 0;
//     peers = 0;
//     console.log("Couldn't pull tx/rx of payload", err);
//   }

//   // we're polling every 500ms, so our per-second rate is half of the
//   // rate we tallied up in this sample
//   // TODO: don't be so sloppy
//   uploadUsage = txRate / 2;
//   downloadUsage = rxRate / 2;

//   numPeersConnected = peers;
//   try {
//     newRunning = stats.result.running;
//   } catch (err) {
//     console.log("Couldn't pull running status of payload", err);
//   }

//   try {
//     newLokiAddress = stats.result.services.default.identity;
//   } catch (err) {
//     console.log("Couldn't pull loki address out of payload", err);
//   }

//   try {
//     var exitMap = stats.result.services.default.exitMap;
//     if (exitMap) {
//       for (var k in exitMap) {
//         newLokiExit = exitMap[k];
//       }
//     }
//   } catch (err) {
//     console.log("Couldn't pull exit address out of payload", err);
//   }
// };
