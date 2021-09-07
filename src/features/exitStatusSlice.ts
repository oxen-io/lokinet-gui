import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface ExitStatusState {
  // set to true when the user clicked. We must block other call while this is true
  exitLoading: boolean;

  // Those are user entered values
  // When clicking on enable exit, those are the values used to setup the daemon
  // exitNodeFromUser is required, but not exitAuthCodeFromUser
  exitNodeFromUser?: string;
  exitAuthCodeFromUser?: string;

  // those 2 fields will be set once exitLoading is done loading with what the daemon gave us back.
  exitNodeFromDaemon?: string;
  exitAuthCodeFromDaemon?: string;
}

const initialStatusState: ExitStatusState = {
  // default to true to let the user know we are fetching data on app load
  exitLoading: true,
  exitNodeFromUser: 'exit.loki',
  exitAuthCodeFromUser: undefined,
  exitNodeFromDaemon: undefined,
  exitAuthCodeFromDaemon: undefined
};

export const exitStatusSlice = createSlice({
  name: 'exitStatus',
  initialState: initialStatusState,
  reducers: {
    markExitIsTurningOn: (state) => {
      state.exitLoading = true;

      state.exitNodeFromDaemon = undefined;
      state.exitAuthCodeFromDaemon = undefined;
      return state;
    },
    markExitIsTurningOff: (state) => {
      state.exitLoading = true;
      return state;
    },
    markExitFailedToLoad: (state, action: PayloadAction<string>) => {
      console.warn('markExitFailedToLoad with error: ', action.payload);

      state.exitLoading = false;
      state.exitNodeFromDaemon = undefined;
      state.exitAuthCodeFromDaemon = undefined;
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
    markExitNodesFromDaemon: (
      state,
      action: PayloadAction<{
        exitNodeFromDaemon?: string;
        exitAuthCodeFromDaemon?: string;
      }>
    ) => {
      state.exitLoading = false;
      state.exitNodeFromDaemon = action.payload.exitNodeFromDaemon;
      state.exitAuthCodeFromDaemon = action.payload.exitAuthCodeFromDaemon;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  markExitIsTurningOn,
  markExitIsTurningOff,
  markExitFailedToLoad,
  markExitNodesFromDaemon,
  onUserExitNodeSet,
  onUserAuthCodeSet
} = exitStatusSlice.actions;
export const selectExitStatus = (state: RootState): ExitStatusState =>
  state.exitStatus;
