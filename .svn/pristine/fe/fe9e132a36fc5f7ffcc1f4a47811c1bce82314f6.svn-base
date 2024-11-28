'use client'
import {
  Box,
  Button
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

import TableDataGrid from './_components/TableDataGrid'

// types
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { SelectItem } from 'select'
import { HeadCell } from 'table'
import FormModal from './_components/FormModal'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '시스템관리',
  },
  {
    title: '시스템일반',
  },
  {
    to: '/sym/sra',
    title: '보조금입금계좌관리',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'dataSeNm',
    numeric: false,
    disablePadding: false,
    label: '업종구분',
  },
  {
    id: 'ctpvNm',
    numeric: false,
    disablePadding: false,
    label: '시도명',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'crdcoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'bankNm',
    numeric: false,
    disablePadding: false,
    label: '거래은행',
  },
  {
    id: 'actno',
    numeric: false,
    disablePadding: false,
    label: '계좌번호',
  },
]
export interface Row {
  dataSeCd?: string; // 업종구분코드
  locgovCd?: string; // 관할관청코드
  crdcoCd?: string; // 카드사코드
  crdcoNm?: string; // 카드사명
  actno?: string; // 계좌번호
  bankCd?: string; // 거래은행코드
  delYn?: string; // 삭제여부
  ctpvCd?: string; // 시도코드
  ctpvNm?: string; // 시도명
  locgovNm?: string; // 관할관청명
  bankNm?: string; // 거래은행명
  dataSeNm?: string; // 업종구분명
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
  locgovCd: string
  locgovNm: string
  dataSeCd: string
  dataSeNm: string  
  [key: string]: string | number | undefined // 인덱스 시그니처 추가
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
    locgovCd: '',
    locgovNm: '',
    dataSeCd: '',
    dataSeNm: '',
    ctpvCd:'',
    ctpvNm:''
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  const [cityCode, setCityCode] = useState<SelectItem[]>([])
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([])
  const [dataSeCode, setDataSeCode] = useState<SelectItem[]>([]);
  const [cardCode, setCardCode] = useState<SelectItem[]>([]);
  const [bankCode, setBankCode] = useState<SelectItem[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<Row>({});
  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    // setFlag(!flag)
     // select item setting //

    // 시도명 select item setting
    getCityCodes().then((res) => {
      let cityCodes: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ]

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['ctpvCd'],
          }

          cityCodes.push(item)
        })
        setCityCode(cityCodes)
      }
    })

    // 관할관청 select item setting
    getLocalGovCodes().then((res) => {
      let locgovCodes: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ]

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['locgovCd'],
          }

          locgovCodes.push(item)
        })
        setLocalGovCode(locgovCodes)
      }
    })

    // 업종구분 select item setting cdGroupNm 086
    getCodesByGroupNm("086").then((res) => {
      let dataSeCodes: SelectItem[] = []

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          dataSeCodes.push(item)
        })
        setDataSeCode(dataSeCodes)
      }
    })
   
    // 카드사구분 select item setting cdGroupNm 023
    getCodesByGroupNm("023").then((res) => {
      let cardCodes: SelectItem[] = [];

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          cardCodes.push(item)
        })
        setCardCode(cardCodes);
      }
    })

    // 은행구분 select item setting cdGroupNm 023
    getCodesByGroupNm("973").then((res) => {
      let bankCodes: SelectItem[] = [];

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          bankCodes.push(item)
        })

        setBankCode(bankCodes);
      }
    })
  }, [])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

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
        setLocalGovCode(locgovCodes)
      }
    })
  }, [params.ctpvCd])

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
        `/fsm/sym/sra/cm/getAllSbsidyRcpmnyAcnut?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.dataSeCd ? '&dataSeCd=' + params.dataSeCd : ''}`;

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


  useEffect(() => {
    if(!open){
      setDetailData({});
    }
  }, [open])
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
  const handleRowClick = (data: Row) => {
    setOpen(true);
    setDetailData(data);
  }

  // 페이지 이동 감지 종료 //

  // 시작일과 종료일 비교 후 일자 변경
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target

    const element = event.target as HTMLSelectElement
    const selectedIndex = element.selectedIndex;
    const options = element.options;

    if(name === 'ctpvCd') {
      setParams({...params, ctpvNm: options[selectedIndex].text})
    }
    
    if(name === 'locgovCd') {
      setParams({...params, locgovNm: options[selectedIndex].text});
    }

    if(name === 'dataSeCd') {
      setParams({...params, dataSeNm: options[selectedIndex].text});
    }

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
    <PageContainer title="보조금입금계좌관리" description="보조금입금계좌관리">
      {/* breadcrumb */}
      <Breadcrumb title="보조금입금계좌관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
              <span className="required-text" >*</span>시도
              </CustomFormLabel>
              <select
                id="search-select-ctpvCd"
                className="custom-default-select"
                name="ctpvCd"
                value={params.ctpvCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {cityCode.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                <span className="required-text" >*</span>관할관청
              </CustomFormLabel>
              <select
                id="search-select-locgovCd"
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
              <CustomFormLabel className="input-label-display">
              <span className="required-text" >*</span>업종구분
              </CustomFormLabel>
              <select
                id="search-select-dataSeCd"
                className="custom-default-select"
                name="dataSeCd"
                value={params.dataSeCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                 {dataSeCode.map((option) => (
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
            <Button variant="contained" type="submit" color="primary">
              조회
            </Button>
            <FormModal
              size={'lg'}
              buttonLabel="신규"
              title="보조금계좌정보"
              isOpen={open}
              setOpen={setOpen}
              locgovCode={localGovCode}
              dataSeCode={dataSeCode}
              cardCode={cardCode}
              bankCode={bankCode}
              data={detailData}
            />
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
