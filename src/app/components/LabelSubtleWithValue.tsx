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

  transition: 0.25s linear;
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

const UploadInlineIcon = (props: { size: string }): JSX.Element => {
  return (
    <InlineIcon size={props.size} title="Upload speed">
      <FiUploadCloud />
    </InlineIcon>
  );
};

const DownloadInlineIcon = (props: { size: string }): JSX.Element => {
  return (
    <InlineIcon size={props.size} title="Download speed">
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
  fontSize: string;
  marginBottom?: string;
  pillColor?: string;
}): JSX.Element => {
  const { label, value, icon, pillColor } = props;

  return (
    <Flex
      justifyContent="start"
      fontSize={props.fontSize}
      marginBottom={props.marginBottom}
    >
      {icon}
      {!!pillColor && <Pill ledColor={pillColor} size="0.8em" />}
      <StyledLabelSubtle>{label}: </StyledLabelSubtle>
      <StyledValue>{value}</StyledValue>
    </Flex>
  );
};

const SpeedWithPillAndIcon = (props: {
  label: string;
  value: string;
  pillColor: string;
  icon: React.ReactNode;
}): JSX.Element => {
  return (
    <KeyValueWithIconAndPill
      fontSize="0.9rem"
      label={props.label}
      value={props.value}
      icon={props.icon}
      pillColor={props.pillColor}
    />
  );
};

export const UpSpeedWithPillAndIcon = (): JSX.Element => {
  const upSpeed = useSelector(selectUploadRate);
  return (
    <SpeedWithPillAndIcon
      pillColor={uploadColorChart}
      icon={<UploadInlineIcon size="15px" />}
      label="Upload"
      value={upSpeed}
    />
  );
};

export const DownSpeedWithPillAndIcon = (): JSX.Element => {
  const downSpeed = useSelector(selectDownloadRate);
  return (
    <SpeedWithPillAndIcon
      pillColor={downloadColorChart}
      icon={<DownloadInlineIcon size="15px" />}
      label="Download"
      value={downSpeed}
    />
  );
};

const SpeedWithIcon = (props: {
  label: string;
  value: string;
  icon: React.ReactNode;
}): JSX.Element => {
  return (
    <KeyValueWithIconAndPill
      label={props.label}
      fontSize="1rem"
      marginBottom="0.5rem"
      value={props.value}
      icon={props.icon}
    />
  );
};

export const UpSpeedWithIcon = (): JSX.Element => {
  const upSpeed = useSelector(selectUploadRate);

  return (
    <SpeedWithIcon
      label="Upload"
      value={upSpeed}
      icon={
        <>
          <UploadInlineIcon size="1.2rem" />
          <HSpacer width="10px" />
        </>
      }
    />
  );
};

export const DownSpeedWithIcon = (): JSX.Element => {
  const downSpeed = useSelector(selectDownloadRate);

  return (
    <SpeedWithIcon
      label="Download"
      value={downSpeed}
      icon={
        <>
          <DownloadInlineIcon size="1.2rem" />
          <HSpacer width="10px" />
        </>
      }
    />
  );
};

export const HSpacer = styled.span<{ width: string }>`
  width: ${(props) => props.width};
  height: 1px;
  background: none;
`;
