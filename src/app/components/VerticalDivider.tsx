import { Divider } from '@chakra-ui/react';
import React from 'react';

export const VerticalDivider = (): JSX.Element => {
  return (
    <Divider
      orientation="vertical"
      borderColor="white"
      borderWidth={1}
      opacity={1}
    />
  );
};
