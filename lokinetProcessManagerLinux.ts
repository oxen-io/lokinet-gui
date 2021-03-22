import { invoke } from './lokinetProcessManager';

import util from 'util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

const isSystemD = async () => {
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

export const doStartLokinetProcessLinux = async (): Promise<boolean> => {
  if (await isSystemD()) {
    return invoke('systemctl', ['--no-block', 'start', 'lokinet.service']);
  } else {
    console.warn('not systemd not supported yet.');
  }
  return false;
};

export const doStopLokinetProcessLinux = async (): Promise<boolean> => {
  if (await isSystemD()) {
    return invoke('systemctl', ['--no-block', 'stop', 'lokinet.service']);
  } else {
    console.warn('not systemd not supported yet.');
  }
  return false;
};

// systemd's "stop" is a managed stop -- it will do its own forceful kill
export const doForciblyStopLokinetProcessLinux = async (): Promise<boolean> => {
  return doStopLokinetProcessLinux();
};
