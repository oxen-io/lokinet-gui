import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

enum UiTab {
  CHART,
  LOGS
}

export type GeneralInfosState = {
  tabSelected: UiTab;
};
const initialGeneralInfosState: GeneralInfosState = {
  tabSelected: UiTab.CHART
};
export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialGeneralInfosState,
  reducers: {
    setTabSelected(
      state,
      action: PayloadAction<{
        tabSelected: UiTab;
      }>
    ) {
      return {
        ...state,
        tabSelected: action.payload.tabSelected
      };
    }
  }
});

export const { setTabSelected } = uiSlice.actions;
export const selectUiState = (state: RootState): GeneralInfosState =>
  state.uiStatus;
