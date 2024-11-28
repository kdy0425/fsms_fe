import * as React from 'react'
import { Grid, Box, Divider } from '@mui/material'

import { Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { SelectItem } from 'select'

interface TabProps {
  taskSeTap: SelectItem[];
  onChange: React.Dispatch<React.SetStateAction<string>>
}

const HeaderTab:React.FC<TabProps> = ({taskSeTap, onChange}) => {
  const [value, setValue] = React.useState(taskSeTap[0].value)

  const handleChange = (value: string) => {
    onChange(value)
    setValue(value)
  };

  return (
    <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
      {/* 탭 시작 */}
      <TabContext value={value}>
        <Box>
          <TabList onChange={(event, value) => handleChange(value)} aria-label="lab API tabs example">
            {taskSeTap.map((tab, index) => (
              <Tab
                label={tab.label}
                value={tab.value}
                key={index + 1}
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

export default HeaderTab
