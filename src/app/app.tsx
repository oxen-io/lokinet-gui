/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDom from 'react-dom';

import {
  ChakraProvider,
  Flex,
  HStack,
  Stack,
  useInterval
} from '@chakra-ui/react';

import {
  getStatus,
  getUpTimeAndVersion,
  initializeIpcRendererSide,
  parseGeneralInfos,
  parseStateResults,
  POLLING_GENERAL_INFOS_INTERVAL_MS,
  POLLING_STATUS_INTERVAL_MS
} from '../ipc/ipc_renderer';
import { DownSpeedStats, UpSpeedStats } from './components/SpeedStats';
import { StopAndStart } from './components/StopAndStartButton';
import { SpeedChart } from './components/SpeedChart';
import { ActivePathStats, LokinetRoutersStats } from './components/RouterStats';
import { selectStatus, updateFromDaemonStatus } from '../features/statusSlice';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import {
  selectGeneralInfos,
  updateFromDaemonGeneralInfos
} from '../features/generalInfosSlice';
import { AppTitle } from './components/AppTitle';
import { ExitPanel } from './components/ExitPanel';
import { LokinetAddress } from './components/LokinetAdress';
import { markExitNodesFromDaemon } from '../features/exitStatusSlice';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

initializeIpcRendererSide();

const App = () => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  const daemonGeneralInfos = useSelector(selectGeneralInfos);

  // dispatch is used to make updates to the redux store
  const dispatch = useAppDispatch();
  // console.info('state', state);

  // register an interval for fetching the status of the daemon
  useInterval(async () => {
    // getStatus sends an IPC call to our node environment
    // once on the node environment, it will trigger and wait for the RPC call to finish
    // or timeout before returning.
    const statusAsString = await getStatus();
    // The status we get is a plain string. Extract the details we care from it and build
    // the state we will send as update to the redux store
    const parsedStatus = parseStateResults(statusAsString);

    // Send the update to the redux store.
    dispatch(updateFromDaemonStatus({ daemonStatus: parsedStatus }));
    dispatch(
      markExitNodesFromDaemon({
        exitNodeFromDaemon: parsedStatus.exitNode,
        exitAuthCodeFromDaemon: parsedStatus.exitAuthCode
      })
    );
  }, POLLING_STATUS_INTERVAL_MS);

  // register an interval for fetching the version and uptime of the daemon.
  // Note: With react, no refresh is triggered if the change made does not make a change
  useInterval(async () => {
    const generalInfos = await getUpTimeAndVersion();
    const parsedInfos = parseGeneralInfos(generalInfos);
    dispatch(updateFromDaemonGeneralInfos({ generalsInfos: parsedInfos }));
  }, POLLING_GENERAL_INFOS_INTERVAL_MS);

  return (
    <ChakraProvider resetCSS={true}>
      <Flex width="100%" height="100%" justifyContent="center">
        <Stack padding="20px" textAlign="center">
          <AppTitle
            uptime={daemonGeneralInfos.uptime}
            version={daemonGeneralInfos.version}
          />
          <Flex>
            <LokinetAddress />
          </Flex>
          <Flex>
            <StopAndStart />
          </Flex>
          <Flex>
            <ExitPanel />
          </Flex>
          <ActivePathStats
            activePaths={daemonStatus.numPathsBuilt}
            ratio={daemonStatus.ratio}
          />
          <LokinetRoutersStats numRouters={daemonStatus.numRoutersKnown} />
          <HStack justify="space-between">
            <UpSpeedStats upSpeed={daemonStatus.uploadUsage} />
            <DownSpeedStats downSpeed={daemonStatus.downloadUsage} />
          </HStack>
          <Flex height={200}>
            <SpeedChart speedHistory={daemonStatus.speedHistory} />
          </Flex>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};

// Make the Redux store available to all sub components of <App/>
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mainElement
);
