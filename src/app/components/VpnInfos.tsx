import React from 'react';
import styled, { useTheme } from 'styled-components';

const TooltipContent = styled.div`
  visibility: hidden;
  opacity: 0;

  position: absolute;
  background: ${(props) => props.theme.inputBackground};
  color: ${(props) => props.theme.textColor};

  padding: 2px 5px;
  font-size: 13px;
  transition: 0.25s all ease;
  transition-delay: 0.15s;
  z-index: 2;
  top: -35px;
  overflow: hidden;
  font-family: 'Archivo';
  font-weight: 400;
  letter-spacing: 0.03em;
`;

const VpnModeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;

  :hover {
    ${TooltipContent} {
      visibility: visible;
      opacity: 1;
      transition: 0.25s all ease;
      transition-delay: 0.2s;
      top: -35px;
    }
  }
`;

const VpnModeLabel = styled.div`
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`;

const QuestionMarkContainer = styled.span`
  width: 18px;
  height: 15px;
  margin-left: 10px;
  display: flex;
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
  return (
    <VpnModeContainer>
      <VpnModeLabel>VPN Mode</VpnModeLabel>
      <QuestionMarkContainer>
        <SvgQuestionMark />
      </QuestionMarkContainer>
      <TooltipContent>{vpnTooltip}</TooltipContent>
    </VpnModeContainer>
  );
};
