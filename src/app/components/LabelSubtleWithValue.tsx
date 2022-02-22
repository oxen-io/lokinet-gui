import { Flex } from '@chakra-ui/react';
import React from 'react';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import styled, { DefaultTheme } from 'styled-components';
import { MdOutlineContentCopy } from 'react-icons/md';
import { FiDownloadCloud, FiUploadCloud } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import {
  selectDownloadRate,
  selectUploadRate
} from '../../features/statusSlice';
import { downloadColorChart, uploadColorChart } from './SpeedChart';

const StyledLabelSubtle = styled.div`
  color: ${(props) => props.theme.textColorSubtle};
  padding-inline-end: 5px;
  user-select: none;
  white-space: nowrap;
`;

const StyledValue = styled(StyledLabelSubtle)<{
  theme: DefaultTheme;
}>`
  color: ${(props) => props.theme.textColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
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

const InlineIcon = styled.div<{ size: string; theme: DefaultTheme }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  color: ${(props) => props.theme.textColor};
  background: none;
  flex-shrink: 0;
  border: none;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const CopyToClipboardIcon = (props: { valueToCopy: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_getclipboard, copyToClipboard] = useCopyToClipboard();
  return (
    <InlineIconButton
      size="15px"
      onClick={() => {
        copyToClipboard(props.valueToCopy);
      }}
      title="Copy to clipboard"
    >
      <MdOutlineContentCopy />
    </InlineIconButton>
  );
};

export const LabelSubtleWithValue = (props: {
  label: string;
  value: string;
  showCopyToClipBoard?: boolean;
  center?: boolean;
}): JSX.Element => {
  const { label, value, showCopyToClipBoard = false, center = true } = props;

  return (
    <Flex justifyContent={center ? 'center' : 'start'}>
      <StyledLabelSubtle>{label}: </StyledLabelSubtle>
      <StyledValue>{value}</StyledValue>
      {value?.length && showCopyToClipBoard ? (
        <CopyToClipboardIcon valueToCopy={value} />
      ) : null}
    </Flex>
  );
};

const UploadInlineIcon = (): JSX.Element => {
  return (
    <InlineIcon size="15px" title="Upload speed">
      <FiUploadCloud />
    </InlineIcon>
  );
};

const DownloadInlineIcon = (): JSX.Element => {
  return (
    <InlineIcon size="15px" title="Download speed">
      <FiDownloadCloud />
    </InlineIcon>
  );
};

const Pill = styled.span<{ ledColor: string; size: string }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  margin: auto ${(props) => props.size} auto ${(props) => props.size};

  background-color: ${(props) => props.ledColor};
`;

const KeyValueWithIconAndPill = (props: {
  label: string;
  value: string;
  icon: React.ReactNode;
  pillColor: string;
}): JSX.Element => {
  const { label, value, icon, pillColor } = props;

  return (
    <Flex justifyContent="start" fontSize="0.8rem">
      {icon}
      <Pill ledColor={pillColor} size="0.8em" />
      <StyledLabelSubtle>{label}: </StyledLabelSubtle>
      <StyledValue>{value}</StyledValue>
    </Flex>
  );
};

export const UpSpeedWithPillAndIcon = (): JSX.Element => {
  const upSpeed = useSelector(selectUploadRate);

  return (
    <KeyValueWithIconAndPill
      label="Upload"
      value={upSpeed}
      pillColor={uploadColorChart}
      icon={<UploadInlineIcon />}
    />
  );
};

export const DownSpeedWithPillAndIcon = (): JSX.Element => {
  const downSpeed = useSelector(selectDownloadRate);
  return (
    <KeyValueWithIconAndPill
      label="Download"
      value={downSpeed}
      pillColor={downloadColorChart}
      icon={<DownloadInlineIcon />}
    />
  );
};
