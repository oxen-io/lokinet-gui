import { Dispatch } from 'react';
import { DEFAULT_EXIT_NODE } from '../../../../types';
import { appendToApplogs } from '../../../features/appLogsSlice';
import {
  markExitIsTurningOff,
  markExitFailedToLoad,
  markExitIsTurningOn,
  updateExitsFromSettings
} from '../../../features/exitStatusSlice';
import { setGlobalError } from '../../../features/statusSlice';
import { setTabSelected } from '../../../features/uiStatusSlice';
import { addExit, deleteExit } from '../../../ipc/ipcRenderer';
import {
  getSavedExitNodesFromSettings,
  setSavedExitNodesToSettings
} from '../../config';
import { AppDispatch, store } from '../../store';

const dispatchExitFailedToTurnOn = (dispatch: Dispatch<any>) => {
  dispatch(markExitFailedToLoad());
  // if we were are already in error for another issue, do not override that error value

  if (store.getState().status.globalError === undefined) {
    dispatch(setGlobalError('error-add-exit'));
    dispatch(setTabSelected('logs'));
  }
};

const dispatchExitFailedToTurnOff = (dispatch: Dispatch<any>) => {
  dispatch(markExitFailedToLoad());
  // if we were in error based on the exit, just remove that error as we did turn off the exit
  if (store.getState().status.globalError === 'error-add-exit') {
    dispatch(setGlobalError(undefined));
  }
};

export const turnExitOff = async (dispatch: AppDispatch): Promise<void> => {
  dispatch(appendToApplogs('TurnExitOFF =>'));
  dispatch(markExitIsTurningOff());
  // trigger the IPC+RPC call
  const deleteExitResult = await deleteExit();

  if (deleteExitResult) {
    try {
      const parsed = JSON.parse(deleteExitResult);
      if (parsed.error) {
        dispatchExitFailedToTurnOff(dispatch);
        dispatch(appendToApplogs(`TurnExitOFF <= ${parsed.error}`));

        return;
      }
      if (parsed.result !== 'OK') {
        dispatchExitFailedToTurnOff(dispatch);
        dispatch(appendToApplogs(`TurnExitOFF <= ${parsed}`));
      } else {
        // Do nothing. At this point we are waiting for the next getSummaryStatus call
        // to send us the exit node set from the daemon.
        dispatch(appendToApplogs(`TurnExitOFF OK result <= ${parsed.result}`));
      }
    } catch (e) {
      dispatchExitFailedToTurnOff(dispatch);
      dispatch(appendToApplogs(`TurnExitOFF: <= ${deleteExitResult}`));

      return;
    }
  }
};

export const turnExitOn = async (
  dispatch: AppDispatch,
  exitNode?: string,
  authCode?: string
): Promise<void> => {
  if (!exitNode) {
    dispatch(appendToApplogs(`TurnExitON => Please enter an Exit Node first`));

    dispatchExitFailedToTurnOn(dispatch);
    return;
  }
  const toAppendToLogs = `TurnExitON with '${exitNode}' ${
    authCode ? `and auth code: ${authCode}` : ' and no auth code.'
  }'`;
  dispatch(appendToApplogs(toAppendToLogs));

  dispatch(markExitIsTurningOn());
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
  dispatch(updateExitsFromSettings(existingFromSettings));

  // trigger the IPC+RPC call
  const addExitResult = await addExit(exitNode, authCode);

  if (addExitResult) {
    try {
      const parsed = JSON.parse(addExitResult);
      if (parsed.error) {
        dispatchExitFailedToTurnOn(dispatch);
        dispatch(appendToApplogs(`TurnExitON <= '${parsed.error}'`));

        return;
      }
      if (!parsed.result || !parsed.result.startsWith('OK: connected to')) {
        dispatchExitFailedToTurnOn(dispatch);
        dispatch(appendToApplogs(`TurnExitON <= ${parsed}`));
      } else {
        dispatch(appendToApplogs(`TurnExitON <= ${parsed.result}`));
        // Do nothing. At this point we are waiting for the next getSummaryStatus call
        // to send us the exit node set from the daemon.
      }
    } catch (e) {
      dispatchExitFailedToTurnOn(dispatch);
      dispatch(appendToApplogs(`TurnExitON <= ${addExitResult}`));

      return;
    }
  }
};
