import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { AppLogs } from './AppLogs';
import { MainTab } from './MainTab';
import { SpeedChart } from './SpeedChart';

export const GuiTabs = (): JSX.Element => {
  return (
    <Tabs
      maxHeight="100%"
      width="100%"
      variant="soft-rounded"
      colorScheme="green"
      padding={3}
      display="flex"
      flexDir="column"
      flexGrow={1}
    >
      <TabList justifyContent="center">
        <Tab>Main</Tab>
        <Tab>Chart</Tab>
        <Tab>Logs</Tab>
      </TabList>
      <TabPanels flexGrow={1} padding={1}>
        <TabPanel padding={2}>
          <MainTab />
        </TabPanel>
        <TabPanel padding={2}>
          <SpeedChart />
        </TabPanel>
        <TabPanel padding={2}>
          <AppLogs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
