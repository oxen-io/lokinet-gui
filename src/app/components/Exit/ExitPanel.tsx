import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import {
  onUserAuthCodeSet,
  selectAuthCodeFromUser,
  selectExitNodeFromUser,
  selectExitStatus,
  selectHasExitNodeChangeLoading,
  selectHasExitNodeEnabled
} from '../../../features/exitStatusSlice';
import { useAppDispatch } from '../../hooks';
import { paddingDividers } from '../Utils/Dividers';
import { TextButton } from '../TextButton';
import { VSpacer } from '../Utils/Spacer';

import { turnExitOff, turnExitOn } from '../PowerButton/PowerButtonActions';
import {
  selectDaemonOrExitIsLoading,
  selectDaemonRunning
} from '../../../features/statusSlice';
import { VpnMode } from '../VpnInfos';
import { ExitInput, ExitSelector } from './ExitSelect';

const InputLabel = styled.div`
  font-family: Archivo;
  font-style: normal;
  font-weight: 500;
  font-size: 1.1rem;
  text-align: start;
`;

const ConnectDisconnectButton = () => {
  const theme = useTheme();

  const daemonOrExitIsLoading = useSelector(selectDaemonOrExitIsLoading);
  const daemonIsRunning = useSelector(selectDaemonRunning);
  const exitLoading = useSelector(selectHasExitNodeChangeLoading);
  const exitIsOn = useSelector(selectHasExitNodeEnabled);

  const isConnecting = !exitIsOn && exitLoading;

  const buttonText = exitIsOn
    ? 'DISCONNECT'
    : isConnecting
    ? 'CONNECTING'
    : 'CONNECT';

  const textAndBorderColor = exitIsOn
    ? theme.dangerColor
    : isConnecting
    ? theme.backgroundColor
    : theme.textColor;
  const buttonBackgroundColor = isConnecting
    ? theme.textColor
    : theme.backgroundColor;

  const dispatch = useDispatch();

  const authCodeFromUser = useSelector(selectAuthCodeFromUser);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);

  const buttonDisabled = daemonOrExitIsLoading || !daemonIsRunning; // || globalError === 'error-start-stop';

  function onClick() {
    if (buttonDisabled) {
      return;
    }
    if (exitIsOn) {
      turnExitOff(dispatch);
      return;
    }
    if (daemonIsRunning) {
      // no need to try to stop the exit if the daemon is not running
      turnExitOn(dispatch, exitNodeFromUser, authCodeFromUser);
    }
  }
  return (
    <TextButton
      textAndBorderColor={textAndBorderColor}
      backgroundColor={buttonBackgroundColor}
      onClick={onClick}
      text={buttonText}
      disabled={buttonDisabled}
    />
  );
};

export const ExitPanel = (): JSX.Element => {
  const exitStatus = useSelector(selectExitStatus);
  const dispatch = useAppDispatch();

  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode
  const disableInputEdits =
    exitStatus.exitLoading || Boolean(exitStatus.exitNodeFromDaemon);

  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
      paddingLeft={paddingDividers}
      paddingRight={paddingDividers}
    >
      <Stack direction="row" alignSelf="center" width="100%" height="100%">
        <Flex flexDirection="column" flexGrow={1}>
          <VpnMode />
          <InputLabel>EXIT NODE</InputLabel>
          <ExitSelector disableInputEdits={disableInputEdits} />

          <InputLabel>AUTH CODE</InputLabel>

          <ExitInput
            disabled={disableInputEdits}
            spellCheck={false}
            onChange={(e: any) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            onPaste={(e: any) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            size="sm"
            variant="flushed"
            value={exitStatus.exitAuthCodeFromUser || ''}
            marginBottom={2}
            noOfLines={1}
            style={{ textIndent: '4px' }}
          />
          <VSpacer height="20px" />
          <ConnectDisconnectButton />
        </Flex>
      </Stack>
    </Flex>
  );
};
