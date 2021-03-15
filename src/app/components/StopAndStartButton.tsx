import { Badge, Flex, Switch } from '@chakra-ui/react';
import React from 'react';

export const StopAndStart = (): JSX.Element => {
  const isLokinetRunning = true;
  return (
    <Flex justify="center" align="center">
      <Switch
        margin="auto"
        onChange={() => {
          console.warn('TODO');
        }}
        size="lg"
        colorScheme="green"
        aria-label="stop and start"
        isChecked={isLokinetRunning}
      />
      {isLokinetRunning ? (
        <Badge colorScheme="green">Lokinet Running</Badge>
      ) : (
        <Badge colorScheme="red">Lokinet Stopped</Badge>
      )}
    </Flex>
  );
};
