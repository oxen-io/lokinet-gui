import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
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

export const UpSpeedStats = ({ upSpeed }: { upSpeed: number }): JSX.Element => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiUploadCloud} />
      <Text>{makeRate(upSpeed)}</Text>
    </HStack>
  </Box>
);

export const DownSpeedStats = ({
  downSpeed
}: {
  downSpeed: number;
}): JSX.Element => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiDownloadCloud} />
      <Text>{makeRate(downSpeed)}</Text>
    </HStack>
  </Box>
);
