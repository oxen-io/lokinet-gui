import { Button, Code, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import { clearLogs, selectAppLogs } from '../../features/appLogsSlice';
import { useAppSelector } from '../hooks';
import { MinusDivider, PlusDivider } from './Dividers';

export const AppLogs = (): JSX.Element => {
  const { appLogs } = useAppSelector(selectAppLogs);
  const hasLogLine = Boolean(appLogs.length);
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <Flex flexDirection="column" height="100%">
      <PlusDivider />

      <Button
        onClick={() => dispatch(clearLogs())}
        width="fit-content"
        alignSelf="center"
        marginBottom={2}
      >
        Clear
      </Button>
      <Code
        size="xs"
        overflowY="auto"
        textAlign="left"
        maxHeight="70vh"
        display="flex"
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
      <MinusDivider />
    </Flex>
  );
};
