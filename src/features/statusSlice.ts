import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MAX_NUMBER_POINT_HISTORY,
  SpeedHistoryDataType
} from '../app/components/SpeedChart';
import { RootState } from '../app/store';
import { defaultDaemonSummaryStatus } from '../ipc/ipcRenderer';

export interface SummaryStatusState {
  isRunning: boolean;
  uptime?: number;
  version?: string;
  numPeersConnected: number;
  uploadUsage: number;
  downloadUsage: number;
  lokiAddress: string;
  numPathsBuilt: number;
  numRoutersKnown: number;
  ratio: string;
  speedHistory: SpeedHistoryDataType;
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
  speedHistory: getDefaultSpeedHistory()
};

const removeFirstElementIfNeeded = (speedHistory: SpeedHistoryDataType) => {
  if (speedHistory.download.length > MAX_NUMBER_POINT_HISTORY) {
    speedHistory.download.shift();
    speedHistory.upload.shift();
  }
  return speedHistory;
};

export const statusSlice = createSlice({
  name: 'status',
  initialState: initialSummaryStatusState,
  reducers: {
    updateFromDaemonStatus: (
      state,
      action: PayloadAction<{
        daemonStatus?: Omit<SummaryStatusState, 'speedHistory'>;
        error?: string;
      }>
    ) => {
      state.isRunning = action.payload.daemonStatus?.isRunning || false;
      if (!state.isRunning) {
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
        return state;
      }

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
          (state.speedHistory.lastDownloadUsage + state.downloadUsage) / 1024; // kb
        const newUpload =
          (state.speedHistory.lastUploadUsage + state.uploadUsage) / 1024; // kb

        // reset the memoized last usage for the next call
        state.speedHistory.lastDownloadUsage = null;
        state.speedHistory.lastUploadUsage = null;
        state.speedHistory.download.push(newDownload);
        state.speedHistory.upload.push(newUpload);
      }

      // Remove the first item is the size is too big
      state.speedHistory = removeFirstElementIfNeeded(state.speedHistory);
      return state;
    },
    markAsStopped: () => {
      return initialSummaryStatusState;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFromDaemonStatus, markAsStopped } = statusSlice.actions;
export const selectStatus = (state: RootState): SummaryStatusState =>
  state.status;
export const selectLokinetRunning = createSelector(
  selectStatus,
  (status) => status.isRunning
);

export const selectVersion = createSelector(
  selectStatus,
  (status) => status.version || ''
);

export const selectUptime = createSelector(
  selectStatus,
  (status) => status.uptime || 0
);

export const selectLokinetAddress = createSelector(
  selectStatus,
  (status) => status.lokiAddress || ''
);

export const selectUploadUsage = createSelector(
  selectStatus,
  (status) => status.uploadUsage || 0
);

export const selectDownloadUsage = createSelector(
  selectStatus,
  (status) => status.downloadUsage || 0
);
