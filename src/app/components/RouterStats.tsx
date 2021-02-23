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

export const ActivePathStats = ({
  activePaths,
  ratio
}: {
  activePaths: number;
  ratio: string;
}): JSX.Element => (
  <StatsBox>
    <Stat padding="5px">
      <StatLabel>Active Paths</StatLabel>
      <StatNumber>{activePaths}</StatNumber>
      <StatHelpText>({ratio} success)</StatHelpText>
    </Stat>
  </StatsBox>
);

export const LokinetRoutersStats = ({
  numRouters
}: {
  numRouters: number;
}): JSX.Element => (
  <StatsBox>
    <Stat padding="5px">
      <StatLabel>Lokinet Routers</StatLabel>
      <StatNumber>{numRouters}</StatNumber>
    </Stat>
  </StatsBox>
);
