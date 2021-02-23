import { IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdPowerSettingsNew } from 'react-icons/md';

export const StopAndStart = (): JSX.Element => {
  const [clicked, setClicked] = useState(false);
  return (
    <IconButton
      margin="auto"
      isRound
      isLoading={clicked}
      onClick={() => {
        setClicked(false);
      }}
      size="lg"
      icon={<MdPowerSettingsNew />}
      aria-label="stop and start"
    />
  );
};
