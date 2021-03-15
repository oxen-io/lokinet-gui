import { Badge, Flex, Switch } from '@chakra-ui/react';
import React, { useState } from 'react';

export const StopAndStart = (): JSX.Element => {
  const [clicked, setClicked] = useState(false);
  return (
    <Flex justify="center" align="center">
      <Switch
        margin="auto"
        isLoading={clicked}
        onClick={() => {
          setClicked(false);
        }}
        size="lg"
        aria-label="stop and start"
      />
      <Badge colorScheme="green">Lokinet Running</Badge>
      <Badge colorScheme="red">Lokinet Stopped</Badge>
    </Flex>
  );
};
