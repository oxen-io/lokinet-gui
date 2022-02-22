import { Code, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { clearLogs, selectAppLogs } from '../../features/appLogsSlice';
import { useAppSelector } from '../hooks';
import { MinusDivider, paddingDividers, PlusDivider } from './Dividers';
import { LokinetIconButton } from './LokinetIconButton';
import { TextButton } from './TextButton';

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const AppLogs = (): JSX.Element => {
  const { appLogs } = useAppSelector(selectAppLogs);
  const hasLogLine = Boolean(appLogs.length);
  const dispatch = useDispatch();
  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_clip, copyToClipboard] = useCopyToClipboard();

  return (
    <Flex flexDirection="column" height="100%">
      <PlusDivider />

      <Code
        size="xs"
        fontSize="10px"
        overflowY="auto"
        textAlign="left"
        maxHeight="70vh"
        display="flex"
        wordBreak="break-all"
        marginLeft={paddingDividers}
        marginRight={paddingDividers}
        padding="10px"
        borderRadius="8px"
        flexDirection="column-reverse"
        flexGrow={1}
        backgroundColor={theme.inputBackground}
      >
        {hasLogLine ? (
          appLogs.map((logLine, index) => {
            return (
              <Text fontSize={12} key={index}>
                {logLine}
              </Text>
            );
          })
        ) : (
          <Text fontSize={12}>No logs yet...</Text>
        )}
      </Code>
      <ButtonRow>
        <TextButton
          onClick={() => dispatch(clearLogs())}
          text="Clear"
          title="Clear logs"
        />
        <LokinetIconButton
          onClick={() => copyToClipboard(appLogs.join('\r\n'))}
          size="30px"
          icon={<MdOutlineContentCopy />}
          title="Copy to clipboard"
        />
      </ButtonRow>
      <MinusDivider />
    </Flex>
  );
};
