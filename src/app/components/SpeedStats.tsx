import { Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { FiUploadCloud, FiDownloadCloud } from 'react-icons/fi';

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
    <Flex width="30%" justifyContent="space-between">
      {children}
    </Flex>
  );
};

export const SpeedStats = (): JSX.Element => {
  const daemonStatus = useSelector(selectStatus);
  const upSpeed = makeRate(daemonStatus.uploadUsage);
  const downSpeed = makeRate(daemonStatus.downloadUsage);

  return (
    <VStack>
      <Heading size="md" marginRight="auto">
        Speeds
      </Heading>
      <SpeedStatsFlex>
        <Icon margin="5px" as={FiUploadCloud} />
        <Text>{upSpeed}</Text>
      </SpeedStatsFlex>
      <SpeedStatsFlex>
        <Icon margin="5px" as={FiDownloadCloud} />
        <Text>{downSpeed}</Text>
      </SpeedStatsFlex>
    </VStack>
  );
};
