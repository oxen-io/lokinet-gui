import { ILokinetProcessManager } from './lokinetProcessManager';

export class LokinetLinuxProcessManager implements ILokinetProcessManager {
  async doStartLokinetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async doStopLokinetProcess(_duringAppExit: boolean): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }
}
