import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { selectDaemonRunning } from './statusSlice';

export interface ExitStatusState {
  // set to true when the user clicked. We must block other call while this is true
  exitLoading: boolean;
  // false until the first get_status gets resolved/fails
  initialLoadingFinished: boolean;

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
  initialLoadingFinished: false,
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
    markExitFailedToLoad: (state) => {
      state.exitLoading = false;
      state.exitNodeFromDaemon = undefined;
      state.exitAuthCodeFromDaemon = undefined;
      return state;
    },

    markInitialLoadingFinished(state) {
      if (!state.initialLoadingFinished) {
        state.exitLoading = false;
        state.initialLoadingFinished = true;
      }
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
  onUserAuthCodeSet,
  markInitialLoadingFinished
} = exitStatusSlice.actions;

export const selectExitStatus = (state: RootState): ExitStatusState =>
  state.exitStatus;

export const selectHasExitNodeEnabled = createSelector(
  selectExitStatus,
  selectDaemonRunning,
  (status, daemonRunning: boolean) =>
    daemonRunning && Boolean(status.exitNodeFromDaemon)
);

export const selectHasExitNodeChangeLoading = createSelector(
  selectExitStatus,
  selectDaemonRunning,
  (status, daemonRunning: boolean) => daemonRunning && status.exitLoading
);

export const selectExitNodeFromUser = createSelector(
  selectExitStatus,
  (status) => status.exitNodeFromUser
);

export const selectAuthCodeFromUser = createSelector(
  selectExitStatus,
  (status) => status.exitAuthCodeFromUser
);

export const selectHasDoneInitialLoading = createSelector(
  selectExitStatus,
  (status) => status.initialLoadingFinished
);
