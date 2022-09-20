import { Flex, Stack, Input } from '@chakra-ui/react';
import { noop } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { paddingDividers } from './Utils/Dividers';
import { TextButton } from './TextButton';
import { VSpacer } from './Utils/Spacer';

const ExitInput = styled(Input)`
  background-color: ${(props) => props.theme.inputBackground};
  color: ${(props) => props.theme.textColor};
  outline-color: transparent;
  font-family: 'IBM Plex Mono';
  font-weight: 400;
  border-radius: 3px;
  border: none;
  font-size: 1.1rem;
  padding: 5px;
  outline: none;
  transition: 0.25s;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
`;

const InputLabel = styled.div`
  font-family: Archivo;
  font-style: normal;
  font-weight: 500;
  font-size: 1.1rem;
  text-align: start;
`;

const ConnectDisconnectButton = () => {
  const { exitLoading, exitNodeFromDaemon } = useSelector(selectExitStatus);
  const theme = useTheme();
  const isConnected = Boolean(exitNodeFromDaemon);

  const buttonText = isConnected
    ? 'DISCONNECT'
    : exitLoading
    ? 'CONNECTING'
    : 'CONNECT';

  const buttonColor = isConnected ? theme.dangerColor : theme.textColor;
  return (
    <TextButton
      buttonColor={buttonColor}
      onClick={noop}
      text={buttonText}
      title={buttonText}
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

  const exitToUse = disableInputEdits
    ? exitStatus.exitNodeFromDaemon
    : exitStatus.exitNodeFromUser;

  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
      paddingLeft={paddingDividers}
      paddingRight={paddingDividers}
    >
      <Stack direction="row" alignSelf="center" width="100%" height="100%">
        <Flex flexDirection="column" flexGrow={1}>
          <InputLabel>EXIT NODE</InputLabel>
          <ExitInput
            disabled={disableInputEdits}
            onChange={(e: any) =>
              dispatch(onUserExitNodeSet(e?.currentTarget?.value))
            }
            onPaste={(e: any) =>
              dispatch(onUserExitNodeSet(e?.currentTarget?.value))
            }
            size="sm"
            variant="flushed"
            marginBottom={2}
            spellCheck={false}
            noOfLines={1}
            value={exitToUse || ''}
          />
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
          />
          <VSpacer height="20px" />
          <ConnectDisconnectButton />
        </Flex>
      </Stack>
    </Flex>
  );
};
