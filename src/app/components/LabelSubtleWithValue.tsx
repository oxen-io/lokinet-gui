import { Flex } from '@chakra-ui/react';
import React from 'react';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import styled, { DefaultTheme } from 'styled-components';
import { MdOutlineContentCopy } from 'react-icons/md';

const StyledLabelSubtle = styled.div`
  color: ${(props) => props.theme.textColorSubtle};
  font-size: 14px;
  line-height: 18px;
  padding-inline-end: 5px;
  user-select: none;
  white-space: nowrap;
`;

const StyledValue = styled(StyledLabelSubtle)<{
  allowSelect: boolean;
  theme: DefaultTheme;
}>`
  color: ${(props) => props.theme.textColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: ${(props) => (props.allowSelect ? 'auto' : 'none')};
`;

const InlineIconButton = styled.button<{ size: string; theme: DefaultTheme }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  color: ${(props) => props.theme.textColor};
  background: none;

  flex-shrink: 0;
  border: none;
  cursor: pointer;

  transition: 0.25s;
  border-radius: 7px;
  :hover {
    color: ${(props) => props.theme.textColorSubtle};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const LabelSubtleWithValue = ({
  label,
  value,
  showCopyToClipBoard = false,
  center = true,
  enableSelectionValue = false
}: {
  label: string;
  value: string;
  showCopyToClipBoard?: boolean;
  center?: boolean;
  enableSelectionValue?: boolean;
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_getclipboard, copyToClipboard] = useCopyToClipboard();

  return (
    <Flex justifyContent={center ? 'center' : 'start'}>
      <StyledLabelSubtle>{label}: </StyledLabelSubtle>
      <StyledValue allowSelect={enableSelectionValue}>{value}</StyledValue>
      {value?.length && showCopyToClipBoard ? (
        <InlineIconButton
          size="15px"
          onClick={() => {
            copyToClipboard(value);
          }}
          title="Copy to clipboard"
        >
          <MdOutlineContentCopy />
        </InlineIconButton>
      ) : null}
    </Flex>
  );
};
