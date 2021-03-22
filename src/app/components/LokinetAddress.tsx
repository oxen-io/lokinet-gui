import { Code, Flex, Text, IconButton, Tooltip } from '@chakra-ui/react';
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
    <Flex flexDirection="row" alignItems="center">
      <Text size="xs" flexShrink={0}>
        Loki address:
      </Text>

      {lokinetAddress && (
        <>
          <Tooltip
            openDelay={500}
            label={lokinetAddress}
            aria-label={lokinetAddress}
            style={{ width: '100%' }}
          >
            <Code
              flexShrink={1}
              height="fit-content"
              alignSelf="center"
              size="xs"
              isTruncated={true}
            >
              {lokinetAddress}
            </Code>
          </Tooltip>
          <IconButton
            variant="ghost"
            aria-label="Copy"
            height="20px"
            width="20px"
            minWidth="20px"
            icon={<AiFillCopy />}
            onClick={copyAndToast}
          />
        </>
      )}
    </Flex>
  );
};
