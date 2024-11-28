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
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'
import {
  getCodesByGroupNm,
  getCityCodes,
  getLocalGovCodes,
} from '@/utils/fsms/common/code/getCode'
import { SelectItem } from 'select'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '거래정보',
  },
  {
    title: '택시주유정보',
  },
  {
    to: '/apv/uddd',
    title: '미할인거래내역조회',
  },
]

const bzmnSeCdSelectItem = [
  {
    value: '',
    label: '전체',
  },
  {
    value: 'individual',
    label: '개인',
  },
  {
    value: 'cb',
    label: '법인',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'locgovCd',
    numeric: false,
    disablePadding: false,
    label: '지자체명',
  },
  {
    id: 'crdcoCd',
    numeric: false,
    disablePadding: false,
    label: '카드사명',
  },
  {
    id: 'cardNo',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'dealDt',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
  },
  {
    id: 'dlngSeCd',
    numeric: false,
    disablePadding: false,
    label: '거래구분',
  },
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
    label: '사업자번호',
  },
  {
    id: 'flnm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
  {
    id: 'frcsBrno',
    numeric: false,
    disablePadding: false,
    label: '가맹점\n사업자등록번호',
  },
  {
    id: 'dailUseAcmlNmtm',
    numeric: false,
    disablePadding: false,
    label: '거래순번',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '가맹점사용량',
  },
  {
    id: 'usageUnit',
    numeric: false,
    disablePadding: false,
    label: '단위',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
  },
  {
    id: 'vhclPorgnUntprc',
    numeric: false,
    disablePadding: false,
    label: '차량등록지\n지역별평균단가',
  },
  {
    id: 'literAcctoOpisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금\n사용량당단가',
  },
  {
    id: 'exsMoliatAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세\n연동보조금(ⓐ)',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세 연동보조금(ⓑ)',
  },
  {
    id: 'moliatAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '국토부보조금(ⓐ+ⓑ)',
  },
  {
    id: 'pbillAmt',
    numeric: false,
    disablePadding: false,
    label: '수급자\n부담금',
  },
  {
    id: 'moliatUseLiter',
    numeric: false,
    disablePadding: false,
    label: '국토부사용량',
  },
  {
    id: 'aprvRspnsNm',
    numeric: false,
    disablePadding: false,
    label: '미할인사유',
  },
]

export interface Row {
  locgovCd?: string // 지자체코드 (지자체명)
  crdcoCd?: string // 카드사코드 (카드사명)
  cardNo?: string // 카드번호
  dealDt?: string // 거래일시
  dlngSeCd: string // 거래구분
  vhclNo?: string // 차량번호
  brno?: string // 사업자번호
  flnm?: string //업체명
  frcsNm?: string //가맹점명
  frcsBrno?: string //가맹점사업자등록번호
  dailUseAcmlNmtm?: string //거래순번
  useLiter?: string //가맹점사용량
  usageUnit?: string // 단위
  aprvAmt?: string //승인금액
  vhclPorgnUntprc?: string //차량등록지 지역별평균단가
  literAcctoOpisAmt?: string //유가연동보조금 사용량당단가
  exsMoliatAsstAmt?: string //기존 국토부보조금 (유류세 연동보조금(ⓐ))
  opisAmt?: string //유류세 연동보조금(ⓑ)
  moliatAsstAmt?: string // 국토부보조금(ⓐ+ⓑ)
  pbillAmt?: string //수급자 부담금
  moliatUseLiter?: string //국토부사용량
  aprvRspnsNm?: string // 승인응답코드(미할인사유)

  sumRmbrAmt?: string // 총보조금

  rgtrId?: string // 등록id
  regDt?: string // 등록일시
  mdfrId?: string // 수정id
  mdfcnDt?: string // 수정일시
  rtrcnDlngDt?: string // 취소거래일시(x)
  sumNtsRmbrAmt?: string // 국세청보조금(x)
  icectxRmbrAmt?: string // 개별소비세교육세환급액 (x)
  vatRmbrAmt?: string // 부가세환급액 (x)
  literAcctoUntprc?: string // 리터당단가 (x)
  literAcctoUntprcSeCd?: string // 리터당단가구분(x)
  frcsNo?: string // 가맹점번호(x)
  koiCd?: string // 유종코드(x)
  puchasSlipNo?: string // 매입번호(x)
  bzmnSeCd?: string // 개인법인구분 (x)
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

  const [cityCode, setCityCode] = useState<SelectItem[]>([])
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([])
  const [aprvRspnsCodes, setAprvRspnsCode] = useState<SelectItem[]>([]) // 미할인사유
  const [bzmnSeCodes, setBzmnSeCode] = useState<SelectItem[]>([]) // 개인법인구분
  const [crdcoCodes, setCrdcoCode] = useState<SelectItem[]>([]) // 카드사
  const [koiCodes, setKoiCode] = useState<SelectItem[]>([]) // 유종

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? '', // 시작일
    searchEdDate: allParams.searchEdDate ?? '', // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
    ctpvCd: '', // 시도명 코드
    locgovCd: '', // 관할관청 코드
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 5, // 기본 페이지 사이즈 설정
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
    // 미할인사유
    let aprvRspnsCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

    // 개인법인구분
    let bzmnSeCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

    // 카드사
    let crdcoCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

    // 유종
    let koiCodes: SelectItem[] = [
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

    // 미할인사유 select item setting
    getCodesByGroupNm('CDE0').then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          aprvRspnsCodes.push(item)
        })
      }
      setAprvRspnsCode(aprvRspnsCodes)
    })

    // 개인법인구분 select item setting
    getCodesByGroupNm('CBG0').then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          bzmnSeCodes.push(item)
        })
      }
      setBzmnSeCode(bzmnSeCodes)
    })

    // 카드사 select item setting
    getCodesByGroupNm('CCGC').then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          crdcoCodes.push(item)
        })
      }
      setCrdcoCode(crdcoCodes)
    })

    // 유종 select item setting
    getCodesByGroupNm('599').then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          koiCodes.push(item)
        })
      }
      setKoiCode(koiCodes)
    })
  }, [])

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

  // 쿼리스트링, endpoint, 메서드(로딩), 페이지, 파싱할때 타입 (rowtype 채택한 타입으로 아무거나 되게 )
  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/uddd/tx/getAllUnDscntDelngDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` + // 시도코드+관할관청
        `${params.aprvRspnsCd ? '&aprvRspnsCd=' + params.aprvRspnsCd : ''}` + // 미할인사유
        `${params.bzmnSeCd ? '&bzmnSeCd=' + params.bzmnSeCd : ''}` + // 업종구분
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` + // 차량번호
        `${params.brno ? '&brno=' + params.brno : ''}` + // 사업자등록번호
        `${params.crdcoCd ? '&crdcoCd=' + params.crdcoCd : ''}` + // 카드사
        `${params.flnm ? '&flnm=' + params.flnm : ''}` + // 업체명
        `${params.frcsNm ? '&frcsNm=' + params.frcsNm : ''}` + // 가맹점명
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` + // 유종
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll('-', '') : ''}` + // 거래시작년월일
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll('-', '') : ''}` // 거래종료년월일

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
          pageSize: 5,
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
        pageSize: 5,
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
  const handleRowClick = () => {
    // 상세정보 바인딩
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
    <PageContainer title="미할인거래내역조회" description="미할인거래내역조회">
      {/* breadcrumb */}
      <Breadcrumb title="미할인거래내역조회" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="form-list">
            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fuel"
                >
                  시도명
                </CustomFormLabel>
                <select
                  id="ft-fuel-select-02"
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
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fuel"
                >
                  관할관청
                </CustomFormLabel>
                <select
                  id="ft-fuel-select-02"
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
                  거래일자
                </CustomFormLabel>
                <CustomFormLabel
                  className="input-label-none"
                  htmlFor="ft-date-start"
                >
                  거래일자
                </CustomFormLabel>
                <CustomTextField
                  type="date"
                  id="ft-date-start"
                  name="searchStDate"
                  value={params.searchStDate}
                  onChange={handleSearchChange}
                  fullWidth
                />
                <CustomFormLabel
                  className="input-label-none"
                  htmlFor="ft-date-end"
                >
                  종료일
                </CustomFormLabel>
                <CustomTextField
                  type="date"
                  id="ft-date-end"
                  name="searchEdDate"
                  value={params.searchEdDate}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </div>
            </div><hr></hr>
            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-ton"
                >
                  미할인사유
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  value={params.aprvRspnsCd}
                  name="aprvRspnsCd"
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {aprvRspnsCodes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-ton"
                >
                  개인법인구분
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  value={params.bzmnSeCd}
                  name="bzmnSeCd"
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {bzmnSeCodes.map((option) => (
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
                  type="text"
                  id="ft-vhclNo"
                  name="vhclNo"
                  fullWidth
                  value={params.vhclNo}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-brno"
                >
                  사업자등록번호
                </CustomFormLabel>
                <CustomTextField
                  id="ft-brno"
                  type="text"
                  name="brno"
                  fullWidth
                  value={params.brno}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="form-inline">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-ton"
                >
                  카드사
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  name="crdcoCd"
                  value={params.crdcoCd}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {crdcoCodes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-flnm"
                >
                  업체명
                </CustomFormLabel>
                <CustomTextField
                  type="text"
                  id="ft-flnm"
                  name="flnm"
                  fullWidth
                  value={params.flnm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fname"
                >
                  가맹점명
                </CustomFormLabel>
                <CustomTextField
                  id="ft-fname"
                  type="text"
                  name="frcsNm"
                  fullWidth
                  value={params.frcsNm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-koiCd"
                >
                  유종
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  name="koiCd"
                  value={params.koiCd}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {koiCodes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button type="submit" variant="contained" color="primary">
              조회
            </Button>
            <FormDialog
              size={'lg'}
              buttonLabel="신규"
              title="전국표준한도관리 등록"
              children={<ModalContent />}
            />
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
          pageable={pageable} // 현재 페이지 / 사이즈 정보
        />
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
