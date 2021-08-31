import util from 'util';
import { eventsByJobId } from './ipcNode';
import {
  doForciblyStopLokinetProcessLinux,
  doStartLokinetProcessLinux,
  doStopLokinetProcessLinux
} from './lokinetProcessManagerLinux';

import {
  doForciblyStopLokinetProcessWindows,
  doStartLokinetProcessWindows,
  doStopLokinetProcessWindows
} from './lokinetProcessManagerWindows';


import { IPC_CHANNEL_KEY } from './sharedIpc';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

const LINUX = 'linux';
const WIN = 'win32';
const MACOS = 'darwin';

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

export const doStartLokinetProcess = async (jobId: string): Promise<void> => {
  let result = false;
  switch (process.platform) {
    case WIN:
      result = await doStartLokinetProcessWindows();
      const event = getEventByJobId(jobId);
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);
      return;
    case LINUX: {
      result = await doStartLokinetProcessLinux();
      const event = getEventByJobId(jobId);
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);

      return;
    }
  }

  throw new Error(`doStartLokinetProcess not made for ${process.platform}`);
};

export const doStopLokinetProcess = async (jobId: string): Promise<void> => {
  switch (process.platform) {
    case LINUX: {
      const ret = await doStopLokinetProcessLinux();
      const event = getEventByJobId(jobId);
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, ret);
      return;
    }
    case WIN: {
      const ret = await doStopLokinetProcessWindows();
      const event = getEventByJobId(jobId);
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, ret);
      return;
    }
  }
  throw new Error(`doStopLokinetProcess not made for ${process.platform}`);
};

export const doForciblyStopLokinetProcess = async (): Promise<void> => {
  switch (process.platform) {
    case WIN:
      await doForciblyStopLokinetProcessWindows();
      return;
    case LINUX:
      await doForciblyStopLokinetProcessLinux();
      return;
  }
  throw new Error(
    `doForciblyStopLokinetProcessLinux not made for ${process.platform}`
  );
};

export const doGetProcessPid = (): number => {
  return 0;
};

export const getDefaultBootstrapFileLocation = (): string => {
  switch (process.platform) {
    case LINUX:
      throw new Error('TODO');
    case WIN:
      return 'C:\\ProgramData\\lokinet\\bootstrap.signed';
    case MACOS:
      return '/var/lib/lokinet/bootstrap.signed';
    default:
      throw new Error(`Unsupported platform ${process.platform}`);
  }
};
