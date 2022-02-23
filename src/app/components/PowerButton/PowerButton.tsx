import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  selectAuthCodeFromUser,
  selectExitNodeFromUser
} from '../../../features/exitStatusSlice';

import { selectedTheme, ThemeType } from '../../../features/uiStatusSlice';
import {
  ConnectingStatus,
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
  status: ConnectingStatus,
  themeType: ThemeType
) => {
  if (status === 'error') {
    return themeType === 'light'
      ? '0px 0px 30px rgba(255, 0, 0, 0.61)'
      : `0px 0px 51px rgba(255, 33, 33, 0.8), 0px 0px 66px #000000`;
  }

  if (status === 'connecting') {
    return themeType === 'light'
      ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
      : `0px 0px 30px rgba(255, 255, 255, 0.18), 0px 0px 66px #000000`;
  }

  if (status === 'connected') {
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
      onClick={() => {
        if (connectingStatus === 'connecting') {
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
        <PowerButtonContainerBorder>
          <PowerButtonIcon />
        </PowerButtonContainerBorder>
      </StyledPowerButton>
    </StyledPowerButtonContainer>
  );
};
