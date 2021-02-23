import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  SpeedHistoryCoordinates,
  SpeedHistoryDataType
} from '../app/components/SpeedChart';
import { RootState } from '../app/store';
import { ParsedStateFromDaemon } from '../ipc/ipc_renderer';

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

const initialState: StatusState = {
  isRunning: false,
  lokiAddress: '',
  numPathsBuilt: 0,
  numRoutersKnown: 0,
  downloadUsage: 0,
  uploadUsage: 0,
  numPeersConnected: 0,
  ratio: '',
  speedHistory: _.range(2).map(
    () => new Array<SpeedHistoryCoordinates>({ x: 0, y: 0 })
  )
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
        state.speedHistory = _.range(2).map(
          () => new Array<SpeedHistoryCoordinates>({ x: 0, y: 0 })
        );
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
      state.speedHistory[0].push({
        x: state.speedHistory[0].length / 2,
        y: state.downloadUsage
      });
      state.speedHistory[1].push({
        x: state.speedHistory[1].length / 2,
        y: state.uploadUsage
      });
      // Remove the first item is the size is too big
      state.speedHistory[0].length > 300 && state.speedHistory[0].shift();
      state.speedHistory[1].length > 300 && state.speedHistory[1].shift();
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFromDaemonStatus } = statusSlice.actions;
export const selectStatus = (state: RootState): StatusState => state.status;
export default statusSlice.reducer;
