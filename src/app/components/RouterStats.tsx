import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box
} from '@chakra-ui/react';
import React from 'react';

const StatsBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    maxW="sm"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    shadow="xs"
  >
    {children}
  </Box>
);

export const ActivePathStats = (): JSX.Element => (
  <StatsBox>
    <Stat padding="5px">
      <StatLabel>Active Paths</StatLabel>
      <StatNumber>3</StatNumber>
      <StatHelpText>(50% success)</StatHelpText>
    </Stat>
  </StatsBox>
);

export const LokinetRoutersStats = (): JSX.Element => (
  <StatsBox>
    <Stat padding="5px">
      <StatLabel>Lokinet Routers</StatLabel>
      <StatNumber>1294</StatNumber>
    </Stat>
  </StatsBox>
);
