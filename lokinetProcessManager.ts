/* eslint-disable @typescript-eslint/no-explicit-any */
import util from 'util';
import {
  getEventByJobId,
  logLineToAppSide,
  sendGlobalErrorToAppSide
} from './ipcNode';
import { LokinetLinuxProcessManager } from './lokinetProcessManagerLinux';
import {
  LokinetSystemDProcessManager,
  isSystemD
} from './lokinetProcessManagerSystemd';

import { LokinetWindowsProcessManager } from './lokinetProcessManagerWindows';

import { IPC_CHANNEL_KEY } from './sharedIpc';
import { exec } from 'child_process';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);
// eslint-disable-next-line @typescript-eslint/no-var-requires

const LINUX = 'linux';
const WIN = 'win32';
// const MACOS = 'darwin';

export const invoke = async (
  cmd: string,
  args: Array<string>
): Promise<string | null> => {
  const cmdWithArgs = `${cmd} ${args.join(' ')}`;
  console.log('running cmdWithArgs', cmdWithArgs);
  try {
    const result = await execPromisified(cmdWithArgs);
    if (result && (result.stdout || result.stderr)) {
      console.warn(`Failed to invoke: '${cmdWithArgs}'`);
      console.warn(`result: `, result);
      return result.stdout || result.stderr || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.warn('invoke failed with', e);
    const stderr = e.stderr ? e.stderr : '';
    const stdout = e.stdout ? e.stdout : '';
    const cmd = e.cmd ? `${e.cmd}: ` : '';
    logLineToAppSide(`invoke failed with: ${e}`);
    return `${cmd}${stdout}  ${stderr}`;
  }

  return null;
};

export interface ILokinetProcessManager {
  doStartLokinetProcess: () => Promise<string | null>;
  doStopLokinetProcess: () => Promise<string | null>;

  // /var/lib/lokinet/bootstrap.signed for MacOS
  getDefaultBootstrapFileLocation: () => string;
}

let lokinetProcessManager: ILokinetProcessManager;

const getLokinetProcessManager = async () => {
  if (lokinetProcessManager) {
    return lokinetProcessManager;
  }

  if (process.platform === WIN) {
    logLineToAppSide('Current system is windows');

    lokinetProcessManager = new LokinetWindowsProcessManager();
    return lokinetProcessManager;
  }

  if (process.platform === LINUX) {
    if (await isSystemD()) {
      lokinetProcessManager = new LokinetSystemDProcessManager();
      return lokinetProcessManager;
    }
    logLineToAppSide('Current system is linux but not systemd');

    lokinetProcessManager = new LokinetLinuxProcessManager();
    return lokinetProcessManager;
  }
  logLineToAppSide('Current system is UNSUPPORTED');

  throw new Error(
    `LokinetProcessManager not implemented for ${process.platform}`
  );
};

export const doStartLokinetProcess = async (jobId: string): Promise<void> => {
  let result: string | undefined;

  try {
    logLineToAppSide('About to start Lokinet process');

    const manager = await getLokinetProcessManager();
    const startStopResult = await manager.doStartLokinetProcess();

    if (startStopResult) {
      sendGlobalErrorToAppSide('error-start-stop');
    }
  } catch (e: any) {
    logLineToAppSide(`Lokinet process start failed with ${e.message}`);
    console.warn('doStartLokinetProcess failed with', e);
    sendGlobalErrorToAppSide('error-start-stop');
  }

  const event = getEventByJobId(jobId);
  event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);
};

/**
 * doStopLokinetProcess is only called when exiting the app so there is no point to wait
 * for the event return and so no jobId argument required
 */
export const doStopLokinetProcess = async (): Promise<void> => {
  try {
    logLineToAppSide('About to stop Lokinet process');

    const manager = await getLokinetProcessManager();
    await manager.doStopLokinetProcess();
  } catch (e: any) {
    logLineToAppSide(`Lokinet process stop failed with ${e.message}`);

    console.warn('doStopLokinetProcess failed with', e);
  }
};

export const doGetProcessPid = (): number => {
  return 0;
};
