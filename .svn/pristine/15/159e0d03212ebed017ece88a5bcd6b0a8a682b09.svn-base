'use client'
import { Box, Button, FormControlLabel } from '@mui/material'
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
import {
  getCityCodes,
  getCodesByGroupNm,
  getLocalGovCodes,
} from '@/utils/fsms/common/code/getCode'

import { SelectItem } from 'select'
import { HeadCell } from 'table'
import { getDateRange } from '@/utils/fsms/common/util'
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '거래정보',
  },
  {
    title: '버스주유정보',
  },
  {
    to: '/apv/bdd',
    title: '버스거래내역',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'asstAmtClclnNm',
    numeric: false,
    disablePadding: false,
    label: '보조금정산',
  },
  {
    id: 'cnptSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래원',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'vhclSeNm',
    numeric: false,
    disablePadding: false,
    label: '면허업종',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
  },
  {
    id: 'dlngSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래구분',
  },
  {
    id: 'cardSeNm',
    numeric: false,
    disablePadding: false,
    label: '카드구분',
  },
  {
    id: 'crdcoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'cardNo',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '주유소명',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
  },
  {
    id: 'koiNm',
    numeric: false,
    disablePadding: false,
    label: '거래유종',
  },
  {
    id: 'lbrctStleNm',
    numeric: false,
    disablePadding: false,
    label: '주유형태',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '연료량',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '보조금',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
  },
  {
    id: 'stlmNm',
    numeric: false,
    disablePadding: false,
    label: '결제여부',
  },
  {
    id: 'imgRecog1VhclNo',
    numeric: false,
    disablePadding: false,
    label: '주유차량번호1',
  },
  {
    id: 'imgRecog2VhclNo',
    numeric: false,
    disablePadding: false,
    label: '주유차량번호2',
  },
  {
    id: 'vcf',
    numeric: false,
    disablePadding: false,
    label: 'VCF',
  },
  {
    id: 'crctBfeFuelQty',
    numeric: false,
    disablePadding: false,
    label: '원충전량',
  },
]

export interface Row {
  dlngDt: string;
  dlngYmd: string;
  brno: string;
  vhclNo: string;
  cardNoEncpt: string;
  cardNo: string;
  asstAmtClclnCd: string;
  frcsNm: string;
  aprvAmt: number;
  fuelQty: number;
  asstAmt: number;
  ftxAsstAmt: number;
  opisAmt: string;
  aprvNo: string;
  imgRecog1VhclNo: string;
  imgRecog2VhclNo: string;
  vcf: string;
  crctBfeFuelQty: string;
  asstAmtClclnNm: string;
  locgovNm: string;
  bzentyNm: string;
  dlngSeNm: string;
  stlmNm: string;
  lbrctStleNm: string;
  koiNm: string;
  vhclSeNm: string;
  cnptSeNm: string;
  cardSeNm: string;
  crdcoNm: string;
  unsetlAmt: string;
  prttnYn: string;
  prttnNm: string;
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

  const [isLocgovCdAll, setIsLocgovCdAll] = useState<boolean>(false);
  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종 코드
  const [lbrctStleCdItems, setLbrctStleCdItems] = useState<SelectItem[]>([]); // 주유형태 코드
  const [vhclSeCdItems, setVhclSeCdItems] = useState<SelectItem[]>([]); // 면허업종 코드
  const [asstAmtClclnCdItems, setAsstAmtClclnCdItems] = useState<SelectItem[]>([]); // 보조금정산 코드

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

  const setDateRange = () => {
    const dateRange = getDateRange("date", 30);

    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))
  }
  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)
    setDateRange();
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
      setCtpvCdItems(cityCodes)
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
      setLocgovCdItems(locgovCodes)
    })

     // 유종코드
     getCodesByGroupNm('599').then((res) => {
      let itemArr: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ];
      if(res) {
        res.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          itemArr.push(item);
        })
      }
      setKoicdItems(itemArr);
    })
    
    // 주유형태
    getCodesByGroupNm('550').then((res) => {
      let itemArr: SelectItem[] = [{
        label: '전체',
        value: '',
      },];
      if(res) {
        res.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          itemArr.push(item);
        })
      }
      setLbrctStleCdItems(itemArr);
    })

    // 면허업종
    getCodesByGroupNm('505').then((res) => {
      let itemArr: SelectItem[] = [{
        label: '전체',
        value: '',
      },];
      if(res) {
        res.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          itemArr.push(item);
        })
      }
      setVhclSeCdItems(itemArr);
    })

    // 보조금정산
    getCodesByGroupNm('544').then((res) => {
      let itemArr: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ];
      if(res) {
        res.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          itemArr.push(item);
        })
      }
      setAsstAmtClclnCdItems(itemArr);
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

      setLocgovCdItems(locgovCodes)
    })
  }, [params.ctpvCd])

  // 쿼리스트링, endpoint, 메서드(로딩), 페이지, 파싱할때 타입 (rowtype 채택한 타입으로 아무거나 되게 )
  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/bdd/bs/getAllBusDelngDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${!isLocgovCdAll && params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
        `${!isLocgovCdAll && params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll('-','') : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll('-','') : ''}` +
        `${params.rtrcnYn ? '&rtrcnYn=' + params.rtrcnYn : ''}` +
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
        `${params.crdcoCd ? '&crdcoCd=' + params.crdcoCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.vhclSeCd ? '&vhclSeCd=' + params.vhclSeCd : ''}` +
        `${params.lbrctStleCd ? '&lbrctStleCd=' + params.lbrctStleCd : ''}`;

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
    try {
      let endpoint: string =
      `/fsm/apv/bdd/bs/getExcelBusDelngDtls?page=${params.page - 1}&size=${params.size}` +
      `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
      `${!isLocgovCdAll && params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
      `${!isLocgovCdAll && params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
      `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll('-','') : ''}` +
      `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll('-','') : ''}` +
      `${params.rtrcnYn ? '&rtrcnYn=' + params.rtrcnYn : ''}` +
      `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
      `${params.crdcoCd ? '&crdcoCd=' + params.crdcoCd : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.brno ? '&brno=' + params.brno : ''}` +
      `${params.vhclSeCd ? '&vhclSeCd=' + params.vhclSeCd : ''}` +
      `${params.lbrctStleCd ? '&lbrctStleCd=' + params.lbrctStleCd : ''}`;

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '버스거래내역.xlsx');
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
      title="버스거래내역"
      description="버스거래내역"
    >
      {/* breadcrumb */}
      <Breadcrumb title="버스거래내역" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box
        className="sch-filter-box"
        component="form"
        onSubmit={handleAdvancedSearch}
        sx={{ mb: 2 }}
      >
        <div className="form-list">
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
                disabled={isLocgovCdAll}
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
                disabled={isLocgovCdAll}
                style={{ width: '100%' }}
              >
                {locgovCdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{maxWidth:'5rem'}}>
              <FormControlLabel control={<CustomCheckbox name='isLocgovCdAll' value={isLocgovCdAll} onChange={()=> setIsLocgovCdAll(!isLocgovCdAll)}/>} label="전체"/>
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                <span className="required-text" >*</span>거래년월일
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">거래년월일 시작</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~ 
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">거래년월일 종료</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group" style={{maxWidth:'6rem'}}>
              <FormControlLabel control={<CustomCheckbox name="rtrcnYn" value={params.rtrcnYn} onChange={handleSearchChange} />}label="취소포함"/>
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                유종
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="koiCd"
                value={params.koiCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {koicdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                카드사
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="koiCd"
                value={params.koiCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {koicdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                <span className="required-text" >*</span>차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                <span className="required-text" >*</span>사업자등록번호
              </CustomFormLabel>
              <CustomTextField name="brno" value={params.brno} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                보조금정산
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="asstAmtClclnCd"
                value={params.asstAmtClclnCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
                >
                {asstAmtClclnCdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                주유형태
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="lbrctStleCd"
                value={params.lbrctStleCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {lbrctStleCdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                면허업종
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="vhclSeCd"
                value={params.vhclSeCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {vhclSeCdItems.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Box>
      {/* 검색영역 끝 */}
     
      {/* 테이블영역 시작 */}
      <Box>
        <TableDataGrid
          fetchData={fetchData}
          excelDownload={excelDownload}
          headCells={headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 수
          loading={loading} // 로딩여부
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
