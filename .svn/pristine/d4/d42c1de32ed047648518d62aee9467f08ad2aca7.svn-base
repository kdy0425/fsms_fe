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
import FormDialog from './_components/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'
import { SelectItem } from 'select'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'


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
    to: '/apv/bds',
    title: '업체별거래현황',
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
    id: 'dlngYm',
    numeric: false,
    disablePadding: false,
    label: '거래년월',
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
    id: 'vhclSeNm',
    numeric: false,
    disablePadding: false,
    label: '면허업종',
  },
  {
    id: 'koiNm',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'lbrctStleNm',
    numeric: false,
    disablePadding: false,
    label: '주유형태',
  },
  {
    id: 'dlngNocs',
    numeric: false,
    disablePadding: false,
    label: '거래건수',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '주유/충전량',
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
]

// {
//   "dlngDt": "2024-10-06 07:02:50",
//   "dlngYmd": "20241006",
//   "brno": "1068191846",
//   "vhclNo": "서울70사6801",
//   "asstAmtClclnCd": "0",
//   "cardNo": "9439********7445",
//   "frcsNm": "에이치디현대오일",
//   "aprvAmt": "75790",
//   "fuelQty": "53.00000",
//   "asstAmt": "10938",
//   "ftxAsstAmt": "10938",
//   "opisAmt": "0",
//   "asstAmtClclnNm": "일반거래",
// "locgovNm": "서울 용산구",
// "bzentyNm": "(주)태영교통",
// "lbrctStleNm": "일반주유",
// "koiNm": "경유",
// "vhclSeNm": "마을버스",
// "cnptSeNm": "CARD"
// },

export interface Row {
  dlngYm?: string // 거래년월                     // 모달 헤더에서 사용됨. 
  locgovNm?: string // 지자체명                   // 모달 헤더에서 사용됨.
  locgovCd?: string // 지자체코드
  brno?: string // 사업자번호                     // 모달 헤더에서 사용됨.
  bzentyNm?: string // 업체명
  vhclSeNm?: string // 면허업종
  koiNm?: string // 유종
  lbrctStleNm?: string // 주유형태
  dlngNocs?: string // 거래건수?
  aprvAmt?: string // 거래건수?
  fuelQty?: string // 주유/충전량
  asstAmt?: string // 보조금
  ftxAsstAmt?: string // 유류세연동보조금
  opisAmt?: string // 유가연동보조금

  vhclSeCd?: string
  koiCd?: string // 유종
  lbrctStleCd?: string
  cardNo?: any // 카드번호
  setlApvlYmd?: any // ?
  stlmAprvYmd?: any // ?
  vhclNo?: any // 차량번호
  dlngDt?: any // ?
  cnptSeCd?: any // ?

  cnptSeNm?: any // ?
}

const rowData: Row[] = [
  {
    dlngYm: '202410',
    locgovCd: '11500',
    brno: '2588102076',
    vhclSeCd: '19',
    koiCd: 'D',
    lbrctStleCd: '3',
    dlngNocs: '37',
    fuelQty: '5715.00000',
    aprvAmt: '0',
    asstAmt: '1179446',
    ftxAsstAmt: '1179446',
    opisAmt: '0',
    cardNo: null,
    setlApvlYmd: null,
    stlmAprvYmd: null,
    vhclNo: null,
    dlngDt: null,
    cnptSeCd: null,
    locgovNm: '강서구',
    bzentyNm: '주식회사 한국공항리무진',
    lbrctStleNm: '자가주유',
    koiNm: '경유',
    vhclSeNm: '시내버스',
    cnptSeNm: null,
  },
  {
    dlngYm: '202410',
    locgovCd: '11500',
    brno: '2588102076',
    vhclSeCd: '19',
    koiCd: 'D',
    lbrctStleCd: '3',
    dlngNocs: '37',
    fuelQty: '5715.00000',
    aprvAmt: '0',
    asstAmt: '1179446',
    ftxAsstAmt: '1179446',
    opisAmt: '0',
    cardNo: null,
    setlApvlYmd: null,
    stlmAprvYmd: null,
    vhclNo: null,
    dlngDt: null,
    cnptSeCd: null,
    locgovNm: '강서구',
    bzentyNm: '주식회사 한국공항리무진',
    lbrctStleNm: '자가주유',
    koiNm: '경유',
    vhclSeNm: '시내버스',
    cnptSeNm: null,
  },
]

// {
//   "dlngYm": "202410",
//   "locgovCd": "11500",
//   "brno": "2588102076",
//   "vhclSeCd": "19",
//   "koiCd": "D",
//   "lbrctStleCd": "3",
//   "dlngNocs": "37",
//   "fuelQty": "5715.00000",
//   "aprvAmt": "0",
//   "asstAmt": "1179446",
//   "ftxAsstAmt": "1179446",
//   "opisAmt": "0",
//   "cardNo": null,
//   "setlApvlYmd": null,
//   "stlmAprvYmd": null,
//   "vhclNo": null,
//   "dlngDt": null,
//   "cnptSeCd": null,
//   "locgovNm": "강서구",
//   "bzentyNm": "주식회사 한국공항리무진",
//   "lbrctStleNm": "자가주유",
//   "koiNm": "경유",
//   "vhclSeNm": "시내버스",
//   "cnptSeNm": null
// },

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

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [detailflag, setDetailFlag] = useState<number>(0) // 데이터 갱신을 위한 플래그 설정


  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [cityCode, setCityCode] = useState<SelectItem[]>([])  //        시도 코드
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([]) // 관할관청 코드
  const [koiCd, setKoicd] = useState<SelectItem[]>([]); // 유종 코드
  const [lbrctStleCd, setLbrctStleCd] = useState<SelectItem[]>([]); // 주유형태 코드
  const [vhclSeCd, setVhclSeCd] = useState<SelectItem[]>([]); // 면허업종 코드

  
  const [selectedRow, setSelectedRow] = useState<Row>();  // 선택된 Row를 저장할 state
  const [isModalOpen, setIsModalOpen] = useState(false);    // modal   오픈 상태 
  const [detailRows, setDetailRows] = useState<Row[]>([]);  // 거래내역에 대한 Row


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

  const handleTonChange = (event: any) => {
    setTon(event.target.value)
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


// useEffect 내에서 조건 추가
useEffect(() => {
  if (detailflag > 0) { // detailflag가 1 이상일 때만 실행
    fetchDetails(selectedRow);
  }
}, [detailflag]);


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
      setLbrctStleCd(itemArr);
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
      setVhclSeCd(itemArr);
    })

    // 유종코드
    getCodesByGroupNm('599').then((res) => {
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
      setKoicd(itemArr);
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
      return dateString;
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
        `/fsm/apv/bds/bs/getAllByenDelngSttus?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.vhclSeCd ? '&vhclSeCd=' + params.vhclSeCd : ''}` +
        `${params.koiCd ? '&' + 'koiCd' + '=' + params.koiCd : ''}` +
        `${params.lbrctStleCd ? '&' + 'lbrctStleCd' + '=' + params.lbrctStleCd : ''}` +
        `${params.bgngDt ? '&bgngDt=' + formatDate(params.bgngDt) : ''}` +
        `${params.endDt ? '&endDt=' + formatDate(params.endDt) : ''}`


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
    const fetchDetails = async (selectedRow:Row | undefined) => {
      setLoading(true)

      if(selectedRow == undefined){
        alert('가져온 데이터가 없습니다.')
        return;
      }
      try {
        // 검색 조건에 맞는 endpoint 생성
        let endpoint: string =
          `/fsm/apv/bds/bs/getAllByenDelngSttusDtl?page=` +
          `${selectedRow.locgovCd ? '&locgovCd=' + selectedRow.locgovCd : ''}` +
          `${selectedRow.brno ? '&brno=' + selectedRow.brno : ''}` +
          `${selectedRow.dlngYm ? '&dlngYm=' + selectedRow.dlngYm : ''}` +
          `${selectedRow.vhclSeCd ? '&vhclSeCd=' + selectedRow.vhclSeCd : ''}` +
          `${selectedRow.koiCd ? '&' + 'koiCd' + '=' + selectedRow.koiCd : ''}` +
          `${selectedRow.lbrctStleCd ? '&lbrctStleCd=' + selectedRow.lbrctStleCd : ''}` 

  
        const response = await sendHttpRequest('GET', endpoint, null, true, {
          cache: 'no-store',
        })
        if (response && response.resultType === 'success' && response.data) {
          // 데이터 조회 성공시
          setDetailRows(response.data)
        } else {
          console.error('no surch fetching data:')
          setDetailRows([])
        }
      } catch (error) {
        // 에러시
        console.error('Error fetching data:', error)
        setDetailRows([])
      } finally {
        setLoading(false)
      }
    }

    const excelDownload = async () => {
      if(selectedRow == undefined){
        alert('액셀파일을 다운로드할 데이터가 없습니다.')
        return;
      }
      try {
        let endpoint: string =
        `/fsm/apv/bds/bs/getExcelByenDelngSttus?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.vhclSeCd ? '&vhclSeCd=' + params.vhclSeCd : ''}` +
        `${params.koiCd ? '&' + 'koiCd' + '=' + params.koiCd : ''}` +
        `${params.lbrctStleCd ? '&' + 'lbrctStleCd' + '=' + params.lbrctStleCd : ''}` +
        `${params.bgngDt ? '&bgngDt=' + formatDate(params.bgngDt) : ''}` +
        `${params.endDt ? '&endDt=' + formatDate(params.endDt) : ''}`
        
  
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


    const excelDownloadDetail = async (selectedRow:Row) => {
      if(selectedRow == undefined){
        alert('액셀파일을 다운로드할 데이터가 없습니다.')
        return;
      }
      try {
        let endpoint: string =
        `/fsm/apv/bds/bs/getExcelByenDelngSttusDtl?` +
          `${selectedRow.locgovCd ? '&locgovCd=' + selectedRow.locgovCd : ''}` +
          `${selectedRow.brno ? '&brno=' + selectedRow.brno : ''}` +
          `${selectedRow.dlngYm ? '&dlngYm=' + formatDate(selectedRow.dlngYm) : ''}` +
          `${selectedRow.vhclSeCd ? '&vhclSeCd=' + selectedRow.vhclSeCd : ''}` +
          `${selectedRow.koiCd ? '&' + 'koiCd' + '=' + selectedRow.koiCd : ''}` +
          `${selectedRow.lbrctStleCd ? '&lbrctStleCd=' + selectedRow.lbrctStleCd : ''}` 
        
  
          const response = await sendHttpFileRequest('GET', endpoint, null, true, {
            cache: 'no-store',
          })
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'detailTest.xlsx');
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

  const handleDetailSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setDetailFlag((prev) => prev + 1); // 플래그 증가
  };

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

  const handleModalOpen = async () => {
    if (selectedRow) {
      await fetchDetails(selectedRow);
      setIsModalOpen(true);
    } else {
      alert('행을 먼저 선택하세요.');
    }
  };



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

  return (
    <PageContainer title="업체별거래현황" description="업체별거래현황">
      {/* breadcrumb */}
      <Breadcrumb title="업체별거래현황" items={BCrumb} />
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
                사업자등록번호
              </CustomFormLabel>
              <CustomTextField  name="brno"
                value={params.brno}
                onChange={handleSearchChange}  type="text" id="ft-car-name" fullWidth />
            </div>
          </div><hr></hr>
          <div className="filter-form">
          <div className="form-group">
                <CustomFormLabel className="input-label-display">
                  <span className="required-text" >*</span>거래년월
                </CustomFormLabel>
                <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">청구 년월</CustomFormLabel>
                <CustomTextField  type="month" id="ft-date-start" name="bgngDt" value={params.bgngDt} onChange={handleSearchChange} fullWidth />
                ~ 
                <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">청구 종료 년월</CustomFormLabel>
                <CustomTextField type="month" id="ft-date-end" name="endDt" value={params.endDt} onChange={handleSearchChange} fullWidth />
              </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton-select-02">
                주유형태
              </CustomFormLabel>
              <select
                id="ft-ton-select-02"
                className="custom-default-select"
                name="lbrctStleCd"
                value={params.lbrctStleCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {lbrctStleCd.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton-select-03">
                면허업종
              </CustomFormLabel>
              <select
                id="ft-ton-select-03"
                className="custom-default-select"
                name="vhclSeCd"
                value={params.vhclSeCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {vhclSeCd.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton-select-04">
                유종
              </CustomFormLabel>
              <select
                id="ft-ton-select-04"
                className="custom-default-select"
                name="koiCd"
                value={params.koiCd}
                onChange={handleSearchChange}
                style={{ width: '50%' }}
              >
                {koiCd.map((option) => (
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
          <Button type="submit" variant="contained" color="primary">
              조회
            </Button>
            {/* 
            <Button variant="contained" color="primary">
              수정
            </Button>
            <Button variant="contained" color="primary">
              삭제
            </Button> */}
            <Button onClick={() => excelDownload()} variant="contained" color="primary">
              엑셀
            </Button>

            {/* locgovCd
            brno
            dlngYm
            vhclSeCd
            koiCd
            lbrctStleCd */}

        <FormDialog
        size="lg"
        buttonLabel="거래상세내역"
        title="거래상세내역조회"
        seletedRow = {selectedRow as Row}
        excelDownloadDetail= {excelDownloadDetail}
        children={<ModalContent rows={detailRows} />}
        onOpen={handleModalOpen} // 모달 열기 전에 handleModalOpen 호출
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

      {/* <Box className="table-bottom-button-group">
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
