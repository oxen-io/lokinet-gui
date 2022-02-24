import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
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

  const theme = useTheme();
  const fgSelected = theme.textColor;

  const selectedStyle = {
    color: fgSelected,
    borderBottom: `3px solid ${fgSelected}}`,
    fontWeight: 700
  };

  return (
    <Tabs
      maxHeight="100%"
      width="100%"
      padding="20px 5px 0 5px"
      display="flex"
      flexDir="column"
      flexGrow={1}
      index={selectedTab}
      onChange={(index: number) => {
        dispatch(setTabSelected(index as TabIndex));
      }}
      isLazy={false}
      variant="unstyled"
    >
      <TabList justifyContent="space-evenly">
        <Tab _selected={selectedStyle}>MAIN</Tab>
        <Tab _selected={selectedStyle}>CHART</Tab>
        <Tab _selected={selectedStyle}>LOGS</Tab>
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
