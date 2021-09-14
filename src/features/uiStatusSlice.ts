import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type TabIndex = 0 | 1 | 2;

export type GeneralInfosState = {
  tabSelected: 0 | 1 | 2;
};
const initialGeneralInfosState: GeneralInfosState = {
  tabSelected: 0
};
export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialGeneralInfosState,
  reducers: {
    setTabSelected(state, action: PayloadAction<TabIndex>) {
      return {
        ...state,
        tabSelected: action.payload
      };
    }
  }
});

export const { setTabSelected } = uiSlice.actions;
export const selectUiState = (state: RootState): GeneralInfosState =>
  state.uiStatus;

export const selectSelectedTab = (state: RootState): TabIndex =>
  state.uiStatus.tabSelected;
