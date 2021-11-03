import { ILokinetProcessManager, invoke } from './lokinetProcessManager';

import { path } from 'fs';

export class LokinetMacOSProcessManager implements ILokinetProcessManager
{

  getLokinetExecPath(): string {
      return path.join(process.env.PORTABLE_EXECUTABLE_DIR, "lokinet");   
  }
    
  doStartLokinetProcess(): Promise<boolean> {
      return false;
  }

  doStopLokinetProcess(): Promise<boolean> {
    return true;
  }

  doForciblyStopLokinetProcess(): Promise<boolean> {
    return this.doStopLokinetProcess();
  }

  getDefaultBootstrapFileLocation(): string {
      return '/dev/null';
  }

}
