import React from 'react';
import { useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components';
import {
  selectHasExitNodeChangeLoading,
  selectHasExitNodeEnabled
} from '../../../features/exitStatusSlice';
import { selectedTheme, ThemeType } from '../../../features/uiStatusSlice';
import {
  ConnectingStatus,
  useGlobalConnectingStatus
} from '../../hooks/connectingStatus';
import { PowerButtonSpinner } from './PowerButtonSpinner';

const StyledPowerButtonContainer = styled.div<{ shadow: string; bg: string }>`
  height: 33vw;
  width: 33vw;
  align-self: center;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: ${(props) => props.shadow};
  background-color: ${(props) => props.bg};
  margin: 50px 5px !important;
`;

const StyledPowerButton = styled.div`
  height: calc(33vw - 40px);
  width: calc(33vw - 40px);
  margin: 20px;
  cursor: pointer;
  border: 2px solid ${(props) => props.theme.textColor}
  position: absolute;
  border-radius: 50%;
  /* border: 2px solid; */
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
      ? '0px 0px 43px rgba(0, 0, 0, 0.55)'
      : `0px 0px 30px rgba(255, 255, 255, 0.48), 0px 0px 66px #000000`;
  }

  return themeType === 'light'
    ? '0px 0px 16px rgba(0, 0, 0, 0.12)'
    : `0px 0px 66px #000000`;
};

export const PowerButton = (): JSX.Element => {
  const theme = useTheme();
  const themeType = useSelector(selectedTheme);
  const connectingStatus = useGlobalConnectingStatus();

  const { shadow, buttonContainerBackground } = getPowerButtonStyles(
    connectingStatus,
    themeType
  );

  const dropShadow = `drop-shadow(0px 0px 2px ${theme.textColor});`;
  return (
    <StyledPowerButtonContainer shadow={shadow} bg={buttonContainerBackground}>
      <StyledPowerButton>
        <PowerButtonSpinner />
        {/* <StyledPowerIcon dropShadow={dropShadow}>{svgPower}</StyledPowerIcon> */}
      </StyledPowerButton>
    </StyledPowerButtonContainer>
  );
};

const StyledPowerIcon = styled.div<{ theme: DefaultTheme; dropShadow: string }>`
  width: 50%;
  height: 50%;
  position: relative;
  color: ${(props) => props.theme.textColor};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  svg {
    height: 100%;
    width: 100%;

    filter: ${(props) => props.dropShadow};
  }
`;

const svgPower = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="63"
    height="72"
    viewBox="0 0 63 72"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M31.5388 0C33.3594 0 34.8353 1.46525 34.8353 3.27273V40.8506C34.8353 42.6581 33.3594 44.1233 31.5388 44.1233C29.7182 44.1233 28.2423 42.6581 28.2423 40.8506V3.27273C28.2423 1.46525 29.7182 0 31.5388 0ZM12.7606 19.748C14.1117 20.9595 14.2177 23.029 12.9974 24.3703C9.01934 28.743 6.59302 34.5271 6.59302 40.8506C6.59302 54.4087 17.7145 65.4545 31.5 65.4545C45.2526 65.4545 56.407 54.4412 56.407 40.8506C56.407 34.5271 53.9807 28.743 50.0026 24.3703C48.7823 23.029 48.8883 20.9595 50.2394 19.748C51.5905 18.5365 53.675 18.6417 54.8953 19.9831C59.9175 25.5034 63 32.8332 63 40.8506C63 58.0892 48.8604 72 31.5 72C14.0948 72 0 58.045 0 40.8506C0 32.8331 3.08248 25.5034 8.10468 19.9831C9.32499 18.6417 11.4095 18.5365 12.7606 19.748Z"
      fill="currentColor"
    />
  </svg>
);
