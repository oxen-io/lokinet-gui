import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { ParsedStateFromDaemon } from '../ipc/ipc_renderer';

interface StatusState {
  isRunning: boolean;
  lokiVersion: string;
  lokiAddress: string;
  lokiExit: string;
  exitAuth: string;
  exitStatus: string;
  exitBusy: boolean;
  lokiUptime: number;
  numPathsBuilt: number;
  numRoutersKnown: number;
  downloadUsage: number;
  uploadUsage: number;
  numPeersConnected: number;
  ratio: string;
}

const initialState: StatusState = {
  isRunning: false,
  lokiVersion: '',
  lokiAddress: '',
  lokiExit: '',
  exitAuth: '',
  exitStatus: '',
  exitBusy: false,
  lokiUptime: 0,
  numPathsBuilt: 0,
  numRoutersKnown: 0,
  downloadUsage: 0,
  uploadUsage: 0,
  numPeersConnected: 0,
  ratio: ''
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
      const newIsRunning = action.payload.stateFromDaemon?.isRunning || false;
      // if (newIsRunning !== state.isRunning) {
      //   console.log('Detected disconnection');
      //   // zero-out values that would otherwise be stale in the UI
      //   state.downloadUsage = 0;
      //   state.uploadUsage = 0;
      //   state.numPathsBuilt = 0;
      //   state.numRoutersKnown = 0;
      //   state.numPeersConnected = 0;
      //   // not yet set on state received
      //   state.lokiVersion = '';
      //   state.lokiAddress = '';
      //   state.lokiUptime = 0;
      // }
      state.isRunning = newIsRunning;

      state.downloadUsage = newIsRunning
        ? action.payload.stateFromDaemon?.downloadUsage || 0
        : 0;
      state.uploadUsage = newIsRunning
        ? action.payload.stateFromDaemon?.uploadUsage || 0
        : 0;

      state.numPathsBuilt = newIsRunning
        ? action.payload.stateFromDaemon?.numPathsBuilt || 0
        : 0;
      state.numRoutersKnown = newIsRunning
        ? action.payload.stateFromDaemon?.numRoutersKnown || 0
        : 0;
      state.numPeersConnected = newIsRunning
        ? action.payload.stateFromDaemon?.numPeersConnected || 0
        : 0;
      state.lokiAddress = newIsRunning
        ? action.payload.stateFromDaemon?.lokiAddress || ''
        : '';
      state.lokiUptime = newIsRunning
        ? action.payload.stateFromDaemon?.lokiUptime || 0
        : 0;
      state.ratio = newIsRunning
        ? action.payload.stateFromDaemon?.ratio || ''
        : '';
      // lokiVersion
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFromDaemonStatus } = statusSlice.actions;
export const selectStatus = (state: RootState): ParsedStateFromDaemon =>
  state.status;
export default statusSlice.reducer;
