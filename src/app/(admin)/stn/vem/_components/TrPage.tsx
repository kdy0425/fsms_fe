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
import TrDetail from './TrDetail'

const headCells: HeadCell[] = [
  {
    id: 'aplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '처리일자',
    format: 'yyyymmdd',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'exsVonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'exsVonrRrnoSecure',
    numeric: false,
    disablePadding: false,
    label: '주민등록번호',
  },
  {
    id: 'exsVonrBrno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
    format: 'brno',
  },
  {
    id: 'exsVhclPsnNm',
    numeric: false,
    disablePadding: false,
    label: '소유구분',
  },
  {
    id: 'vhclSttsNm',
    numeric: false,
    disablePadding: false,
    label: '현재차량상태',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '처리관할관청',
  },
  {
    id: 'chgRsnNm',
    numeric: false,
    disablePadding: false,
    label: '처리구분',
  },
]

export interface Row {
  vhclNo:string //차량번호
  aplcnYmd:string //처리일자
  exsCrno:string //법인등록번호(원본)
  exsCrnoS:string //법인등록번호(암호화)
  exsVonrRrno:string //주민등록번호(원본)
  exsVonrRrnoSecure:string //주민등록번호(별표)
  exsVonrNm:string //소유자명
  exsVonrBrno:string //사업자등록번호
  exsVhclPsnCd:string //소유구분코드
  exsVhclPsnNm:string //소유구분
  chgRsnCd:string //처리구분코드
  chgRsnNm:string //처리구분
  chgRsnCn:string //사유
  rgtrId:string //등록자아이디
  regDt:string //등록일시
  mdfrId:string //수정자아이디
  mdfcnDt:string //수정일시
  trsmYn:string //전송여부
  vonrSn:string //차량소유자일련번호
  vhclSttsCd:string //차량상태코드
  vhclSttsNm:string //차량상태
  locgovCd:string //관할관청
  locgovNm:string //관할관청
  vonrNm:string //차량 소유자명
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


const TrPage = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  const [selectedRow, setSelectedRow] = useState<Row | null>() // 클릭로우

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [chgRsnCdItems, setChgRsnCdItems] = useState<SelectItem[]>([]); // 처리구분 코드

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

    getCommCd('035', '전체').then((itemArr) => setChgRsnCdItems(itemArr))// 처리구분코드
    
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

      if(!params.searchStDate || !params.searchEdDate) {
        alert("말소일자를 입력해주세요.");
        return;
      }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/stn/vem/tr/getAllVhcleErsrMng?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate : ''}`+
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`+
        `${params.vonrNm ? '&vonrNm=' + params.vonrNm : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.chgRsnCd ? '&chgRsnCd=' + params.chgRsnCd : ''}`

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
    `/fsm/stn/vem/tr/getExcelVhcleErsrMng?` +
    `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
    `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
    `${params.searchStDate ? '&bgngDt=' + params.searchStDate : ''}` +
    `${params.searchEdDate ? '&endDt=' + params.searchEdDate : ''}`+
    `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`+
    `${params.vonrNm ? '&vonrNm=' + params.vonrNm : ''}` +
    `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
    `${params.chgRsnCd ? '&chgRsnCd=' + params.chgRsnCd : ''}`

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
                차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                소유자명
              </CustomFormLabel>
              <CustomTextField name="vonrNm" value={params.vonrNm} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
          <hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                말소일자
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">말소일자 시작</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~ 
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">말소일자 종료</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-02">
                처리구분
              </CustomFormLabel>
              <select
                id="ft-select-02"
                className="custom-default-select"
                name="koiCd"
                value={params.koiCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {chgRsnCdItems.map((option) => (
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
          <TrDetail data={selectedRow} />
        </>
      }
    </Box>
  )
}

export default TrPage
