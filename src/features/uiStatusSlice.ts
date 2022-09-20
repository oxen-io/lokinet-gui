import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type TabIndex = 0 | 1 | 2 | 3;

export type ThemeType = 'light' | 'dark';

export type GeneralInfosState = {
  tabSelected: TabIndex;
  theme: ThemeType;
};

const initialGeneralInfosState: GeneralInfosState = {
  tabSelected: toTabIndex('settings'),
  theme: 'light'
};

export type TabName = 'main' | 'chart' | 'logs' | 'settings';

export function toTabIndex(name: TabName): TabIndex {
  return name === 'main' ? 0 : name === 'chart' ? 1 : name === 'logs' ? 2 : 3;
}

export function toTabName(index: TabIndex): TabName {
  switch (index) {
    case 0:
      return 'main';
    case 1:
      return 'chart';
    case 2:
      return 'logs';
    case 3:
      return 'settings';
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialGeneralInfosState,
  reducers: {
    setTabSelected(state, action: PayloadAction<TabName>) {
      const tabSelected = toTabIndex(action.payload);
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
