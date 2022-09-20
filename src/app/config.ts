import Store from 'electron-store';
import {
  getDefaultOnExitDo,
  OnExitStopSetting,
  SETTINGS_ID_SELECTED_THEME,
  SETTINGS_ID_STOP_ON_EXIT
} from '../../types';
import { ThemeType } from '../features/uiStatusSlice';

const store = new Store();

export const getOnStopSetting = (): OnExitStopSetting => {
  return store.get(
    SETTINGS_ID_STOP_ON_EXIT,
    getDefaultOnExitDo()
  ) as OnExitStopSetting;
};

export const setOnStopSetting = (selectedSetting: OnExitStopSetting) => {
  store.set(SETTINGS_ID_STOP_ON_EXIT, selectedSetting);
};

export const getThemeFromSettings = (): ThemeType => {
  return store.get(SETTINGS_ID_SELECTED_THEME, 'light') as ThemeType;
};

export const setThemeToSettings = (selectedTheme: ThemeType) => {
  store.set(SETTINGS_ID_SELECTED_THEME, selectedTheme);
};
