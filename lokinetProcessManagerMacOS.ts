import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import { app } from 'electron';
import { dirname } from 'path';

function getLokinetControlLocation() {
  // We will be at: Lokinet.app/Contents/Helpers/Lokinet-GUI.app/Contents/MacOS/Lokinet-GUI, we want to back to
  // Lokinet.app/Contents/MacOS/Lokinet:
  return (
    dirname(dirname(dirname(dirname(dirname(app.getPath('exe')))))) +
    '/MacOS/Lokinet'
  );
}

export class LokinetMacOSProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<string | null> {
    return invoke(getLokinetControlLocation(), ['--start']);
  }

  doStopLokinetProcess(_duringAppExit = false): Promise<string | null> {
    return invoke(getLokinetControlLocation(), ['--stop']);
  }
}
