import { ILokinetProcessManager, invoke } from './lokinetProcessManager';
import { app } from 'electron';

export class LokinetMacOSProcessManager implements ILokinetProcessManager {
  doStartLokinetProcess(): Promise<string | null> {
      return invoke(getLokinetBinLocation(), ["--start"]);
  }

  doStopLokinetProcess(): Promise<string | null> {
      return invoke(getLokinetBinLocation(), ["--stop"]);
  }

  getLokinetBinLocation(): string {
      return app.getPath("Lokinet");
  }

  getDefaultBootstrapFileLocation(): string {
      return "";
  }
}
