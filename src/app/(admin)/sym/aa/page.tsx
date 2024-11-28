'use client'
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb, CustomRadio, CustomSelect } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

// types
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import TableDataGrid from './_components/TableDataGrid'
import { getCityCodes, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { SelectItem } from 'select'
import { getDateRange } from '@/utils/fsms/common/util'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '시스템관리',
  },
  {
    title: '권한관리',
  },
  {
    to: '/sym/',
    title: '접근권한관리',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'ctpvNm',
    numeric: false,
    disablePadding: false,
    label: '시도',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '지자체명',
  },
  {
    id: 'lgnId',
    numeric: false,
    disablePadding: false,
    label: '사용자ID',
  },
  {
    id: 'userNm',
    numeric: false,
    disablePadding: false,
    label: '성명',
  },
  {
    id: 'roleNm',
    numeric: false,
    disablePadding: false,
    label: '담당업무',
  },
  {
    id: 'ipAddr',
    numeric: false,
    disablePadding: false,
    label: '신청IP',
  },
  {
    id: 'telno',
    numeric: false,
    disablePadding: false,
    label: '연락처',
  },
  {
    id: 'regDt',
    numeric: false,
    disablePadding: false,
    label: '생성일자',
  },
  {
    id: 'mdfcnDt',
    numeric: false,
    disablePadding: false,
    label: '말소일자',
  },
]

const detailHeadCell: HeadCell[] =[
  {
    id: 'hstrySn',
    numeric: false,
    disablePadding: false,
    label: '번호',
  },
  {
    id: 'userId',
    numeric: false,
    disablePadding: false,
    label: '사용자ID',
  },
  {
    id: 'userNm',
    numeric: false,
    disablePadding: false,
    label: '성명',
  },
  {
    id: 'roleNm',
    numeric: false,
    disablePadding: false,
    label: '담당업무',
  },
  {
    id: 'ipAddr',
    numeric: false,
    disablePadding: false,
    label: '신청IP',
  },
  {
    id: 'chgRsnNm',
    numeric: false,
    disablePadding: false,
    label: '변경사유',
  },
  {
    id: 'mdfrId',
    numeric: false,
    disablePadding: false,
    label: '변경ID',
  },
  {
    id: 'mdfcnDt',
    numeric: false,
    disablePadding: false,
    label: '변경일자',
  },
] 

export interface Row {
  ctpvNm?: string; // 시도명
  locgovNm?: string; // 지자체명
  lgnId?: string; // 사용자ID
  userNm?: string; // 성명
  ipAddr?: string; // 신청IP
  telno?: string; // 연락처
  roleNm?: string; // 담당업무
  regDt?: string; // 생성일자
  mdfrId?: string; // 변경ID
  mdfcnDt?: string; // 말소일자 / 변경일자
  hstrySn?: string; // 번호
  chgRsnNm?: string; // 변경사유
  chgRsnCn?: string; // 
}

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

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [detailRows, setDetailRows] = useState<Row[]>([]) // 가져온 로우 데이터

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? '', // 시작일
    searchEdDate: allParams.searchEdDate ?? '', // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
    prdSeCd: '1',
    ctpvCd: '',
    locgovCd: ''
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  const [cityCode, setCityCode] = useState<SelectItem[]>([])
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([])

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
    setDetailRows([]);
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)
    setDateRange()

    // select item setting
    let cityCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]
    let locgovCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

    // 시도명 select item setting
    getCityCodes().then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['ctpvCd'],
          }

          cityCodes.push(item)
        })
      }
      setCityCode(cityCodes)
    })

    // 관할관청 select item setting
    getLocalGovCodes().then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['locgovCd'],
          }

          locgovCodes.push(item)
        })
      }
      setLocalGovCode(locgovCodes)
    })
  }, [])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])

  useEffect(() => {
    let locgovCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

    // 관할관청 select item setting
    getLocalGovCodes(params.ctpvCd).then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['locgovCd'],
          }

          locgovCodes.push(item)
        })
      }

      setLocalGovCode(locgovCodes)
    })
  }, [params.ctpvCd])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/sym/aa/cm/getAllAccesAuthor?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.lgnId ? '&lgnId=' + params.lgnId : ''}` +
        `${params.userNm ? '&userNm=' + params.userNm : ''}` +
        `${params.prdSeCd ? '&prdSeCd=' + params.prdSeCd: ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", "") : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", "") : ''}`;

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRows(response.data.content)
        setTotalRows(response.data.totalElements)
        setPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        setRows([])
        setTotalRows(0)
        setPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows([])
      setTotalRows(0)
      setPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    } finally {
      setLoading(false)
    }
  }

  // 페이지 이동 감지 시작 //

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
  }

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setFlag(!flag)
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (lgnId: string) => {

    try {
      let endpoint: string = `/fsm/sym/aa/cm/getAllAccesAuthorHst?lgnId=${lgnId}`;

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if(response && response.resultType === 'success' && response.data) {
        setDetailRows(response.data)
      }

    } catch(error) {
      console.error('Error fetching data:', error)
    }

  }

  // 페이지 이동 감지 종료 //

  // 시작일과 종료일 비교 후 일자 변경
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    if (name === 'searchStDate' || name === 'searchEdDate') {
      const otherDateField =
        name === 'searchStDate' ? 'searchEdDate' : 'searchStDate'
      const otherDate = params[otherDateField]

      if (isValidDateRange(name, value, otherDate)) {
        setParams((prev) => ({ ...prev, [name]: value }))
      } else {
        alert('종료일은 시작일보다 빠를 수 없습니다.')
      }
    } else {
      setParams((prev) => ({ ...prev, [name]: value }))
    }
  }

  // 시작일과 종료일 비교
  const isValidDateRange = (
    changedField: string,
    changedValue: string,
    otherValue: string | undefined,
  ): boolean => {
    if (!otherValue) return true

    const changedDate = new Date(changedValue)
    const otherDate = new Date(otherValue)

    if (changedField === 'searchStDate') {
      return changedDate <= otherDate
    } else {
      return changedDate >= otherDate
    }
  }

  // 조건 검색 변환 매칭
  const sortChange = (sort: String): String => {
    if (sort && sort != '') {
      let [field, sortOrder] = sort.split(',') // field와 sortOrder 분리하여 매칭
      if (field === 'regYmd') field = 'regDt' // DB -> regDt // DTO -> regYmd ==> 매칭 작업
      return field + ',' + sortOrder
    }
    return ''
  }
 
  // 기본 검색 날짜 범위 설정 (30일)
  const setDateRange = () => {
    const dateRange = getDateRange("date", 30);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))
  }

  return (
    <PageContainer title="접근권한관리" description="접근권한관리">
      {/* breadcrumb */}
      <Breadcrumb title="접근권한관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                시도
              </CustomFormLabel>
              <select
                id="search-select-ctpvCd"
                className="custom-default-select"
                name="ctpvCd"
                value={params.ctpvCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {cityCode.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                관할관청
              </CustomFormLabel>
              <select
                id="search-select-locgovCd"
                className="custom-default-select"
                name="locgovCd"
                value={params.locgovCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                 {localGovCode.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                ID
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-lgnId" name="lgnId" value={params.lgnId} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                성명
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-userNm" name="userNm" value={params.userNm} onChange={handleSearchChange} fullWidth />
            </div>
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group" style={{ width: 'inherit' }}>
              <CustomFormLabel className="input-label-display">
                기간
              </CustomFormLabel>
              <RadioGroup
                row
                id="radio-group-prdSeCd"
                name="prdSeCd"
                value={params.prdSeCd}
                onChange={handleSearchChange}
                className="mui-custom-radio-group"
              >
                <FormControlLabel
                  control={<CustomRadio id="prdSeCd_1" name="prdSeCd" value="1" />}
                  label="생성일자"
                />
                <FormControlLabel
                  control={<CustomRadio id="prdSeCd_2" name="prdSeCd" value="2" />}
                  label="말소일자"
                />
              </RadioGroup>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">
                기간 시작일
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">
                기간 종료일
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" type="submit" color="primary">
              조회
            </Button>
            <Button variant="contained" color="primary">
              엑셀
            </Button>
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}

      {/* 테이블영역 시작 */}
      <Box>
        <TableDataGrid
          headCells={headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 수
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
        />
      </Box>

      <Box style={{display: detailRows.length > 0 ? 'block' : 'none'}}>
        <CustomFormLabel className="input-label-display">
          <h3>상세정보</h3>
        </CustomFormLabel>
        <TableContainer>
          <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'small'}
          >
            <TableHead>
              <TableRow key={'thRow'}>
              {detailHeadCell.map((headCell) => (
                <TableCell
                key={headCell.id}
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                <div className="table-head-text">
                  {headCell.label}
                </div>
                </TableCell>
              ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {detailRows.length > 0 ? detailRows.map((row: any, index) => {
                return (
                <TableRow hover key={'tr_d'+index}>
                  <TableCell>
                    {Number(row.hstrySn)}
                  </TableCell>
                  <TableCell>
                    {row.lgnId}
                  </TableCell>
                  <TableCell>
                    {row.userNm}
                  </TableCell>
                  <TableCell>
                    {row.roleNm}
                  </TableCell>
                  <TableCell>
                    {row.ipAddr}
                  </TableCell>
                  <TableCell>
                    {row.chgRsnNm}
                  </TableCell>
                  <TableCell>
                    {row.mdfrId}
                  </TableCell>
                  <TableCell>
                    {row.mdfcnDt}
                  </TableCell>
                </TableRow>
                )
              }) : 
              <TableRow key={'tr0'}>
                <TableCell colSpan={headCells.length} className='td-center'><p>조회된 데이터가 없습니다.</p></TableCell>
              </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
