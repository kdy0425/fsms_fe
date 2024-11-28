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

import TableDataGrid from './_components/TableDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import { SelectItem } from 'select'
import { getCityCodes, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import DetailReportDataGrid from './_components/DetailReportDataGrid'
import BrnoDetailDataGrid from './_components/DetailScrcarCarDataGrid'
import DetailScrcarCarDataGrid from './_components/DetailScrcarCarDataGrid'
import DetailRentalDataGrid from './_components/DetailRentalDataGrid'
// import ModalContent from './_components/ModalContent'

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
    to: '/stn/rs',
    title: '화물 대폐차신고조회',
  },
]



const cityData = [
  {
    value: 'seoul',
    label: '서울',
  },
  {
    value: 'gyeonggi',
    label: '경기',
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
  // 유종, 지역명, 고시기준일, 고시단가(원), 상태
  {
    id: 'flnm',
    numeric: false,
    disablePadding: false,
    label: '성명(법인명)',
  },
  {
    id: 'bizKndCdNm',
    numeric: false,
    disablePadding: false,
    label: '사업종류',
  },
  {
    id: 'scrapPeriodYmd',
    numeric: false,
    disablePadding: false,
    label: '대폐차기간',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  { 
    id: 'acceptCdNm',       // 아직 확실하지 않음.
    numeric: false,
    disablePadding: false,
    label: '처리결과',
  },
]

/**
 *   {
        "koiCd": 경유 / LPG
        "cityName": "서울"
        "crtrAplcnYmd": "20090601",
        "crtrPrice": "1,500,00",
        "status": "전송" 
    }
 * 
 */

    export interface Row {
      locgovCd?: string; // 시도명+관할관청
      vhclNo?: string; // 차량번호
      bgngAplcnYmd?: string; // 시작일자
      endAplcnYmd?: string; // 종료일자
      flnm?: string; // 성명
      rprNo?: string  // 수리번호 

      //vhclNo?: string; // 차량번호
      vin?: string; // 차대번호
      //flnm?: string; // 성명
      crno?: string; // 법인등록번호(원본)
      crnoS?: string; // 법인등록번호(복호화)
      partAddr?: string; // 주소
      part1Addr?: string; // 부분1주소
      part2Addr?: string; // 부분2주소
      zip?: string; // 우편번호
      telno?: string; // 전화번호
      bizKndCdNm?: string; // 사업종류
      carmdlCdNm?: string; // 차종
      typeCdNm?: string; // 유형
      detailTypeCdNm?: string; // 세부유형명
      vhclCdNm?: string; // 차량코드명
      vhclDtlCdNm?: string; // 차량상세코드명
      yridnw?: string; // 연식
      maxLoadQty?: string; // 최대적재수량
      scrcarTotlWt?: string; // 총중량
      frstDclrYmd?: string; // 최초신고일자
      acceptCdNm?: string; // 수리코드명
      rprDt?: string; // 수리일시
      //rprNo?: string; // 수리번호
      acceptYn?: string; // 수리 여부
      frstRptpEndYmd?: string; // 최초보고서종료일자
      rgtrId?: string; // 등록자아이디
      regDt?: string; // 등록일자
      mdfrId?: string; // 수정자아이디
      mdfcnDt?: string; // 수정일자
      locgovNm?: string; // 지자체명
      histCnt?: string; // 순번
      scrapPeriodYmd?: string; // 대폐차기간
      vhclNm?: string; // 차량명
      vonrBrno?: string; // 차주사업자등록번호
      cosiNm?: string; // 위수탁명

      scrcarCarmdlCd?: string; // 폐차차종코드
      scrcarCarmdlCdNm?: string; // 폐차차종코드명
      scrcarTypeCd?: string; // 폐차유형코드
      scrcarTypeCdNm?: string; // 폐차유형코드명
      scrcarDetailTypeCd?: string; // 폐차세부유형코드
      scrcarDetailTypeCdNm?: string; // 폐차세부유형코드명
      scrcarVhclCd?: string; // 폐차차량코드
      scrcarVhclCdNm?: string; // 폐차차량코드명
      scrcarVhclDtlCd?: string; // 폐차차량상세코드
      scrcarVhclDtlCdNm?: string; // 폐차차량상세코드명
      scrcarVhclNm?: string; // 폐차차량명
      scrcarVin?: string; // 폐차차대번호
      scrcarYridnw?: string; // 폐차연식
      scrcarMaxLoadQty?: string; // 폐차최대적재수량
      scrcarScrcarTotlWt?: string; // 폐차 총중량
    }
    

const rowData: Row[] = [

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

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);  // 선택된 Row를 저장할 state

  const [cityCode, setCityCode] = useState<SelectItem[]>([])          //        시도 코드
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([])  // 관할관청 코드

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

  const [city, setCity] = useState('전체')
  const [fuel, setFuel] = useState('경유')
  const [date, setDate] = useState('2024-10-15')

  const handleCityChange = (event: any) => {
    setCity(event.target.value)
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

    // 시도가 정해지면 관할관청도 특정한다.
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
        `/fsm/stn/rs/tr/roscSttemnt?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
        `${params.searchStDate ? '&pstgBgngYmd=' + params.searchStDate : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.bgngAplcnYmd ? '&bgngAplcnYmd=' + (params.bgngAplcnYmd+'').replace(/-/g, "") : ''}` +
        `${params.endAplcnYmd ? '&endAplcnYmd=' + (params.endAplcnYmd+'').replace(/-/g, ""): ''}` +
        `${params.rprNo ? '&rprNo=' + params.rprNo : ''}` +
        `${params.flnm ? '&flnm=' + params.flnm : ''}`



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


  
  // Fetch를 통해 데이터 갱신
  const fetchOutputData = async () => {
    if(selectedRow == undefined){
      alert('출력할 대상이 없습니다..')
      return;
    }
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/stn/rs/tr/roscSttemntReport?` +
        `${selectedRow.vhclNo ? '&vhclNo=' + selectedRow.vhclNo : ''}` 

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시

       
      } else {
        // 데이터가 없거나 실패
        alert('출력할 대상이 없습니다..')

      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
  
    } finally {
    }
  }



  const excelDownload = async () => {

    try {
      let endpoint: string =
      `/fsm/stn/rs/tr/getExcelRoscSttemnt?page=${params.page - 1}&size=${params.size}` +
      `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
      `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
      `${params.searchStDate ? '&pstgBgngYmd=' + params.searchStDate : ''}` +
      `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.bgngAplcnYmd ? '&bgngAplcnYmd=' + (params.bgngAplcnYmd+'').replace(/-/g, "") : ''}` +
      `${params.endAplcnYmd ? '&endAplcnYmd=' + (params.endAplcnYmd+'').replace(/-/g, ""): ''}` +
      `${params.rprNo ? '&rprNo=' + params.rprNo : ''}` +
      `${params.flnm ? '&flnm=' + params.flnm : ''}`
      

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
  const handleRowClick = (selectedRow: Row) => {
    setSelectedRow(selectedRow);
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
    if (name === 'bgngAplcnYmd' || name === 'endAplcnYmd') {
      const otherDateField =
        name === 'bgngAplcnYmd' ? 'endAplcnYmd' : 'bgngAplcnYmd'
      const otherDate = params[otherDateField]

      if (isValidDateRange(name, value, otherDate as string)) {
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

    if (changedField === 'bgngAplcnYmd') {
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
      title="지역별 고시유가관리"
      description="지역별 고시유가관리"
    >
      {/* breadcrumb */}
      <Breadcrumb title="지역별 고시유가관리" items={BCrumb} />
      {/* end breadcrumb */}

       {/* 검색영역 시작 */}
       <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
                <CustomFormLabel className="input-label-display" htmlFor="ft-ton1">
                <span className="required-text" >*</span>시도명
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  name="ctpvCd"
                  value={params.ctpvCd ?? ''}
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
                  htmlFor="ft-fuel"
                >
                  <span className="required-text" >*</span>관할관청
                </CustomFormLabel>
                <select
                  id="ft-fuel-select-02"
                  className="custom-default-select"
                  name="locgovCd"
                  value={params.locgovCd ?? ''}
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
                  <CustomTextField
                    id="ft-vhclNo"
                    placeholder=""
                    fullWidth
                    name="vhclNo"
                    value={params.vhclNo ?? ''} // 빈 문자열로 초기화
                    onChange={handleSearchChange}
                  />
              </div>
          
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group">
                <CustomFormLabel className="input-label-display">
                기간
                </CustomFormLabel>
                <CustomFormLabel
                  className="input-label-none"
                  htmlFor="ft-date-start"
                >
                  시작일
                </CustomFormLabel>
                <CustomTextField
                  type="date"
                  id="ft-date-start"
                  name="bgngAplcnYmd"
                  value={params.bgngAplcnYmd ?? ''}
                  onChange={handleSearchChange}
                  fullWidth
                />
                ~
                <CustomFormLabel
                  className="input-label-none"
                  htmlFor="ft-date-end"
                >
                  종료일
                </CustomFormLabel>
                <CustomTextField
                  type="date"
                  id="ft-date-end"
                  name="endAplcnYmd"
                  value={params.endAplcnYmd ?? ''}
                  onChange={handleSearchChange}
                  fullWidth
                />
            </div>
    
            <div className="form-group">
                  <CustomFormLabel
                    className="input-label-display"
                    htmlFor="ft-flnm"
                  >
                    성명
                  </CustomFormLabel>
                  <CustomTextField
                    id="ft-flnm"
                    placeholder=""
                    fullWidth
                    name="flnm"
                    value={params.flnm ?? ''}
                    onChange={handleSearchChange}
                  />
            </div>  
            <div className="form-group">
                  <CustomFormLabel
                    className="input-label-display"
                    htmlFor="ft-rprNo"
                  >
                    발급번호
                  </CustomFormLabel>
                  <CustomTextField
                    id="ft-rprNo"
                    placeholder=""
                    fullWidth
                    name="rprNo"
                    value={params.rprNo ?? ''}
                    onChange={handleSearchChange}
                  />
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
          <Button onClick={()=> fetchOutputData()} variant="contained" color="primary">
            출력
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
      {/* 테이블영역 끝 */}
      </Box>
      {/* <Box className="table-bottom-button-group">
          <div className="button-right-align">
              <Button variant="contained" color="primary"
              onClick={handleWriteClick}
              >
                등록
              </Button>
          </div>
      </Box> */}

        <DetailReportDataGrid
            row={selectedRow as Row} // 목록 데이터
        />
            <DetailScrcarCarDataGrid
            row={selectedRow as Row} // 목록 데이터
        />
            <DetailRentalDataGrid
            row={selectedRow as Row} // 목록 데이터
        />

    </PageContainer>
  )
}

export default DataList
