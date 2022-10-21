import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';

import { useAppDispatch } from '../../hooks';
import { paddingDividers } from '../Utils/Dividers';
import { TextButton } from '../TextButton';
import { VSpacer } from '../Utils/Spacer';

import {
  onUserAuthCodeSet,
  selectAuthCodeFromUser,
  selectDaemonOrExitIsLoading,
  selectDaemonRunning,
  selectExitInputDisabled,
  selectExitNodeFromUser,
  selectHasExitNodeEnabled,
  selectHasExitTurningOff,
  selectHasExitTurningOn,
  selectNetworkReady
} from '../../../features/statusSlice';
import { VpnMode } from '../VpnInfos';
import { ExitInput, ExitSelector } from './ExitSelect';
import { turnExitOff, turnExitOn } from '../../../features/thunk';

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
  const networkReady = useSelector(selectNetworkReady);
  const daemonIsRunning = useSelector(selectDaemonRunning);
  const exitIsOn = useSelector(selectHasExitNodeEnabled);

  const exitTurningOff = useSelector(selectHasExitTurningOff);
  const exitTurningOn = useSelector(selectHasExitTurningOn);

  const buttonText = exitIsOn
    ? 'DISCONNECT'
    : exitTurningOn
    ? 'CONNECTING'
    : exitTurningOff
    ? 'DISCONNECTING'
    : 'CONNECT';

  const textAndBorderColor = exitIsOn
    ? theme.dangerColor
    : exitTurningOn || exitTurningOff
    ? theme.backgroundColor
    : theme.textColor;

  const buttonBackgroundColor =
    exitTurningOff || exitTurningOn ? theme.textColor : theme.backgroundColor;

  const authCodeFromUser = useSelector(selectAuthCodeFromUser);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);

  const buttonDisabled =
    daemonOrExitIsLoading || !daemonIsRunning || !networkReady;

  function onClick() {
    if (buttonDisabled) {
      return;
    }
    if (exitIsOn) {
      turnExitOff();
      return;
    }
    if (daemonIsRunning) {
      // no need to try to stop the exit if the daemon is not running
      turnExitOn(exitNodeFromUser, authCodeFromUser);
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
  const exitAuthCodeFromUser = useSelector(selectAuthCodeFromUser);
  const dispatch = useAppDispatch();

  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode
  const disableInputEdits = useSelector(selectExitInputDisabled);

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
          <ExitSelector />

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
            value={exitAuthCodeFromUser || ''}
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
