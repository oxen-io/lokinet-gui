/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDom from 'react-dom';
import 'focus-visible/dist/focus-visible';

import { useInterval } from '@chakra-ui/react';

import {
  getSummaryStatus,
  initializeIpcRendererSide,
  parseSummaryStatus,
  POLLING_STATUS_INTERVAL_MS
} from '../ipc/ipcRenderer';
import { markAsStopped, updateFromDaemonStatus } from '../features/statusSlice';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { markExitNodesFromDaemon } from '../features/exitStatusSlice';
import { AppLayout } from './components/AppLayout';
import { appendToApplogs } from '../features/appLogsSlice';
import { GlobalStyle } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import { selectedTheme } from '../features/uiStatusSlice';

initializeIpcRendererSide();

const App = () => {
  // dispatch is used to make updates to the redux store
  const dispatch = useAppDispatch();

  // register an interval for fetching the status of the daemon
  useInterval(async () => {
    // getSummaryStatus sends an IPC call to our node environment
    // once on the node environment, it will trigger and wait for the RPC call to finish
    // or timeout before returning.
    try {
      const statusAsString = await getSummaryStatus();
      // The status we get is a plain string. Extract the details we care from it and build
      // the state we will send as update to the redux store
      const parsedStatus = parseSummaryStatus(statusAsString);
      // Send the update to the redux store.
      dispatch(updateFromDaemonStatus({ daemonStatus: parsedStatus }));
      if (
        store.getState().exitStatus.exitNodeFromDaemon !== parsedStatus.exitNode
      ) {
        dispatch(
          appendToApplogs(
            `exitNode set by daemon: ${parsedStatus.exitNode || ''}`
          )
        );
      }

      if (
        store.getState().exitStatus.exitAuthCodeFromDaemon !==
        parsedStatus.exitAuthCode
      ) {
        dispatch(
          appendToApplogs(
            `authCode set by daemon: ${parsedStatus.exitAuthCode || ''}`
          )
        );
      }
      dispatch(
        markExitNodesFromDaemon({
          exitNodeFromDaemon: parsedStatus.exitNode,
          exitAuthCodeFromDaemon: parsedStatus.exitAuthCode
        })
      );
    } catch (e) {
      console.log('getSummaryStatus() failed');
      dispatch(markAsStopped());
      dispatch(
        markExitNodesFromDaemon({
          exitNodeFromDaemon: undefined,
          exitAuthCodeFromDaemon: undefined
        })
      );
    }
  }, POLLING_STATUS_INTERVAL_MS);

  return <AppLayout />;
};

ReactDom.render(<div id="root" />, document.body);

const LokinetThemeProvider = (props: { children: React.ReactNode }) => {
  const currentTheme = useSelector(selectedTheme);
  return (
    <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
      {props.children}
    </ThemeProvider>
  );
};

// Make the Redux store available to all sub components of <App/>
ReactDom.render(
  <Provider store={store}>
    <LokinetThemeProvider>
      <GlobalStyle />

      <App />
    </LokinetThemeProvider>
  </Provider>,
  document.getElementById('root')
);
