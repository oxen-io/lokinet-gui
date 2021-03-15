import { Code, Text } from '@chakra-ui/react';
import React from 'react';
import { selectAppLogs } from '../../features/appLogsSlice';
import { useAppSelector } from '../hooks';

export const AppLogs = (): JSX.Element => {
  const { appLogs } = useAppSelector(selectAppLogs);

  return (
    <Code size="xs" overflowY="auto" maxHeight="80vh">
      {appLogs.map((logLine, index) => {
        return <Text key={index}>{logLine}</Text>;
      })}
    </Code>
  );
};
