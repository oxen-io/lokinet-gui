import { useSelector } from 'react-redux';
import {
  selectHasExitNodeEnabled,
  selectHasExitNodeChangeLoading,
  selectHasDoneInitialLoading
} from '../../features/exitStatusSlice';
import {
  selectGlobalError,
  selectDaemonRunning
} from '../../features/statusSlice';

// export type ConnectingStatus =
//   | 'exit-connected'
//   | 'exit-connecting'
//   | 'daemon-running'
//   | 'daemon-not-running'
//   | 'daemon-loading'
//   | 'error-start-stop'
//   | 'error-add-exit';

// export const useGlobalConnectingStatus = (): ConnectingStatus => {
//   const exitIsSet = useSelector(selectHasExitNodeEnabled);
//   const exitIsLoading = useSelector(selectHasExitNodeChangeLoading);
//   const daemonIsRunning = useSelector(selectDaemonRunning);
//   const globalError = useSelector(selectGlobalError);
//   const initialLoadingFinished = useSelector(selectHasDoneInitialLoading);

//   if (globalError) {
//     return globalError;
//   }

//   if (!initialLoadingFinished) {
//     return 'daemon-loading';
//   }
//   if (!daemonIsRunning) {
//     return 'daemon-not-running';
//   }

//   if (exitIsLoading) {
//     return 'exit-connecting';
//   }

//   if (exitIsSet) {
//     return 'exit-connected';
//   }
//   return 'daemon-running';
// };

// export const isGlobalStatusError = (
//   globalStatus: ConnectingStatus
// ): boolean => {
//   return Boolean(globalStatus?.startsWith('error-'));
// };
