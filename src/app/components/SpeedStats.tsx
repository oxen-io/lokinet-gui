import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FiUploadCloud, FiDownloadCloud } from 'react-icons/fi';

export const UpSpeedStats = ({ upSpeed }: { upSpeed: number }): JSX.Element => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiUploadCloud} />
      <Text>{Math.floor(upSpeed / 100) / 10} KB/s</Text>
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
      <Text>{Math.floor(downSpeed / 100) / 10} KB/s</Text>
    </HStack>
  </Box>
);
