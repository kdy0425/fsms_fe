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
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell, Pageable } from 'table'
import { getCtpvCd, getCommCd, getLocGovCd, getDateRange, getExcelFile, getToday } from '@/utils/fsms/common/comm'
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
    to: '/cal/vtxcsr',
    title: '차량별 청구내역 집계현황(택시)',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
    rowspan: true,
  },
  {
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
    rowspan: true,
  },
  {
    id: 'vonrBrno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
    rowspan: true,
  },
  {
    id: 'slsNocs',
    numeric: false,
    disablePadding: false,
    label: '매출건',
    rowspan: true,
  },
  {
    id: 'slsAmt',
    numeric: false,
    disablePadding: false,
    label: '매출액',
    format: 'number',
    align: 'td-right',
    rowspan: true,
  },
  {
    id: 'indvClmAmt',
    numeric: false,
    disablePadding: false,
    label: '개인청구',
    format: 'number',
    align: 'td-right,',
    rowspan: true,
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '정부지원',
    format: 'number',
    align: 'td-right',
    rowspan: true,
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '사용리터(L)',
    format: 'number',
    align: 'td-right',
    rowspan: true,
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터(L)',
    format: 'number',
    align: 'td-right',
    rowspan: true,
  },
  {
    id: 'koiCdNm',
    numeric: false,
    disablePadding: false,
    label: '정상거래',
  },
  {
    id: 'vhclTonNm',
    numeric: false,
    disablePadding: false,
    label: '취소거래',
  },
]

export interface Row {
  clclnYm?: string // 청구년월
  crdcoNm?: string // 카드사명
  locgovNm?: string // 지자체명
  flnm?: string // 대표자명
  brno?: string // 사업자등록번호
  vhclNo?: string // 차량번호
  bzmnSeNm?: string // 면허구분명
  koiNm?: string // 유종명
  gnrlDlngNocs?: string // 정상매출건수
  gnrlUseLiter?: string // 정상국토부사용량
  gnrlSlsAmt?: string // 정상매출금액
  gnrlIndvBrdnAmt?: string // 정상개인부담금
  gnrlMoliatAsstAmt?: string // 정상국토부보조금
  rtrcnDlngNocs?: string // 취소매출건수
  rtrcnUseLiter?: string // 취소국토부사용량
  rtrcnSlsAmt?: string // 취소매출금액
  rtrcnIndvClmAmt?: string // 취소개인부담금
  rtrcnMoliatAsstAmt?: string // 취소국토부보조금
  usageUnit?: string // 사용단위
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

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]) // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]) // 관할관청 코드
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]) // 유종 코드
  const [crdcoCdItems, setCrdcoCdItems] = useState<SelectItem[]>([]) // 카드사 구분 코드

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
  const [pageable, setPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if (params.ctpvCd || params.locgovCd) {
        fetchData()
    }
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

    const dateRange = getDateRange('d', 30);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))

    getCtpvCd().then((itemArr) => {
        setCtpvCdItems(itemArr)
        setParams((prev) => ({ ...prev, ctpvCd: itemArr[0].value })) // 첫번째 아이템으로 기본값 설정
    }) // 시도 코드

    getCommCd('977', '전체').then((itemArr) => setKoicdItems(itemArr)) // 유종 코드
    getCommCd('023', '전체').then((itemArr) => setCrdcoCdItems(itemArr)) // 카드사 구분 코드
  }, [])

  useEffect(() => { // 시도 코드 변경시 관할관청 재조회
    if (params.ctpvCd) {
        getLocGovCd(params.ctpvCd).then((itemArr) => {
            setLocgovCdItems(itemArr)
            setParams((prev) => ({ ...prev, locgovCd: itemArr[0].value })) // 첫번째 아이템으로 기본값 설정
        })
    }
  }, [params.ctpvCd])

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
      if (!params.locgovCd) {
        alert("지자체를 선택해주세요.")
        return;
      }

      if (!params.searchStDate || !params.searchEdDate) {
        alert("청구년월을 입력해주세요.");
        return;
      }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/cal/byvsr/tx/getAllByveSbsidyRqest?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&clclnLocgovCd=' + params.locgovCd : ''}` +
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` + 
        `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}` + 
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` + 
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` + 
        `${params.crdcoCd ? '&crdcoCd=' + params.crdcoCd : ''}`
        

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

  const excelDownload = async () => {
    if (!params.locgovCd) {
      alert("지자체를 선택해주세요.");
      return;
    }

    if (!params.searchStDate || !params.searchEdDate) {
      alert("청구년월을 입력해주세요.");
      return;
    }

    let endpoint: string =
        `/fsm/cal/byvsr/tx/getExcelAllByveSbsidyRqest?`+
        `${params.locgovCd ? '&clclnLocgovCd=' + params.locgovCd : ''}` + 
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` + 
        `${params.searchEdDate ? 'endDt=' + formatDate(params.searchEdDate) : ''}`
        
    getExcelFile(endpoint, BCrumb[BCrumb.length - 1].title + "_" + getToday() + ".xlsx")
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
      title="차량별 청구내역 집계현황"
      description="차량별 청구내역 집계현황"
    >
      {/* breadcrumb */}
      <Breadcrumb title="차량별 청구내역 집계현황" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
                <CustomFormLabel className="input-label-display" htmlFor="ft-select-01">
                    <span className="required-text">*</span>시도명
                </CustomFormLabel>
                <select
                    id="ft-select-01"
                    className="custom-default-select"
                    name="ctpvCd"
                    value={params.ctpvCd}
                    onChange={handleSearchChange}
                    style={{ width: '100%' }}
                >
                    {ctpvCdItems.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <CustomFormLabel className="input-label-display" htmlFor="ft-select-02">
                    <span className="required-text">*</span>관할관청
                </CustomFormLabel>
                <select
                    id="ft-select-02"
                    className="custom-default-select"
                    name="locgovCd"
                    value={params.locgovCd}
                    onChange={handleSearchChange}
                    style={{ width: '100%' }}
                >
                    {locgovCdItems.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                청구년월
              </CustomFormLabel>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                청구년월
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-end"
              >
                청구년월
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-select-03"
              >
                카드사 구분
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="crdcoCd"
                value={params.crdcoCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {crdcoCdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
        </div><hr></hr>
        <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                사업자등록번호
              </CustomFormLabel>
              <CustomTextField name="brno" value={params.brno} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-select-04"
              >
                유종
              </CustomFormLabel>
              <select
                id="ft-select-04"
                className="custom-default-select"
                name="koiCd"
                value={params.koiCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {koicdItems.map((option) => (
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
            onRowClick={() => {}} // 행 클릭 핸들러 추가
            onPaginationModelChange={handlePaginationModelChange} // 페이지, 사이즈 변경 핸들러
            onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
            pageable={pageable} // 현재 페이지 / 사이즈 정보
        />
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
