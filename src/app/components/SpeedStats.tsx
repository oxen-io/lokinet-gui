import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FiUploadCloud, FiDownloadCloud } from 'react-icons/fi';

export const UpSpeedStats = (): JSX.Element => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiUploadCloud} />
      <Text>7.44 KB/s</Text>
    </HStack>
  </Box>
);

export const DownSpeedStats = (): JSX.Element => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiDownloadCloud} />
      <Text>5.33 KB/s</Text>
    </HStack>
  </Box>
);
