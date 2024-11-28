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
import BlankCard from '@/app/components/shared/BlankCard'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpFileRequest, sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import TableDataGrid from '@/app/components/tables/CommDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell, Pageable  } from 'table'
import { getCtpvCd, getCommCd, getLocGovCd, getDateRange, isValidDateRange, sortChange, getExcelFile, getToday} from '@/utils/fsms/common/comm'
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
    title: '통합주유정보',
  },
  {
    to: '/apv/ld',
    title: '주유내역',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'taskSeNm',
    numeric: false,
    disablePadding: false,
    label: '구분',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래기간',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '지자체명',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자번호',
    format: 'brno',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금합계',
    format: 'number',
    align: 'td-right',
  },
]

const vhclHeadCells: HeadCell[] = [
  {
    id: 'taskSeNm',
    numeric: false,
    disablePadding: false,
    label: '구분',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래기간',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '지자체명',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자번호',
    format: 'brno',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금합계',
    format: 'number',
    align: 'td-right',
  },
]

const detailTrHeadCells: HeadCell[] = [
  {
    id: 'cnptSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래방법',
  },
  {
    id: 'dlngSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래구분',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
    format: 'yyyymmddhh24miss',
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
    format: 'brno',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체(차주명)',
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
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '사용량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
]

const detailTxHeadCells: HeadCell[] = [
  {
    id: 'cnptSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래방법',
  },
  {
    id: 'dlngSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래구분',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
    format: 'yyyymmddhh24miss',
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
    format: 'brno',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체(차주명)',
  },
  {
    id: 'koiNm',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'bzmnSeNm',
    numeric: false,
    disablePadding: false,
    label: '개인/법인',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '사용량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
]

const detailBsHeadCells: HeadCell[] = [
  {
    id: 'cnptSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래방법',
  },
  {
    id: 'dlngSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래구분',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
    format: 'yyyymmddhh24miss',
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
    format: 'brno',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체(차주명)',
  },
  {
    id: 'koiNm',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'vhclSeNm',
    numeric: false,
    disablePadding: false,
    label: '면허업종',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '사용량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
]

export interface Row {
  taskSeNm:string; //구분
  dlngBgngYmd:string; //거래시작일자
  dlngEndYmd:string; //거래종료일자
  locgovNm:string; //지자체명
  brno:string; //사업자번호
  vhclNo:string; //차량번호
  bzentyNm:string; //업체명
  asstAmtLiter:string; //보조량
  ftxAsstAmt:string; //유류세연동보조금
  opisAmt:string; //유가연동보조금
  asstAmt:string; //유가보조금합계
  taskSeCd:string; //업무구분코드
  locgovCd:string; //관할관청코드
  koiCd:string; //유종코드
}

export interface DetailRow {
  cnptSeNm: string;//거래방법
  dlngSeNm: string;//거래구분
  dlngDt: string;//거래일시
  vhclNo: string;//차량번호
  brno: string;//사업자번호
  bzentyNm: string;//업체(차주명)
  koiNm: string;//유종코드
  vhclTonNm: string;//톤수
  bzmnSeNm: string;//개인/법인
  vhclSeNm: string;//면허업종
  aprvAmt: string;//승인금액
  fuelQty: string;//사용량
  asstAmtLiter: string;//보조량
  asstAmt: string;//유가보조금
  ftxAsstAmt: string;//유류세연동보조금
  opisAmt: string;//유가연동보조금
  frcsNm: string;//가맹점명
}

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  detailSort: string
  detailPage: number
  detailSize: number
  searchStDate: string
  searchEdDate: string
  [key: string]: string | number // 인덱스 시그니처 추가
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

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종 코드
  const [taskSeCdItems, setTaskSeCdItems] = useState<SelectItem[]>([]); // 업무구분 코드
  const [vhclFalg, setVhclFlag] = useState<boolean>(false); //차량번호플래그

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    detailPage: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    detailSize: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? '', // 시작일
    searchEdDate: allParams.searchEdDate ?? '', // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
    detailSort: allParams.sort ?? '', // 정렬 기준 추가
  })

  const [detailParams, setDetailParams] = useState({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    taskSeCd: '',
    locgovCd: '',
    dlngBgngYmd: '',
    dlngEndYmd: '',
    vhclNo: '',
    brno: '',
  })
  //
  const [pageable, setPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })
  //
  const [detailPageable, setDetailPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if(params.ctpvCd || params.locgovCd) {
      //fetchData()
    }
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

    const dateRange = getDateRange('d', 30);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))

    getCtpvCd().then((itemArr) => {
      setCtpvCdItems(itemArr);
      setParams((prev) => ({...prev, ctpvCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
    })// 시도코드 
    
    getCommCd('599', '전체').then((itemArr) => setKoicdItems(itemArr))// 유종코드
    getCommCd('096', '전체').then((itemArr) => setTaskSeCdItems(itemArr))//업무구분코드

  }, [])

  useEffect(() => { // 시도 코드 변경시 관할관청 재조회
    // 관할관청
    if(params.ctpvCd) {
      getLocGovCd(params.ctpvCd).then((itemArr) => {
        setLocgovCdItems(itemArr);
        setParams((prev) => ({...prev, locgovCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
      })
    }
  }, [params.ctpvCd])

  useEffect(() => { //상세내역 조회
    if(detailParams.locgovCd) {
      fetchDetailData();
    }
  }, [detailParams])

  useEffect(() => { //첫행조회
    if(rows.length>0) {
      handleRowClick(rows[0]);
    }
  }, [rows])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    setVhclFlag(false);
    if(params.vhclNo){
      setVhclFlag(true);
    }
    try {
      if(!params.ctpvCd) {
        alert("시도명을 선택해주세요.");
        return;
      }

      if(!params.locgovCd) {
        alert("관할관청을 선택해주세요.");
        return;
      }

      if(!params.searchStDate || !params.searchEdDate) {
        alert("거래년월을 입력해주세요.");
        return;
      }

      if(!params.brno && !params.vhclNo) {
        alert("사업자등록번호 또는 차량번호를 입력해주세요.");
        return;
      }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/ld/cm/getAllLbrctDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchStDate ? '&dlngBgngYmd=' + params.searchStDate : ''}` +
        `${params.searchEdDate ? '&dlngEndYmd=' + params.searchEdDate : ''}`+
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
        `${params.taskSeCd ? '&taskSeCd=' + params.taskSeCd : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}`

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
      setRows([])
      setTotalRows(0)
      setPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    } finally {
      setDetailRows([])
      setDetailTotalRows(0)
      setLoading(false)
    }
  }
    
  const excelDownload = async () => {
      let endpoint: string =
      `/fsm/apv/ld/cm/getExcelLbrctDtls?` +
      `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
      `${params.searchStDate ? '&dlngBgngYmd=' + params.searchStDate : ''}` +
      `${params.searchEdDate ? '&dlngEndYmd=' + params.searchEdDate : ''}`+
      `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
      `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
      `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
      `${params.taskSeCd ? '&taskSeCd=' + params.taskSeCd : ''}` +
      `${params.brno ? '&brno=' + params.brno : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}`

      getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_'+getToday()+'.xlsx')
  }

  const fetchDetailData = async () => {
    try {
      let endpoint = `/fsm/apv/ld/cm/getAllDelngDtls?page=${detailParams.page - 1}&size=${detailParams.size}` +
      `${detailParams.taskSeCd ? '&taskSeCd=' + detailParams.taskSeCd : ''}` +
      `${detailParams.locgovCd ? '&locgovCd=' + detailParams.locgovCd : ''}` +
      `${detailParams.dlngBgngYmd ? '&dlngBgngYmd=' + detailParams.dlngBgngYmd : ''}` +
      `${detailParams.dlngEndYmd ? '&dlngEndYmd=' + detailParams.dlngEndYmd : ''}` +
      `${detailParams.vhclNo ? '&vhclNo=' + detailParams.vhclNo : ''}` +
      `${detailParams.brno ? '&brno=' + detailParams.brno : ''}` +
      `${params.koiCd ? '&koiCd=' + params.koiCd : ''}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setDetailRows(response.data.content);
        setDetailTotalRows(response.data.totalElements);
        setDetailPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        setDetailRows([])
        setDetailTotalRows(0)
        setDetailPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    }catch(error) {
      setDetailRows([])
      setDetailTotalRows(0)
      setDetailPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
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
    setDetailRows([])
    setDetailTotalRows(0)
  }

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const detailhandlePaginationModelChange = (page: number, pageSize: number) => {
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

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (row: Row) => {
    setDetailParams((prev) => ({
      ...prev,
      page: 1,
      taskSeCd: row.taskSeCd ? row.taskSeCd : '',
      locgovCd: row.locgovCd ? row.locgovCd : '',
      dlngBgngYmd: row.dlngBgngYmd ? row.dlngBgngYmd : '',
      dlngEndYmd: row.dlngEndYmd ? row.dlngEndYmd : '',
      vhclNo: row.vhclNo ? row.vhclNo : '',
      brno: row.brno ? row.brno : '',
    }))
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

  return (
    <PageContainer title="주유내역" description="주유내역">
      {/* breadcrumb */}
      <Breadcrumb title="주유내역" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                <span className="required-text" >*</span>거래일자
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">거래년월일 시작</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~ 
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">거래년월일 종료</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
            
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
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-02">
                업무구분
              </CustomFormLabel>
              <select
                id="ft-select-02"
                className="custom-default-select"
                name="taskSeCd"
                value={params.taskSeCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {taskSeCdItems.map((option) => (
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
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-02">
                유종
              </CustomFormLabel>
              <select
                id="ft-select-02"
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
          headCells={params.vhclNo? vhclHeadCells : headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 수
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          paging={true}
          cursor={true}
        />
        
        {detailRows && detailRows.length > 0 &&
          <BlankCard className="contents-card" title="상세 거래내역">
              <TableDataGrid 
                headCells={detailParams.taskSeCd == 'TR' ? detailTrHeadCells : detailParams.taskSeCd == 'TX' ? detailTxHeadCells : detailBsHeadCells} 
                rows={detailRows} 
                totalRows={detailTotalRows} 
                loading={loading} 
                onRowClick={() => {}} // 행 클릭 핸들러 추가
                onPaginationModelChange={detailhandlePaginationModelChange} 
                onSortModelChange={() => {}} 
                pageable={detailPageable}
                paging={true}
              />
          </BlankCard>
        }
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
