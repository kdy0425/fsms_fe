import * as React from 'react'
import { Grid, Box, Divider } from '@mui/material'

import { Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'

export type Tab = {
  value: string,
  label: string,
  active: boolean
}

interface TabProps {
  tabs: Tab[];
  seletedTab: string | number;
  onTabChange: (event: React.SyntheticEvent, tabValue: string) => any;
}

const HeaderTab = (props: TabProps) => {
  const { tabs, seletedTab, onTabChange } = props;

  return (
    <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
      {/* 탭 시작 */}
      <TabContext value={seletedTab}>
        <Box>
          <TabList onChange={onTabChange} aria-label="lab API tabs example">
            {tabs.map((tab, index) => (
              <Tab
                style={{fontSize:'1rem', fontWeight:'600', backgroundColor: (seletedTab == tab.value ? '' : '#edf1f5')}}
                key={tab.value}
                label={tab.label}
                value={String(index + 1)}
              />
            ))}
          </TabList>
        </Box>
        <Divider />
      </TabContext>
      {/* 탭 끝 */}
    </Grid>
  )
}

export default HeaderTab;