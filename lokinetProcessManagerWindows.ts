import { ILokinetProcessManager, invoke } from './lokinetProcessManager';

export class LokinetWindowsProcessManager implements ILokinetProcessManager {
  nodeStartLokinetProcess(): Promise<string | null> {
    return invoke('net', ['start', 'lokinet']);
  }

  nodeStopLokinetProcess(): Promise<string | null> {
    return invoke('net', ['stop', 'lokinet']);
  }
}
