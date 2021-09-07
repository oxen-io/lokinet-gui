import util from 'util';
import { eventsByJobId } from './ipcNode';
import { LokinetLinuxProcessManager } from './lokinetProcessManagerLinux';
import {
  LokinetSystemDProcessManager,
  isSystemD
} from './lokinetProcessManagerSystemd';

import { LokinetWindowsProcessManager } from './lokinetProcessManagerWindows';

import { IPC_CHANNEL_KEY } from './sharedIpc';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

const LINUX = 'linux';
const WIN = 'win32';
// const MACOS = 'darwin';

export const invoke = async (
  cmd: string,
  args: Array<string>
): Promise<boolean> => {
  const cmdWithArgs = `${cmd} ${args.join(' ')}`;
  console.log('running cmdWithArgs', cmdWithArgs);
  try {
    const result = await exec(cmdWithArgs);
    if (result && (result.stdout || result.stderr)) {
      console.warn(`Failed to invoke: '${cmdWithArgs}'`);
      console.warn(`result: `, result);
      return false;
    }
  } catch (e) {
    console.warn('invoke failed with', e);
    return false;
  }

  return true;
};

const getEventByJobId = (jobId: string) => {
  const event = eventsByJobId[jobId];

  if (!event) {
    throw new Error(`Could not find the event for jobId ${jobId}`);
  }
  return event;
};

export interface ILokinetProcessManager {
  doStartLokinetProcess: () => Promise<boolean>;
  doStopLokinetProcess: () => Promise<boolean>;
  doForciblyStopLokinetProcess: () => Promise<boolean>;

  // /var/lib/lokinet/bootstrap.signed for MacOS
  getDefaultBootstrapFileLocation: () => string;
}

let lokinetProcessManager: ILokinetProcessManager;

const getLokinetProcessManager = async () => {
  if (lokinetProcessManager) {
    return lokinetProcessManager;
  }

  if (process.platform === WIN) {
    lokinetProcessManager = new LokinetWindowsProcessManager();
    return lokinetProcessManager;
  }

  if (process.platform === LINUX) {
    if (await isSystemD()) {
      lokinetProcessManager = new LokinetSystemDProcessManager();
      return lokinetProcessManager;
    }
    lokinetProcessManager = new LokinetLinuxProcessManager();
    return lokinetProcessManager;
  }

  throw new Error(
    `LokinetProcessManager not implemented for ${process.platform}`
  );
};

export const doStartLokinetProcess = async (jobId: string): Promise<void> => {
  let result = false;

  try {
    const manager = await getLokinetProcessManager();
    result = await manager.doStartLokinetProcess();
  } catch (e) {
    console.warn('doStartLokinetProcess failed with', e);
  }

  const event = getEventByJobId(jobId);
  event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);
};

export const doStopLokinetProcess = async (jobId: string): Promise<void> => {
  let result = false;

  try {
    const manager = await getLokinetProcessManager();
    result = await manager.doStopLokinetProcess();
  } catch (e) {
    console.warn('doStopLokinetProcess failed with', e);
  }

  const event = getEventByJobId(jobId);
  event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);
};

export const doForciblyStopLokinetProcess = async (
  jobId: string
): Promise<void> => {
  let result = false;

  try {
    const manager = await getLokinetProcessManager();
    result = await manager.doForciblyStopLokinetProcess();
  } catch (e) {
    console.warn('doForciblyStopLokinetProcess failed with', e);
  }

  const event = getEventByJobId(jobId);
  event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);
};

export const doGetProcessPid = (): number => {
  return 0;
};
