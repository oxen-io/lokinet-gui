/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import 'focus-visible/dist/focus-visible';

import { useInterval } from '@chakra-ui/react';

import {
  getSummaryStatus,
  initializeIpcRendererSide,
  parseSummaryStatus,
  POLLING_STATUS_INTERVAL_MS
} from '../ipc/ipcRenderer';
import {
  markAsStopped,
  selectGlobalError,
  setGlobalError,
  updateFromDaemonStatus
} from '../features/statusSlice';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import {
  markExitNodesFromDaemon,
  markDaemonIsLoading
} from '../features/exitStatusSlice';
import { AppLayout } from './components/AppLayout';
import { appendToApplogs } from '../features/appLogsSlice';
import { GlobalStyle } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import { selectedTheme, setTheme } from '../features/uiStatusSlice';
import { StatusErrorType } from '../../sharedIpc';
import { getThemeFromSettings } from './config';

void initializeIpcRendererSide();

export function appendToAppLogsOutsideRedux(logline: string): void {
  store.dispatch(appendToApplogs(logline));
}

export function setErrorOutsideRedux(errorStatus: StatusErrorType): void {
  store.dispatch(setGlobalError(errorStatus));
}

export function markAsStoppedOutsideRedux(): void {
  store.dispatch(markAsStopped());
}

const useSummaryStatusPolling = () => {
  const dispatch = useAppDispatch();

  const globalError = useSelector(selectGlobalError);

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
      const hasExitNodeChange =
        store.getState().exitStatus.exitNodeFromDaemon !==
        parsedStatus.exitNode;
      const hasExitAuthChange =
        store.getState().exitStatus.exitAuthCodeFromDaemon !==
        parsedStatus.exitAuthCode;
      if (hasExitNodeChange) {
        dispatch(
          appendToApplogs(
            `exitNode set by daemon: ${parsedStatus.exitNode || ''}`
          )
        );
      }

      if (hasExitAuthChange) {
        dispatch(
          appendToApplogs(
            `authCode set by daemon: ${parsedStatus.exitAuthCode || ''}`
          )
        );
      }

      if (hasExitNodeChange || hasExitAuthChange) {
        dispatch(
          markExitNodesFromDaemon({
            exitNodeFromDaemon: parsedStatus.exitNode,
            exitAuthCodeFromDaemon: parsedStatus.exitAuthCode
          })
        );
        // the daemon told us we have an exit set but our current state says we have an error on the status.
        // make sure to remove that error from the UI
        if (
          hasExitNodeChange &&
          parsedStatus.exitNode &&
          globalError === 'error-add-exit'
        ) {
          dispatch(setGlobalError(undefined));
        }
      }
      dispatch(markDaemonIsLoading(false));
    } catch (e) {
      console.log('getSummaryStatus() failed');
      dispatch(markAsStopped());
      dispatch(markDaemonIsLoading(false));

      dispatch(
        markExitNodesFromDaemon({
          exitNodeFromDaemon: undefined,
          exitAuthCodeFromDaemon: undefined
        })
      );
    }
  }, POLLING_STATUS_INTERVAL_MS);
};

const App = () => {
  useSummaryStatusPolling();
  return <AppLayout />;
};

ReactDom.render(<div id="root" />, document.body);

const LokinetThemeProvider = (props: { children: React.ReactNode }) => {
  const currentTheme = useSelector(selectedTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    const fromSettings = getThemeFromSettings();
    if (
      (currentTheme !== fromSettings && fromSettings === 'light') ||
      fromSettings === 'dark'
    ) {
      dispatch(setTheme(fromSettings));
    }
  }, [currentTheme, dispatch]);

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
