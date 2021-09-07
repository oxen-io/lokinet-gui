import { ILokinetProcessManager } from './lokinetProcessManager';

export class LokinetLinuxProcessManager implements ILokinetProcessManager {
  async doStartLokinetProcess(): Promise<boolean> {
    throw new Error('Not systemd: not supported yet');
  }

  async doStopLokinetProcess(): Promise<boolean> {
    throw new Error('Not systemd: not supported yet');
  }

  async doForciblyStopLokinetProcess(): Promise<boolean> {
    throw new Error('Not systemd: not supported yet');
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('getDefaultBootstrapFileLocation TODO for Linux');
  }
}
