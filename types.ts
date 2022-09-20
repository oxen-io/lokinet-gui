export const SETTINGS_ID_STOP_ON_EXIT = 'on_exit_stop_setting';

export type OnExitStopSetting =
  | 'stop_everything' // stop daemon and exit
  | 'keep_daemon_only' // stop exit mode but keep daemon running (no need for admin rights)
  | 'keep_everything'; // keep exit and daemon as they are currently running

export function getDefaultOnExitDo(): OnExitStopSetting {
  return 'stop_everything';
}
