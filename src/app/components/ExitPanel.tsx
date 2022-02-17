import { Flex, Stack, Input } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { EnableExitToggle } from './EnableExitToggle';

const ExitInput = styled(Input)`
  background-color: ${(props) => props.theme.inputBackground};
  color: ${(props) => props.theme.textColor};
  outline-color: ${(props) => props.theme.textColorSubtle};
  font-family: 'IBM Plex Mono';
  font-weight: 400;
  border-radius: 3px;
  border: none;
  font-size: 14px;
  line-height: 18px;
`;

const InputLabel = styled.div`
  font-family: Archivo;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  text-align: start;
  user-select: none;
`;

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
    <Flex flexDirection="column" flexGrow={1}>
      <Stack
        direction="row"
        alignSelf="center"
        width="100%"
        height="100%"
        p={2}
      >
        <Flex flexDirection="column" flexGrow={1}>
          <InputLabel>EXIT NODE</InputLabel>
          <ExitInput
            disabled={disableInputEdits}
            onChange={(e) =>
              dispatch(onUserExitNodeSet(e?.currentTarget?.value))
            }
            onPaste={(e) =>
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
            onChange={(e) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            onPaste={(e) =>
              dispatch(onUserAuthCodeSet(e?.currentTarget?.value))
            }
            size="sm"
            variant="flushed"
            value={exitStatus.exitAuthCodeFromUser || ''}
            marginBottom={2}
            noOfLines={1}
          />
          <EnableExitToggle />
        </Flex>
      </Stack>
    </Flex>
  );
};
