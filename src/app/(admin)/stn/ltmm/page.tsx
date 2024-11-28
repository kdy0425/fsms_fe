'use client'
import React, { useState } from 'react'
import { Box, Grid, Button, MenuItem, Stack } from '@mui/material'
import { Label } from '@mui/icons-material'

import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'
import PageContainer from '@/components/container/PageContainer'
import { useRouter, useSearchParams } from 'next/navigation'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import SearchHeaderTab from './_components/SearchHeaderTab'

import CheckBoxTableGrid from './_components/CheckBoxTableGrid'
import DetailDataGrid from './_components/DetailDataGrid'
import BlankCard from '@/components/shared/BlankCard'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import { ButtonGroupActionProps } from './_components/DetailDataGrid'

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
    to: '/stn/ltmm',
    title: '지자체이관전출관리',
  },
]

const citySelectData = [
  {
    value: 'seoul',
    label: '서울',
  },
  {
    value: 'gyeong-gi',
    label: '경기',
  },
  {
    value: 'incheon',
    label: '인천',
  },
  {
    value: 'busan',
    label: '부산',
  },
]

const authoritySelectData = [
  {
    value: 'gangnam',
    label: '강남구',
  },
  {
    value: 'gangseo',
    label: '강서구',
  },
  {
    value: 'gangdong',
    label: '강동구',
  },
  {
    value: 'gangbuk',
    label: '강북구',
  },
]

const processStatusSelectData = [
  {
    value: 'all',
    label: '전체',
  },
  {
    value: 'request',
    label: '요청',
  },
]

export interface Row {
  id: number
  requestDate?: string // 요청일자
  ownerIdBuisnessNumber?: string // 주민사업자번호
  companyName?: string // 업체명
  carNumber?: string // 차량번호
  transferOutOffice?: string // 전출관청
  transferInOffice?: string // 전입관청
  processStatus?: string // 처리상태
}

const headCells: HeadCell[] = [
  {
    id: 'requestDate',
    numeric: false,
    disablePadding: false,
    label: '요청일자',
  },
  {
    id: 'ownerIdBuisnessNumber',
    numeric: false,
    disablePadding: false,
    label: '주민사업자번호',
  },
  {
    id: 'companyName',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'carNumber',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'transferOutOffice',
    numeric: false,
    disablePadding: false,
    label: '전출관청',
  },
  {
    id: 'transferInOffice',
    numeric: false,
    disablePadding: false,
    label: '전입관청',
  },
  {
    id: 'processStatus',
    numeric: false,
    disablePadding: false,
    label: '처리상태',
  },
]

const rowData: Row[] = [
  {
    id: 1,
    requestDate: '2024-09-20',
    carNumber: '서울00바0000',
    ownerIdBuisnessNumber: '901012-1234567',
    companyName: '고길동',
    transferOutOffice: '서울 영등포구',
    transferInOffice: '서울 강남구',
    processStatus: '요청수신',
  },
  {
    id: 2,
    requestDate: '2024-09-20',
    carNumber: '서울00바0000',
    ownerIdBuisnessNumber: '901012-1234567',
    companyName: '홍길동',
    transferOutOffice: '서울 강동구',
    transferInOffice: '서울 강북구',
    processStatus: '요청수신',
  },
  {
    id: 3,
    requestDate: '2024-09-24',
    carNumber: '서울00바0000',
    ownerIdBuisnessNumber: '901012-1234567',
    companyName: '(주)대한통운',
    transferOutOffice: '서울 강북구',
    transferInOffice: '서울 강남구',
    processStatus: '승인',
  },
]

// 상세정보에 있는 Button actions
const buttonGroupActions: ButtonGroupActionProps = {
  onClickApporveAllBtn: function (): void {
    alert('일괄승인 버튼 눌림')
  },
  onClickDeclineAllBtn: function (): void {
    alert('일괄거절 버튼 눌림')
  },
  onClickApproveBtn: function (): void {
    alert('승인 버튼 눌림')
  },
  onClickDeclineBtn: function (): void {
    alert('거절 버튼 눌림')
  },
  onClickCancelBtn: function (): void {
    alert('취소 버튼 눌림')
  },
  onClickCheckMoveCenterHistoryBtn: function (): void {
    alert('관할관청 버튼 눌림')
  },
}

const BasicTable = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [city, setCity] = useState('서울')
  const [authority, setAuthority] = useState('강남구')
  const [carNumber, setCarNumber] = useState('')
  const [date, setDate] = useState('2024-10-16')
  const [processStatus, setProcessStatus] = useState('')

  const handleCityChange = (event: any) => {
    // 시도명 select
    setCity(event.target.value)
  }

  const handleAuthorityChange = (event: any) => {
    // 관할관청 select
    setAuthority(event.target.value)
  }

  const handleCarNumberChange = (event: any) => {
    // 차량번호 input
    setCarNumber(event.target.value)
  }

  const handleDateChange = (event: any) => {
    // 신청일자 select
    setDate(event.target.value)
  }

  const handleProcessStatusChange = (event: any) => {
    // 처리상태 select
    setProcessStatus(event.target.value)
  }

  return (
    <PageContainer
      title="지자체이관전출관리"
      description="지자체이관전출관리 페이지"
    >
      {/* breadcrumb */}
      <Breadcrumb title="지자체이관전출관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <SearchHeaderTab />

      <Box className="sch-filter-box">
        <div className="form-list">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                시도명
              </CustomFormLabel>
              <select
                id="ft-city-select-01"
                className="custom-default-select"
                value={city}
                onChange={handleCityChange}
                style={{ width: '50%' }}
              >
                {citySelectData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                관할관청
              </CustomFormLabel>
              <select
                id="ft-city-select-01"
                className="custom-default-select"
                value={authority}
                onChange={handleAuthorityChange}
                style={{ width: '50%' }}
              >
                {authoritySelectData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fname"
              >
                차량번호
              </CustomFormLabel>
              <CustomTextField
                id="ft-fname"
                placeholder=""
                fullWidth
                text={carNumber}
                onChange={handleCarNumberChange}
              />
            </div>
          </div>

          {/* 신청일자 datePicker */}
          <hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                신청일자
              </CustomFormLabel>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                신청일자
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" fullWidth />
              <span style={{ margin: '0 4px' }}> - </span>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-end"
              ></CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                처리상태
              </CustomFormLabel>
              <select
                id="ft-city-select-01"
                className="custom-default-select"
                value={processStatus}
                onChange={handleProcessStatusChange}
                style={{ width: '50%' }}
              >
                {processStatusSelectData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Box>

      {/* 검색영역 끝 */}

      <Grid style={{ marginBottom: '8px' }}>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" color="primary">
              조회
            </Button>
            <Button variant="contained" color="primary">
              신규
            </Button>
            <Button variant="contained" color="primary">
              엑셀
            </Button>
          </div>
        </Box>
      </Grid>
      {/* 검색영역 끝 */}

      {/* 테이블영역 시작 */}

      <CheckBoxTableGrid
        headCells={headCells}
        rowData={rowData}
        totalRows={rowData.length}
        loading={loading}
        detailBtnGroupActions={buttonGroupActions}
      />
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default BasicTable
