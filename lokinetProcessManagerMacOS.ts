import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import { logLineToAppSide } from './ipcNode';

import { app } from 'electron';
import { dirname } from 'path';

function getLokinetControlLocation() {
  // We will be at: Lokinet.app/Contents/Helpers/Lokinet-GUI.app/Contents/MacOS/Lokinet-GUI, we want to back to
  // Lokinet.app/Contents/MacOS/Lokinet:
  const controlLocation =
    dirname(dirname(dirname(dirname(dirname(app.getPath('exe')))))) +
    '/MacOS/Lokinet';
  logLineToAppSide(`Lokinet bin control location: "${controlLocation}"`);
  return controlLocation;
}

export class LokinetMacOSProcessManager implements ILokinetProcessManager {
  nodeStartLokinetProcess(): Promise<string | null> {
    return invoke(getLokinetControlLocation(), ['--start']);
  }

  nodeStopLokinetProcess(): Promise<string | null> {
    return invoke(getLokinetControlLocation(), ['--stop']);
  }
}
