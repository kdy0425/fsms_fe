'use client'
import React, { useState } from 'react'
import { Box, Grid, Button, MenuItem, Stack } from '@mui/material'

import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'
import PageContainer from '@/components/container/PageContainer'
import { HeadCell } from 'table'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import SearchHeaderTab from './_components/SearchHeaderTab'
import TableDataGrid from './_components/TableDataGrid'
import BrnoDetailDataGrid from './_components/BrnoDetailDataGrid'
import CarDetailDataGrid from './_components/CarDetailDataGrid'

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
    to: '/stn/vm',
    title: '차량관리',
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

const lcnsTpbizData = [
  // 면허업종
  {
    value: '0',
    label: '전체',
  },
  {
    value: '1',
    label: '일반화물',
  },
  {
    value: '1',
    label: '대형화물',
  },
  {
    value: '1',
    label: '택시',
  },
]

const vhclSttsCdData = [
  {
    value: '0',
    label: '전체',
  },
  {
    value: '1',
    label: '차량상태1',
  },
]

const usageTypeData = [
  // 용도구분
  {
    value: '0',
    label: '전체',
  },
  {
    value: '1',
    label: '기타용도',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'crno',
    numeric: false,
    disablePadding: false,
    label: '법인등록번호',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'rprsvNm',
    numeric: false,
    disablePadding: false,
    label: '차주명',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '차주사업자등록번호',
  },
  {
    id: 'rprsvRrno',
    numeric: false,
    disablePadding: false,
    label: '차주주민등록번호',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'tons', // 코드 재확인 필요
    numeric: false,
    disablePadding: false,
    label: '톤수',
  },
  {
    id: 'vhclSeCd', // 코드 재확인 필요
    numeric: false,
    disablePadding: false,
    label: '면허업종',
  },
  {
    id: 'dscntYn', // 코드 재확인 필요
    numeric: false,
    disablePadding: false,
    label: '할인여부',
  },
  {
    id: 'rfidYn', // 코드 재확인 필요
    numeric: false,
    disablePadding: false,
    label: '소유구분',
  },
]

export interface Row {
  crno?: string //법인등록번호
  bzentyNm?: string // 업체명
  vhclNo?: string // 차량번호
  rprsvNm?: string // 차주명
  brno?: string // 차주사업자등록번호
  rprsvRrno?: string // 차주주민등록번호
  koiCd?: string // 유종
  tons?: string // 톤수
  vhclSeCd?: string // 면허업종
  dscntYn?: string // 할인여부
  rfidYn?: string // 소유구분
}

const rowData: Row[] = [
  {
    crno: '110111-345401',
    bzentyNm: '(주)거승',
    vhclNo: '서울90바1768',
    rprsvNm: '김학준',
    brno: '123-12-21345',
    rprsvRrno: '700123-1212134',
    koiCd: '경유',
    tons: '12톤이하',
    vhclSeCd: '일반화물',
    dscntYn: '미할인',
    rfidYn: '법인',
  },
  {
    crno: '110111-345401',
    bzentyNm: '(주)금호물류',
    vhclNo: '서울90바1768',
    rprsvNm: '김학준',
    brno: '123-12-21345',
    rprsvRrno: '700123-1212134',
    koiCd: '경유',
    tons: '12톤이하',
    vhclSeCd: '일반화물',
    dscntYn: '미할인',
    rfidYn: '법인',
  },
]

const BasicTable = () => {
  const [ctpv, setCtpv] = useState('서울') // 시도
  const [locgov, setLocgov] = useState('강남구') // 관할관청
  const [lcnsTpbiz, setLcnsTpbiz] = useState('전체') // 면허업종
  const [vhclSttsCd, setVhclSttsCd] = useState('전체') // 차량상태
  const [usageType, setUsageType] = useState('전체') // 용도구분
  const [vhclNo, setVhclNo] = useState('') // 차량번호
  const [rrno, setRrno] = useState('') // 주민등록번호
  const [crno, setCrno] = useState('') // 법인등록번호
  const [brno, setBrno] = useState('') // 사업자등록번호

  const handleCtpvChange = (event: any) => {
    setCtpv(event.target.value)
  }

  const handleLocgovChange = (event: any) => {
    setLocgov(event.target.value)
  }
  const handleLcnsTpbizChange = (event: any) => {
    setLcnsTpbiz(event.target.value)
  }
  const handleVhclSttsCdChange = (event: any) => {
    setVhclSttsCd(event.target.value)
  }
  const handleUsageTypeChange = (event: any) => {
    setUsageType(event.target.value)
  }
  const handleVhclNoChange = (event: any) => {
    setVhclNo(event.target.value)
  }
  const handleRrnoChange = (event: any) => {
    setRrno(event.target.value)
  }
  const handleCrnoChange = (event: any) => {
    setCrno(event.target.value)
  }
  const handleBrnoChange = (event: any) => {
    setBrno(event.target.value)
  }
  return (
    <PageContainer title="차량관리" description="차량관리 페이지">
      {/* breadcrumb */}
      <Breadcrumb title="차량관리" items={BCrumb} />
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
                value={ctpv}
                onChange={handleCtpvChange}
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
                value={locgov}
                onChange={handleLocgovChange}
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
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                면허업종
              </CustomFormLabel>
              <select
                id="ft-city-select-01"
                className="custom-default-select"
                value={lcnsTpbiz}
                onChange={handleLcnsTpbizChange}
                style={{ width: '50%' }}
              >
                {lcnsTpbizData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                차량상태
              </CustomFormLabel>
              <select
                id="ft-city-select-01"
                className="custom-default-select"
                value={vhclSttsCd}
                onChange={handleVhclSttsCdChange}
                style={{ width: '50%' }}
              >
                {vhclSttsCdData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                용도구분
              </CustomFormLabel>
              <select
                id="ft-city-select-01"
                className="custom-default-select"
                value={usageType}
                onChange={handleUsageTypeChange}
                style={{ width: '50%' }}
              >
                {usageTypeData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-form">
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
                text={vhclNo}
                onChange={handleVhclNoChange}
              />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fname"
              >
                주민등록번호
              </CustomFormLabel>
              <CustomTextField
                id="ft-fname"
                placeholder=""
                fullWidth
                text={rrno}
                onChange={handleRrnoChange}
              />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fname"
              >
                법인등록번호
              </CustomFormLabel>
              <CustomTextField
                id="ft-fname"
                placeholder=""
                fullWidth
                text={crno}
                onChange={handleCrnoChange}
              />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fname"
              >
                사업자등록번호
              </CustomFormLabel>
              <CustomTextField
                id="ft-fname"
                placeholder=""
                fullWidth
                text={brno}
                onChange={handleBrnoChange}
              />
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
      <Box>
        <TableDataGrid headCells={headCells} rowData={rowData} />
      </Box>
      {/* 테이블영역 끝 */}

      {/* 상세 영역 시작 */}
      <Grid item xs={4} sm={4} md={4}>
        <BrnoDetailDataGrid />
      </Grid>
      <Grid item xs={4} sm={4} md={4}>
        <CarDetailDataGrid
          onClickManageMileageBtn={() => alert('주행거리관리')}
          onClickCheckVehicleHistoryBtn={() => alert('차량이력보기')}
          onClickChangeBrnoBtn={() => alert('차주사업자변경')}
          onClickTransferLocalGovernmentBtn={() => alert('지자체이관')}
          onClickChangeKoiTonCountBtn={() => alert('유종/톤수변경')}
          onClickCarRestBtn={() => alert('차량휴지')}
          onClickStopPaymentBtn={() => alert('지급정지')}
          onClickVehicleCancellationBtn={() => alert('차량말소')}
        />
      </Grid>
      {/* 상세 영역 끝 */}
    </PageContainer>
  )
}

export default BasicTable
