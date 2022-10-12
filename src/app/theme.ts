import { DefaultTheme } from 'styled-components';

const sharedColors = {
  dangerColor: '#F33232',
  connectingColor: '#EBD619',
  connectedLokinetColor: '#36B7FF',
  connectedVpnModeColor: '#37EB19'
};

export const darkTheme = {
  backgroundColor: '#141414',
  textColor: '#ffffff',
  textColorSubtle: '#bdbdbd',
  inputBackground: '#262626',
  inputTextColor: '#bdbdbd',
  ...sharedColors
};

export const lightTheme: DefaultTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  textColorSubtle: '#6c6c6c',
  inputBackground: '#f4f4f4',
  inputTextColor: '#6c6c6c',
  ...sharedColors
};
