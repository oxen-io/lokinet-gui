/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDom from 'react-dom';

import {
  Heading,
  ChakraProvider,
  Center,
  Flex,
  HStack,
  Stack,
  useInterval
} from '@chakra-ui/react';

import {
  getStatus,
  initializeIpcRendererSide,
  parseStateResults,
  POLLING_STATUS_INTERVAL_MS
} from '../ipc/ipc_renderer';
import { DownSpeedStats, UpSpeedStats } from './components/SpeedStats';
import { StopAndStart } from './components/StopAndStartButton';
import { SpeedChart } from './components/SpeedChat';
import { EnableExitToggle } from './components/EnableExitToggle';
import { ActivePathStats, LokinetRoutersStats } from './components/RouterStats';
import { selectStatus, updateFromDaemonStatus } from '../features/statusSlice';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

initializeIpcRendererSide();

const App = () => {
  const state = useSelector(selectStatus);
  const dispatch = useAppDispatch();
  console.info('state', state);
  useInterval(async () => {
    const status = await getStatus();
    const parsedState = parseStateResults(status);
    dispatch(updateFromDaemonStatus({ stateFromDaemon: parsedState }));
  }, POLLING_STATUS_INTERVAL_MS);
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
          <ActivePathStats
            activePaths={state.numPathsBuilt}
            ratio={state.ratio}
          />
          <LokinetRoutersStats numRouters={state.numRoutersKnown} />
          <HStack justify="space-between">
            <UpSpeedStats upSpeed={state.uploadUsage} />
            <DownSpeedStats downSpeed={state.downloadUsage} />
          </HStack>
          <SpeedChart />
        </Stack>
      </Center>
    </ChakraProvider>
  );
};

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mainElement
);
