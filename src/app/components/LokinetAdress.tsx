import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';

export const LokinetAddress = (): JSX.Element => {
  const statusFromDaemon = useSelector(selectStatus);
  return (
    <FormControl size="xs" id="lokiAddress">
      <FormLabel size="xs">Loki address:</FormLabel>
      <Input size="xs" isDisabled={true} value={statusFromDaemon.lokiAddress} />
    </FormControl>
  );
};
