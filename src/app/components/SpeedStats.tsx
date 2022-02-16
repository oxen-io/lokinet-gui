import { Flex, Icon, Stack, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { FiUploadCloud, FiDownloadCloud } from 'react-icons/fi';
import { PlusDivider } from './PlusDivider';

function makeRate(value: number): string {
  let unit_idx = 0;
  const units = ['B', 'KB', 'MB'];
  while (value > 1024.0 && unit_idx + 1 < units.length) {
    value /= 1024.0;
    unit_idx += 1;
  }
  const unitSpeed = ` ${units[unit_idx]}/s`;
  return (
    (value < 10
      ? Math.round(value * 100) / 100
      : value < 100
      ? Math.round(value * 10) / 10
      : Math.round(value)) + unitSpeed
  );
}

const SpeedStatsFlex = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex width="100%" justifyContent="space-between">
      {children}
    </Flex>
  );
};

export const SpeedStats = (): JSX.Element => {
  const daemonStatus = useSelector(selectStatus);
  const upSpeed = makeRate(daemonStatus.uploadUsage);
  const downSpeed = makeRate(daemonStatus.downloadUsage);

  return (
    <Flex flexDirection="column" flexGrow={1}>
      <Text alignSelf="flex-start" fontWeight={700}>
        Speeds
      </Text>
      <Stack
        direction="row"
        alignSelf="center"
        width="100%"
        height="100%"
        p={2}
      >
        <PlusDivider />
        <Flex flexDirection="column" flexGrow={1}>
          <SpeedStatsFlex>
            <Icon margin="5px" as={FiUploadCloud} />
            <Tooltip
              openDelay={100}
              label={'Upload Speed'}
              aria-label={'Upload Speed'}
              style={{ width: '100%' }}
            >
              <Text>{upSpeed}</Text>
            </Tooltip>
          </SpeedStatsFlex>

          <SpeedStatsFlex>
            <Icon margin="5px" as={FiDownloadCloud} />
            <Tooltip
              openDelay={100}
              label={'Download Speed'}
              aria-label={'Download Speed'}
            >
              <Text>{downSpeed}</Text>
            </Tooltip>
          </SpeedStatsFlex>
        </Flex>
      </Stack>
    </Flex>
  );
};
