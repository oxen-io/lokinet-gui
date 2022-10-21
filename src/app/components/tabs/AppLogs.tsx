import { Code, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { selectAppLogs, clearLogs } from '../../../features/appLogsSlice';
import { useAppSelector } from '../../hooks';
import { TextButton } from '../TextButton';
import { PlusDivider, MinusDivider } from '../Utils/Dividers';

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Timestamp = styled.span`
  font-size: 10px;
  color: ${(props) => props.theme.textColorSubtle};
  user-select: text;
`;

const Content = styled(Timestamp)`
  color: ${(props) => props.theme.textColor};
  user-select: text;
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
        overflowY="auto"
        textAlign="left"
        maxHeight="70vh"
        display="flex"
        wordBreak="break-all"
        padding="10px"
        borderRadius="8px"
        flexDirection="column"
        flexGrow={1}
        flexShrink={300}
        backgroundColor={theme.inputBackground}
      >
        {hasLogLine ? (
          appLogs.map((logLine) => {
            const separator = logLine.indexOf('ms:') + 3;
            const timestamp = logLine.substring(0, separator);
            const content = logLine.substring(separator);
            return (
              <span key={timestamp}>
                <Timestamp>{timestamp}</Timestamp>
                <Content>{content}</Content>
              </span>
            );
          })
        ) : (
          <Text fontSize={12}>No logs yet...</Text>
        )}
      </Code>
      <ButtonRow>
        <TextButton onClick={() => dispatch(clearLogs())} text="Clear" />
        <TextButton
          onClick={() => copyToClipboard(appLogs.join('\r\n'))}
          text="Copy"
        />
      </ButtonRow>
      <MinusDivider />
    </Flex>
  );
};
