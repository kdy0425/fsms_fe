'use client'
import {
  Box,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import TableDataGrid from './_components/TableDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '운영관리',
  },
  {
    to: '/mng/sspc',
    title: '보조금지급정지 변경관리',
  },
]

const tonData = [
  {
    value: '01',
    label: '1톤이하',
  },
  {
    value: '03',
    label: '3톤이하',
  },
  {
    value: '05',
    label: '5톤이하',
  },
  {
    value: '08',
    label: '8톤이하',
  },
  {
    value: '10',
    label: '10톤이하',
  },
]

const fuelData = [
  {
    value: 'L',
    label: 'LPG',
  },
  {
    value: 'M',
    label: '경유',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'vhclTonCd',
    numeric: false,
    disablePadding: false,
    label: '전송상태',
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
    label: '소유자명',
  },
  {
    id: 'rrno',
    numeric: false,
    disablePadding: false,
    label: '주민등록번호',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
  },
  {
    id: 'stopBgngYmd',
    numeric: false,
    disablePadding: false,
    label: '지급정지시작일',
  },
  {
    id: 'stopEndYmd',
    numeric: false,
    disablePadding: false,
    label: '지급정지종료일',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'delYn',
    numeric: false,
    disablePadding: false,
    label: '삭제여부',
  },
]

/**
 *    {
                "hstrySn": "2.000000000000000",
                "brno": "3038102906",
                "vhclNo": "충북71바7706",
                "locgovCd": "43130",
                "locgovNm": "충북 충주시",
                "koiCd": "H",
                "koiNm": "수소",
                "rprsvNm": "김영훈",
                "delYn": "N",
                "dscntYn": "Y",
                "souSourcSeCd": null,
                "rfidYn": "Y",
                "bsc_info_chgYn": null,
                "locgovAprvYn": "Y",
                "stopBgngYmd": "20240901",
                "stopEndYmd": "20251101",
                "stopRsnCn": "",
                "rgtrId": "user",
                "regDt": "2024-10-10 15:29:19.687",
                "mdfrId": "user",
                "mdfcnDt": "2024-10-10 15:29:19.687"
            }
 * 
 */

export interface Row {
  // id:string;
  hstrySn: string,
  brno: string,
  rrno: string
  vhclNo: string,
  locgovCd: string
  locgovNm:string
  koiCd: string
  koiNm: string
  rprsvNm: string
  delYn: string
  dscntYn: string
  souSourcSeCd?: string | null
  rfidYn: string
  bsc_info_chgYn?: string | null
  locgovAprvYn: string
  stopBgngYmd: string
  stopEndYmd: string
  stopRsnCn: string
  rgtrId: string
  regDt: string,
  mdfrId: string
  mdfcnDt: string
}

const rowData: Row[] = [
  {
    hstrySn: "2.000000000000000",
    rrno: "000000-0000000",
    brno: "3038102906",
    vhclNo: "충북71바7706",
    locgovCd: "43130",
    locgovNm: "충북 충주시",
    koiCd: "H",
    koiNm: "수소",
    rprsvNm: "김영훈",
    delYn: "N",
    dscntYn: "Y",
    souSourcSeCd: null,
    rfidYn: "Y",
    bsc_info_chgYn: null,
    locgovAprvYn: "Y",
    stopBgngYmd: "20240901",
    stopEndYmd: "20251101",
    stopRsnCn: "",
    rgtrId: "user",
    regDt: "2024-10-10 15:29:19.687",
    mdfrId: "user",
    mdfcnDt: "2024-10-10 15:29:19.687"
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

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

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
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  const [ton, setTon] = useState('1톤이하')
  const [fuel, setFuel] = useState('L')
  const [date, setDate] = useState('2024-10-15')

  const handleTonChange = (event: any) => {
    setTon(event.target.value)
  }

  const handleFuelChange = (event: any) => {
    setFuel(event.target.value)
  }

  const handleDateChange = (event: any) => {
    setDate(event.target.value)
  }

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)
  }, [])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/sample/posts?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
        `${params.searchStDate ? '&pstgBgngYmd=' + params.searchStDate : ''}` +
        `${params.searchEdDate ? '&pstgEndYmd=' + params.searchEdDate : ''}`

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
      setRows(rowData)
      setTotalRows(rowData.length)
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
  const handleRowClick = (postTsid: string) => {
    router.push(`./view/${postTsid}${qString}`) // 조회 페이지 경로
  }

  // 글쓰기 페이지로 이동하는 함수
  const handleWriteClick = () => {
    router.push(`./create${qString}`) // '/create'는 글쓰기 페이지의 경로입니다.
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

  return (
    <PageContainer
      title="보조금지급정지 변경관리"
      description="보조금지급정지 변경관리"
    >
      {/* breadcrumb */}
      <Breadcrumb title="보조금지급정지 변경관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                고시기준일
              </CustomFormLabel>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                고시기준일
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" fullWidth />
              {/* <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">종료일</CustomFormLabel>
            <CustomTextField type="date" id="ft-date-end" fullWidth /> */}
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                톤수
              </CustomFormLabel>
              <select
                id="ft-ton-select-01"
                className="custom-default-select"
                value={ton}
                onChange={handleTonChange}
                style={{ width: '100%' }}
              >
                {tonData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-fuel"
              >
                유종
              </CustomFormLabel>
              <select
                id="ft-fuel-select-02"
                className="custom-default-select"
                value={fuel}
                onChange={handleFuelChange}
                style={{ width: '100%' }}
              >
                {fuelData.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" color="primary">
              조회
            </Button>
            <FormDialog
              size={'lg'}
              buttonLabel="신규"
              title="전국표준한도관리 등록"
              children={<ModalContent />}
            />
            {/* <Button variant="contained" color="primary">
              신규
            </Button> */}
            <Button variant="contained" color="primary">
              수정
            </Button>
            <Button variant="contained" color="primary">
              삭제
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
      {/* 테이블영역 끝 */}

      {/* <Box className="table-bottom-button-group">
          <div className="button-right-align">
              <Button variant="contained" color="primary"
              onClick={handleWriteClick}
              >
                등록
              </Button>
          </div>
      </Box> */}
    </PageContainer>
  )
}

export default DataList
