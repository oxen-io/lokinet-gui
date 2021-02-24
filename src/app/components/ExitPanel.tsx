import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  onUserAuthCodeSet,
  onUserExitNodeSet,
  selectExitStatus
} from '../../features/exitStatusSlice';
import { useAppDispatch } from '../hooks';
import { EnableExitToggle } from './EnableExitToggle';

export const ExitPanel = (): JSX.Element => {
  const exitStatus = useSelector(selectExitStatus);
  const dispatch = useAppDispatch();

  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode
  const disableInputEdits =
    exitStatus.exitLoading || Boolean(exitStatus.exitNodeFromDaemon);

  return (
    <Flex flexDirection="column" alignSelf="center" width="100%">
      <FormControl id="exitNode">
        <FormLabel size="xs">Exit node:</FormLabel>
        <Input
          isDisabled={disableInputEdits}
          onChange={(e) => dispatch(onUserExitNodeSet(e?.currentTarget?.value))}
          onPaste={(e) => dispatch(onUserExitNodeSet(e?.currentTarget?.value))}
          size="xs"
        />
      </FormControl>
      <FormControl id="authCodes">
        <FormLabel size="xs">Auth code:</FormLabel>
        <Input
          isDisabled={disableInputEdits}
          onChange={(e) => dispatch(onUserAuthCodeSet(e?.currentTarget?.value))}
          onPaste={(e) => dispatch(onUserAuthCodeSet(e?.currentTarget?.value))}
          size="xs"
        />
      </FormControl>
      <EnableExitToggle />
    </Flex>
  );
};
