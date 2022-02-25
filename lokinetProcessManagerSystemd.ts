/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import util from 'util';
import { exec } from 'child_process';
import { logLineToAppSide } from './ipcNode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);

export const isSystemD = async (): Promise<boolean> => {
  try {
    logLineToAppSide('Checking for SystemD.');

    const { stdout, stderr } = await execPromisified(
      'ps --no-headers -o comm 1'
    );
    if (stdout && stdout.trim() === 'systemd') {
      logLineToAppSide('SystemD: The current system is using systemd.');
      return true;
    }
    console.log('isSystemD stderr:', stderr);
    logLineToAppSide(`The current system is NOT using systemd: ${stderr}`);

    return false;
  } catch (e: any) {
    logLineToAppSide(`The current system is NOT using systemd: ${e.message}`);

    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    return false;
  }
};

const lokinetService = 'lokinet.service';

export class LokinetSystemDProcessManager implements ILokinetProcessManager {
  async checkForActiveLokinetService(): Promise<boolean> {
    let result;
    try {
      logLineToAppSide('SystemD: checking if lokinet is already running');
      const cmdWithArgs = `systemctl is-active ${lokinetService}`;

      result = await execPromisified(cmdWithArgs);
      if (result?.stdout?.trim() === 'active') {
        logLineToAppSide('SystemD: lokinet is already running');
        return true;
      }
    } catch (e: any) {
      if (e?.stdout?.trim() === 'inactive') {
        logLineToAppSide(
          'SystemD: lokinet service is not running. About to try to start it'
        );
      } else {
        logLineToAppSide(
          `SystemD: checking if lokinet is running failed with: ${e}`
        );

        console.warn(e);
      }
    }
    return false;
  }

  async doStartLokinetProcess(): Promise<string | null> {
    const isRunning = await this.checkForActiveLokinetService();

    if (isRunning) {
      return null;
    }
    const result = await invoke('systemctl', [
      '--no-block',
      'start',
      lokinetService
    ]);

    if (!result) {
      logLineToAppSide('SystemD: lokinet service started');
    }
    return result;
  }

  async doStopLokinetProcess(): Promise<string | null> {
    const isRunning = await this.checkForActiveLokinetService();

    if (!isRunning) {
      return null;
    }
    return invoke('systemctl', ['--no-block', 'stop', lokinetService]);
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('getDefaultBootstrapFileLocation TODO for Systemd');
  }
}
