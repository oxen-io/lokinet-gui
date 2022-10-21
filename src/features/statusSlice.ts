import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, omit } from 'lodash';
import { logLineToAppSide } from '../../ipcNode';
import { StatusErrorType } from '../../sharedIpc';
import { appendToAppLogsOutsideRedux } from '../app/app';
import {
  MAX_NUMBER_POINT_HISTORY,
  SpeedHistoryDataType
} from '../app/components/tabs/SpeedChart';
import { getSavedExitNodesFromSettings } from '../app/config';
import { RootState, store } from '../app/store';
import {
  DaemonSummaryStatus,
  defaultDaemonSummaryStatus
} from '../ipc/ipcRenderer';

/**
 * This interface defines our status of the daemon+ the loading states and data inputed by the user.
 * This is the main status of the app.
 */
export interface SummaryStatusState extends DaemonSummaryStatus {
  speedHistory: SpeedHistoryDataType;

  // set to true when the user clicked. We must block other call while this is true
  exitTurningOn: boolean;
  exitTurningOff: boolean;

  daemonIsTurningOn: boolean;
  daemonIsTurningOff: boolean;

  // Those are user entered values
  // When clicking on enable exit, those are the values used to setup the daemon
  // exitNodeFromUser is required, but not exitAuthCodeFromUser
  exitNodeFromUser?: string;
  exitsFromSettings: Array<string>;
  exitAuthCodeFromUser?: string;
}

const getDefaultSpeedHistory = (): SpeedHistoryDataType => {
  return {
    upload: new Array<number>(MAX_NUMBER_POINT_HISTORY).fill(0),
    download: new Array<number>(MAX_NUMBER_POINT_HISTORY).fill(0),
    lastUploadUsage: null,
    lastDownloadUsage: null
  };
};

const initialSummaryStatusState: SummaryStatusState = {
  ...defaultDaemonSummaryStatus,
  // by default the daemon state is loading, but not the exit one
  exitTurningOn: false,
  exitTurningOff: false,
  daemonIsTurningOn: true, // on app start, we try to start the daemon if it's not already running.
  daemonIsTurningOff: false,
  exitNodeFromUser: getSavedExitNodesFromSettings()[0],
  exitsFromSettings: getSavedExitNodesFromSettings(),
  exitAuthCodeFromUser: undefined,
  speedHistory: getDefaultSpeedHistory()
};

const removeFirstElementIfNeeded = (speedHistory: SpeedHistoryDataType) => {
  if (speedHistory.download.length > MAX_NUMBER_POINT_HISTORY) {
    speedHistory.download.shift();
    speedHistory.upload.shift();
  }
  return speedHistory;
};

function logState(text: string, state: SummaryStatusState) {
  const toPrint = JSON.stringify(
    omit(state, [
      'speedHistory',
      'exitNodeFromUser',
      'exitNodeFromUser',
      'exitAuthCodeFromUser',
      // 'uptime',
      // 'version',
      // 'numPeersConnected',
      'uploadUsage',
      'downloadUsage',
      // 'lokiAddress',
      // 'numPathsBuilt',
      'numRoutersKnown',
      'ratio',
      // 'isRunning',
      'exitsFromSettings'
    ])
  );

  console.info(text, cloneDeep(toPrint));
  setTimeout(() => {
    appendToAppLogsOutsideRedux(`redux state at ${text}:     "${toPrint}"`);
  }, 1);
}

export const statusSlice = createSlice({
  name: 'status',
  initialState: initialSummaryStatusState,
  reducers: {
    updateFromDaemonStatus: (
      state,
      action: PayloadAction<{
        daemonStatus?: Omit<
          SummaryStatusState,
          | 'speedHistory'
          | 'daemonIsTurningOn'
          | 'daemonIsTurningOff'
          | 'exitsFromSettings'
          | 'exitTurningOn'
          | 'exitTurningOff'
        >;
        error?: string;
      }>
    ) => {
      state.isRunning = action.payload.daemonStatus?.isRunning || false;
      if (!state.isRunning || !action.payload.daemonStatus?.lokiAddress) {
        state.isRunning = false;
        state.networkReady = false;
        state.downloadUsage = 0;
        state.uploadUsage = 0;
        state.numPathsBuilt = 0;
        state.numRoutersKnown = 0;
        state.numPeersConnected = 0;
        state.lokiAddress = '';
        state.ratio = '';
        state.version = undefined;
        state.uptime = undefined;
        state.speedHistory = getDefaultSpeedHistory();
        logState('updateFromDaemonStatus1', state);

        return state;
      }

      if (state.globalError === 'error-start-stop') {
        state.globalError = undefined;
      }

      state.exitNodeFromDaemon = action.payload.daemonStatus.exitNodeFromDaemon;
      state.exitAuthCodeFromDaemon =
        action.payload.daemonStatus.exitAuthCodeFromDaemon;

      state.downloadUsage = action.payload.daemonStatus?.downloadUsage || 0;
      state.uploadUsage = action.payload.daemonStatus?.uploadUsage || 0;

      state.numPathsBuilt = action.payload.daemonStatus?.numPathsBuilt || 0;
      state.numRoutersKnown = action.payload.daemonStatus?.numRoutersKnown || 0;
      state.numPeersConnected =
        action.payload.daemonStatus?.numPeersConnected || 0;

      state.lokiAddress = action.payload.daemonStatus?.lokiAddress || '';
      state.ratio = action.payload.daemonStatus?.ratio || '';
      state.version = action.payload.daemonStatus?.version;
      state.uptime = action.payload.daemonStatus?.uptime;

      // As we pull status every 500 ms, we have to merge two rates for one second for the graph.
      // This code effectively save one call temporary until we get the second call 500ms later.
      // Then, we merge the two usage in a single entry added to the data used by the graph
      if (
        state.speedHistory.lastUploadUsage === null ||
        state.speedHistory.lastDownloadUsage === null
      ) {
        state.speedHistory.lastUploadUsage = state.uploadUsage;
        state.speedHistory.lastDownloadUsage = state.downloadUsage;
      } else {
        // update graph speeds data
        const newDownload =
          state.speedHistory.lastDownloadUsage + state.downloadUsage;
        const newUpload =
          state.speedHistory.lastUploadUsage + state.uploadUsage;

        // reset the memoized last usage for the next call
        state.speedHistory.lastDownloadUsage = null;
        state.speedHistory.lastUploadUsage = null;
        state.speedHistory.download.push(newDownload);
        state.speedHistory.upload.push(newUpload);
      }

      // Remove the first item is the size is too long
      state.speedHistory = removeFirstElementIfNeeded(state.speedHistory);
      state.networkReady = action.payload.daemonStatus.networkReady;
      logState('updateFromDaemonStatus2', state);

      return state;
    },
    markAsStopped: (state) => {
      if (!state.initialDaemonStartDone) {
        logState('markAsStopped1', state);

        return state;
      }
      const updated = {
        ...initialSummaryStatusState,
        daemonIsTurningOn: state.daemonIsTurningOn,
        daemonIsTurningOff: state.daemonIsTurningOff,
        initialDaemonStartDone: state.initialDaemonStartDone,
        exitNodeFromDaemon: undefined,
        exitAuthCodeFromDaemon: undefined,
        globalError: state.globalError
      };
      logState('markAsStopped2', updated);

      return updated;
    },
    markAsStoppedFromSummaryTimedOut: (state) => {
      if (
        !state.initialDaemonStartDone ||
        state.daemonIsTurningOn ||
        state.daemonIsTurningOff ||
        state.exitTurningOff ||
        state.exitTurningOn
      ) {
        logState('markAsStoppedFromSummaryTimedOut1', state);

        return state;
      }

      const updated = {
        ...initialSummaryStatusState,
        daemonIsTurningOn: state.daemonIsTurningOn,
        daemonIsTurningOff: state.daemonIsTurningOff,
        initialDaemonStartDone: state.initialDaemonStartDone,
        exitNodeFromDaemon: undefined,
        exitAuthCodeFromDaemon: undefined,
        globalError: state.globalError
      };

      logState('markAsStoppedFromSummaryTimedOut2', updated);

      return updated;
    },
    setGlobalError: (state, action: PayloadAction<StatusErrorType>) => {
      state.globalError = action.payload;
      logState('setGlobalError', state);

      return state;
    },
    markInitialDaemonStartDone: (state) => {
      state.initialDaemonStartDone = true;
      logState('markInitialDaemonStartDone', state);

      return state;
    },

    // exit stuff
    markExitIsTurningOn: (state, action: PayloadAction<boolean>) => {
      const isTurningOn = action.payload;

      state.exitTurningOn = isTurningOn;

      if (isTurningOn) {
        if (state.globalError === 'error-add-exit') {
          state.globalError = undefined; // we want to reset the error state
        }
        state.exitNodeFromDaemon = undefined;
        state.exitAuthCodeFromDaemon = undefined;
      }

      logState('markExitIsTurningOn', state);

      return state;
    },
    markExitIsTurningOff: (state, action: PayloadAction<boolean>) => {
      const isTurningOff = action.payload;

      if (isTurningOff && state.globalError === 'error-add-exit') {
        state.globalError = undefined; // we want to reset the error state
      }

      state.exitTurningOff = isTurningOff;
      logState('markExitIsTurningOff', state);

      return state;
    },

    markDaemonIsTurningOn(state, action: PayloadAction<boolean>) {
      const isTurningOn = action.payload;
      state.daemonIsTurningOn = isTurningOn;
      if (isTurningOn) {
        state.globalError = undefined;
      }
      state.exitTurningOff = false;
      state.exitTurningOn = false;
      state.exitNodeFromDaemon = undefined;
      state.exitAuthCodeFromDaemon = undefined;
      logState('markDaemonIsTurningOn', state);

      return state;
    },

    markDaemonIsTurningOff(state, action: PayloadAction<boolean>) {
      const isTurningOff = action.payload;

      if (isTurningOff) {
        state.globalError = undefined;
      }
      state.daemonIsTurningOff = isTurningOff;
      state.exitTurningOff = false;
      state.exitTurningOn = false;
      logState('markDaemonIsTurningOff', state);

      return state;
    },

    onUserExitNodeSet: (state, action: PayloadAction<string>) => {
      state.exitNodeFromUser = action.payload;
      return state;
    },
    onUserAuthCodeSet: (state, action: PayloadAction<string>) => {
      state.exitAuthCodeFromUser = action.payload;
      return state;
    },
    updateExitsFromSettings: (state, action: PayloadAction<Array<string>>) => {
      state.exitsFromSettings = action.payload;
      return state;
    }
  }
});

/**
 * Actions which can be called with this slice
 */
export const {
  updateFromDaemonStatus,
  markAsStopped,
  markAsStoppedFromSummaryTimedOut,
  setGlobalError,
  markInitialDaemonStartDone,
  markExitIsTurningOn,
  markExitIsTurningOff,
  onUserExitNodeSet,
  onUserAuthCodeSet,
  markDaemonIsTurningOn,
  markDaemonIsTurningOff,
  updateExitsFromSettings
} = statusSlice.actions;

/**
 * Those are all selectors only
 */

function selectStatus(state: RootState): SummaryStatusState {
  return state.status;
}

export function selectDaemonRunning(state: RootState) {
  return state.status.isRunning;
}

export function selectNetworkReady(state: RootState) {
  return state.status.isRunning && state.status.networkReady;
}

export const selectInitialDaemonStartDone = (state: RootState) =>
  state.status.initialDaemonStartDone;

export function selectGlobalError(state: RootState) {
  return state.status.initialDaemonStartDone &&
    !state.status.daemonIsTurningOn &&
    !state.status.daemonIsTurningOff
    ? state.status.globalError
    : undefined;
}

export const selectDaemonIsLoading = (state: RootState) => {
  return (
    state.status.daemonIsTurningOn ||
    state.status.daemonIsTurningOff ||
    !state.status.initialDaemonStartDone
  );
};

export function selectVersion(state: RootState) {
  return (!selectDaemonIsLoading(state) && state.status.version) || '';
}

export function selectUptime(state: RootState) {
  return (!selectDaemonIsLoading(state) && state.status.uptime) || 0;
}

export function selectLokinetAddress(state: RootState) {
  return (!selectDaemonIsLoading(state) && state.status.lokiAddress) || '';
}

export const selectUploadRate = createSelector(
  selectStatus,
  selectDaemonIsLoading,
  (status, isLoading) =>
    !isLoading &&
    makeRate(status.speedHistory.upload[MAX_NUMBER_POINT_HISTORY - 1] || 0)
);

export const selectDownloadRate = createSelector(
  selectStatus,
  selectDaemonIsLoading,
  (status, isLoading) =>
    !isLoading &&
    makeRate(status.speedHistory.download[MAX_NUMBER_POINT_HISTORY - 1] || 0)
);

export function makeRate(originalValue: number, forceMBUnit = false): string {
  let unit_idx = 0;
  const units = ['B', 'KB', 'MB'];

  if (forceMBUnit) {
    return `${(originalValue / (1024 * 1024)).toFixed(2)} ${units[2]}/s`;
  }
  let value = originalValue;
  while (value > 1024.0 && unit_idx + 1 < units.length) {
    value /= 1024.0;
    unit_idx += 1;
  }
  const unitSpeed = ` ${units[unit_idx]}/s`;

  return value.toFixed(1) + unitSpeed;
}

export const selectSpeedHistory = (state: RootState): SpeedHistoryDataType =>
  state.status.speedHistory;

/**
 *
 */

export const selectExitInputDisabled = (state: RootState): boolean =>
  Boolean(state.status.exitTurningOff) ||
  Boolean(state.status.exitTurningOn) ||
  Boolean(state.status.exitNodeFromDaemon);

export const selectHasExitNodeEnabled = (state: RootState) =>
  state.status.isRunning &&
  Boolean(state.status.exitNodeFromDaemon) &&
  !state.status.exitTurningOn &&
  !state.status.exitTurningOff;

export const selectHasExitTurningOn = (state: RootState) =>
  state.status.isRunning && state.status.exitTurningOn;

export const selectHasExitTurningOff = (state: RootState) =>
  state.status.isRunning && state.status.exitTurningOff;

export const selectHasExitNodeChangeLoading = (state: RootState) =>
  state.status.isRunning &&
  (state.status.exitTurningOn || state.status.exitTurningOff);

export const selectExitNodeFromUser = (state: RootState) =>
  state.status.exitNodeFromUser;

export const selectAuthCodeFromUser = (state: RootState) =>
  state.status.exitAuthCodeFromUser;

export const selectExitNodeFromDaemon = (state: RootState) =>
  state.status.exitNodeFromDaemon;

export const selectAuthCodeFromDaemon = (state: RootState) =>
  state.status.exitAuthCodeFromDaemon;

export const selectDaemonIsTurningOff = (state: RootState) => {
  return state.status.daemonIsTurningOff;
};

export const selectDaemonIsTurningOn = (state: RootState) => {
  return state.status.daemonIsTurningOn || !state.status.initialDaemonStartDone;
};

export const selectExitsFromSettings = (state: RootState) =>
  state.status.exitsFromSettings;

export const selectDaemonOrExitIsLoading = createSelector(
  selectDaemonIsLoading,
  selectHasExitNodeChangeLoading,
  (daemonIsLoading, exitLoading) => {
    return daemonIsLoading || exitLoading;
  }
);

export const selectNumPathBuilt = (state: RootState) =>
  selectDaemonIsLoading(state) ? 0 : state.status.numPathsBuilt;
export const selectRatio = (state: RootState) =>
  selectDaemonIsLoading(state) ? 0 : state.status.ratio;
export const selectNumRoutersKnown = (state: RootState) =>
  selectDaemonIsLoading(state) ? 0 : state.status.numRoutersKnown;
