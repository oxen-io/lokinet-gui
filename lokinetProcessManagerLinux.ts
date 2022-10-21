import { ILokinetProcessManager } from './lokinetProcessManager';

export class LokinetLinuxProcessManager implements ILokinetProcessManager {
  async nodeStartLokinetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async nodeStopLokinetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }
}
