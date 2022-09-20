import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import { selectVpnMode, setVpnMode } from '../../features/exitStatusSlice';

const VpnModeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const VpnModeLabel = styled.div`
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
`;

const VpnModeToolTip = styled.span`
  width: 18px;
  height: 15px;
  margin-left: 10px;
  display: flex;
`;

const VpnToggleContainer = styled.div`
  margin-left: auto;
  position: relative;
  display: inline-block;
  width: 39px;
  height: 21px;
`;

const VpnToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.backgroundColor};
  transition: 0.25s;
  border-radius: 200px;
  border: 1px solid ${(props) => props.theme.textColor};

  :before {
    position: absolute;
    content: '';
    height: 19px;
    width: 19px;
    left: 0px;
    bottom: 0px;
    background-color: ${(props) => props.theme.textColor};
    transition: 0.25s;
    border-radius: 200px;
  }
`;

const VpnToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  :checked + ${VpnToggleSlider} {
    background-color: ${(props) => props.theme.textColor};
  }
  :checked + ${VpnToggleSlider}:before {
    transform: translateX(18px);
    background-color: ${(props) => props.theme.backgroundColor};
  }
`;

const SvgQuestionMark = () => {
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 12 13"
      style={{ width: '100%', height: '100%' }}
    >
      <circle cx="6" cy="6" r="6" fill={theme.textColor} />
      <path
        fill={theme.backgroundColor}
        d="M5.38 6.496c0-.214.032-.396.098-.546.065-.154.142-.275.23-.364a2.73 2.73 0 0 1 .35-.3 1.65 1.65 0 0 0 .33-.295.493.493 0 0 0 .112-.329c0-.35-.227-.525-.68-.525-.265 0-.447.068-.545.203a.707.707 0 0 0-.147.434V4.9a.598.598 0 0 1 .007.063h-.973a.967.967 0 0 1-.021-.09 1.556 1.556 0 0 1-.007-.155c0-.266.065-.506.196-.72.135-.22.333-.393.595-.519.266-.126.588-.189.966-.189.518 0 .921.108 1.21.322.295.21.442.518.442.924 0 .21-.035.392-.105.546-.066.15-.147.273-.245.371-.094.094-.22.201-.378.322a3.098 3.098 0 0 0-.427.4.667.667 0 0 0-.133.426v.196H5.38v-.3Zm-.042.721h.966v.96h-.966v-.96Z"
      />
    </svg>
  );
};
const vpnTooltip =
  'VPN Mode routes all internet traffic over Lokinet to your selected Exit node';

export const VpnMode = () => {
  const vpnMode = useSelector(selectVpnMode);
  const dispatch = useDispatch();
  return (
    <VpnModeContainer title={vpnTooltip}>
      <VpnModeLabel>VPN Mode</VpnModeLabel>
      <VpnModeToolTip>
        <SvgQuestionMark />
      </VpnModeToolTip>
      <VpnToggleContainer
        onClick={() => {
          dispatch(setVpnMode(!vpnMode));
        }}
      >
        <VpnToggleInput type="checkbox" checked={vpnMode} />
        <VpnToggleSlider />
      </VpnToggleContainer>
    </VpnModeContainer>
  );
};
