'use client'
import { Box, Button, FormControlLabel, RadioGroup } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb, CustomRadio } from '@/utils/fsms/fsm/mui-imports'

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
import {
  getCityCodes,
  getLocalGovCodes,
} from '@/utils/fsms/common/code/getCode'

import { getCtpvCd, getCommCd, getLocGovCd, getDateRange, isValidDateRange, sortChange, getExcelFile, getToday} from '@/utils/fsms/common/comm'

import { HeadCell } from 'table'
import ModalContent from './_components/SearchModal'
import { SelectItem } from 'select'
import UserAuthContext from '@/app/components/context/UserAuthContext'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '기준관리',
  },
  {
    to: '/stn/tcc',
    title: '탱크용량변경관리',
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
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vonrBrno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
  },
  {
    id: 'regDt',
    numeric: false,
    disablePadding: false,
    label: '요청일자',
  },
  {
    id: 'trsmDt',
    numeric: false,
    disablePadding: false,
    label: '탱크용량변경일자',
  },
  {
    id: 'bfchgTnkCpcty',
    numeric: false,
    disablePadding: false,
    label: '변경전 탱크용량',
  },
  {
    id: 'tnkCpcty',
    numeric: false,
    disablePadding: false,
    label: '변경후 탱크용량',
  },
  {
    id: 'tankStsNm',
    numeric: false,
    disablePadding: false,
    label: '처리상태',
  },
  {
    id: 'reason',
    numeric: false,
    disablePadding: false,
    label: '탱크용량 변경 사유',
  },
  {
    id: 'mdfcnDt',
    numeric: false,
    disablePadding: false,
    label: '처리일자',
  },
]

/**
 *     {
                "vhclNo": "충북80아1304",
                "dmndYmd": "20241001",
                "crtrYmd": "20240822",
                "prcsYmd": "20241028",
                "prcsSttsCd": "00",
                "tnkCpcty": "300.000000000000000",
                "chgRsnCn": "0",
                "tankRsnNm": null,
                "flCd": "01",
                "flRsnCn": "탱크용량 거절 테스트",
                "fileId": "",
                "mbtlnum": "01071945680",
                "rgtrId": "D2D030",
                "regDt": "2024-08-23",
                "mdfrId": "kdh961129",
                "mdfcnDt": "2024-10-01",
                "vonrBrno": "6760102267",
                "vonrNm": "이기현",
                "tankStsNm": "심사요청",
                "bfchgTnkCpcty": "75.000000000000000",
                "locgovCd": "41190",
                "locgovNm": "경기 부천시",
                "vonrRrno": "QF437RaLWiMJ5Os8ktbOo/ZW",
                "rejectNm": "실제 주유리터 대비 과한 용량 신청",
                "saveFlag": "M",
                "trsmYn": "N",
                "trsmDt": null,
                "confirmNm": "김동훈",
                "inptSeCd": "M",
                "rmrkCn": "",
                "carTonsNm": "12톤초과",
                "tonsLit": "900",
                "carSts": "화물 일반형-카고 대형",
                "vhclNm": "대우25톤장축카고트럭",
                "carPid": "QF71xxEvNNQ8qS0aBugxzkN/",
                "carBid": "QF7zF4ob4RxeOX4TJmZXxcAX",
                "ownerChangeYn": "Y",
                "cnt": null,
                "vonrRrnoS": null,
                "apvlLit": "288.000",
                "secondLit": "276.000",
                "apvlAvg": "240.140"
            }


 * 
 */

export interface Row {
  vhclNo: string; // 차량번호
  dmndYmd: string; // 요청일자
  crtrYmd: string; // 탱크용량변경일자
  prcsYmd: string; // 처리일자
  prcsSttsCd: string; // 처리상태 코드
  tnkCpcty: string; // 변경후 탱크용량
  chgRsnCn: string; // 변경사유 내용
  tankRsnNm: string; // 탱크용량 변경사유
  flCd: string; // 탈락코드
  flRsnCn: string; // 탈락사유 내용
  fileId: string; // 파일아이디
  mbtlnum: string; // 휴대폰번호
  rgtrId: string; // 등록자아이디
  regDt: string; // 등록일시
  mdfrId: string; // 수정자아이디
  mdfcnDt: string; // 수정일시
  vonrBrno: string; // 차량소유자 사업자등록번호
  vonrNm: string; // 차량소유자명
  tankStsNm: string; // 처리상태
  bfchgTnkCpcty: string; // 변경전 탱크용량
  locgovCd: string; // 관할구청 코드
  locgovNm: string; // 관할구청명
  vonrRrno: string; // 주민등록번호
  rejectNm: string; // 탈락유형
  saveFlag: string;
  trsmYn: string; // 전송여부
  trsmDt: string; // 전송일시
  confirmNm: string; // 처리자
  inptSeCd: string; // 입력구분코드
  rmrkCn: string; // 비고
  carTonsNm: string; // 톤수
  tonsLit: string;
  carSts: string; // 차량형태
  vhclNm: string; // 차명
  carPid: string; // 차량소유자 주민등록번호
  carBid: string; // 차량소유자 법인등록번호
  ownerChangeYn: string;
  cnt: string;
  vonrRrnoS: string;
  aprvLit: string; // 3개월 최고주유량
  secondLit: string; // 3개월 두번째 주유량
  aprvAvg: string; // 3개월 평균주유량
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
  const [isDetailOn, setIsDetailOn] = useState<boolean>(false)
  // const [detail, setDetail] = useState<DetailData>();
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [cityCode, setCityCode] = useState<SelectItem[]>([])
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([])
  const [prcsSttsItems, setPrcsSttsItems] = useState<SelectItem[]>([]); // 처리상태 코드
  const [rejectItems, setRejectItems] = useState<SelectItem[]>([]); // 탈락유형 코드

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
    chk: '01', // 기간 체크
    prcsSttsCd: '', // 처리 상태
    vhclNo: '', // 차량번호
    brno: '', // 사업자등록번호
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 5, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })


  const {authInfo} = useContext(UserAuthContext);
  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)
    console.log('CONTEXT ::: ' , authInfo);
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

    getCommCd('172', '전체').then((itemArr) => setPrcsSttsItems(itemArr)) // 처리상태
    getCommCd('173', '전체').then((itemArr) => setRejectItems(itemArr)) // 탈락유형

    const dateRange = getDateRange('d', 60);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))
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
        `/fsm/stn/tcc/tr/tnkCpctyChmngmt?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
        `${params.chk ? '&chk=' + params.chk : ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", "") : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", "") : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.prcsSttsCd ? '&prcsSttsCd=' + params.prcsSttsCd : ''}`

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

  const excelDownload = async () => {
    let endpoint: string =
    `/fsm/stn/tcc/tr/tnkCpctyChmngmtExcel?` +
    `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
    `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
    `${params.chk ? '&chk=' + params.chk : ''}` +
    `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", "") : ''}` +
    `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", "") : ''}` +
    `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}` +
    `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
    `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
    `${params.brno ? '&brno=' + params.brno : ''}` +
    `${params.prcsSttsCd ? '&prcsSttsCd=' + params.prcsSttsCd : ''}`

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
    <PageContainer
      title="탱크용량변경관리"
      description="탱크용량변경관리"
    >
      {/* breadcrumb */}
      <Breadcrumb title="탱크용량변경관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                시도명
              </CustomFormLabel>
              <select
                id="ft-ton-select-01"
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
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-car-name"
              >
                차량번호
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-car-name" 
                name="vhclNo"
                value={params.vhclNo}
                onChange={handleSearchChange}/>
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="vonr-brno-name"
              >
                사업자등록번호
              </CustomFormLabel>
              <CustomTextField type="text" id="vonr-brno-name" 
                name="vonrBrno"
                value={params.brno}
                onChange={handleSearchChange}
                fullWidth />
            </div>
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group" style={{minWidth:'45rem'}}>
              <CustomFormLabel className="input-label-display">
                기간
              </CustomFormLabel>
              <RadioGroup
                sx={{minWidth:'13rem'}}
                row
                id="chk"
                className="mui-custom-radio-group"
                value={params.chk || ''}
                onChange={handleSearchChange}
              >
                <FormControlLabel
                  control={<CustomRadio id="chk_01" name="chk" value="01" />}
                  label="요청일자"
                />
                <FormControlLabel
                  control={<CustomRadio id="chk_02" name="chk" value="02" />}
                  label="처리일자"
                />
              </RadioGroup>
            {/* </div>
            <div className="form-group"> */}
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                시작일
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-end"
              >
                종료일
              </CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                처리상태
              </CustomFormLabel>
              <select
                id="ft-ton-select-03"
                className="custom-default-select"
                name="prcsSttsCd"
                value={params.prcsSttsCd}
                onChange={handleSearchChange}
              >
                {prcsSttsItems.map((option) => (
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
            <Button variant="contained" onClick={() => excelDownload()} color="primary">
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
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          rejectItems={rejectItems}
        />
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
