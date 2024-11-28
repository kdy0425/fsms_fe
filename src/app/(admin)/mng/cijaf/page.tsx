'use client'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

import TableDataGrid from '@/app/components/tables/CommDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import { SelectItem } from 'select'
import { getCityCodes, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { getDateRange } from '@/utils/fsms/common/util'
import DetailDataGrid from './_components/DetailDataGrid'
// import DetailDataGrid from './_components/DetailDataGrid'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '부정수급관리',
  },
  {
    title: '행정처분',
  },
  {
    to: '/ilg/ssp',
    title: '보조금지급정지',
  },
]


const headCells: HeadCell[] = [
  {
    id: 'errorNm',
    numeric: false,
    disablePadding: false,
    label: '오류명',
  },
  {
    id: 'rcptYmd',
    numeric: false,
    disablePadding: false,
    label: '접수일자',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'vhclPsnNm',
    numeric: false,
    disablePadding: false,
    label: '소유',
  },
  {
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vonrRrnoS',
    numeric: false,
    disablePadding: false,
    label: '주민등록번호',
  },
  {
    id: 'crnoS',
    numeric: false,
    disablePadding: false,
    label: '사업자등록\n번호',
  },
  {
    id: 'crnoEncpt',
    numeric: false,
    disablePadding: false,
    label: '법인등록번호',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'telno',
    numeric: false,
    disablePadding: false,
    label: '연락처',
  },
  {
    id: 'koiNm',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'vhclTonNm',
    numeric: false,
    disablePadding: false,
    label: '톤수',
  },
  {
    id: 'crdcoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'cardSeNm',
    numeric: false,
    disablePadding: false,
    label: '카드구분',
  },
  {
    id: 'issuSeCd',
    numeric: false,
    disablePadding: false,
    label: '발급',
  },
  {
    id: 'stlmCardNo',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'regDt',
    numeric: false,
    disablePadding: false,
    label: '처리일자',
  },
]

export interface Row {
  ctpvCd?: string; // 시도코드 (locgovCd의 앞 2자리)
  locgovCd?: string; // 시도+지자체코드
  errCd?: string; // 오류사유
  vhclNo?: string; // 차량번호
  bgngRegDt?: string; // 시작일
  endRegDt?: string; // 종료일
  errorNm?: string; // 오류명
  crdcoCd?: string; // 카드사코드
  rcptYmd?: string; // 접수일자
  rcptSeqNo?: string; // 접수일련번호
  reqSeq?: string; // 요청이력번호
  locgovNm?: string; // 지자체명
  issuSeCd?: string; // 발급구분코드
  vonrNm?: string; // 차주명
  vonrBrno?: string; // 차주사업자번호
  vhclPsnCd?: string; // 차량소유구분코드
  koiCd?: string; // 유종코드
  vhclTonCd?: string; // 톤수코드
  lcnsTpbizCd?: string; // 면허업종코드
  stlmCardNo?: string; // 결제카드번호
  rissuBfrCardNo?: string; // 재발급이전카드번호
  cardSeCd?: string; // 카드구분코드
  cardBzmnSeCd?: string; // 카드사업자구분코드
  vldPrdYm?: string; // 유효기간년월
  bzentyNm?: string; // 업체명
  locgovAprvYn?: string; // 지자체승인여부
  telno?: string; // 전화번호
  trsmYn?: string; // 전송여부
  transDt?: string; // 전송일자
  rgtrId?: string; // 등록ID
  regDt?: string; // 등록일
  mdfrId?: string; // 수정ID
  updateDt?: string; // 수정일
  cardAplyYmd?: string; // 등록일
  idntyYmd?: string; // 전송일자
  cardNoS?: string; // 카드번호(암호화)
  cardNoD?: string; // 카드번호(복호화)
  cardNo?: string; // 카드번호(암호화)
  crnoD?: string; // 사업자번호(복호화)
  crnoS?: string; // 사업자번호(암호화)
  crno?: string; // 사업자번호(암호화)
  vonrRrno?: string; // 주민번호(암호화)
  vonrRrnoD?: string; // 주민번호(복호화)
  vonrRrnoS?: string; // 주민번호(암호화)
  crnoEncpt?: string; // 법인등록번호(암호화)
  rprsvNm?: string; // 대표자명
  rprsvRrno?: string; // 대표자 주민번호
  bzmnSeCd?: string; // 사업자구분코드
  koiNm?: string; // 유종명
  vhclTonNm?: string; // 톤수명
  crdcoNm?: string; // 카드사명
  vhclPsnNm?: string; // 소유구분명
  cardSeNm?: string; // 카드구분명
  issuGbNm?: string; // 처리구분명
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

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

   // 기본 날짜 세팅 (30일)
   const setDateRange = () => {
    const dateRange = getDateRange("date", 30);

    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    setParams((prev) => ({ ...prev, bgngDt: startDate, endDt: endDate }))
  }
  // 초기 데이터 로드
  useEffect(() => {
    setDateRange()
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
        `/fsm/mng/cijaf/tr/getAllCardIssuJdgAtmcFailTr?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.errCd ? '&errCd=' + params.errCd : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vonrNm ? '&vonrNm=' + params.vonrNm : ''}` +
        `${params.bgngRegDt ? '&bgngRegDt=' + (params.bgngRegDt+'').replace(/-/g, "") : ''}` +
        `${params.endRegDt ? '&endRegDt=' + (params.endRegDt+'').replace(/-/g, "") : ''}`


        console.log(endpoint);
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        console.log('성공',response.data.content)

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
    if (name === 'bgngRegDt' || name === 'endRegDt') {
      const otherDateField =
        name === 'bgngRegDt' ? 'endRegDt' : 'bgngRegDt'
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

    if (changedField === 'bgngRegDt') {
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
    <PageContainer title="카드발급심사 자동탈락내역" description="카드발급심사 자동탈락내역">
      {/* breadcrumb */}
      <Breadcrumb title="카드발급심사 자동탈락내역" items={BCrumb} />
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
                    htmlFor="ft-errCd"
                  >
                    오류사유
                  </CustomFormLabel>
                  <CustomTextField
                    id="ft-errCd"
                    placeholder=""
                    fullWidth
                    name="errCd"
                    value={params.errCd ?? ''} // 빈 문자열로 초기화
                    onChange={handleSearchChange}
                  />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fname"
                >
                  차량번호
                </CustomFormLabel>
                <CustomTextField
                  id="ft-vonrNm"
                  placeholder=""
                  fullWidth
                  name="vonrNm"
                  text={params.vonrNm ?? ''}
                  onChange={handleSearchChange}
                />
              </div>
            </div>  <hr></hr>
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
                    name="bgngRegDt"
                    value={params.bgngRegDt ?? ''}
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
                    name="endRegDt"
                    value={params.endRegDt ?? ''}
                    onChange={handleSearchChange}
                    fullWidth
                  />
              </div>
          </div>
        </Box>
    

        <Box className="table-bottom-button-group">
          <div className="button-right-align">
          <Button type="submit" variant="contained" color="primary">
            조회
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
          onSortModelChange={() => {}} 
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          paging={true}
          cursor={true}
        />
      </Box>
      {/* 테이블영역 끝 */}


        <DetailDataGrid
            row={selectedRow as Row} // 목록 데이터
        />
    </PageContainer>

  )
}

export default DataList
