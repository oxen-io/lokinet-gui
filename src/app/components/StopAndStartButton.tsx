import { Badge, Flex, Switch } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectLokinetRunning } from '../../features/statusSlice';
import {
  doStartLokinetProcess,
  doStopLokinetProcess
} from '../../ipc/ipcRenderer';

export const StopAndStart = (): JSX.Element => {
  const isLokinetRunning = useSelector(selectLokinetRunning);

  return (
    <Flex justify="center" align="center" paddingTop={2} paddingBottom={2}>
      <Switch
        marginRight="auto"
        onChange={async () => {
          if (isLokinetRunning) {
            await doStopLokinetProcess();
          } else {
            await doStartLokinetProcess();
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
