import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { HiMoon } from 'react-icons/hi';
import styled from 'styled-components';

import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import { useDispatch, useSelector } from 'react-redux';
import { minimizeToTray } from '../../ipc/ipcRenderer';
import { setThemeToSettings } from '../config';
import { isMacOS } from '../../../sharedIpc';

const Container = styled.div<{ reverse: boolean }>`
  flex-direction: ${(props) => (props.reverse ? 'row-reverse' : 'row')};
  place-content: space-between;

  background: ${(props) => props.theme.backgroundColor};
  z-index: 99;

  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  font-size: 2rem;
  -webkit-app-region: drag;
  flex-shrink: 0;
  padding: 0.5rem 1rem;
`;

const StyledIconButton = styled.button`
  font-size: 2rem;
  color: ${(props) => props.theme.textColor};
  border: none;
  cursor: pointer;
  background: none;
  -webkit-app-region: no-drag;
  flex-shrink: 0;

  transition: 0.25s;
  :hover {
    color: ${(props) => props.theme.textColorSubtle};
  }
`;

export const TitleBar = (): JSX.Element => {
  const themeSelected = useSelector(selectedTheme);
  const dispatch = useDispatch();

  const macOs = isMacOS();
  return (
    <Container reverse={macOs}>
      <StyledIconButton
        title="Switch theme dark/white"
        onClick={() => {
          const newTheme = themeSelected === 'light' ? 'dark' : 'light';
          setThemeToSettings(newTheme);
          dispatch(setTheme(newTheme));
        }}
      >
        <HiMoon />
      </StyledIconButton>

      <StyledIconButton title="Minimize to tray" onClick={minimizeToTray}>
        <RiCloseFill />
      </StyledIconButton>
    </Container>
  );
};
