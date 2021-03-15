import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const RouterStatsFlex = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex width="40%" justifyContent="space-between">
      {children}
    </Flex>
  );
};

export const RoutersStats = ({
  numRouters,
  activePaths,
  ratio
}: {
  numRouters: number;
  activePaths: number;
  ratio: string;
}): JSX.Element => (
  <VStack>
    <Heading size="md" marginRight="auto">
      Routers
    </Heading>

    <RouterStatsFlex>
      <Text fontWeight="bold">Count</Text>
      <Text>{numRouters}</Text>
    </RouterStatsFlex>
    <RouterStatsFlex>
      <Text fontWeight="bold">Active Paths</Text>
      <Text>{activePaths}</Text>
    </RouterStatsFlex>
    <RouterStatsFlex>
      <Text fontWeight="bold">Success</Text>
      <Text>{ratio}</Text>
    </RouterStatsFlex>
  </VStack>
);
