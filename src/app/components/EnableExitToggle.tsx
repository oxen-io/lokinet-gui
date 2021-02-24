import React from 'react';
import { Button } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {
  markExitFailedToLoad,
  markExitIsTurningOn,
  markExitIsTurningOff,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { addExit, deleteExit } from '../../ipc/ipc_renderer';
import { AppDispatch } from '../store';

const handleTurningOffExit = async (dispatch: AppDispatch) => {
  dispatch(markExitIsTurningOff());
  // trigger the IPC+RPC call
  const deleteExitResult = await deleteExit();

  if (deleteExitResult) {
    try {
      const parsed = JSON.parse(deleteExitResult);
      if (parsed.error) {
        dispatch(
          markExitFailedToLoad(`DeleteExit: Daemon says '${parsed.error}'`)
        );
        return;
      }
      if (parsed.result !== 'OK') {
        dispatch(
          markExitFailedToLoad(`DeleteExit: Daemon says ${parsed.error}`)
        );
      } else {
        // Do nothing. At this point we are waiting for the next getStatus call
        // to send us the exit node set from the daemon.
      }
    } catch (e) {
      dispatch(
        markExitFailedToLoad(
          `Couldn't parse result from deleteExit: '${deleteExitResult}'`
        )
      );
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
    dispatch(markExitFailedToLoad('Please enter an Exit Node address first.'));
    return;
  }
  dispatch(markExitIsTurningOn());
  // trigger the IPC+RPC call
  const addExitResult = await addExit(exitNode, authCode);

  if (addExitResult) {
    try {
      const parsed = JSON.parse(addExitResult);
      if (parsed.error) {
        dispatch(
          markExitFailedToLoad(
            `AddExit with ${exitNode}: Daemon says '${parsed.error}'`
          )
        );
        return;
      }
      if (parsed.result !== 'OK') {
        dispatch(markExitFailedToLoad(`AddExit: Daemon says ${parsed.error}`));
      } else {
        // Do nothing. At this point we are waiting for the next getStatus call
        // to send us the exit node set from the daemon.
      }
    } catch (e) {
      dispatch(
        markExitFailedToLoad(
          `Couldn't parse result from addExit: '${addExitResult}'`
        )
      );
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
  const isOffAndMissingNode = !isExitEnabledFromDaemon && !exitNode;
  return (
    <Button
      isLoading={exitLoading}
      isDisabled={isOffAndMissingNode}
      loadingText="Please wait..."
      colorScheme={isExitEnabledFromDaemon ? 'red' : 'green'}
      onClick={async () => {
        if (isExitEnabledFromDaemon) {
          handleTurningOffExit(dispatch);
        } else {
          handleTurningOnExit(dispatch, exitNode, authCode);
        }
      }}
    >
      {isExitEnabledFromDaemon ? 'Disable Exit' : 'Enable Exit'}
    </Button>
  );
};
