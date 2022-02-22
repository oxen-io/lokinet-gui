import { appendToApplogs } from '../../../features/appLogsSlice';
import {
  markExitIsTurningOff,
  markExitFailedToLoad,
  markExitIsTurningOn
} from '../../../features/exitStatusSlice';
import { addExit, deleteExit } from '../../../ipc/ipcRenderer';
import { AppDispatch } from '../../store';

export const turnExitOff = async (dispatch: AppDispatch): Promise<void> => {
  dispatch(appendToApplogs('TurnExitOFF =>'));
  dispatch(markExitIsTurningOff());
  // trigger the IPC+RPC call
  const deleteExitResult = await deleteExit();

  if (deleteExitResult) {
    try {
      const parsed = JSON.parse(deleteExitResult);
      if (parsed.error) {
        dispatch(markExitFailedToLoad());
        dispatch(appendToApplogs(`TurnExitOFF <= ${parsed.error}`));

        return;
      }
      if (parsed.result !== 'OK') {
        dispatch(markExitFailedToLoad());
        dispatch(appendToApplogs(`TurnExitOFF <= ${parsed}`));
      } else {
        // Do nothing. At this point we are waiting for the next getSummaryStatus call
        // to send us the exit node set from the daemon.
        dispatch(appendToApplogs(`TurnExitOFF OK? <= ${parsed.result}`));
      }
    } catch (e) {
      dispatch(markExitFailedToLoad());
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

    dispatch(markExitFailedToLoad());
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
        dispatch(markExitFailedToLoad());
        dispatch(appendToApplogs(`TurnExitON <= '${parsed.error}'`));

        return;
      }
      if (!parsed.result || !parsed.result.startsWith('OK: connected to')) {
        dispatch(markExitFailedToLoad());
        dispatch(appendToApplogs(`TurnExitON <= ${parsed}`));
      } else {
        dispatch(appendToApplogs(`TurnExitON <= ${parsed.result}`));
        // Do nothing. At this point we are waiting for the next getSummaryStatus call
        // to send us the exit node set from the daemon.
      }
    } catch (e) {
      dispatch(markExitFailedToLoad());
      dispatch(appendToApplogs(`TurnExitON <= ${addExitResult}`));

      return;
    }
  }
};
