import { ILokinetProcessManager, invoke } from './lokinetProcessManager';

export class LokinetMacOSProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<string | null> {
    const startNotification =
      '-e \'display notification "We should start LOKINET mac extension"\'';
    return invoke('osascript', [startNotification]);
  }

  doStopLokinetProcess(): Promise<string | null> {
    const stopNotification =
      '-e \'display notification "We should stop LOKINET mac extension"\'';

    return invoke('osascript', [stopNotification]);
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('FIXME');
    return 'C:\\ProgramData\\lokinet\\bootstrap.signed';
  }
}
