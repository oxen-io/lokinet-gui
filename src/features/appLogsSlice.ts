import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../app/store';

export interface AppLogsState {
  appLogs: Array<string>;
}

const MAX_LOG_LINES = 1000;

const initialStatusState: AppLogsState = {
  appLogs: []
};

const removeFirstElementIfNeeded = (appLogs: Array<string>) => {
  if (appLogs.length > MAX_LOG_LINES) {
    appLogs.shift();
  }
  return appLogs;
};

export const appLogsSlice = createSlice({
  name: 'appLogs',
  initialState: initialStatusState,
  reducers: {
    appendToApplogs: (state, action: PayloadAction<string>) => {
      const lastLine = state.appLogs[state.appLogs.length - 1];
      const summaryStatusTimedOut = 'getSummaryStatus timed out at';
      if (
        lastLine?.includes(summaryStatusTimedOut) &&
        action.payload?.includes(summaryStatusTimedOut)
      ) {
        return state;
      }
      state.appLogs.push(`${Date.now()}: ${action.payload}`);

      // Remove the first item is the size is too big
      state.appLogs = removeFirstElementIfNeeded(state.appLogs);
      return state;
    },
    clearLogs: (state) => {
      state.appLogs = [];
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { appendToApplogs, clearLogs } = appLogsSlice.actions;
export const selectAppLogs = (state: RootState): AppLogsState =>
  state.appLogsStatus;
