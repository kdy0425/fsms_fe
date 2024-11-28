'use client'
import {
  Box,
  Button,
  FormControlLabel
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
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { SelectItem } from 'select'
import { HeadCell } from 'table'
import DetailTableDataGrid from './_components/DetailTableDataGrid'
import ModalContent from './_components/ModalContent'

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
    to: '/apv/bddd',
    title: '버스일별거래내역',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'cnptSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래원',
  },
  {
    id: 'dlngYmd',
    numeric: false,
    disablePadding: false,
    label: '거래일',
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
    id: 'vhclSeNm',
    numeric: false,
    disablePadding: false,
    label: '면허업종',
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
    id: 'dlngNocs',
    numeric: false,
    disablePadding: false,
    label: '거래건수',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '연료량합계',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액합계',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '보조금합계',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금합계',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금합계',
  },
]

const detailHeadCells: HeadCell[] = [
  {
    id: 'asstAmtClclnNm',
    numeric: false,
    disablePadding: false,
    label: '보조금정산',
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
  dlngYmd: string; // 거래연월일
  cnptSeCd: string; // 거래원코드
  cnptSeNm: string; // 거래원명
  dlngSeCd: string; // 거래구분코드
  dlngSeNm: string; // 거래구분명
  brno: string; // 사업자번호
  lbrctStleCd: string; // 주유형태코드
  lbrctStleNm: string; // 주유형태명
  koiCd: string; // 유종코드
  koiNm: string; // 유종명
  locgovCd: string; // 관할관청코드
  locgovNm: string; // 관할관청명
  vhclSeCd: string; // 면허업종코드
  vhclSeNm: string; // 면허업종명
  dlngNocs: string; // 거래건수
  aprvAmt: string; // 승인금액합계
  fuelQty: string; // 연료량합계
  asstAmt: string; // 보조금합계
  ftxAsstAmt: string; // 유류세연동보조금합계
  opisAmt: string; // 유가연동보조금합계
  bzentyNm: string; // 업체명
  rtrcnYn: string; // 취소포함여부
}

export interface DetailRow {
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

  const [detailRows, setDetailRows] = useState<DetailRow[]>();
  const [detailTotalRows, setDetailTotalRows] = useState(0);

  const [isLocgovCdAll, setIsLocgovCdAll] = useState<boolean>(false);
  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종 코드
  const [lbrctStleCdItems, setLbrctStleCdItems] = useState<SelectItem[]>([]); // 주유형태 코드
  const [vhclSeCdItems, setVhclSeCdItems] = useState<SelectItem[]>([]); // 면허업종 코드
  const [asstAmtClclnCdItems, setAsstAmtClclnCdItems] = useState<SelectItem[]>([]); // 보조금정산 코드

   // 기본 검색 날짜 범위 설정 (30일)
   const getDateRange = () => {
    const today = new Date();
    const before1Month = new Date();
    before1Month.setDate(today.getDate() - 30);
    
    let stYear:string = String(before1Month.getFullYear());
    let stMonth:string = String(before1Month.getMonth()+1).padStart(2, '0');
    let stDate:string = String(before1Month.getDate()).padStart(2, '0');

    let edYear = String(today.getFullYear());
    let edMonth = String(today.getMonth()+1).padStart(2, '0');
    let edDate = String(today.getDate()).padStart(2, '0');

    const startDate = stYear+"-"+stMonth+"-"+stDate;
    const endDate = edYear+"-"+edMonth+"-"+edDate;

    return({
      startDate: startDate,
      endDate: endDate
    })
  }

  

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? getDateRange().startDate, // 시작일
    searchEdDate: allParams.searchEdDate ?? getDateRange().endDate, // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
    ctpvCd: ''
  })

  const [detailParams, setDetailParams] = useState({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    dlngYmd: '',
    locgovCd: '',
    brno: '',
    vhclSeCd: '',
    koiCd: '',
    lbrctStleCd: '',
    dlngSeCd: '',
    cnptSeCd: '',
    rtrcnYn: ''
  })
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    // fetchData();
  }, [flag])

  // 기본 검색 날짜 범위 설정 1달

  // 초기 데이터 로드
  useEffect(() => {
    // select item 로드
    // 시도코드 
    getCityCodes().then((res) => {
      let itemArr:SelectItem[] = [];
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
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
      if(!params.ctpvCd) {
        alert("시도명을 선택해주세요.");
        return;
      }

      if(!isLocgovCdAll && !params.locgovCd) {
        alert("관할관청을 선택해주세요.");
        return;
      }

      if(!params.searchStDate || !params.searchEdDate) {
        alert("거래년월을 입력해주세요.");
        return;
      }

      // if(!params.brno) {
      //   alert("사업자등록번호를 입력해주세요.");
      //   return;
      // }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/bddd/bs/getAllBusDalyDelngDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", "") : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", "") : ''}` + 
        `${!isLocgovCdAll && params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
        `${!isLocgovCdAll && params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.rtrcnYn ? '&rtrcnYn=' + params.rtrcnYn : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.asstAmtClclnCd ? '&asstAmtClclnCd=' + params.asstAmtClclnCd : ''}` +
        `${params.vhclSeCd ? '&vhclSeCd=' + params.vhclSeCd : ''}` +
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
        `${params.lbrctStleCd ? '&lbrctStleCd=' + params.lbrctStleCd : ''}` +
        ``

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRows(response.data);
        setTotalRows(response.data.length)
      } else {
        // 데이터가 없거나 실패
        setRows([])
        setTotalRows(0)
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows([])
      setTotalRows(0)
    } finally {
      setDetailRows([])
      setDetailTotalRows(0)
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
    setDetailParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  const fetchDetailData = async () => {
    try {
      let endpoint = `/fsm/apv/bddd/bs/getAllBusDelngDtls?page=${detailParams.page - 1}&size=${detailParams.size}` +
      `${detailParams.dlngYmd ? '&dlngYmd=' + detailParams.dlngYmd : ''}` +
      `${detailParams.locgovCd ? '&locgovCd=' + detailParams.locgovCd : ''}` +
      `${detailParams.brno ? '&brno=' + detailParams.brno : ''}` +
      `${detailParams.vhclSeCd ? '&vhclSeCd=' + detailParams.vhclSeCd : ''}` +
      `${detailParams.koiCd ? '&koiCd=' + detailParams.koiCd : ''}` +
      `${detailParams.lbrctStleCd ? '&lbrctStleCd=' + detailParams.lbrctStleCd : ''}` +
      `${detailParams.dlngSeCd ? '&dlngSeCd=' + detailParams.dlngSeCd : ''}` +
      `${detailParams.cnptSeCd ? '&cnptSeCd=' + detailParams.cnptSeCd : ''}` +
      `${detailParams.rtrcnYn ? '&rtrcnYn=' + detailParams.rtrcnYn : ''}`;

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setDetailRows(response.data.content);
        setDetailTotalRows(response.data.totalElements);
        setPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        setDetailRows([])
        setDetailTotalRows(0)
      }
    }catch(error) {
      setDetailRows([])
      setDetailTotalRows(0)
    }
  }

  const excelDownload = async () => {
    try {
      let endpoint: string =
      `/fsm/apv/bddd/bs/getExcelBusDalyDelngDtls?page=${params.page - 1}&size=${params.size}` +
      `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
      `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", "") : ''}` +
      `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", "") : ''}` + 
      `${!isLocgovCdAll && params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
      `${!isLocgovCdAll && params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
      `${params.rtrcnYn ? '&rtrcnYn=' + params.rtrcnYn : ''}` +
      `${params.brno ? '&brno=' + params.brno : ''}` +
      `${params.asstAmtClclnCd ? '&asstAmtClclnCd=' + params.asstAmtClclnCd : ''}` +
      `${params.vhclSeCd ? '&vhclSeCd=' + params.vhclSeCd : ''}` +
      `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
      `${params.lbrctStleCd ? '&lbrctStleCd=' + params.lbrctStleCd : ''}` +
      ``

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '버스일별거래내역.xlsx');
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

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (row: Row) => {
    setDetailParams((prev) => ({
      ...prev,
      page: 1,
      dlngYmd: row.dlngYmd ? row.dlngYmd : '',
      locgovCd: row.locgovCd ? row.locgovCd : '',
      brno: row.brno ? row.brno: '',
      vhclSeCd: row.vhclSeCd ? row.vhclSeCd : '',
      koiCd: row.koiCd ? row.koiCd : '',
      lbrctStleCd: row.lbrctStleCd ? row.lbrctStleCd : '',
      dlngSeCd: row.dlngSeCd ? row.dlngSeCd : '',
      cnptSeCd: row.cnptSeCd ? row.cnptSeCd : '',
      rtrcnYn: row.rtrcnYn ? row.rtrcnYn : ''
    }))
  }

  useEffect(() => {
    if(detailParams.locgovCd && detailParams.brno) {
      fetchDetailData();
    }
  }, [detailParams])

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
      if(name === 'rtrcnYn') {
        value === 'on' ? setParams((prev) => ({ ...prev, [name]: 'Y' })) : setParams((prev) => ({ ...prev, [name]: 'N' }))
      }else {
        setParams((prev) => ({ ...prev, [name]: value }))
      }
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
    <PageContainer title="버스일별거래내역" description="버스일별거래내역">
      {/* breadcrumb */}
      <Breadcrumb title="버스일별거래내역" items={BCrumb} />
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
          </div><hr></hr>
          <div className="filter-form">
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
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button onClick={() => fetchData()} variant="contained" color="primary">
              조회
            </Button>
            <Button onClick={() => excelDownload()} variant="contained" color="primary">
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
        />

        {detailRows && detailRows.length > 0 &&
          <DetailTableDataGrid 
            headCells={detailHeadCells} 
            rows={detailRows} 
            totalRows={detailTotalRows} 
            loading={loading} 
            onPaginationModelChange={handlePaginationModelChange} 
            onSortModelChange={() => {}} 
            pageable={pageable}          
          />
        }
      </Box>
      {/* 테이블영역 끝 */}
      
    </PageContainer>
  )
}

export default DataList
