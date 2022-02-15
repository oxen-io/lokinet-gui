import { ILokinetProcessManager } from './lokinetProcessManager';

export class LokinetLinuxProcessManager implements ILokinetProcessManager {
  async doStartLokinetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async doStopLokinetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async doForciblyStopLokinetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('getDefaultBootstrapFileLocation TODO for Linux');
  }
}
