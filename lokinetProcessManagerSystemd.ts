import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import util from 'util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

export const isSystemD = async (): Promise<boolean> => {
  try {
    const { stdout, stderr } = await exec('ps --no-headers -o comm 1');
    if (stdout && stdout.trim() === 'systemd') {
      return true;
    }
    console.log('isSystemD stderr:', stderr);

    return false;
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    return false;
  }
};

export class LokinetSystemDProcessManager implements ILokinetProcessManager {
  async doStartLokinetProcess(): Promise<boolean> {
    return invoke('systemctl', ['--no-block', 'start', 'lokinet.service']);
  }

  async doStopLokinetProcess(): Promise<boolean> {
    return invoke('systemctl', ['--no-block', 'stop', 'lokinet.service']);
  }

  async doForciblyStopLokinetProcess(): Promise<boolean> {
    // systemd's "stop" is a managed stop -- it will do its own forceful kill
    return this.doStopLokinetProcess();
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('getDefaultBootstrapFileLocation TODO for Systemd');
  }
}
