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

import TableDataGrid from '@/app/components/tables/CommDataGrid'

// types
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell, Pageable } from 'table'
import { getDateRange, getExcelFile, getToday, getLocGovCd, getCommCd } from '@/utils/fsms/common/comm'
import { SelectItem } from 'select'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '보조금청구',
  },
  {
    title: '택시청구',
  },
  {
    to: '/cal/csr',
    title: '카드사별청구내역조회',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'clclnYm',
    numeric: false,
    disablePadding: false,
    label: '청구년월',
  },
  {
    id: 'crdcoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'bznmSeNm',
    numeric: false,
    disablePadding: false,
    label: '사업자구분',
  },
  {
    id: 'userCnt',
    numeric: false,
    disablePadding: false,
    label: '사용자수',
  },
  {
    id: 'dlngNocs',
    numeric: false,
    disablePadding: false,
    label: '매출건수',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '국토부사용량',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'slsAmt',
    numeric: false,
    disablePadding: false,
    label: '매출금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'indvBrdnAmt',
    numeric: false,
    disablePadding: false,
    label: '개인부담금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'moliatAssaAmt',
    numeric: false,
    disablePadding: false,
    label: '국토부보조금',
    format: 'number',
    align: 'td-right',
  },
]

const detailHeadCells: HeadCell[] = [
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '지자체',
  },
  {
    id: 'clclnYm',
    numeric: false,
    disablePadding: false,
    label: '청구월',
  },
  {
    id: 'crdcoCd',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'userCnt',
    numeric: false,
    disablePadding: false,
    label: '회원수',
  },
  {
    id: 'dlngNocs',
    numeric: false,
    disablePadding: false,
    label: '청구건수',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '국토부사용량',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'slsAmt',
    numeric: false,
    disablePadding: false,
    label: '매출금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'indvBrdnAmt',
    numeric: false,
    disablePadding: false,
    label: '개인부담금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'moliatAssaAmt',
    numeric: false,
    disablePadding: false,
    label: '국토부보조금',
    format: 'number',
    align: 'td-right',
  },
]

export interface Row {
  clclnYm?: string
  crdcoCd?: string
  bzmnSeCd?: string
  crdcoNm?: string
  bznmSeNm?: string
  userCnt?: string
  dlngNocd?: string
  useLiter?: string
  slsAmt?: string
  indvBrndAmt?: string
  moliatAsstAmt?: string
}

export interface DetailRow {
  clclnYm?: string
  crdcoCd?: string
  bzmnSeCd?: string
  userCnt?: string
  dlngNocd?: string
  locgovCd?: string
  locgovNm?: string
  useLiter?: string
  slsAmt?: string
  indvBrndAmt?: string
  moliatAsstAmt?: string
}

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  detailSort: string
  detailPage: number
  detailSize: number
  searchStDate: string
  searchEdDate: string
  [key: string]: string | number // 인덱스 시그니처 추가
}

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [detailRows, setDetailRows] = useState<DetailRow[]>([]);
  const [detailTotalRows, setDetailTotalRows] = useState(0);

  const [crdcoCdItems, setCrdcoCdItems] = useState<SelectItem[]>([]);
  const [bzmnSeCdItems, setBznmSeCdItems] = useState<SelectItem[]>([]);

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    detailPage: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    detailSize: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? '', // 시작일
    searchEdDate: allParams.searchEdDate ?? '', // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
    detailSort: allParams.sort ?? '', // 정렬 기준 추가
  })

  const [detailParams, setDetailParams] = useState({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    crdcoCd: '',
    clclnYm: '',
    bzmnSeCd: '',
  })
  //
  const [pageable, setPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })
  //
  const [detailPageable, setDetailPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

    const dateRange = getDateRange('d', 30);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))

    getCommCd('543', '전체').then((itemArr) => setCrdcoCdItems(itemArr)) // 카드사구분코드
    getCommCd('001', '전체').then((itemArr) => setBznmSeCdItems(itemArr)) // 사업자구분코드
  }, [])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])

  // 상세 내역 조회
  useEffect(() => {
    if (detailParams.crdcoCd && detailParams.clclnYm && detailParams.bzmnSeCd) {
      fetchDetailData();
    }
  }, [detailParams])

  function formatDate(dateString: string) {
    // 입력 형식이 YYYY-MM인지 확인
    if (!/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    return dateString.replace("-", "");
  }

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/cal/cardsr/tx/getAllCardSbsidyRqestTx?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` +
        `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        for (let i = 0; i < response.data.content.length; i++) {
          const crdcoCd = response.data.content[i].crdcoCd;
          const bzmnSeCd = response.data.content[i].bznmSeCd;
          for (let j = 0; j < crdcoCdItems.length; j++) {
            const item = crdcoCdItems[j].value;
            if (crdcoCd === item) {
              response.data.content[i].crdcoNm = crdcoCdItems[j].label;
            }
          }
          for (let j = 0; j < bzmnSeCdItems.length; j++) {
            const item = bzmnSeCdItems[j].value;
            if (bzmnSeCd === item) {
              response.data.content[i].bzmnSeNm = bzmnSeCdItems[j].label;
            }
          }
        }
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
      setDetailRows([])
      setDetailTotalRows(0)
      setLoading(false)
    }
  }

  const excelDownload = async() => {
    let endpoint: string =
        `/fsm/cal/cardsr/tx/getAllCardSbsidyRqestTx?` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` +
        `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}`

    getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_' + getToday() + '.xlsx');
  }

  const fetchDetailData = async () => {
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint = `/fsm/cal/cardsr/tx/getAllSbsidyRqestTx?page=${detailParams.page - 1}&size=${detailParams.size}` +
        `${detailParams.crdcoCd ? '&crdcoCd=' + detailParams.crdcoCd : ''}` + 
        `${detailParams.clclnYm ? '&clclnYm=' + formatDate(detailParams.clclnYm) : ''}` + 
        `${detailParams.bzmnSeCd ? '&bzmnSeCd=' + detailParams.bzmnSeCd : ''}`
          
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store'
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setDetailRows(response.data.content);
        setDetailTotalRows(response.data.totalElements);
        setDetailPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        setDetailRows([])
        setDetailTotalRows(0)
        setDetailPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    } catch (error) {
      console.error('no such fetching data:', error)
      setDetailRows([])
      setDetailTotalRows(0)
      setDetailPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
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

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handleDetailPaginationModelChange = (page: number, pageSize: number) => {
    setDetailParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (row: Row) => {
    setDetailParams((prev) => ({
      ...prev,
      page: 1,
      crdcoCd: row.crdcoCd ? row.crdcoCd : '',
      clclnYm: row.clclnYm ? row.clclnYm : '',
      bzmnSeCd: row.bzmnSeCd ? row.bzmnSeCd : '',
    }))
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
    <PageContainer title="카드사별청구내역조회" description="카드사별청구내역조회">
      {/* breadcrumb */}
      <Breadcrumb title="카드사별청구내역조회" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                청구년월
              </CustomFormLabel>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                청구년월 시작
              </CustomFormLabel>
              <CustomTextField type="month" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-end"
              >
                청구년월 종료
              </CustomFormLabel>
              <CustomTextField type="month" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button onClick={() => fetchData()} variant="contained" color="primary">
              조회
            </Button>
            <Button onClick={() => excelDownload()} variant="contained" color="primary">
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
          onPaginationModelChange={handlePaginationModelChange} // 페이지, 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          paging={true}
        />

        {detailRows && detailRows.length > 0 &&
          <TableDataGrid
            headCells={detailHeadCells}
            rows={detailRows}
            totalRows={detailTotalRows}
            loading={loading}
            onRowClick={() => {}}
            onPaginationModelChange={handleDetailPaginationModelChange}
            onSortModelChange={() => {}}
            pageable={detailPageable}
            paging={true}
          />
        }
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
