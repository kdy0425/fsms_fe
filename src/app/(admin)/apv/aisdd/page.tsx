'use client'
import {
  Box,
  Button
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { BlankCard, Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

// types
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getDateRange, getExcelFile, getToday } from '@/utils/fsms/common/comm'
import { HeadCell } from 'table'
import TableDataGrid from '@/app/components/tables/CommDataGrid'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '거래정보',
  },
  {
    title: '주유(충전)소 관리',
  },
  {
    to: '/apv/aisdd',
    title: '주유량확인시스템 거래내역조회',
  },
]


const headCells: HeadCell[] = [
  {
    id: 'regDt',
    numeric: false,
    disablePadding: false,
    label: '등록일자',
    format: 'yyyymmdd'
  },
  {
    id: 'frcsBrno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
    format: 'brno'
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
  {
    id: 'rprsvNm',
    numeric: false,
    disablePadding: false,
    label: '대표자명',
  },
  {
    id: 'telnoFull',
    numeric: false,
    disablePadding: false,
    label: '연락처',
  },
  {
    id: 'aogIdntySysInstlYmd',
    numeric: false,
    disablePadding: false,
    label: '설치일자',
    format: 'yyyymmdd'
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '등록 관할관청',
  },
]

const detailHeadCells: HeadCell[] = [
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호'
  },
  {
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'cardSeCdNm',
    numeric: false,
    disablePadding: false,
    label: '구분',
  },
  {
    id: 'aprvYmdTm',
    numeric: false,
    disablePadding: false,
    label: '승인일시',
    format: 'yyyymmddhh24miss'
  },
  {
    id: 'aprvNo',
    numeric: false,
    disablePadding: false,
    label: '승인번호',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
    format: 'number'
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '사용리터',
    format: 'lit'
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '보조금액',
    format: 'number'
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
    format: 'lit'
  },
  {
    id: 'origTrauYmdTm',
    numeric: false,
    disablePadding: false,
    label: '취소 원거래일시',
    format: 'yyyymmddhh24miss'
  },
  {
    id: 'crdcoCdNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'cardNoS',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
  {
    id: 'asstCdNm',
    numeric: false,
    disablePadding: false,
    label: '비 고',
  },
]

export interface Row {
  aogIdntySysIdSn: number;
  frcsBrno: string;
  shFrcsCdNo: string;
  wrFrcsCdNo: string;
  kbFrcsCdNo: string;
  ssFrcsCdNo: string;
  hdFrcsCdNo: string;
  rprsvNm: string;
  frcsTlphonDddCd: string;
  telno: string;
  telnoFull: string;
  zip: string;
  daddr: string;
  frcsNm: string;
  aplcntMbtlnum: string;
  aogIdntySysInstlDmndYmd: string;
  aogIdntySysSttsCd: string;
  aogIdntySysSttsCdNm: string;
  aogIdntySysInstlYmd: string;
  delYn: string;
  delRsnCd: string;
  delRsnCdNm: string;
  idfrNm: string;
  idntyYmd: string;
  locgovCd: string;
  locgovNm: string;
  trsmYn: string;
  trsmDt: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
  vhclNo: string;
  vonrNm: string;
  crdcoCdNm: string;
  cardNoS: string;
  crdcoCd: string;
  cardNo: string;
  aprvYmd: string;
  aprvTm: string;
  aprvYmdTm: string;
  aprvNo: string;
  aprvYn: string;
  stlmYn: string;
  aprvAmt: string;
  useLiter: string;
  asstAmt: string;
  asstAmtLiter: string;
  unsetlLiter: string;
  unsetlAmt: string;
  frcsCdNo: string;
  cardSeCdNm: string;
  cardSttsCdNm: string;
  stlmCardNo: string;
  stlmAprvNo: string;
  ceckStlmYn: string;
  origTrauTm: string;
  origTrauYmdTm: string;
  asstCdNm: string;
  colorGb: string;
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

  const [selectedRow, setSelectedRow] = useState<Row>();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const [detailRows, setDetailRows] = useState<Row[]>([]);

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

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
    setSelectedIndex(-1)
    setDetailRows([]);
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    const dateRange = getDateRange('d', 30);

    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    setParams((prev) => ({...prev, 
      searchStDate: startDate,
      searchEdDate: endDate
    }))

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
        `/fsm/apv/aisdd/tr/getAllAogIdSysDelngs?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.frcsBrno ? '&frcsBrno=' + params.frcsBrno : ''}` +
        `${params.frcsCdNo ? '&frcsCdNo=' + params.frcsCdNo : ''}` +
        `${params.frcsNm ? '&frcsNm=' + params.frcsNm : ''}` +
        `${params.searchStDate ? '&bgngAprvYmd=' + params.searchStDate.replaceAll('-', '') : ''}` +
        `${params.searchEdDate ? '&endAprvYmd=' + params.searchEdDate.replaceAll('-', '') : ''}`

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

  const fetchDetailData = async (row:Row) => {
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/aisdd/tr/getAllAogIdSysDelngDtls?` +
        `${row.frcsBrno ? '&frcsBrno=' + row.frcsBrno : ''}` +
        `${row.aogIdntySysIdSn ? '&aogIdntySysIdSn=' + row.aogIdntySysIdSn : ''}` +
        `${row.vhclNo ? '&vhclNo=' + row.vhclNo : ''}` +
        // `${row.aprvCd ? '&aprvCd=' + row.aprvCd : ''}` + row에 포함안되어 있는데 파라미터 정의서에는 있음 (241126)
        // `${row.apvlYn ? '&apvlYn=' + row.apvlYn : ''}` +
        `${params.searchStDate ? '&bgngAprvYmd=' + params.searchStDate.replaceAll('-', '') : ''}` +
        `${params.searchEdDate ? '&endAprvYmd=' + params.searchEdDate.replaceAll('-', '') : ''}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setDetailRows(response.data)
    
      } else {
        // 데이터가 없거나 실패
        setDetailRows([])
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setDetailRows([])
    }
  }

  const excelDownload = async (row: Row) => {
    let endpoint: string =
    `/fsm/apv/aisdd/tr/getExcelAogIdSysDelngDtls?` +
    `${row.frcsBrno ? '&frcsBrno=' + row.frcsBrno : ''}` +
    `${row.aogIdntySysIdSn ? '&aogIdntySysIdSn=' + row.aogIdntySysIdSn : ''}` +
    `${row.vhclNo ? '&vhclNo=' + row.vhclNo : ''}` +
    // `${row.aprvCd ? '&aprvCd=' + row.aprvCd : ''}` + row에 포함안되어 있는데 파라미터 정의서에는 있음 (241126)
    // `${row.apvlYn ? '&apvlYn=' + row.apvlYn : ''}` +
    `${params.searchStDate ? '&bgngAprvYmd=' + params.searchStDate.replaceAll('-', '') : ''}` +
    `${params.searchEdDate ? '&endAprvYmd=' + params.searchEdDate.replaceAll('-', '') : ''}`

    getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_'+getToday()+'.xlsx')
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
  const handleRowClick = (row: Row, index?:number) => {
    setSelectedIndex(index ?? -1);
    setSelectedRow(row);

    fetchDetailData(row);
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
      title="주유량확인시스템 거래내역조회"
      description="주유량확인시스템 거래내역조회"
    >
      {/* breadcrumb */}
      <Breadcrumb title="주유량확인시스템 거래내역조회" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-frcsBrno">
                사업자등록번호
              </CustomFormLabel>
              <CustomTextField id="ft-frcsBrno" name="frcsBrno" value={params.frcsBrno} onChange={handleSearchChange} fullWidth/>
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-frcsNm">
                가맹점명
              </CustomFormLabel>
              <CustomTextField id="ft-frcsNm" name="frcsNm" value={params.frcsNm} onChange={handleSearchChange} fullWidth/>
            </div>
          </div>
          <hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" required>
                시작일자
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">시작일자</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">종료일자</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>  
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" type='submit' color="primary">
              조회
            </Button>
            {selectedRow && detailRows.length > 0 ? 
            <Button variant="contained" color="primary" onClick={() => excelDownload(selectedRow)}>
              엑셀
            </Button>
            : ''}
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}

      {/* 테이블영역 시작 */}
      <Box>
        <TableDataGrid
          headCells={headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          selectedRowIndex={selectedIndex}
          paging
          cursor
        />
      </Box>
      {selectedRow && selectedIndex > -1 ? 
      <Box>
        <BlankCard title='상세내역'>
            <Box style={{display:'flex', padding:'1rem 1rem', gap:'1rem'}}>
              <span>■ 일반거래</span>
              <span style={{color: 'blue'}}>■ 취소거래</span>
              <span style={{color: 'green'}}>■ 차량휴지/보조금지급정지기간 거래건</span>
              <span style={{color: 'purple'}}>■ 유종/단가불량/특별관리주유소 거래건</span>
              <span style={{color: 'red'}}>■ 주유량확인시스템 누락 거래건</span>
            </Box>
          <TableDataGrid
            headCells={detailHeadCells} // 테이블 헤더 값
            rows={detailRows} // 목록 데이터
            totalRows={-1} // 총 로우 수
            loading={loading} // 로딩여부
            onRowClick={() => {}} // 행 클릭 핸들러 추가
            onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
            onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
            pageable={pageable} // 현재 페이지 / 사이즈 정보
            paging={false}
            cursor={false}
          />
        </BlankCard>
      </Box>
      : <></>}
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
