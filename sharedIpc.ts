/**
 * Direction: Renderer -> Main -> Renderer
 * When renderer side wants to run some main functions, he call this IPC.
 * this can run either an rpc call (get status, add/remove exit,..) or a lokinet process manager command (start/stop the service)
 */

export const IPC_CHANNEL_KEY = 'ipc-channel';

/**
 * Direction: Main -> Renderer
 * When main side wants to add a log line in the renderer log screen it calls this IPC
 */
export const IPC_LOG_LINE = 'log-line-to-app';

/**
 * Direction: Main -> Renderer
 * When main side wants to set the global error status on the renderer side he calls this method
 */
export const IPC_GLOBAL_ERROR = 'ipc-global-error';
export type StatusErrorTypeSet = 'error-start-stop' | 'error-add-exit';

export type StatusErrorType = StatusErrorTypeSet | undefined;

export const DEBUG_IPC_CALLS = true;
export const DEBUG_IPC_CALLS_GET_STATUS = false;

export function isMacOS() {
  return process.platform === 'darwin';
}

export function isLinux() {
  return process.platform !== 'win32' && !isMacOS();
}
