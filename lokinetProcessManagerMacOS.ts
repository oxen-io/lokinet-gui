import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import { logLineToAppSide } from './ipcNode';

function getLokinetControlLocation() {
  const lokinetControlLocation =
    '/Applications/Lokinet.app/Contents/MacOS/Lokinet';

  logLineToAppSide(`lokinet path: "${lokinetControlLocation}"`);
  return lokinetControlLocation;
}

export class LokinetMacOSProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<string | null> {
    return invoke(getLokinetControlLocation(), ['--start']);
  }

  doStopLokinetProcess(): Promise<string | null> {
    return invoke(getLokinetControlLocation(), ['--stop']);
  }
}
