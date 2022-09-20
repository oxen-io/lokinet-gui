import { useSelector } from 'react-redux';
import { StatusErrorTypeSet } from '../../../sharedIpc';
import {
  selectHasExitNodeEnabled,
  selectHasExitNodeChangeLoading
} from '../../features/exitStatusSlice';
import { selectGlobalError } from '../../features/statusSlice';

export type ConnectingStatus =
  | 'default'
  | 'exit-connected'
  | 'exit-connecting'
  | 'daemon-connected'
  | 'daemon-connecting'
  | StatusErrorTypeSet;

export const useGlobalConnectingStatus = (): ConnectingStatus => {
  const exitIsSet = useSelector(selectHasExitNodeEnabled);
  const exitIsLoading = useSelector(selectHasExitNodeChangeLoading);
  const globalError = useSelector(selectGlobalError);

  if (globalError) {
    return globalError;
  }

  if (exitIsLoading) {
    return 'exit-connecting';
  }

  if (exitIsSet) {
    return 'exit-connected';
  }
  return 'default';
};

export const isGlobalStatusError = (
  globalStatus: ConnectingStatus
): boolean => {
  return globalStatus.startsWith('error-');
};
