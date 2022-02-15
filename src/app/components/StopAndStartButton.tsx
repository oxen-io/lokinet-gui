import { Badge, Flex, Switch } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appendToApplogs } from '../../features/appLogsSlice';
import { selectLokinetRunning } from '../../features/statusSlice';
import {
  doStartLokinetProcess,
  doStopLokinetProcess
} from '../../ipc/ipcRenderer';

export const StopAndStart = (): JSX.Element => {
  const isLokinetRunning = useSelector(selectLokinetRunning);
  const dispatch = useDispatch();
  return (
    <Flex justify="center" align="center" paddingTop={2} paddingBottom={2}>
      <Switch
        marginRight="auto"
        onChange={async () => {
          const startStopReturn = isLokinetRunning
            ? await doStopLokinetProcess()
            : await doStartLokinetProcess();
          if (startStopReturn !== null && startStopReturn.length) {
            dispatch(appendToApplogs(`start/stop: ${startStopReturn}`));
          }
        }}
        size="lg"
        colorScheme="blue"
        aria-label="stop and start"
        isChecked={isLokinetRunning}
      />
      {isLokinetRunning ? (
        <Badge colorScheme="blue">Lokinet Running</Badge>
      ) : (
        <Badge colorScheme="red">Lokinet Stopped</Badge>
      )}
    </Flex>
  );
};
