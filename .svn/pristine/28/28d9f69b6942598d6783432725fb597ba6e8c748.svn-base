'use client'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useRouter, useSearchParams,usePathname  } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import MessageDisplay from '@/app/components/MessageDisplay'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import {  sendHttpFileRequest, sendHttpRequest  } from '@/utils/fsms/common/apiUtils'
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
import { SelectItem } from 'select'
import {
  getCityCodes,
  getLocalGovCodes,
  getCodesByGroupNm,
} from '@/utils/fsms/common/code/getCode'

import {
  getLabelFromCode

} from '@/utils/fsms/common/convert'

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
    to: '/cal/lsr',
    title: '지자체별 청구내역 집계현황',
  },
]

const tonData = [
  {
    value: '01',
    label: '1톤이하',
  },
  {
    value: '03',
    label: '3톤이하',
  },
  {
    value: '05',
    label: '5톤이하',
  },
  {
    value: '08',
    label: '8톤이하',
  },
  {
    value: '10',
    label: '10톤이하',
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
  {
    id: 'clclnYm',
    numeric: false,
    disablePadding: false,
    label: '청구년월',
  },
  {
    id: 'crdcoCd',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'locgovCd',
    numeric: false,
    disablePadding: false,
    label: '지자체',
  },
  {
    id: 'bzmnSeCd',
    numeric: false,
    disablePadding: false,
    label: '면허종류',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'clmAprvYn',
    numeric: false,
    disablePadding: false,
    label: '처리구분',
  },
  {
    id: 'dlngNocs',
    numeric: false,
    disablePadding: false,
    label: '매출건수',
  },
  {
    id: 'userCnt',
    numeric: false,
    disablePadding: false,
    label: '회원수',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '국토부사용량',
  },
  {
    id: 'usageUnit',
    numeric: false,
    disablePadding: false,
    label: '단위',
  },
  {
    id: 'slsAmt',
    numeric: false,
    disablePadding: false,
    label: '매출금',
  },
  {
    id: 'indvBrdnAmt',
    numeric: false,
    disablePadding: false,
    label: '개인부담금',
  },
  {
    id: 'moliatAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '국토부보조금',
  },
]

/**
 *   {
        "koiCd": "LPG",
        "vhclTonCd": "1톤이하",
        "crtrAplcnYmd": "20090601",
        "crtrAplcnYmdHyp": null,
        "crtrYear": "2009",
        "limUseRt": "225.000000000",
        "crtrLimLiter": "1024.000",
        "avgUseLiter": "455.000"
    }
 * 
 */


    export interface Row {
      // 파라미터 
      clclnLocgovCd?: string;      // 정산 지자체 코드
      bgngDt?: string;             // 청구시작년월
      endDt?: string;              // 청구종료년월
      bzmnSeCd?: string;           // 사업자구분 (면허종류)
      koiCd?: string;              // 유종
      crdcoCd?: string;            // 카드사구분 (카드사코드)

      cityCode?: string;
      //결과값
      locgovCd?: string;           // 지자체코드
    //clclnLocgovCd?: string;      // 정산 지자체 코드
    //crdcoCd?: string;            // 카드사구분 (카드사코드)
      clclnYm?: string;            // 청구년월
    //bzmnSeCd?: string;           // 사업자구분 (면허종류)
    //koiCd?: string;              // 유종
      clmAprvYn?: string;          // 청구승인여부
      clmAprvDt?: string;          // 청구승인일시
      dlngNocs?: string;           // 매출건수 
      userCnt?: string;            // 회원수
      useLiter?: string;           // 국토부사용량
      slsAmt?: string;             // 매출금액 
      indvBrdnAmt?: string;        // 개인부담금액
      icectxRmbrAmt?: string;      // 개별소비세교육세환급금액
      vatRmbrAmt?: string;         // 부가가치세환급금액
      moliatAsstAmt?: string;      // 국토부 보조금
      sumRmbrAmt?: string;      // 합계환급금액
      usageUnit?: string;      // 단위
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
  bgngDt: string
  endDt: string
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
  const pathname = usePathname(); // 현재 경로를 가져옴


  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터

  const [detailRows, setDetailRows] = useState<Row[]>([]) // 가져온 로우 데이터

  const [searchCityCode, setSearchCityCode] = useState<string>('')  //시도 코드


  //Selct Code 세팅 
  const [cityCode, setCityCode] = useState<SelectItem[]>([])  //        시도 코드
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([]) // 관할관청 코드
  const [bzmnSeCdCode, setBzmnSeCd] = useState<SelectItem[]>([]) //          사업자 구분 코드
  const [koiCdCode, setKoiCdCode] = useState<SelectItem[]>([]) //       유종 코드
  const [crdcoCode, setCrdCode] = useState<SelectItem[]>([])           //카드사 코드

  // 함수 라벨 반환 함수 선언 
  const [getLabelFromCity, setGetLabelFromCity] = useState<(value: string) => string>(() => () => '');
  const [getLabelFromLocalGov, setGetLabelFromLocalGov] = useState<(value: string) => string>(() => () => '');
  const [getLabelFromKoi, setGetLabelFromKoi] = useState<(value: string) => string>(() => () => '');
  const [getLabelFormCrdCod, setGetLabelFormCrdCod] = useState<(value: string) => string>(() => () => '');
  const [getLabelFromBzmnSe, setGetLabelFromBzmnSe] = useState<(value: string) => string>(() => () => '');




  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

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

  const [ton, setTon] = useState('1톤이하')
  const [fuel, setFuel] = useState('L')
  const [date, setDate] = useState('2024-10-15')


  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)


  //Select Code 가져오기

  // 시도 코드
  let cityCodes: SelectItem[] = [
    {
      label: '전체',
      value: '',
    },
  ]

  //시도 관청 코드 
  let locgovCodes: SelectItem[] = [
    {
      label: '전체',
      value: '',
    },
  ]
    //사업자 구분 
    let BzmnSeCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]
      //카드사
  let CrdCodes: SelectItem[] = [
    {
      label: '전체',
      value: '',
    },
  ]
    //유종코드
    let KoiCdCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

  //면허종류 코드
  let bzmnSeCdCodes: SelectItem[] = [

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
      setGetLabelFromCity(() =>getLabelFromCode(cityCodes))
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
      setGetLabelFromLocalGov(() =>getLabelFromCode(locgovCodes))
      setLocalGovCode(locgovCodes)
    })

    //사업자 구분
    getCodesByGroupNm('301').then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          BzmnSeCodes.push(item)
        })
      }
      setGetLabelFromBzmnSe(() =>getLabelFromCode(BzmnSeCodes))
      setBzmnSeCd(BzmnSeCodes)
    })

    //카드사
    getCodesByGroupNm("CCGC").then((res) => {

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          CrdCodes.push(item)
        })
      }
      setGetLabelFormCrdCod(() => getLabelFromCode(CrdCodes))
      setCrdCode(CrdCodes)
    })

    // 유종코드
    getCodesByGroupNm('599').then((res) => {

      if(res) {
        res.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }
          KoiCdCodes.push(item);
        })
      }
      setGetLabelFromKoi(() =>getLabelFromCode(KoiCdCodes))
      setKoiCdCode(KoiCdCodes);
    })

    // 면허종류
    getCodesByGroupNm('CBG0').then((res) => {

      if(res) {
        res.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          bzmnSeCdCodes.push(item);
        })
      }
      setGetLabelFromBzmnSe(() =>getLabelFromCode(bzmnSeCdCodes));
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

  function formatDate(dateString:string) {
    // 입력 형식이 YYYY-MM인지 확인
    if (!/^\d{4}-\d{2}$/.test(dateString)) {
      throw new Error("Invalid format. Expected 'YYYY-MM'");
    }
    
    // "-" 제거하고 반환
    return dateString.replace("-", "");
  }

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/cal/lsr/tx/getAllLocgovSbsidyRqest?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.clclnLocgovCd ? '&' + 'clclnLocgovCd' + '=' + params.clclnLocgovCd : ''}` +
        `${params.bzmnSeCd ? '&' + 'bzmnSeCd' + '=' + params.bzmnSeCd : ''}` +
        `${params.koiCd ? '&' + 'koiCd' + '=' + params.koiCd : ''}` +
        `${params.crdcoCd ? '&' + 'crdcoCd' + '=' + params.crdcoCd : ''}` +
        `${params.bgngDt ? '&bgngDt=' + formatDate(params.bgngDt) : ''}` +
        `${params.endDt ? '&endDt=' + formatDate(params.endDt) : ''}`
      

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        
        setSearchCityCode(params.ctpvCd as string)
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

  // 페이지 이동 감지 시작 //

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {

    event.preventDefault()

    
    if(!params.ctpvCd || params.ctpvCd== '') {
      alert('시도군은 필수값입니다.');
      return;
    }

    if(!params.clclnLocgovCd || params.clclnLocgovCd == '') {
      alert('관할관청은 필수값입니다.');
      return;
    }

    if(!params.bgngDt || params.bgngDt == '') {
      alert('시작일은 필수값입니다.');
      return;
    }

    if(!params.endDt || params.endDt == '') {
      alert('종료일은 필수값입니다.');
      return;
    }


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
  const handleRowClick = async (lgnId: string) => {

    try {
      let endpoint: string = `/fsm/sym/aa/cm/getAllAccesAuthorHst?lgnId=${lgnId}`;

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if(response && response.resultType === 'success' && response.data) {
        setDetailRows(response.data)
      }

    } catch(error) {
      console.error('Error fetching data:', error)
    }

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

  // 조건 검색 변환 매칭
  const sortChange = (sort: String): String => {
    if (sort && sort != '') {
      let [field, sortOrder] = sort.split(',') // field와 sortOrder 분리하여 매칭
      if (field === 'regYmd') field = 'regDt' // DB -> regDt // DTO -> regYmd ==> 매칭 작업
      return field + ',' + sortOrder
    }
    return ''
  }

  // 추후에 액셀 다운로드 API 나오면 연동! 
  const excelDownload = async () => {
    try {
      let endpoint: string =
      `/sample?page=${params.page - 1}&size=${params.size}` 

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      alert('추후에 액셀 다운로드 API 나오면 연동! ')
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'test.xlsx');
      // document.body.appendChild(link);
      // link.click();
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

  return (
    <PageContainer title="지급확정관리" description="지급확정관리">
      {/* breadcrumb */}
      <Breadcrumb title="지급확정관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
          <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
              <span className="required-text" >*</span>시도명
              </CustomFormLabel>
              <select
                id="ft-ton-select-01"
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
                  htmlFor="ft-fuel"
                >
                  <span className="required-text" >*</span>관할관청
                </CustomFormLabel>
                <select
                  id="ft-fuel-select-02"
                  className="custom-default-select"
                  name="clclnLocgovCd"
                  value={params.clclnLocgovCd}
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
                  <span className="required-text" >*</span>청구년월
                </CustomFormLabel>
                <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">청구 년월</CustomFormLabel>
                <CustomTextField  type="month" id="ft-date-start" name="bgngDt" value={params.bgngDt} onChange={handleSearchChange} fullWidth />
                ~ 
                <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">청구 종료 년월</CustomFormLabel>
                <CustomTextField type="month" id="ft-date-end" name="endDt" value={params.endDt} onChange={handleSearchChange} fullWidth />
              </div>

              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-bzmnSeCd"
                >
                  사업자 구분
                </CustomFormLabel>
                <select
                  id="ft-ton-select-02"
                  className="custom-default-select"
                  name="bzmnSeCd"
                  value={params.bzmnSeCd}
                  onChange={handleSearchChange}
                  style={{ width: '70%' }}
                >
                  {bzmnSeCdCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* // 다음줄  */}
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-koiCd"
                >
                  유종
                </CustomFormLabel>
                <select
                  id="ft-koiCd-select-02"
                  className="custom-default-select "
                  value={params.koiCd}
                  name="koiCd"
                  onChange={handleSearchChange}
                  style={{ width: '30%' }}
                >
                  {koiCdCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                카드사 구분
              </CustomFormLabel>
              <select
                id="ft-ton-select-03"
                className="custom-default-select"
                name="crdcoCd"
                value={params.crdcoCd}
                onChange={handleSearchChange}
                style={{ width: '50%' }}
              >
                {crdcoCode.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
              {/* // 다음줄  */}
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
            {/* <FormDialog
              size={'lg'}
              buttonLabel="신규"
              title="전국표준한도관리 등록"
              children={<ModalContent />}
            /> */}
            {/* <Button variant="contained" color="primary">
              신규
            </Button> */}
            {/* <Button variant="contained" color="primary">
              수정
            </Button>
            <Button variant="contained" color="primary">
              삭제
            </Button>
            */}
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
          searchCityCode={searchCityCode}
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          getLabelFromCity={getLabelFromCity}
          getLabelFromLocalGov={getLabelFromLocalGov}
          getLabelFromKoi={getLabelFromKoi}
          getLabelFormCrdCod={getLabelFormCrdCod}
          getLabelFromBzmnSe={getLabelFromBzmnSe}
        />
      </Box>

      <Box>


      {/* 로딩 인디케이터 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
      {/* 테이블영역 끝 */}

      {/* <Box className="table-bottom-button-group">.map((option
          <div className="button-right-align">
              <Button variant="contained" color="primary"
              onClick={handleWriteClick}
              >
                등록
              </Button>
          </div>
      </Box> */}
    </PageContainer>
  )
}

export default DataList
