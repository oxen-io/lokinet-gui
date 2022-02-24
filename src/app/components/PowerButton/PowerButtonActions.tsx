import { Dispatch } from 'react';
import { appendToApplogs } from '../../../features/appLogsSlice';
import {
  markExitIsTurningOff,
  markExitFailedToLoad,
  markExitIsTurningOn
} from '../../../features/exitStatusSlice';
import { setGlobalError } from '../../../features/statusSlice';
import { addExit, deleteExit } from '../../../ipc/ipcRenderer';
import { AppDispatch, store } from '../../store';

const dispatchExitFailedToTurnOn = (dispatch: Dispatch<any>) => {
  dispatch(markExitFailedToLoad());
  // if we were are already in error for another issue, do not override that error value

  if (store.getState().status.globalError === undefined) {
    dispatch(setGlobalError('error-add-exit'));
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
        dispatch(appendToApplogs(`TurnExitOFF OK? <= ${parsed.result}`));
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
  dispatch(
    appendToApplogs(
      `TurnExitON with '${exitNode}'; auth code: '${authCode || ''}'`
    )
  );

  dispatch(markExitIsTurningOn());
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
