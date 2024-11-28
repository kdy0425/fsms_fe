'use client'
import {
  Box,
  Button,
  FormControlLabel,
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

import TableDataGrid from './_components/TableDataGrid'

// types
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import { SelectItem } from 'select'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import DetailDataGrid from './_components/DetailDataGrid'
import { formatDate } from '@/utils/fsms/common/convert'
import { getCtpvCd, getExcelFile, getLocGovCd, getToday } from '@/utils/fsms/common/comm'

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
    to: '/stn/di',
    title: '화물 운전면허정보',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'inptSeCdNm',
    numeric: false,
    disablePadding: false,
    label: '입력구분',
  },
  {
    id: 'csdyRegSeCd',
    numeric: false,
    disablePadding: false,
    label: '영치등록구분',
  },
  {
    id: 'csdyRegRsnCdCn',
    numeric: false,
    disablePadding: false,
    label: '영치등록사유',
  },
  {
    id: 'csdyRegRmvYmd',
    numeric: false,
    disablePadding: false,
    label: '영치등록/해제일자',
  },
  {
    id: 'regDt',
    numeric: false,
    disablePadding: false,
    label: '등록일자',
  },
  {
    id: 'mdfcnDt',
    numeric: false,
    disablePadding: false,
    label: '수정일자',
  },
]

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  searchValue: string
  searchSelect: string
  bgngDt: string
  endDt: string
  [key: string]: string | number // 인덱스 시그니처 추가
}



export interface Row {
  locgovCd?: string; // 시도명+관할관청
  vhclNo?: string; // 차량번호
  vonrRrno?: string; // 주민등록번호(원본)
  vonrRrnoS?: string; // 주민등록번호(별표)
  vonrNm?: string; // 소유자명
  vhclPsnCd?: string; // 소유구분
  vhclSttsCdNm?: string; // 차량상태
  carRegDt?: string; // 차량등록일자
  driverVonrNm?: string; // 운전자명
  driverVonrRrno?: string; // 운전자주민등록번호(원본)
  driverVonrRrnoS?: string; // 운전자주민등록번호(별표)
  ctrtBgngYmd?: string; // 계약시작일
  ctrtEndYmd?: string; // 계약종료일
  TELNO?: string; // 연락처
  driverRegDt?: string; // 운전자등록일자
  psnSeCdNm?: string; // 면허보유여부
  stopBgngYmd?: string; // 정지시작일자
  stopEndYmd?: string; // 정지종료일자
  rtrcnYmd?: string; // 취소일자
  knpaRgtrId?: string; // 등록자아이디
  knpaRegDt?: string; // 등록일자
  knpaMdfrId?: string; // 수정자아이디
  knpaMdfcnDt?: string; // 수정일자
  hstrySn?: string; // 순번
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
  const [historyflag, setHistoryFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정


  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  const [historyLoading, setHistoryLoading] = useState(false) // 로딩여부


  const [cityCode, setCityCode] = useState<SelectItem[]>([])  //        시도 코드
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([]) // 관할관청 코드

  
  const [selectedRow, setSelectedRow] = useState<Row>();  // 선택된 Row를 저장할 state
  const [historyRows, setHistoryRows] = useState<Row[]>([]);  // 거래내역에 대한 Row



    // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
    const [params, setParams] = useState<listSearchObj>({
      page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
      size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
      searchValue: allParams.searchValue ?? '', // 검색어
      searchSelect: allParams.searchSelect ?? 'ttl', // 종류
      bgngDt: String(allParams.bgngDt ?? ''), // 시작일
      endDt: String(allParams.endDt ?? ''), // 종료일
      sort: allParams.sort ?? '', // 정렬 기준 추가
    })
    //
    const [pageable, setPageable] = useState<pageable>({
      pageNumber: 1, // 페이지 번호는 1부터 시작
      pageSize: 10, // 기본 페이지 사이즈 설정
      sort: '', // 정렬 기준
    })

    // 초기 데이터 로드
    useEffect(() => {
      setFlag(!flag)
  

      getCtpvCd().then((itemArr) => {
        setCityCode(itemArr);
        setParams((prev) => ({...prev, ctpvCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
      })// 시도코드 
    }, [])

          // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if(selectedRow !== undefined){
    fetchhistoryData()
    }
  }, [historyflag])

      // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 조건 검색 변환 매칭
  const sortChange = (sort: String): String => {
    if (sort && sort != '') {
      let [field, sortOrder] = sort.split(',') // field와 sortOrder 분리하여 매칭
      if (field === 'regYmd') field = 'regDt' // DB -> regDt // DTO -> regYmd ==> 매칭 작업
      return field + ',' + sortOrder
    }
    return ''
  }



  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/stn/di/tr/drliInfo?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.vonrRrno ? '&vhclNo=' + params.vonrRrno : ''}` 

      console.log(endpoint)
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시

        setRows(response.data.content)
        console.log(response.data.content)

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
    let endpoint: string =
      `/fsm/stn/tr/getExcelDrliInfoTr?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.vonrRrno ? '&vhclNo=' + params.vonrRrno : ''}` 
      
        getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_'+getToday()+'.xlsx')
      }

  
  // Fetch를 통해 데이터 갱신
  const fetchhistoryData = async () => {
    if(selectedRow == undefined){
      return;
    }
    setHistoryLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/stn/di/tr/drliHst?` +
        `${selectedRow.vonrRrno ? '&vonrRrno=' + selectedRow.vonrRrno : selectedRow.driverVonrRrno}` 



        console.log('his end ',endpoint)

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        console.log(response)
        setHistoryRows(response.data.content)
        
      } else {
        setHistoryRows([])
      }
    } catch (error) {
      // 에러시
      setHistoryRows([])
      console.error('Error fetching data:', error)
    } finally {
      setHistoryLoading(false)
    }
  }


  const excelHisDownload = async () => {
    if(selectedRow == undefined){
      return;
    }
      let endpoint: string =
      `/fsm/stn/di/tr/getExcelDrliHstTr?` +
      `${selectedRow.vonrRrno ? '&vonrRrno=' + selectedRow.vonrRrno : selectedRow.driverVonrRrno}` 

      getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_이력'+getToday()+'.xlsx')
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
  const handleRowClick = (selectedRow: Row) => {
    setSelectedRow(selectedRow);
    setHistoryFlag((prev)=> !prev)

  }

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])



    // 관할관청 select item setting
    useEffect(() => { // 시도 코드 변경시 관할관청 재조회
      // 관할관청
      if(params.ctpvCd) {
        getLocGovCd(params.ctpvCd).then((itemArr) => {
          setLocalGovCode(itemArr);
          // setParams((prev) => ({...prev, locgovCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
        })
      }
    }, [params.ctpvCd])
  

  
  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
  }

     // 시작일과 종료일 비교 후 일자 변경
    const handleSearchChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
  
      const { name, value } = event.target
  
      if (name === 'bgngDt' || name === 'endDt') {
        const otherDateField =
          name === 'bgngDt' ? 'endDt' : 'bgngDt'
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
  
      if (changedField === 'bgngDt') {
        return changedDate <= otherDate
      } else {
        return changedDate >= otherDate
      }
    }
  



  return (
    <PageContainer title="화물 운전면허정보" description="차량휴지관리 페이지">
      {/* breadcrumb */}
      <Breadcrumb title="화물 운전면허정보" items={BCrumb} />
      {/* end breadcrumb */}

            {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ctpvCd">
              <span className="required-text" >*</span>시도명
              </CustomFormLabel>
              <select
                id="ft-ctpvCd"
                className="custom-default-select"
                name="ctpvCd"
                value={params.ctpvCd}
                onChange={handleSearchChange}
                style={{ width: '70%' }}
              >
                {cityCode.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-locgovCd"
              >
                <span className="required-text" >*</span>관할관청
              </CustomFormLabel>
              <select
                id="ft-locgovCd"
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
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-vhclNo"
              >
                차량번호
              </CustomFormLabel>
              <CustomTextField  name="vhclNo"
                value={params.vhclNo ?? ''}
                onChange={handleSearchChange}  type="text" id="ft-vhclNo" fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-vonrRrno"
              >
                주민등록번호
              </CustomFormLabel>
              <CustomTextField  name="vonrRrno"
                value={params.vonrRrno ?? ''}
                onChange={handleSearchChange}  type="text" id="ft-vonrRrno" fullWidth />
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button type="submit" variant="contained" color="primary">
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
          headCells={headCells}
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

      {/* 상세 영역 시작 */}
        <DetailDataGrid  
        rows={historyRows} 
        excelHisDownload={excelHisDownload}
        loading={historyLoading} />
      {/* 상세 영역 끝 */}
    </PageContainer>
  )
}

export default DataList
