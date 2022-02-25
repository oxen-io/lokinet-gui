import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHover } from 'react-use';
import styled from 'styled-components';
import {
  selectAuthCodeFromUser,
  selectExitNodeFromUser
} from '../../../features/exitStatusSlice';

import { selectedTheme, ThemeType } from '../../../features/uiStatusSlice';
import {
  ConnectingStatus,
  isGlobalStatusError,
  useGlobalConnectingStatus
} from '../../hooks/connectingStatus';
import { turnExitOn, turnExitOff } from './PowerButtonActions';
import { PowerButtonIcon } from './PowerButtonIcon';
import { PowerButtonContainerBorder } from './PowerButtonSpinner';

const StyledPowerButtonContainer = styled.div<{ shadow: string; bg: string }>`
  height: 38vw;
  width: 38vw;
  max-height: 140px;
  max-width: 140px;
  align-self: center;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: ${(props) => props.shadow};
  background-color: ${(props) => props.bg};
  margin: 37px 5px !important;
  cursor: pointer;
`;

const StyledPowerButton = styled.div`
  height: calc(38vw - 40px);
  width: calc(38vw - 40px);

  max-height: 100px;
  max-width: 100px;
  margin: 20px;
  border: 2px solid ${(props) => props.theme.textColor}
  position: absolute;
  border-radius: 50%;

  transition: 0.25s;

`;

const getPowerButtonStyles = (
  status: ConnectingStatus,
  themeType: ThemeType
) => {
  const shadow = getPowerButtonContainerShadowStyle(status, themeType);
  const buttonContainerBackground =
    themeType === 'light' ? '#FAFAFA' : '#000000';
  return { shadow, buttonContainerBackground };
};

const getPowerButtonContainerShadowStyle = (
  globalStatus: ConnectingStatus,
  themeType: ThemeType
) => {
  if (isGlobalStatusError(globalStatus)) {
    return themeType === 'light'
      ? '0px 0px 30px rgba(255, 0, 0, 0.61)'
      : `0px 0px 51px rgba(255, 33, 33, 0.8), 0px 0px 66px #000000`;
  }

  if (globalStatus === 'connecting') {
    return themeType === 'light'
      ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
      : `0px 0px 30px rgba(255, 255, 255, 0.18), 0px 0px 66px #000000`;
  }

  if (globalStatus === 'connected') {
    return themeType === 'light'
      ? '0px 0px 25px rgba(0, 0, 0, 0.55)'
      : `0px 0px 15px rgba(255, 255, 255, 0.48)`;
  }

  return themeType === 'light'
    ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
    : `0px 0px 66px #000000`;
};

export const PowerButton = (): JSX.Element => {
  const themeType = useSelector(selectedTheme);

  const [isHovered, setIsHovered] = useState(false);

  const connectingStatus = useGlobalConnectingStatus();
  const dispatch = useDispatch();

  const authCodeFromUser = useSelector(selectAuthCodeFromUser);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);

  const { shadow, buttonContainerBackground } = getPowerButtonStyles(
    connectingStatus,
    themeType
  );

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
      onClick={() => {
        if (
          connectingStatus === 'connecting' ||
          connectingStatus === 'error-start-stop'
        ) {
          return;
        }
        if (connectingStatus === 'connected') {
          turnExitOff(dispatch);
        } else {
          turnExitOn(dispatch, exitNodeFromUser, authCodeFromUser);
        }
      }}
    >
      <StyledPowerButton>
        <PowerButtonContainerBorder isHovered={isHovered}>
          <PowerButtonIcon isHovered={isHovered} />
        </PowerButtonContainerBorder>
      </StyledPowerButton>
    </StyledPowerButtonContainer>
  );
};
