import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  selectDaemonIsLoading,
  selectHasExitNodeEnabled
} from '../../../features/exitStatusSlice';
import {
  selectDaemonOrExitIsLoading,
  selectDaemonRunning,
  selectGlobalError
} from '../../../features/statusSlice';

import { selectedTheme } from '../../../features/uiStatusSlice';
import {
  doStartLokinetProcess,
  doStopLokinetProcess
} from '../../../ipc/ipcRenderer';

import { PowerButtonIcon } from './PowerButtonIcon';
import { PowerButtonContainerBorder } from './PowerButtonSpinner';

const StyledPowerButtonContainer = styled.div<{ shadow: string; bg: string }>`
  display: flex;
  height: 38vw;
  width: 38vw;
  max-height: 140px;
  max-width: 140px;
  min-height: 100px;
  min-width: 100px;
  align-self: center;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: ${(props) => props.shadow};
  background-color: ${(props) => props.bg};
  margin: 37px 5px !important;
  cursor: pointer;
`;

const StyledPowerButton = styled.div`
  height: 80%;
  width: 80%;

  margin: auto;
  border: 2px solid ${(props) => props.theme.textColor}
  position: absolute;
  border-radius: 50%;

  transition: 0.25s;

`;

const usePowerButtonStyles = () => {
  const themeType = useSelector(selectedTheme);

  const shadow = usePowerButtonContainerShadowStyle();
  const buttonContainerBackground =
    themeType === 'light' ? '#FAFAFA' : '#000000';
  return { shadow, buttonContainerBackground };
};

const usePowerButtonContainerShadowStyle = () => {
  const globalError = useSelector(selectGlobalError);
  const themeType = useSelector(selectedTheme);
  const daemonOrExitIsLoading = useSelector(selectDaemonOrExitIsLoading);
  const exitConnected = useSelector(selectHasExitNodeEnabled);
  const daemonRunning = useSelector(selectDaemonRunning);

  if (globalError) {
    return themeType === 'light'
      ? '0px 0px 30px rgba(255, 0, 0, 0.61)'
      : `0px 0px 51px rgba(255, 33, 33, 0.8), 0px 0px 66px #000000`;
  }

  if (daemonOrExitIsLoading) {
    return themeType === 'light'
      ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
      : `0px 0px 30px rgba(255, 255, 255, 0.18), 0px 0px 66px #000000`;
  }

  if (daemonRunning || exitConnected) {
    return themeType === 'light'
      ? '0px 0px 25px rgba(0, 0, 0, 0.55)'
      : `0px 0px 15px rgba(255, 255, 255, 0.48)`;
  }

  return themeType === 'light'
    ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
    : `0px 0px 66px #000000`;
};

export const PowerButton = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  const daemonOrExitIsLoading = useSelector(selectDaemonOrExitIsLoading);
  const daemonIsRunning = useSelector(selectDaemonRunning);
  const daemonIsLoading = useSelector(selectDaemonIsLoading);

  const { shadow, buttonContainerBackground } = usePowerButtonStyles();

  const onPowerButtonClick = () => {
    if (daemonOrExitIsLoading) {
      // we are waiting for a refresh from lokinet, drop the click event

      return;
    }
    if (daemonIsRunning) {
      // no matter the current state, if the daemon is running a click on the power button means STOP the daemon
      doStopLokinetProcess();
      return;
    }
    // here, daemon is not running. Whatever the state of the rest, we first need to start the daemon first.
    // but we do not want to trigger another start if we are still waiting on the `daemonIsLoading`
    if (daemonIsLoading) {
      return;
    }
    // this effectively trigger a start of the lokinet daemon
    doStartLokinetProcess();
  };

  return (
    <StyledPowerButtonContainer
      shadow={shadow}
      bg={buttonContainerBackground}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={onPowerButtonClick}
    >
      <StyledPowerButton>
        <PowerButtonContainerBorder isHovered={isHovered}>
          <PowerButtonIcon isHovered={isHovered} />
        </PowerButtonContainerBorder>
      </StyledPowerButton>
    </StyledPowerButtonContainer>
  );
};
