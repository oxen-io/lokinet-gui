import { ILokinetProcessManager, invoke } from './lokinetProcessManager';

export class LokinetWindowsProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<boolean> {
    return invoke('net', ['start', 'lokinet']);
  }

  doStopLokinetProcess(): Promise<boolean> {
    return invoke('net', ['stop', 'lokinet']);
  }

  doForciblyStopLokinetProcess(): Promise<boolean> {
    return this.doStopLokinetProcess();
  }

  getDefaultBootstrapFileLocation(): string {
    return 'C:\\ProgramData\\lokinet\\bootstrap.signed';
  }
}
