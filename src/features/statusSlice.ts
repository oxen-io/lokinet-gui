import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MAX_NUMBER_POINT_HISTORY,
  SpeedHistoryDataType
} from '../app/components/SpeedChart';
import { RootState } from '../app/store';
import { DaemonStatus, defaultDaemonStatus } from '../ipc/ipc_renderer';

export interface StatusState {
  isRunning: boolean;
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
    lastUploadUsage: undefined,
    lastDownloadUsage: undefined
  };
};

const initialStatusState: StatusState = {
  ...defaultDaemonStatus,
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
  initialState: initialStatusState,
  reducers: {
    updateFromDaemonStatus: (
      state,
      action: PayloadAction<{
        daemonStatus?: DaemonStatus;
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

      // As we pull status every 500 ms, we have to merge two rates for one second for the graph.
      // This code effectively save one call temporary until we get the second call 500ms later.
      // Then, we merge the two usage in a single entry added to the data used by the graph
      if (
        !state.speedHistory.lastUploadUsage ||
        !state.speedHistory.lastDownloadUsage
      ) {
        state.speedHistory.lastUploadUsage = state.downloadUsage;
        state.speedHistory.lastDownloadUsage = state.uploadUsage;
      } else {
        // update graph speeds data
        const newDownload =
          (state.speedHistory.lastDownloadUsage + state.downloadUsage) / 1024; // kb
        const newUpload =
          (state.speedHistory.lastUploadUsage + state.uploadUsage) / 1024; // kb

        console.warn('newDownload', newDownload);
        console.warn('newUpload', newUpload);
        // reset the memoized last usage for the next call
        state.speedHistory.lastDownloadUsage = undefined;
        state.speedHistory.lastUploadUsage = undefined;
        state.speedHistory.download.push(newDownload);
        state.speedHistory.upload.push(newUpload);
      }

      // Remove the first item is the size is too big
      state.speedHistory = removeFirstElementIfNeeded(state.speedHistory);
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFromDaemonStatus } = statusSlice.actions;
export const selectStatus = (state: RootState): StatusState => state.status;
