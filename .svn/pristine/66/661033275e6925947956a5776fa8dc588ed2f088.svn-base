'use client'
import React, { useState } from 'react'
import { Box, Grid, Button, MenuItem, Stack } from '@mui/material'

import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'
import PageContainer from '@/components/container/PageContainer'
import BlankCard from '@/components/shared/BlankCard'
import { HeadCell } from 'table'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'
import TableDataGrid from './_components/TableDataGrid'
import DetailDataGrid from './_components/DetailDataGrid'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '부정수급관리',
  },
  {
    to: '/ilg/nr',
    title: '체납환수금관리',
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

const authorityData = [
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

const statusData = [
  {
    value: 'all',
    label: '전체',
  },
  {
    value: 'etc',
    label: '기타',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'authority',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'carNumber',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'ownerName',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'ownerIdNumber',
    numeric: false,
    disablePadding: false,
    label: '주민등록번호',
  },
  {
    id: 'buisnessNumber',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
  },
  {
    id: 'corporateRegNumber',
    numeric: false,
    disablePadding: false,
    label: '법인등록번호',
  },
  {
    id: 'oilType',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'tons',
    numeric: false,
    disablePadding: false,
    label: '톤수',
  },
]

export interface Row {
  authority?: string
  carNumber?: string
  ownerName?: string
  ownerIdNumber?: string
  buisnessNumber?: string
  corporateRegNumber?: string
  oilType?: '경유' | 'LPG' | string
  tons?: string
}

const rowData: Row[] = [
  {
    authority: '서울 강남구',
    carNumber: '서울00바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울01바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울02바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울03바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울04바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울05바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울06바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
  {
    authority: '서울 강남구',
    carNumber: '서울07바0000',
    ownerName: '홍길동',
    ownerIdNumber: '901012-1111111',
    buisnessNumber: '000-00-00000',
    corporateRegNumber: '000000-0000000',
    oilType: '경유',
    tons: '1톤이하',
  },
]

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  searchValue: string
  searchSelect: string
  searchStDate: string
  searchEdDate: string
  [key: string]: string | number // 인덱스 시그니처 추가
}

// 조회하여 가져온 정보를 Table에 넘기는 객체
type pageable = {
  pageNumber: number
  pageSize: number
  sort: string
}

const BasicTable = () => {
  // const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정

  const [city, setCity] = useState('서울')
  const [authority, setAuthority] = useState('강남구')
  const [carNumber, setCarNumber] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [date, setDate] = useState('2024-10-16')
  const [idNumber, setIdNumber] = useState('901111-1111111')
  const [status, setStatus] = useState('전체')

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? '', // 시작일
    searchEdDate: allParams.searchEdDate ?? '', // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
  })
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  const handleCityChange = (event: any) => {
    setCity(event.target.value)
  }

  const handleAuthorityChange = (event: any) => {
    setAuthority(event.target.value)
  }

  const handleCarNumberChange = (event: any) => {
    setCarNumber(event.target.value)
  }

  const handleOwnerNameChange = (event: any) => {
    setOwnerName(event.target.value)
  }

  const handleDateChange = (event: any) => {
    setDate(event.target.value)
  }

  const handleIdNumberChange = (event: any) => {
    setIdNumber(event.target.value)
  }

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value)
  }

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setParams((prev: any) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setFlag(!flag)
  }

  return (
    <PageContainer title="부정수급관리" description="부정수급관리 페이지">
      {/* breadcrumb */}
      <Breadcrumb title="체납환수금관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box className="sch-filter-box">
        <div className="form-list">
          <div className="form-inline">
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
                {authorityData.map((option) => (
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
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fname"
              >
                소유자명
              </CustomFormLabel>
              <CustomTextField
                id="ft-fname"
                placeholder=""
                fullWidth
                text={ownerName}
                onChange={handleOwnerNameChange}
              />
            </div>
          </div>

          {/* 휴지일자 datePicker */}
          <div className="form-inline">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                등록일자
              </CustomFormLabel>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                등록일자
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" fullWidth />
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-end"
              ></CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fname"
              >
                주민(법인)등록번호
              </CustomFormLabel>
              <CustomTextField
                id="ft-fname"
                placeholder=""
                fullWidth
                text={idNumber}
                onChange={handleIdNumberChange}
              />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                상태
              </CustomFormLabel>
              <select
                id="ft-status-select-01"
                className="custom-default-select"
                value={status}
                onChange={handleStatusChange}
                style={{ width: '50%' }}
              >
                {statusData.map((option) => (
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
              수정
            </Button>
            <Button variant="contained" color="primary">
              엑셀
            </Button>
          </div>
        </Box>
      </Grid>
      {/* 검색영역 끝 */}

      {/* 테이블영역 시작 */}
      <Grid
        container
        spacing={2}
        className="card-container"
        style={{ marginBottom: '20px' }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <TableDataGrid
            headCells={headCells}
            rows={rowData}
            totalRows={rowData.length}
            loading={false}
            onPaginationModelChange={handlePaginationModelChange}
            pageable={pageable}
          />
        </Grid>
      </Grid>
      {/* 테이블영역 끝 */}

      {/* 상세 영역 시작 */}
      <Grid item xs={4} sm={4} md={4}>
        <DetailDataGrid />
      </Grid>
      {/* 상세 영역 끝 */}
    </PageContainer>
  )
}

export default BasicTable
