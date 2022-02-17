import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedTab,
  setTabSelected,
  TabIndex
} from '../../features/uiStatusSlice';
import { AppLogs } from './AppLogs';
import { MainTab } from './MainTab';
import { SpeedChart } from './SpeedChart';

export const GuiTabs = (): JSX.Element => {
  const selectedTab = useSelector(selectSelectedTab);
  const dispatch = useDispatch();
  return (
    <Tabs
      maxHeight="100%"
      width="100%"
      variant="soft-rounded"
      colorScheme="blue"
      padding={3}
      display="flex"
      flexDir="column"
      flexGrow={1}
      index={selectedTab}
      onChange={(index: number) => {
        dispatch(setTabSelected(index as TabIndex));
      }}
    >
      <TabList justifyContent="center">
        <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Main</Tab>
        <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Chart</Tab>
        <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Logs</Tab>
      </TabList>
      <TabPanels flexGrow={1} padding={1}>
        <TabPanel flexGrow={1} padding={2} height="100%">
          <MainTab />
        </TabPanel>
        <TabPanel flexGrow={1} padding={2} height="100%">
          <SpeedChart />
        </TabPanel>
        <TabPanel flexGrow={1} padding={2} height="100%">
          <AppLogs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
