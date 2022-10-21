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

let firstLogPrintedAt: number | undefined;

export const appLogsSlice = createSlice({
  name: 'appLogs',
  initialState: initialStatusState,
  reducers: {
    appendToApplogs: (state, action: PayloadAction<string>) => {
      // do not duplicate the getSummaryStatus timed out if the last one was the same
      const lastLine = state.appLogs[state.appLogs.length - 1];
      const summaryStatusTimedOut = 'getSummaryStatus timed out after';
      if (
        lastLine?.includes(summaryStatusTimedOut) &&
        action.payload?.includes(summaryStatusTimedOut)
      ) {
        return state;
      }

      if (firstLogPrintedAt === undefined) {
        firstLogPrintedAt = Date.now();
      }
      const diffWithFirstLog = Date.now() - firstLogPrintedAt;
      const diffDate = new Date(diffWithFirstLog);
      let offsetToPrint = '';
      if (diffWithFirstLog > 1000 * 60 * 60 * 24) {
        offsetToPrint += `${Math.floor(
          diffWithFirstLog / (1000 * 60 * 60 * 24)
        )}d`;
      }

      if (diffWithFirstLog > 1000 * 60 * 60) {
        offsetToPrint += `${offsetToPrint ? ':' : ''}${diffDate.getHours()}h`;
      }

      if (diffWithFirstLog > 1000 * 60) {
        offsetToPrint += `${offsetToPrint ? ':' : ''}${diffDate.getMinutes()}m`;
      }
      if (diffWithFirstLog > 1000) {
        offsetToPrint += `${offsetToPrint ? ':' : ''}${diffDate.getSeconds()}s`;
      }

      offsetToPrint += `${
        offsetToPrint ? ':' : ''
      }${diffDate.getMilliseconds()}ms`;

      state.appLogs.push(`${offsetToPrint}: ${action.payload}`);

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
