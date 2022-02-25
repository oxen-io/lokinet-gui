import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type TabIndex = 0 | 1 | 2;

export type ThemeType = 'light' | 'dark';

export type GeneralInfosState = {
  tabSelected: 0 | 1 | 2;
  theme: ThemeType;
};
const initialGeneralInfosState: GeneralInfosState = {
  tabSelected: 2,
  theme: 'light'
};
export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialGeneralInfosState,
  reducers: {
    setTabSelected(state, action: PayloadAction<'main' | 'chart' | 'logs'>) {
      const tabSelected =
        action.payload === 'main' ? 0 : action.payload === 'chart' ? 1 : 2;
      return {
        ...state,
        tabSelected
      };
    },
    setTheme(state, action: PayloadAction<ThemeType>) {
      return {
        ...state,
        theme: action.payload
      };
    }
  }
});

export const { setTabSelected, setTheme } = uiSlice.actions;
export const selectUiState = (state: RootState): GeneralInfosState =>
  state.uiStatus;

export const selectSelectedTab = (state: RootState): TabIndex =>
  state.uiStatus.tabSelected;

export const selectedTheme = (state: RootState): ThemeType =>
  state.uiStatus.theme;
