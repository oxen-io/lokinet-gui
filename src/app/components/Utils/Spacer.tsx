import styled from 'styled-components';

export const HSpacer = styled.span<{ width: string }>`
  width: ${(props) => props.width};
  height: 1px;
  background: none;
`;

export const VSpacer = styled.span<{ height: string }>`
  height: ${(props) => props.height};
  width: 1px;
  background: none;
`;
