import Store from 'electron-store';
import {
  getDefaultOnExitDo,
  OnExitStopSetting,
  SETTINGS_ID_STOP_ON_EXIT
} from '../../types';

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
