import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    updateByIsRunningChange: (state, action: PayloadAction<boolean>) => {
      const newIsRunning = action.payload;
      if (newIsRunning !== state.isRunning) {
        // we were running and we are different => we are no longer running
        if (state.isRunning) {
          console.log('Detected disconnection');
          // zero-out values that would otherwise be stale in the UI
          state.lokiVersion = '';
          state.lokiAddress = '';
          state.lokiUptime = 0;
          state.numPathsBuilt = 0;
          state.numRoutersKnown = 0;
          state.downloadUsage = 0;
          state.uploadUsage = 0;
          state.numPeersConnected = 0;
          state.isRunning = newIsRunning;
        } else {
          // we restarted running
          console.warn(
            'Detected [re-]connection. We have to fetch the lokinet version'
          );
          state.isRunning = newIsRunning;
        }
      }
    }
    // updateFromJsonStatus: (
    //   state,
    //   action: PayloadAction<{ json?: string; error?: string }>
    // ) => {
    //   state.value += action.payload;
    // }
  }
});

// Action creators are generated for each case reducer function
export const {
  updateByIsRunningChange
  // updateFromJsonStatus
} = statusSlice.actions;

export default statusSlice.reducer;
