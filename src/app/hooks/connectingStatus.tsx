import { useSelector } from 'react-redux';
import { StatusErrorTypeSet } from '../../../sharedIpc';
import {
  selectHasExitNodeEnabled,
  selectHasExitNodeChangeLoading
} from '../../features/exitStatusSlice';
import { selectGlobalError } from '../../features/statusSlice';

export type ConnectingStatus =
  | 'default'
  | 'connected'
  | 'connecting'
  | StatusErrorTypeSet;

export const useGlobalConnectingStatus = (): ConnectingStatus => {
  const exitIsSet = useSelector(selectHasExitNodeEnabled);
  const exitIsLoading = useSelector(selectHasExitNodeChangeLoading);
  const globalError = useSelector(selectGlobalError);

  if (globalError) {
    return globalError;
  }

  if (exitIsLoading) {
    return 'connecting';
  }

  if (exitIsSet) {
    return 'connected';
  }
  return 'default';
};

export const isGlobalStatusError = (
  globalStatus: ConnectingStatus
): boolean => {
  return globalStatus.startsWith('error-');
};
