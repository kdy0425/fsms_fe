'use client'
import {
  Box,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpFileRequest, sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import TableDataGrid from '@/app/components/tables/CommDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell, Pageable  } from 'table'
import { getCtpvCd, getCommCd, getLocGovCd, getDateRange, isValidDateRange, sortChange, getExcelFile, getToday} from '@/utils/fsms/common/comm'
import { SelectItem } from 'select'
import TxDetail from './TxDetail'

import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'

const headCells: HeadCell[] = [
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
    format: 'brno',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'bizSttsNm',
    numeric: false,
    disablePadding: false,
    label: '사업자상태',
  },
  {
    id: 'ntsChgYmd',
    numeric: false,
    disablePadding: false,
    label: '국세청 변경일자',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'bzmnSeNm',
    numeric: false,
    disablePadding: false,
    label: '개인/법인구분',
  },
  {
    id: 'dscntNm',
    numeric: false,
    disablePadding: false,
    label: '차량할인여부',
  },
  {
    id: 'vhclSttsNm',
    numeric: false,
    disablePadding: false,
    label: '차량상태',
  },
]

export interface Row {
  vhclNo:string //차량번호
  brno:string //사업자등록번호
  bzentyNm:string //업체명
  koiCd:string //유종
  bzmnSeCd:string //사업자구분
  dscntYn:string //차량할인여부
  carSts:string //차량상태
  locgovCd:string //지자체코드
  ersrYmd:string //말소일자
  ersrRsnCd:string //말소코드
  rgtrId:string //등록자ID
  regDt:string //등록일자
  mdfrId:string //수정자ID
  mdfcnDt:string //수정일자
  currPossYn:string //최근차량상태
  sttsCd:string //사업자 상태코드
  txtnTypeCd:string //과세구분코드
  ntsChgYmd:string //국세청 변경일자
  ntsDclrYmd:string //국세청 신고일자
  bizSttsNm:string //사업자 상태명
  vhclSttsNm:string //차량상태명
  bzmnSeNm:string //사업자구분명
  dscntNm:string //차량할인여부
  ersrRsnNm:string //말소사유명
}

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  searchStDate: string
  searchEdDate: string
  [key: string]: string | number // 인덱스 시그니처 추가
}


const BsPage = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [dtFlag, setDtFlag] = useState<boolean>(false) // 전체날짜조회를 위한 플래그
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  const [selectedRow, setSelectedRow] = useState<Row | null>() // 클릭로우

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [sttsCdItems, setSttsCdItems] = useState<SelectItem[]>([]); // 차량상태 코드

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

  const [pageable, setPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

    const dateRange = getDateRange('d', 30);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))

    getCtpvCd().then((itemArr) => {
      setCtpvCdItems(itemArr);
      if(itemArr.length >0) setParams((prev) => ({...prev, ctpvCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
    })// 시도코드 

    getCommCd('CTS0', '전체').then((itemArr) => setSttsCdItems(itemArr))// 차량상태 코드
    
  }, [])

  useEffect(() => { // 시도 코드 변경시 관할관청 재조회
    // 관할관청
    if(params.ctpvCd) {
      getLocGovCd(params.ctpvCd).then((itemArr) => {
        setLocgovCdItems(itemArr);
        setParams((prev) => ({...prev, locgovCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
      })
    }
  }, [params.ctpvCd])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setSelectedRow(null);
    setLoading(true)
    try {
      if(!params.ctpvCd) {
        alert("시도명을 선택해주세요.");
        return;
      }

      if(!params.locgovCd) {
        alert("관할관청을 선택해주세요.");
        return;
      }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/stn/vem/tx/getAllVhcleErsrMng?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`+
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.bzentyNm ? '&bzentyNm=' + params.bzentyNm : ''}` +
        `${params.sttsCd ? '&sttsCd=' + params.sttsCd : ''}`

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
    let endpoint: string =
    `/fsm/stn/vem/tx/getExcelVhcleErsrMng?` +
    `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
    `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`+
    `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
    `${params.brno ? '&brno=' + params.brno : ''}` +
    `${params.bzentyNm ? '&bzentyNm=' + params.bzentyNm : ''}` +
    `${params.sttsCd ? '&sttsCd=' + params.sttsCd : ''}`

    getExcelFile(endpoint, '차량말소관리_'+getToday()+'.xlsx')
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
  }// 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (row: Row) => {
    setSelectedRow(row)
  }
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Box>
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-01">
                <span className="required-text" >*</span>시도명
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
                <span className="required-text" >*</span>관할관청
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
                사업자번호
              </CustomFormLabel>
              <CustomTextField name="brno" value={params.brno} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
          <hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                업체명
              </CustomFormLabel>
              <CustomTextField name="bzentyNm" value={params.bzentyNm} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-02">
                차량상태
              </CustomFormLabel>
              <select
                id="ft-select-02"
                className="custom-default-select"
                name="sttsCd"
                value={params.sttsCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {sttsCdItems.map((option) => (
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
            <Button onClick={() => fetchData()} variant="contained" color="primary">
              신규
            </Button>
            <Button onClick={() => fetchData()} variant="contained" color="primary">
              수정
            </Button>
            <Button onClick={() => excelDownload()} variant="contained" color="primary">
              엑셀
            </Button>
          </div>
        </Box>
      </Box>
      {/* 검색영역 끝 */}

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
          paging={true}
          cursor={true}
        />
      </Box>
      {/* 테이블영역 끝 */}
      {selectedRow &&
        <>
          <CustomFormLabel className="input-label-display"><h3>상세정보</h3></CustomFormLabel>
          <TxDetail data={selectedRow} />
        </>
      }
    </Box>
  )
}

export default BsPage
