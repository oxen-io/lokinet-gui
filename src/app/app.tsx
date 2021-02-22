/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDom from 'react-dom';

import {
  Heading,
  ChakraProvider,
  Center,
  Flex,
  HStack,
  Stack
} from '@chakra-ui/react';

import { initializeIpcRendererSide } from '../ipc/ipc_renderer';
import { DownSpeedStats, UpSpeedStats } from './components/SpeedStats';
import { StopAndStart } from './components/StopAndStartButton';
import { SpeedChart } from './components/SpeedChat';
import { EnableExitToggle } from './components/EnableExitToggle';
import { ActivePathStats, LokinetRoutersStats } from './components/RouterStats';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

initializeIpcRendererSide();

const App = () => {
  return (
    <ChakraProvider resetCSS={true}>
      <Center height="100vh">
        <Stack padding="20px">
          <Heading size="4xl">Lokinet</Heading>
          <Flex>
            <StopAndStart />
          </Flex>
          <Flex>
            <EnableExitToggle />
          </Flex>
          <ActivePathStats />
          <LokinetRoutersStats />
          <HStack justify="space-between">
            <UpSpeedStats />
            <DownSpeedStats />
          </HStack>
          <SpeedChart />
        </Stack>
      </Center>
    </ChakraProvider>
  );
};

ReactDom.render(<App />, mainElement);
