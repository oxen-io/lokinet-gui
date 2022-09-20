import { ILokinetProcessManager, invoke } from './lokinetProcessManager';

export class LokinetWindowsProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<string | null> {
    return invoke('net', ['start', 'lokinet']);
  }

  doStopLokinetProcess(duringAppExit = false): Promise<string | null> {
    return invoke('net', ['stop', 'lokinet']);
  }
}
