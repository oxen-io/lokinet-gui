import { ILokinetProcessManager, invoke } from './lokinetProcessManager';

export class LokinetWindowsProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<string | null> {
    return invoke('net', ['start', 'lokinet']);
  }

  doStopLokinetProcess(): Promise<string | null> {
    return invoke('net', ['stop', 'lokinet']);
  }

  getDefaultBootstrapFileLocation(): string {
    return 'C:\\ProgramData\\lokinet\\bootstrap.signed';
  }
}
