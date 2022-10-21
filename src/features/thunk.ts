import { DEFAULT_EXIT_NODE } from '../../types';
import {
  getSavedExitNodesFromSettings,
  setSavedExitNodesToSettings
} from '../app/config';
import { runForAtLeast } from '../app/promiseUtils';
import { store } from '../app/store';
import {
  addExit,
  deleteExit,
  doStartLokinetProcess,
  doStopLokinetProcess,
  waitForDaemonStarted,
  waitForDaemonStopped
} from '../ipc/ipcRenderer';
import { appendToApplogs } from './appLogsSlice';
import {
  markDaemonIsTurningOn,
  markDaemonIsTurningOff,
  markAsStopped,
  markExitIsTurningOff,
  markExitIsTurningOn,
  setGlobalError,
  updateExitsFromSettings
} from './statusSlice';
import { setTabSelected } from './uiStatusSlice';

/**
 * Those async calls are redux-thunk actions. So essentially just async actions for out redux store.
 */

export async function startLokinetDaemon() {
  store.dispatch(markDaemonIsTurningOn(true));
  // this effectively trigger a start of the lokinet daemon
  try {
    await runForAtLeast(doStartLokinetProcess, 5000);
  } catch (e: any) {
    console.error('doStartLokinetProcess failed with: ', e.message);
  } finally {
    const isStarted = await waitForDaemonStarted();

    store.dispatch(markDaemonIsTurningOn(false));
    if (isStarted) {
      store.dispatch(setGlobalError(undefined));
    }
  }
}

export async function stopLokinetDaemon() {
  store.dispatch(markDaemonIsTurningOff(true));
  // this effectively trigger a stop of the lokinet daemon

  let isRunningAfterStop = true;
  try {
    await runForAtLeast(doStopLokinetProcess, 5000);
  } catch (e: any) {
    console.error('doStopLokinetProcess failed with: ', e.message);
  } finally {
    isRunningAfterStop = await waitForDaemonStopped();

    store.dispatch(markDaemonIsTurningOff(false));
    if (!isRunningAfterStop) {
      store.dispatch(markAsStopped());
      store.dispatch(setGlobalError(undefined));
    }
  }
}

const dispatchExitFailedToTurnOn = () => {
  // if we were are already in error for another issue, do not override that error value

  if (store.getState().status.globalError === undefined) {
    store.dispatch(setGlobalError('error-add-exit'));
    store.dispatch(setTabSelected('logs'));
  }
};

const dispatchExitFailedToTurnOff = (toLog: string) => {
  // if we were in error based on the exit, just remove that error as we did turn off the exit
  if (store.getState().status.globalError === 'error-add-exit') {
    store.dispatch(setGlobalError(undefined));
  }
  store.dispatch(appendToApplogs(toLog));
};

export const turnExitOff = async (): Promise<void> => {
  store.dispatch(appendToApplogs('TurnExitOFF =>'));
  store.dispatch(markExitIsTurningOff(true));

  let deleteExitResult = '';
  try {
    // trigger the IPC+RPC call
    deleteExitResult = await runForAtLeast<string>(deleteExit, 5000);
    if (!deleteExitResult) {
      throw new Error('deleteExitResult: empty result');
    }

    const parsed = JSON.parse(deleteExitResult);
    if (parsed.error) {
      dispatchExitFailedToTurnOff(
        `TurnExitOFF: failed with: "${parsed.error}"`
      );
      return;
    }
    if (parsed.result !== 'OK') {
      dispatchExitFailedToTurnOff(`TurnExitOFF: parsed NOK with "${parsed}"`);
    } else {
      // Do nothing. At this point we are waiting for the next getSummaryStatus call
      // to send us the exit node set from the daemon.
      store.dispatch(
        appendToApplogs(`TurnExitOFF: OK with content "${parsed.result}"`)
      );
    }
  } catch (e: any) {
    dispatchExitFailedToTurnOff(`TurnExitOFF: failed with "${e.message}"`);
  } finally {
    store.dispatch(markExitIsTurningOff(false));
  }
};

function updateExitsSaved(exitNode: string) {
  let existingFromSettings = getSavedExitNodesFromSettings();

  // remove any occurence of the exit node from the list.
  // as we just requested it, we want to pop it to the front
  existingFromSettings = existingFromSettings.filter((m) => m !== exitNode);

  // add exitNode to the front
  existingFromSettings.unshift(exitNode);

  // remove any exit mode if we have too many saved already
  if (existingFromSettings.length > 5) {
    existingFromSettings.pop();
  }
  // we always wait exit.loki to be one of the option saved
  if (!existingFromSettings.includes(DEFAULT_EXIT_NODE)) {
    // remove the last element and add default exit node as last item
    existingFromSettings.pop();
    existingFromSettings.push(DEFAULT_EXIT_NODE);
  }
  setSavedExitNodesToSettings(existingFromSettings);
  store.dispatch(updateExitsFromSettings(existingFromSettings));
}

const MAX_RETRY_TIMEOUT = 11000;

export const turnExitOn = async (
  exitNode?: string,
  authCode?: string
): Promise<void> => {
  if (!exitNode) {
    store.dispatch(
      appendToApplogs(`TurnExitON => Please enter an Exit Node first`)
    );

    dispatchExitFailedToTurnOn();
    return;
  }
  const toAppendToLogs = `TurnExitON with '${exitNode}' ${
    authCode ? `and auth code: ${authCode}` : ' and no auth code.'
  }`;
  store.dispatch(appendToApplogs(toAppendToLogs));
  store.dispatch(markExitIsTurningOn(true));

  updateExitsSaved(exitNode);

  // trigger the IPC+RPC call
  let addExitResult = '';

  let parsed;
  try {
    console.time('addExit');

    addExitResult = await runForAtLeast<string>(
      () => addExit(exitNode, authCode),
      5000
    );
    if (!addExitResult) {
      throw new Error('addExit: Empty result');
    }

    parsed = JSON.parse(addExitResult);
    if (parsed.error) {
      dispatchExitFailedToTurnOn();
      console.info(`TurnExitON: failed with '${parsed.error}'`);
      store.dispatch(
        appendToApplogs(`TurnExitON: failed with '${parsed.error}'`)
      );
      return;
    }

    if (!parsed.result || !parsed.result.startsWith('OK: connected to')) {
      console.info(`TurnExitON: '${parsed}'`);

      dispatchExitFailedToTurnOn();
      store.dispatch(
        appendToApplogs(`TurnExitON: invalid parsed content: ${parsed}`)
      );
    } else {
      store.dispatch(
        appendToApplogs(`TurnExitON: OK with result "${parsed.result}"`)
      );
      // Do nothing. At this point we are waiting for the next getSummaryStatus call
      // to send us the exit node set from the daemon.
    }
  } catch (e: any) {
    console.info(`TurnExitON: '${addExitResult}', ${e}`);

    dispatchExitFailedToTurnOn();
    store.dispatch(appendToApplogs(`TurnExitON: failed with ${e.message}`));

    return;
  } finally {
    console.timeEnd('addExit');

    store.dispatch(markExitIsTurningOn(false));
  }
};
