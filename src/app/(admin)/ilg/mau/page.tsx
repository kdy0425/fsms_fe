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
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import TableDataGrid from './_components/TableDataGrid'

// types
import HeaderTab, { Tab } from '@/app/components/tables/HeaderTab'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { getDateRange } from '@/utils/fsms/common/util'
import { SelectItem } from 'select'
import { HeadCell } from 'table'
import DetailTableDataGrid from './_components/DetailTableDataGrid'
import AverageTableDataGrid from './_components/AverageTableDataGrid'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '부정수급관리',
  },
  {
    title: '택시의심거래상시점검',
  },
  {
    to: '/ilg/mau',
    title: '월 누적 사용량',
  },
]

const averageHeadCells: HeadCell[] = [
  // {
  //   id: 'dlngYm',
  //   numeric: false,
  //   disablePadding: false,
  //   label: '거래년월',
  // },
  // {
  //   id: 'bzmnSeNm',
  //   numeric: false,
  //   disablePadding: false,
  //   label: '사업자구분',
  // },
  // {
  //   id: 'locgovCd',
  //   numeric: false,
  //   disablePadding: false,
  //   label: '지자체',
  // },
  // {
  //   id: 'avgLiter',
  //   numeric: false,
  //   disablePadding: false,
  //   label: '평균(L)',
  // },
  // {
  //   id: 'maxLiter',
  //   numeric: false,
  //   disablePadding: false,
  //   label: '최대(L)',
  // },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '0~100',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '100~200',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '200~300',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '300~400',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '400~500',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '500~600',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '600~700',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '700~800',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '800~900',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '900~1000',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1000~1100',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1100~1200',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1200~1300',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1300~1400',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1400~1500',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1500~1600',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1600~1700',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1700~1800',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1800~1900',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '1900~2000',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '2000~2100',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '2100~2200',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '2200~2300',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '2300~2400',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '2400~2500',
  },
  {
    id: 'avrgSection',
    numeric: false,
    disablePadding: false,
    label: '2500이상',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'dlngYm',
    numeric: false,
    disablePadding: false,
    label: '순번',
  },
  {
    id: 'dlngYm',
    numeric: false,
    disablePadding: false,
    label: '거래년월',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '지자체',
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
    label: '사업자 등록번호',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'bzmnSeNm',
    numeric: false,
    disablePadding: false,
    label: '사업자구분',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '사용량',
  },
  {
    id: 'moliatAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
  },
  {
    id: 'acmlUseNmtm',
    numeric: false,
    disablePadding: false,
    label: '거래건수',
  },
]

const detailHeadCells: HeadCell[] = [
  {
    id: 'crdcoCd',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'dlngYmd',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
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
    label: '사업자등록번호',
  },
  {
    id: 'dlngSeCd',
    numeric: false,
    disablePadding: false,
    label: '거래유형',
  },
  {
    id: 'dailUseAcmlNmtm',
    numeric: false,
    disablePadding: false,
    label: '거래순번',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '거래량',
  },
  {
    id: 'moliatAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'bzentyNm',
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
    id: 'cardNo',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'rtrcnDlngDt',
    numeric: false,
    disablePadding: false,
    label: '취소거래 일자',
  },
]

export interface Row {
  locgovCd: string;
  locgovNm: string;
  dlngYm: string;
  bzmnSeCd: string;
  koiCd: string;
  avgLiter: string;
  maxLiter: string;
  avrgSection: string;
  a01: string;
  a02: string;
  a03: string;
  a04: string;
  a05: string;
  a06: string;
  a07: string;
  a08: string;
  a09: string;
  a10: string;
  a11: string;
  a12: string;
  a13: string;
  a14: string;
  a15: string;
  a16: string;
  a17: string;
  a18: string;
  a19: string;
  a20: string;
  a21: string;
  a22: string;
  a23: string;
  a24: string;
  a25: string;
  rnk: string;
  vhclNo: string;
  brno: string;
  bzentyNm: string;
  useLiter: string;
  acmlAprvAmt: string;
  moliatStAmt: string;
  acmlUseNmtm: string;
  crdcoCd: string;
  cardNo: string;
  puchSlipNo: string;
  dealDt: string;
  dailUseAcmlNmtm: string;
  dlngSeCd: string;
  frcsNm: string;
  frcsNo: string;
  frcsBrno: string;
  aprvAmt: string;
  vatRmbrAmt: string;
  icectxRmbrAmt: string;
  sumNtsRmbrAmt: string;
  sumRmbrAmt: string;
  rtrcnDlngDt: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
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

  const [averageRows, setAverageRows] = useState<Row[]>([]);

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [bzentyItems, setBzentyItems] = useState<SelectItem[]>([]);

  const [seletedTab, setSelectedTab] = useState<string>('1');

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
  
  const [detailFlag, setDetailFlag] = useState<boolean>(false);
  const [detailRow, setDetailRow] = useState<Row[]>([]);
  const [detailTotalRows, setDetailTotalRows] = useState(0)
  const [detailPageable, setDetailPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })
  const [detailParams, setDetailParams] = useState({
    page: 1, // 페이지 번호는 1부터 시작
    size: 10, // 기본 페이지 사이즈 설정
    locgovCd: '',
    dlngYm: '',
    koiCd: '',
    brno: '',
    vhclNo: '',
    bzmnSeCd: ''
  })
  
  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
    setDetailRow([])
    setDetailTotalRows(0)
    setDetailPageable({
      pageNumber: 1,
      pageSize: 10,
      sort: params.sort,
    })
  }, [flag])

  useEffect(() => {
    if(detailParams.brno !== '') {
      fetchDetailData();
    }
  }, [detailFlag])

  // 기본 날짜 세팅 (이번달이라 endDate만 활용)
  const setDateRange = () => {
    const dateRange = getDateRange("month", 30);

    let endDate = dateRange.endDate;

    setParams((prev) => ({ ...prev, searchEdDate: endDate }))
  }
  // 초기 데이터 로드
  useEffect(() => {
    setDateRange();
     // 시도코드 
     getCityCodes().then((res) => {
      let itemArr:SelectItem[] = [
        {
          value: "",
          label: "전체"
        },
      ];
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['ctpvNm'],
            value: code['ctpvCd'],
          }

          itemArr.push(item)
        })
      }
      setCtpvCdItems(itemArr);

      setParams((prev) => ({...prev, ctpvCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
    })

    // 관할관청
    getLocalGovCodes().then((res) => {
      let itemArr:SelectItem[] = [
        {
          value: "",
          label: "전체"
        },
      ];
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['locgovCd'],
          }

          itemArr.push(item)
        })
      }
      setLocgovCdItems(itemArr)
    })

    // 택시개인법인구분 706
    getCodesByGroupNm('706').then((res) => {
      let itemArr:SelectItem[] = [
        {
          value: "",
          label: "전체"
        },
      ]

      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }

          itemArr.push(item)
        })
        setBzentyItems(itemArr);
        setParams((prev) => ({...prev, bzentyCd: itemArr[0].value}));
      }
    })

    setFlag(!flag)
  }, [])

  useEffect(() => { // 시도 코드 변경시 관할관청 재조회
    // 관할관청
    if(params.ctpvCd) {
      getLocalGovCodes(params.ctpvCd).then((res) => {
        let itemArr:SelectItem[] = [];
        if (res) {
          res.map((code: any) => {
            let item: SelectItem = {
              label: code['locgovNm'],
              value: code['locgovCd'],
            }
  
            itemArr.push(item)
          })
        }
        setLocgovCdItems(itemArr)
        setParams((prev) => ({...prev, locgovCd: itemArr[0].value}));
      })
    }
  }, [params.ctpvCd])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

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
        `/fsm/ilg/mau/tx/getAllLgByveAccmltUsgqty?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.bzmnSeCd ? '&bzmnSeCd=' + params.bzmnSeCd : ''}` +
        `${params.searchEdDate ? '&dlngYm=' + params.searchEdDate.replaceAll("-", "") : ''}`

      let averageEndpoint: string = 
        `/fsm/ilg/mau/tx/getAllByLgovAccmltUsgqty?locgovCd=${params.locgovCd ? params.locgovCd : ''}` +
        `${params.bzmnSeCd ? '&bzmnSeCd=' + params.bzmnSeCd : ''}` +
        `${params.searchEdDate ? '&dlngYm=' + params.searchEdDate.replaceAll("-", "") : ''}`

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

      const averageResponse = await sendHttpRequest('GET', averageEndpoint, null, true, {
        cache: 'no-store',
      })

      if (averageResponse && averageResponse.resultType === 'success' && averageResponse.data) {
        // 데이터 조회 성공시
        setAverageRows(averageResponse.data.content)
      } else {
        // 데이터가 없거나 실패
        setAverageRows([])
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
      setAverageRows([])
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

  const fetchDetailData = async () => {
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/ilg/mau/tx/getOneByveDelngDtls?` +
        `${'trauYmd=' + detailParams.dlngYm}` +
        `${'&locgovCd=' + detailParams.locgovCd}` +
        `${'&brno=' + detailParams.brno}` +
        `${'&vhclNo=' + detailParams.vhclNo}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setDetailRow(response.data.content)
        setDetailTotalRows(response.data.totalElements)
        setDetailPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        setDetailRow([])
        setDetailTotalRows(0)
        setDetailPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setDetailRow([])
      setDetailTotalRows(0)
      setDetailPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    } 
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (rowData: Row) => {
    setDetailParams({
      page: 1,
      size: 10,
      locgovCd: rowData.locgovCd,
      dlngYm: rowData.dlngYm,
      koiCd: rowData.koiCd,
      brno: rowData.brno,
      vhclNo: rowData.vhclNo,
      bzmnSeCd: rowData.bzmnSeCd
    })

    setDetailFlag(!detailFlag);
  }

  const handelDetailListPagenation = (page: number, pageSize: number) => {
    setDetailParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setDetailFlag(!detailFlag);
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

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    setSelectedTab(tabValue);
  }

  return (
    <PageContainer title="월 누적 사용량" description="월 누적 사용량">
      {/* breadcrumb */}
      <Breadcrumb title="월 누적 사용량" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
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
                거래년월
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">거래년월</CustomFormLabel>
              <CustomTextField type="month" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                사업자구분
              </CustomFormLabel>
              <select
                id="ft-select-02"
                className="custom-default-select"
                name="bzmnSeCd"
                value={params.bzmnSeCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {bzentyItems.map((option) => (
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
            <Button variant="contained" color="primary">
              엑셀
            </Button>
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}

      {/* 테이블영역 시작 */}
      {/* <Box display={averageRows.length > 0 ? 'block' : 'none'} sx={{ mb: 2 }}> */}
      <Box>
        <AverageTableDataGrid
          locgovItems={locgovCdItems} 
          headCells={averageHeadCells} 
          rows={averageRows} 
          totalRows={averageRows.length} 
          loading={loading} 
          onPaginationModelChange={() => {}} 
          onSortModelChange={handleSortModelChange} 
          onRowClick={() => {}} 
          pageable={pageable}
        />
      </Box>
      <Box>
        <TableDataGrid
          locgovItems={locgovCdItems}
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
      <Box display={detailRow.length > 0 ? 'block' : 'none'}>
        <DetailTableDataGrid 
          locgovItems={locgovCdItems} 
          headCells={detailHeadCells} 
          rows={detailRow} 
          totalRows={detailTotalRows} 
          loading={false} 
          onPaginationModelChange={handelDetailListPagenation} 
          onSortModelChange={handleSortModelChange} 
          onRowClick={() => {}} 
          pageable={detailPageable}        
        />
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
