import { Text, Stack, Code, Tooltip, Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectGeneralInfos } from '../../features/generalInfosSlice';

const formatUptime = (uptimeInMs: number) => {
  const seconds = uptimeInMs / 1000;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' min, ' : ' mins, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' sec' : ' secs') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

export const GeneralInfos = (): JSX.Element => {
  const { uptime, version } = useSelector(selectGeneralInfos);

  const formattedUptime = formatUptime(uptime);
  return (
    <Stack>
      <Flex justifyContent="space-between">
        <Text size="xs">Uptime: </Text>
        <Tooltip
          openDelay={500}
          label={formattedUptime}
          aria-label={formattedUptime}
        >
          <Text size="xs" isTruncated={true}>
            {formattedUptime}
          </Text>
        </Tooltip>
      </Flex>
      {version && (
        <Flex justifyContent="space-between">
          <Text size="xs">Version: </Text>
          <Tooltip openDelay={500} label={version} aria-label={version}>
            <Code size="xs" isTruncated={true}>
              {version}
            </Code>
          </Tooltip>
        </Flex>
      )}
    </Stack>
  );
};
