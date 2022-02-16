/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import styled, { useTheme } from 'styled-components';
import { RiFileCopyLine } from 'react-icons/ri';

const StyledLabelSubtle = styled.div`
  color: ${(props) => props.theme.textColorSubtle};
  font-size: 14px;
  line-height: 18px;
  padding-inline-end: 5px;
  user-select: none;
  white-space: nowrap;
`;

const StyledValue = styled(StyledLabelSubtle)`
  color: ${(props) => props.theme.textColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: auto;
`;

export const LabelSubtleWithValue = ({
  label,
  value,
  showCopyToClipBoard = false
}: {
  label: string;
  value: string;
  showCopyToClipBoard?: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_getclipboard, copyToClipboard] = useCopyToClipboard();
  const theme = useTheme();

  return (
    <Flex justifyContent="center">
      <StyledLabelSubtle>{label}: </StyledLabelSubtle>
      <StyledValue>{value}</StyledValue>
      {value?.length && showCopyToClipBoard ? (
        <IconButton
          variant="unstyled"
          aria-label="Copy"
          height="15px"
          width="15px"
          color={theme.textColor}
          border="none"
          cursor="pointer"
          background="none"
          minWidth="15px"
          icon={<RiFileCopyLine />}
          onClick={() => {
            copyToClipboard(value);
          }}
        />
      ) : null}
    </Flex>
  );
};
