/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
  body {
    background-color:  ${({ theme }) => theme.backgroundColor};
    color:  ${({ theme }) => theme.textColor};
    height: 100%;
    width: 100vw;
    font-family: "IBM Plex Mono";
    overflow-x: hiddden;
    font-weight: 400;
    transition: 0.25s;
    transition: width 0s;
  }

  code {
    white-space: pre-wrap;

  }

  html {
    height: 100%;
    font-size: 12px;
    line-height: 1.3;
  }

  ::selection {
    background: lightGrey;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundColor};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.textColor};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textColorSubtle};
  }

  #root {
    height: 100%;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :focus {
    outline: none;
  }

  [role="tab"] {
    color: ${({ theme }) => theme.textColorSubtle};
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    font-family: Archivo;
    font-weight: 400;
    font-size: 1.4rem;
    border-bottom: 3px solid transparent;
    padding: 0 5px 5px 5px;
    user-select: none;
    transition: 0.25s;
  }



  @font-face {
    font-family: Archivo;
    src: url('../fonts/Archivo-VariableFont.ttf') format('truetype');
    font-weight: 100 1000;
	  font-stretch: 62% 125%;

  }

  @font-face {
    font-family: "IBM Plex Mono";
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/ibm-plex-mono.regular.ttf') format('truetype');
  }
`;
