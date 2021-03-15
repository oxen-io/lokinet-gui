import { Code, Flex, FormLabel, IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { AiFillCopy } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import { selectStatus } from '../../features/statusSlice';
import { useToast } from '@chakra-ui/react';

export const LokinetAddress = (): JSX.Element => {
  const statusFromDaemon = useSelector(selectStatus);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();
  const lokinetAddress = statusFromDaemon.lokiAddress;

  const toast = useToast();
  const copyAndToast = () => {
    copyToClipboard(lokinetAddress);
    toast({
      title: 'Copied',
      status: 'success',
      duration: 1000,
      isClosable: true
    });
  };

  return (
    <Flex flexDirection="column">
      <FormLabel size="xs">Loki address:</FormLabel>

      {lokinetAddress && (
        <Flex flexDirection="row">
          <Tooltip
            openDelay={500}
            label={lokinetAddress}
            aria-label={lokinetAddress}
          >
            <Code
              flexShrink={1}
              height="100%"
              alignSelf="center"
              size="xs"
              isTruncated={true}
            >
              {lokinetAddress}
            </Code>
          </Tooltip>
          <IconButton
            height="20px"
            variant="ghost"
            aria-label="Copy"
            icon={<AiFillCopy />}
            onClick={copyAndToast}
          />
        </Flex>
      )}
    </Flex>
  );
};
