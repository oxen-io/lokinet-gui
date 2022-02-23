import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import util from 'util';
import { exec } from 'child_process';
import { logLineToAppSide } from './ipcNode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);

export const isSystemD = async (): Promise<boolean> => {
  try {
    logLineToAppSide('Checking for systemd.');

    const { stdout, stderr } = await execPromisified(
      'ps --no-headers -o comm 1'
    );
    if (stdout && stdout.trim() === 'systemd') {
      logLineToAppSide('The current system is using systemd.');
      return true;
    }
    console.log('isSystemD stderr:', stderr);
    logLineToAppSide(`The current system is NOT using systemd: ${stderr}`);

    return false;
  } catch (e) {
    logLineToAppSide(`The current system is NOT using systemd: ${e.message}`);

    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    return false;
  }
};

const lokinetService = 'lokinet.service';

export class LokinetSystemDProcessManager implements ILokinetProcessManager {
  async doStartLokinetProcess(): Promise<string | null> {
    const cmdWithArgs = `systemctl is-active ${lokinetService}`;
    let isRunning = false;
    let result;
    try {
      logLineToAppSide('SystemD: checking if lokinet is already running');

      result = await execPromisified(cmdWithArgs);
      if (result?.stdout?.trim() === 'active') {
        logLineToAppSide('SystemD: lokinet is already running');

        isRunning = true;
        console.warn('result', result);
      }
    } catch (e) {
      if (result?.stdout?.trim() === 'inactive') {
        logLineToAppSide('SystemD: lokinet is not running');
      } else {
        logLineToAppSide(
          `SystemD: checking if lokinet is running failed with: ${e.message}`
        );

        console.warn(e);
      }
    }

    if (isRunning) {
      return null;
    }
    return invoke('systemctl', ['--no-block', 'start', lokinetService]);
  }

  async doStopLokinetProcess(): Promise<string | null> {
    return invoke('systemctl', ['--no-block', 'stop', lokinetService]);
  }

  async doForciblyStopLokinetProcess(): Promise<string | null> {
    // systemd's "stop" is a managed stop -- it will do its own forceful kill
    return this.doStopLokinetProcess();
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('getDefaultBootstrapFileLocation TODO for Systemd');
  }
}
