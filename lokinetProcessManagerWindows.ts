import { invoke } from './lokinetProcessManager';

export const doStartLokinetProcessWindows = async (): Promise<boolean> => {
  return invoke('net', ['start', 'lokinet']);
};

export const doStopLokinetProcessWindows = async (): Promise<boolean> => {
  return invoke('net', ['stop', 'lokinet']);
};

export const doForciblyStopLokinetProcessWindows =
  async (): Promise<boolean> => {
    return doStopLokinetProcessWindows();
  };
