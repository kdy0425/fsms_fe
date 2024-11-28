'use client'
import React, { useState} from 'react'
import { Box, Grid} from '@mui/material'

import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'
import PageContainer from '@/components/container/PageContainer'

import HeaderTab from '@/components/tables/CommHeaderTab'
import { SelectItem } from 'select'
import TrPage from './_components/TrPage'
import TxPage from './_components/TxPage'
import BsPage from './_components/BsPage'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '기준관리',
  },
  {
    title: '자격관리',
  },
  {
    to: '/stn/vem',
    title: '차량말소관리',
  },
]

const taskSeTap:SelectItem[] = [
  { value: 'TR', label: '화물'},
  { value: 'TX', label: '택시'},
  { value: 'BS', label: '버스'},
]

const DataList = () => {
  // 상위 컴포넌트에서 탭 상태 관리
    const [selectedTab, setSelectedTab] = useState(taskSeTap[0].value)

    return (
      <PageContainer
      title="차량말소관리"
      description="차량말소관리"
      >
        {/* breadcrumb */}
        <Breadcrumb title="차량말소관리" items={BCrumb} />
        <HeaderTab
        taskSeTap = {taskSeTap}
        onChange = {setSelectedTab}
        />
        {
          selectedTab === 'TR' ?
          <TrPage/> 
          : 
          selectedTab === 'TX' ?
          <TxPage/> 
          :
          <BsPage/> 
        }
      </PageContainer>
    )
}

export default DataList
