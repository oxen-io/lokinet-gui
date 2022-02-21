/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
  body {
    background-color:  ${({ theme }) => theme.backgroundColor};
    color:  ${({ theme }) => theme.textColor};
    height: 100%;
    width: 100vw;
    font-family: "IBM Plex Mono";
    font-weight: 400;
    font-size: 14px;
    overflow-x: hiddden;
    transition: 0.25s;
  }

  html {
    height: 100%;
  }

  ::selection {
    background: lightGrey;
  }

  #root {
    height: 100%;
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
    font-size: 18px;
    line-height: 20px;
    border-bottom: 3px solid transparent;
    padding: 0 5px 5px 5px;
    transition: 0.25s;
  }


  @font-face {
    font-family: Archivo;
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/Archivo-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: Archivo;
    font-style: normal;
    font-weight: 500;
    src: url('../fonts/Archivo-Medium.ttf') format('truetype');
  }
  @font-face {
    font-family: Archivo;
    font-style: normal;
    font-weight: 700;
    src: url('../fonts/Archivo-Bold.ttf') format('truetype');
  }
  @font-face {
    font-family: "IBM Plex Mono";
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/IBMPlexMono-Medium.ttf') format('truetype');
  }
`;
