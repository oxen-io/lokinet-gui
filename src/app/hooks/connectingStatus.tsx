import { useSelector } from 'react-redux';
import {
  selectHasExitNodeEnabled,
  selectHasExitNodeChangeLoading
} from '../../features/exitStatusSlice';

export type ConnectingStatus = 'default' | 'connected' | 'connecting' | 'error';

export const useGlobalConnectingStatus = (): ConnectingStatus => {
  const exitIsSet = useSelector(selectHasExitNodeEnabled);
  const exitIsLoading = useSelector(selectHasExitNodeChangeLoading);
  const error = false; //FIXME
  if (error) {
    return 'error';
  }

  if (exitIsLoading) {
    return 'connecting';
  }

  if (exitIsSet) {
    return 'connected';
  }
  return 'default';
};
