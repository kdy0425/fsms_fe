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
    to: '/stn/osi',
    title: '화물 운행정지 정보',
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
  locgovCd?: string // 시도명+관할관청
  vhclNo?: string // 차량번호
  csdyDataSn?: string // 영치자료일련번호
  inptSeCd?: string // 입력구분코드
  inptSeCdNm?: string // 입력구분
  csdyRegSeCd?: string // 영치등록구분코드
  csdyRegSeCdNm?: string // 영치등록구분
  csdyRegRsnCdCn?: string // 영치등록사유
  csdyRegRmvYmd?: string // 영치등록/해제일자
  regDt?: string // 등록일자
  mdfcnDt?: string // 수정일자
  locgovNm?: string // 지자체명
  totalLocgovNm?: string // 지자체명
  hstrySn?: string // 이력순번
  dlngYm?: string // 거래년월
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
  const [isModalOpen, setIsModalOpen] = useState(false);    // modal   오픈 상태 

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
              label: code['ctpvNm'],
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
        `/fsm/stn/rnci/tr/regNopltCsdyInfo?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` 


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

    try {
      let endpoint: string =
      `/fsm/stn/rnci/tr/getExcelRegNopltCsdyInfo?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` 
      

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'test.xlsx');
      document.body.appendChild(link);
      link.click();
      // if (response && response.resultType === 'success' && response.data) {
      //   // 데이터 조회 성공시
        
      // } else {
      //   // 데이터가 없거나 실패
  
      // }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows([])
      setTotalRows(0)
    }
  }



  const excelHisDownload = async () => {
    if(selectedRow == undefined){
      return;
    }
    try {
      let endpoint: string =
      `/fsm/stn/rnci/tr/getExcelRegNopltCsdyHst?` +
        `${selectedRow.locgovCd ? '&locgovCd=' + selectedRow.locgovCd : ''}` +
        `${selectedRow.vhclNo ? '&vhclNo=' + selectedRow.vhclNo : ''}` 
      

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'test.xlsx');
      document.body.appendChild(link);
      link.click();
      // if (response && response.resultType === 'success' && response.data) {
      //   // 데이터 조회 성공시
        
      // } else {
      //   // 데이터가 없거나 실패
  
      // }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows([])
      setTotalRows(0)
    }
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
        `/fsm/stn/rnci/tr/regNopltCsdyHst?` +
        `${selectedRow.locgovCd ? '&locgovCd=' + selectedRow.locgovCd : ''}` +
        `${selectedRow.vhclNo ? '&vhclNo=' + selectedRow.vhclNo : ''}` 
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시

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
    <PageContainer title="화물 등록번호판영치 정보" description="차량휴지관리 페이지">
      {/* breadcrumb */}
      <Breadcrumb title="화물 등록번호판영치 정보" items={BCrumb} />
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
                value={params.vhclNo}
                onChange={handleSearchChange}  type="text" id="ft-vhclNo" fullWidth />
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
            {/* 
            <Button variant="contained" color="primary">
              수정
            </Button>
            <Button variant="contained" color="primary">
              삭제
            </Button> */}
    

            {/* locgovCd
            brno
            dlngYm
            vhclSeCd
            koiCd
            lbrctStleCd */}

      
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
