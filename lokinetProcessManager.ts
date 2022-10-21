/* eslint-disable @typescript-eslint/no-explicit-any */
import util from 'util';
import {
  logLineToAppSide,
  sendGlobalErrorToAppSide,
  sendIpcReplyAndDeleteJob
} from './ipcNode';
import { LokinetLinuxProcessManager } from './lokinetProcessManagerLinux';
import {
  LokinetSystemDProcessManager,
  isSystemD
} from './lokinetProcessManagerSystemd';

import { LokinetWindowsProcessManager } from './lokinetProcessManagerWindows';

import { exec } from 'child_process';
import { LokinetMacOSProcessManager } from './lokinetProcessManagerMacOS';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);
// eslint-disable-next-line @typescript-eslint/no-var-requires

const LINUX = 'linux';
const WIN = 'win32';
const MACOS = 'darwin';

export const invoke = async (
  cmd: string,
  args: Array<string>
): Promise<string | null> => {
  const cmdWithArgs = `${cmd} ${args.join(' ')}`;
  console.log('running cmdWithArgs', cmdWithArgs);
  try {
    const result = await execPromisified(cmdWithArgs);
    if (result && (result.stdout || result.stderr)) {
      console.info(`Failed to invoke: '${cmdWithArgs}'`);
      console.info(`result: `, result);
      return result.stdout || result.stderr || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.info('invoke failed with', e);
    const stderr = e.stderr ? e.stderr : '';
    const stdout = e.stdout ? e.stdout : '';
    const cmd = e.cmd ? `${e.cmd}: ` : '';
    logLineToAppSide(`invoke failed with: ${e}`);
    return `${cmd}${stdout}  ${stderr}`;
  }

  return null;
};

export interface ILokinetProcessManager {
  nodeStartLokinetProcess: () => Promise<string | null>;
  nodeStopLokinetProcess: () => Promise<string | null>;
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

  if (process.platform === MACOS) {
    logLineToAppSide('Current system is macos');

    lokinetProcessManager = new LokinetMacOSProcessManager();
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

    let startResult = await manager.nodeStartLokinetProcess();
    logLineToAppSide(`Lokinet process start result: "${startResult}"`);

    if (
      startResult &&
      startResult.includes('The requested service has already been started')
    ) {
      // try to stop it and restart it?
      logLineToAppSide(`Trying to restart the daemon...`);
      const stopResult = await manager.nodeStopLokinetProcess();
      logLineToAppSide(`restart stop: ${stopResult}`);

      startResult = await manager.nodeStartLokinetProcess();
      logLineToAppSide(`Lokinet process restart result: "${startResult}"`);
    }

    if (startResult) {
      sendGlobalErrorToAppSide('error-start-stop');
    }
    sendIpcReplyAndDeleteJob(jobId, null, '');
  } catch (e: any) {
    logLineToAppSide(`Lokinet process start failed with ${e.message}`);
    console.info('nodeStartLokinetProcess failed with', e);
    sendGlobalErrorToAppSide('error-start-stop');
    sendIpcReplyAndDeleteJob(jobId, null, result);
  }
};

/**
 * doStopLokinetProcess is only called when exiting the app so there is no point to wait
 * for the event return and so no jobId argument required
 */
export const doStopLokinetProcess = async (jobId: string): Promise<void> => {
  try {
    logLineToAppSide('About to stop Lokinet process');

    const manager = await getLokinetProcessManager();
    await manager.nodeStopLokinetProcess();
    sendIpcReplyAndDeleteJob(jobId, null, '');
  } catch (e: any) {
    logLineToAppSide(`Lokinet process stop failed with ${e.message}`);
    sendIpcReplyAndDeleteJob(jobId, e.message, '');

    console.info('nodeStopLokinetProcess failed with', e);
  }
};
