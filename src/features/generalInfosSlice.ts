import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { ParsedGeneralInfosFromDaemon } from '../ipc/ipcRenderer';

export type GeneralInfosState = ParsedGeneralInfosFromDaemon;
const initialGeneralInfosState: GeneralInfosState = {
  version: '',
  uptime: 0
};
export const generalInfosSlice = createSlice({
  name: 'generalInfos',
  initialState: initialGeneralInfosState,
  reducers: {
    updateFromDaemonGeneralInfos: (
      state,
      action: PayloadAction<{
        generalsInfos?: ParsedGeneralInfosFromDaemon;
        error?: string;
      }>
    ) => {
      state.uptime = action.payload.generalsInfos?.uptime || 0;
      state.version = action.payload.generalsInfos?.version || '';

      return state;
    }
  }
});

export const { updateFromDaemonGeneralInfos } = generalInfosSlice.actions;
export const selectGeneralInfos = (state: RootState): GeneralInfosState =>
  state.generalInfos;
