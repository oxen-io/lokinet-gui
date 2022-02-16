import { Flex, Text, Stack, Input } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { EnableExitToggle } from './EnableExitToggle';
import { PlusDivider } from './PlusDivider';

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
      <Text alignSelf="flex-start" fontWeight={700}>
        Exit node
      </Text>
      <Stack
        direction="row"
        alignSelf="center"
        width="100%"
        height="100%"
        p={2}
      >
        <PlusDivider />
        <Flex flexDirection="column" flexGrow={1}>
          <Input
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
            placeholder="Exit address"
            _placeholder={{ color: '#a7a7a7' }}
            value={exitToUse || ''}
          />
          <Input
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
            placeholder="Auth code"
            _placeholder={{ color: '#a7a7a7' }}
            marginBottom={2}
            noOfLines={1}
          />
          <EnableExitToggle />
        </Flex>
      </Stack>
    </Flex>
  );
};
