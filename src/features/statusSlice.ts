import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MAX_NUMBER_POINT_HISTORY,
  SpeedHistoryCoordinates,
  SpeedHistoryDataType
} from '../app/components/SpeedChart';
import { RootState } from '../app/store';
import {
  ParsedStateFromDaemon,
  POLLING_STATUS_INTERVAL_MS
} from '../ipc/ipc_renderer';

export interface StatusState {
  isRunning: boolean;
  lokiAddress: string;
  numPathsBuilt: number;
  numRoutersKnown: number;
  downloadUsage: number;
  uploadUsage: number;
  numPeersConnected: number;
  ratio: string;
  speedHistory: SpeedHistoryDataType;
}
const getDefaultSpeedHistory = () => {
  return {
    upload: new Array<SpeedHistoryCoordinates>({ x: 0, y: 0 }),
    download: new Array<SpeedHistoryCoordinates>({ x: 0, y: 0 })
  };
};

const initialState: StatusState = {
  isRunning: false,
  lokiAddress: '',
  numPathsBuilt: 0,
  numRoutersKnown: 0,
  downloadUsage: 0,
  uploadUsage: 0,
  numPeersConnected: 0,
  ratio: '',
  speedHistory: getDefaultSpeedHistory()
};

const removeFirstElementIfNeeded = (speedHistory: SpeedHistoryDataType) => {
  if (speedHistory.download.length > MAX_NUMBER_POINT_HISTORY) {
    speedHistory.download.shift();
    speedHistory.upload.shift();
    for (let i = 0; i < speedHistory.upload.length; i++) {
      speedHistory.upload[i].x = (i * POLLING_STATUS_INTERVAL_MS) / 1000;
      speedHistory.download[i].x = (i * POLLING_STATUS_INTERVAL_MS) / 1000;
    }
  }
  return speedHistory;
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateFromDaemonStatus: (
      state,
      action: PayloadAction<{
        stateFromDaemon?: ParsedStateFromDaemon;
        error?: string;
      }>
    ) => {
      state.isRunning = action.payload.stateFromDaemon?.isRunning || false;
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

      state.downloadUsage = action.payload.stateFromDaemon?.downloadUsage || 0;
      state.uploadUsage = action.payload.stateFromDaemon?.uploadUsage || 0;

      state.numPathsBuilt = action.payload.stateFromDaemon?.numPathsBuilt || 0;
      state.numRoutersKnown =
        action.payload.stateFromDaemon?.numRoutersKnown || 0;
      state.numPeersConnected =
        action.payload.stateFromDaemon?.numPeersConnected || 0;
      state.lokiAddress = action.payload.stateFromDaemon?.lokiAddress || '';
      state.ratio = action.payload.stateFromDaemon?.ratio || '';

      // update graph speeds data
      state.speedHistory.download.push({
        x:
          (state.speedHistory.download.length * POLLING_STATUS_INTERVAL_MS) /
          1000,
        y: state.downloadUsage / 1000 // kb
      });
      state.speedHistory.upload.push({
        x:
          (state.speedHistory.upload.length * POLLING_STATUS_INTERVAL_MS) /
          1000,
        y: state.uploadUsage / 1024 // kb
      });

      // Remove the first item is the size is too big
      state.speedHistory = removeFirstElementIfNeeded(state.speedHistory);
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFromDaemonStatus } = statusSlice.actions;
export const selectStatus = (state: RootState): StatusState => state.status;
export default statusSlice.reducer;
