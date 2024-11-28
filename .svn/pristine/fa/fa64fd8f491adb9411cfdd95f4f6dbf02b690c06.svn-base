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
    title: '기준관리',
  },
  {
    title: '보조급지급시행기준',
  },
  {
    to: '/stn/ksu',
    title: '유종별 보조금단가관리',
  },
]

const buisnessData = [
  {
    value: 'busFirst',
    label: '고속버스',
  },
  {
    value: 'intercityBus',
    label: '시외버스',
  },
  {
    value: 'villageBus',
    label: '마을버스',
  },
  {
    value: 'ruralBus',
    label: '농어촌버스',
  },
  {
    value: 'privateOwnedTaxi',
    label: '개인택시',
  },
  {
    value: 'buisnessOwnedTaxi',
    label: '법인택시',
  },
  {
    value: 'normalCargo',
    label: '일반화물',
  },
  {
    value: 'individualCargo',
    label: '개별화물',
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
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'lisenceType',
    numeric: false,
    disablePadding: false,
    label: '면허업종',
  },

  {
    id: 'crtrAplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '고시기준일',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: '단가(원)',
  },
]

export interface Row {
  // id:string;
  koiCd?: '경유' | 'LPG' // 유종
  lisenceType?: string // 면허업종
  crtrAplcnYmd?: string // 고시기준일
  price?: string // 단가(원)
}

const rowData: Row[] = [
  {
    koiCd: '경유',
    lisenceType: '고속버스-우등',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: '경유',
    lisenceType: '개인택시',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: '경유',
    lisenceType: '농어촌버스',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: '경유',
    lisenceType: '법인택시-우등',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: 'LPG',
    lisenceType: '시외버스',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: 'LPG',
    lisenceType: '고속버스-우등',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: '경유',
    lisenceType: '마을버스',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: 'LPG',
    lisenceType: '시외버스',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: 'LPG',
    lisenceType: '일반화물',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
  },
  {
    koiCd: 'LPG',
    lisenceType: '개별화물',
    crtrAplcnYmd: '2024-09-04',
    price: '187.62',
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

  const [date, setDate] = useState('2024-10-15') // 고시기준일
  const [buisness, setBuisness] = useState('전체') // 면허업종
  const [fuel, setFuel] = useState('L') // 유종

  const handleBuisnessChange = (event: any) => {
    setBuisness(event.target.value)
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
      title="유종별 보조금단가관리"
      description="유종별 보조금단가관리"
    >
      {/* breadcrumb */}
      <Breadcrumb title="유종별 보조금단가관리" items={BCrumb} />
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
                면허업종
              </CustomFormLabel>
              <select
                id="ft-ton-select-01"
                className="custom-default-select"
                value={buisness}
                onChange={handleBuisnessChange}
                style={{ width: '100%' }}
              >
                {buisnessData.map((option) => (
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
    </PageContainer>
  )
}

export default DataList
