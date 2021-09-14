import { Flex, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { VerticalDivider } from './VerticalDivider';

const RouterStatsFlex = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex width="100%" justifyContent="space-between">
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
  <Flex flexDirection="column" flexGrow={1}>
    <Text alignSelf="flex-start" fontWeight={700}>
      Routers
    </Text>
    <Stack direction="row" alignSelf="center" width="100%" height="100%" p={2}>
      <VerticalDivider />
      <Flex flexDirection="column" flexGrow={1}>
        <RouterStatsFlex>
          <Text>Total count</Text>
          <Text>{numRouters}</Text>
        </RouterStatsFlex>
        <RouterStatsFlex>
          <Text>Active paths</Text>
          <Text>{activePaths}</Text>
        </RouterStatsFlex>
        <RouterStatsFlex>
          <Text>Success</Text>
          <Text>{ratio}</Text>
        </RouterStatsFlex>
      </Flex>
    </Stack>
  </Flex>
);
