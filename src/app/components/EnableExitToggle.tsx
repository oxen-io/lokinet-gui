import React from 'react';
import { Badge, Flex, Spinner, Switch } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {
  markExitFailedToLoad,
  markExitIsTurningOn,
  markExitIsTurningOff,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { addExit, deleteExit } from '../../ipc/ipcRenderer';
import { AppDispatch } from '../store';
import { appendToApplogs } from '../../features/appLogsSlice';

const handleTurningOffExit = async (dispatch: AppDispatch) => {
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
        // Do nothing. At this point we are waiting for the next getStatus call
        // to send us the exit node set from the daemon.
        dispatch(appendToApplogs(`TurnExitOFF OK: <= ${parsed.result}`));
      }
    } catch (e) {
      dispatch(markExitFailedToLoad());
      dispatch(appendToApplogs(`TurnExitOFF: <= ${deleteExitResult}`));

      return;
    }
  }
};

const handleTurningOnExit = async (
  dispatch: AppDispatch,
  exitNode?: string,
  authCode?: string
) => {
  if (!exitNode) {
    dispatch(appendToApplogs(`TurnExitON => Please enter an Exit Node first`));

    dispatch(markExitFailedToLoad());
    return;
  }
  dispatch(
    appendToApplogs(`TurnExitON with '${exitNode}'; auth code: '${authCode}'`)
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
        // Do nothing. At this point we are waiting for the next getStatus call
        // to send us the exit node set from the daemon.
      }
    } catch (e) {
      dispatch(markExitFailedToLoad());
      dispatch(appendToApplogs(`TurnExitON <= ${addExitResult}`));

      return;
    }
  }
};

export const EnableExitToggle = (): JSX.Element => {
  const exitStatus = useSelector(selectExitStatus);

  const {
    exitNodeFromUser: exitNode,
    exitAuthCodeFromUser: authCode,
    exitLoading,
    exitNodeFromDaemon
  } = exitStatus;

  const dispatch = useAppDispatch();

  const isExitEnabledFromDaemon = Boolean(exitNodeFromDaemon);

  // Disable the button if the exit mode is not enabled by the daemon
  // AND the user did not enter an exit yet
  const isOffAndMissingNode =
    !isExitEnabledFromDaemon && !exitNode && !exitNodeFromDaemon;
  return (
    <Flex justify="center" align="center">
      {exitLoading ? (
        <Spinner margin="3px" marginRight="auto" />
      ) : (
        <Switch
          marginRight="auto"
          isChecked={isExitEnabledFromDaemon}
          onChange={() => {
            if (isExitEnabledFromDaemon) {
              handleTurningOffExit(dispatch);
            } else {
              handleTurningOnExit(dispatch, exitNode, authCode);
            }
          }}
          size="lg"
          aria-label="stop and start"
          colorScheme="blue"
          isDisabled={isOffAndMissingNode}
        />
      )}

      {isExitEnabledFromDaemon ? (
        <Badge colorScheme="blue">Exit Enabled</Badge>
      ) : (
        <Badge colorScheme="blue">No Exit Set</Badge>
      )}
    </Flex>
  );
};
