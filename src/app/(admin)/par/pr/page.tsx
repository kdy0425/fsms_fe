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

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'
import { getDateRange, getCtpvCd, getLocGovCd, getCommCd, getToday, getExcelFile } from '@/utils/fsms/common/comm'
import { SelectItem } from 'select'
import TableDataGrid from './_components/TableDataGrid'
import DetailDataGrid from './_components/DetailDataGrid'
import FormModal from './_components/FormModal'
import HeaderTab, { Tab } from '@/app/components/tables/HeaderTab'


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '서면신청',
  },
  {
    title: '화물서면신청',
  },
  {
    to: '/par/pr',
    title: '서면신청관리',
  },
]

const tabs: Tab[] = [
  {
    value: '1',
    label: 'RFID',
    active: false
  },
  {
    value: '2',
    label: '거래확인',
    active: false
  },
]

const rfIdHeadCells: HeadCell[] = [
  {
    id: 'lbrctYmd',
    numeric: false,
    disablePadding: false,
    label: '주유월',
    format: 'yyyy년mm월'
  },
  {
    id: 'lbrctCnt',
    numeric: false,
    disablePadding: false,
    label: '주유건수',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'vhclCnt',
    numeric: false,
    disablePadding: false,
    label: '차량대수',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '주유량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmtGroup',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
    groupHeader: true
  },
  {
    id: 'lbrctGiveAmt',
    numeric: false,
    disablePadding: false,
    label: '지급금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'lbrctGiveNotAmt',
    numeric: false,
    disablePadding: false,
    label: '미지금금액',
    format: 'number',
    align: 'td-right',
  },
]

const rfIdSubHeadCells: HeadCell[] = [
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '합계',
    format: 'number',
    align: 'td-right',
    groupId: 'asstAmtGroup'
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동',
    format: 'number',
    align: 'td-right',
    groupId: 'asstAmtGroup'
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동',
    format: 'number',
    align: 'td-right',
    groupId: 'asstAmtGroup'
  },
]

const rfIdVhclHeadCells: HeadCell[] = [
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'lbrctCnt',
    numeric: false,
    disablePadding: false,
    label: '주유건수',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '주유량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'asstAmtGroup',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
    groupHeader: true
  },
  {
    id: 'lbrctGiveAmt',
    numeric: false,
    disablePadding: false,
    label: '지급금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'lbrctGiveNotAmt',
    numeric: false,
    disablePadding: false,
    label: '미지금금액',
    format: 'number',
    align: 'td-right',
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
    id: 'dpstrNm',
    numeric: false,
    disablePadding: false,
    label: '예금주명',
  },
  {
    id: 'bankNm',
    numeric: false,
    disablePadding: false,
    label: '금융기관',
  },
  {
    id: 'actno',
    numeric: false,
    disablePadding: false,
    label: '계좌번호',
  },
]
const dealConfirmHeadCells: HeadCell[] = [
  {
    id: 'clclnYm',
    numeric: false,
    disablePadding: false,
    label: '정산월',
    format: 'yyyy년mm월'
  },
  {
    id: 'lbrctCnt',
    numeric: false,
    disablePadding: false,
    label: '주유건수',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'totlAprvAmt',
    numeric: false,
    disablePadding: false,
    label: '거래금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'vhclCnt',
    numeric: false,
    disablePadding: false,
    label: '차량대수',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'totlUseLiter',
    numeric: false,
    disablePadding: false,
    label: '주유량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'totlPerAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
    groupHeader: true
  },
  {
    id: 'totlAsstGiveAmt',
    numeric: false,
    disablePadding: false,
    label: '지급금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'totlAsstGiveNotAmt',
    numeric: false,
    disablePadding: false,
    label: '미지금금액',
    format: 'number',
    align: 'td-right',
  },
]

const dealConfirmSubHeadCells: HeadCell[] = [
  {
    id: 'totlAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '합계',
    format: 'number',
    align: 'td-right',
    groupId: 'asstAmtGroup'
  },
  {
    id: 'totlFtxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동',
    format: 'number',
    align: 'td-right',
    groupId: 'asstAmtGroup'
  },
  {
    id: 'totlOpisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동',
    format: 'number',
    align: 'td-right',
    groupId: 'asstAmtGroup'
  },
]

const dealConfirmVhclHeadCells: HeadCell[] = [
  {
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'totlCnt',
    numeric: false,
    disablePadding: false,
    label: '주유건수',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'totlUseLiter',
    numeric: false,
    disablePadding: false,
    label: '주유량',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'totlAsstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
    format: 'lit',
    align: 'td-right',
  },
  {
    id: 'totlAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align: 'td-right',
    groupHeader: true
  },
  {
    id: 'totlAsstGiveAmt',
    numeric: false,
    disablePadding: false,
    label: '지급금액',
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'totlAsstGiveNotAmt',
    numeric: false,
    disablePadding: false,
    label: '미지금금액',
    format: 'number',
    align: 'td-right',
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
    id: 'dpstrNm',
    numeric: false,
    disablePadding: false,
    label: '예금주명',
  },
  {
    id: 'bankNm',
    numeric: false,
    disablePadding: false,
    label: '금융기관',
  },
  {
    id: 'actno',
    numeric: false,
    disablePadding: false,
    label: '계좌번호',
  },
]

export interface Row {
  dlngYmd: string;
  onlnDocmntAplyYn: string;
  onlnDocmntAplyNm: string;
  docmntAplySttsCd: string;
  docmntAplySttsNm: string;
  brno: string;
  bzentyNm: string;
  vhclSeCd: string;
  vhclSeNm: string;
  lbrctStleCd: string;
  lbrctStleNm: string;
  docmntAplyUnqNo: string;
  cnptSeCd: string;
  cnptSeNm: string;
  locgovCd: string;
  locgovNm: string;
  fileNm: string;
  fileExtnNm: string;
  transCnt: string;
  carCnt: string;
  sumFuelQty: string;
  sumAsstAmt: string;
  asstAmt: number;
  ftxAsstAmt: number;
  opisAmt: number;
  vhclNo: string;
  dlngYm: string;
  dlngTm: string;
  dlngYmdtm: string;
  origDlngYmd: string;
  origDlngTm: string;
  origDlngYmdtm: string;
  dlngSeCd: string;
  cardSeCd: string;
  crdcoCd: string;
  cardNo: string;
  cardNoS: string;
  frcsNm: string;
  frcsBrno: string;
  aprvAmt: string;
  koiCd: string;
  koiNm: string;
  fuelQty: string;
  asstAmtClclnCd: string;
  stlmYn: string;
  stlmCardNoS: string;
  stlmAprvNo: string;
  stlmAprvYmd: string;
  stlmAprvYmdtm: string;
  splitYn: string;
  unsetlAmt: string;
  rtrcnYn: string;
  remark: string;
  imgRecog1VhclNo: string;
  imgRecog2VhclNo: string;
  telno: string;
  addr: string;
  cardDlngTypeCd: string;
  cardDlngTypeNm: string;
  dlngTypeCd: string;
  dlngTypeNm: string;
  carmdlSeCd: string;
  carmdlSeNm: string;
  dlngBgngYmd: string;
  dlngEndYmd: string;
  giveUntprc: string;
  giveActno: string;
  giveBacntNm: string;
  giveSeCd: string;
  giveSeNm: string;
  giveImprtyRsnCn: string;
  atchFileYn: string;
  atchFileNm: string;
  detailCnt: string;
  regYmd: string;
  bzmnSeCd: string;
  bzmnSeNm: string;
  docmntAplySn: string;
  dlngMnsNo: string;
  crdcoNm: string;
  oltCdNo: string;
  oilStaNm: string;
  apvlDt: string;
  chk: string;
  lbrctYmd: string;
  lbrctCnt: number;
  vhclCnt: number;
  useLiter: number;
  lbrctGiveAmt: number;
  lbrctGiveNotAmt: number;
  lbrctYm: string;
  crno: string;
  asstAmtLiter: number;
  vhclTonCd: string;
  bankCd: string;
  actno: string;
  dpstrNm: string;
  bacntInfoSn: number;
  vhclTonNm: string;
  bankNm: string;
  aplySn: number;
  lbrctYmdTm: string;
  lbrctTm: string;
  giveCfmtnYn: string;
  giveCfmtnYmd: string;
  giveCfmtnTxt: string;
  giveCfmtnYmdD: string;
  rcptSeqNo: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
  clclnYm: string;
  totlCnt: number;
  totlAprvAmt: number;
  totlPerAmt: number;
  totlAsstAmt: number;
  totlOpisAmt: number;
  totlFtxAsstAmt: number;
  totlUseLiter: number;
  totlAsstGiveAmt: number;
  totlAsstGiveNotAmt: number;
  vonrNm: string;
  vonrBrno: string;
  totlAsstAmtLiter: number;
  aprvYmdTm: string;
  aprvYmd: string;
  aprvTm: string;
  aprvNo: string;
  prcsSeCd: string;
  clclnSn: string;
  asstAmtCmpttnSeNm: string;
  col01: string;
  col02: string;
  col03: string;
  col04: string;
  col05: string;
  col06: string;
  col07: string;
  col08: string;
  col09: string;
  col10: string;
  col11: string;
  col12: string;
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

  const [selectedTab, setSelectedTab] = useState<string>('1');
  const [dataSeCd, setDataSeCd] = useState<string>('RFID');

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  
  const [vhclRows, setVhclRows] = useState<Row[]>([]) // 차량별 데이터
  const [detail, setDetail] = useState<Row>();

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종 코드
  const [bankCdItems, setBankCdItems] = useState<SelectItem[]>([]);
  const [vhclTonCdItems, setVhclTonCdItems] = useState<SelectItem[]>([]);

  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [selectedVhclRow, setSelectedVhclRow] = useState<number>(-1);

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
    setSelectedRow(-1);
    setSelectedVhclRow(-1);
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

    const dateRange = getDateRange('m', 1);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))

    getCtpvCd().then((itemArr) => {
      setCtpvCdItems(itemArr);
      setParams((prev) => ({...prev, ctpvCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
    })// 시도코드 

    getCommCd('599', '전체').then((itemArr) => setKoicdItems(itemArr))// 유종코드
    getCommCd('971', '전체').then((itemArr) => setVhclTonCdItems(itemArr))// 유종코드
    getCommCd('973', '전체').then((itemArr) => setBankCdItems(itemArr))// 은행코드
    
  }, [])

  useEffect(() => { // 시도 코드 변경시 관할관청 재조회
    // 관할관청
    if(params.ctpvCd) {
      getLocGovCd(params.ctpvCd).then((itemArr) => {
        setLocgovCdItems(itemArr);
        // setParams((prev) => ({...prev, locgovCd: itemArr[0].value})); // 첫번째 아이템으로 기본값 설정
      })
    }
  }, [params.ctpvCd])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])

  useEffect(() => {
    if(selectedRow > -1) {
      fetchVhclData();
    }
  }, [selectedRow])

  useEffect(() => {
    // if(selectedVhclRow > -1) {
    //   fetchDetailData();
    // }
    setDetail(vhclRows[selectedVhclRow]);
  }, [selectedVhclRow])

  useEffect(() => {
    setFlag(!flag)
  } , [dataSeCd])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        dataSeCd == 'RFID' ? `/fsm/par/pr/tr/getAllPapersReqstRfidMon?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.searchStDate ? '&lbrctBgngYm=' + params.searchStDate.replaceAll('-', '') : ''}` +
        `${params.searchEdDate ? '&lbrctEndYm=' + params.searchEdDate.replaceAll('-', '') : ''}`
        :
        `/fsm/par/pr/tr/getAllPapersReqstDealCnfirmMon?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.searchStDate ? '&clclnBgngYm=' + params.searchStDate.replaceAll('-', '') : ''}` +
        `${params.searchEdDate ? '&clclnEndYm=' + params.searchEdDate.replaceAll('-', '') : ''}`

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

  const fetchVhclData = async () => {
    try {
      let endpoint: string =
      dataSeCd == 'RFID' ? `/fsm/par/pr/tr/getAllPapersReqstRfidVhcl?` +
      `${rows[selectedRow].locgovCd ? '&locgovCd=' + rows[selectedRow].locgovCd : ''}` +
      `${rows[selectedRow].vhclNo ? '&vhclNo=' + rows[selectedRow].vhclNo : ''}` +
      `${rows[selectedRow].lbrctYmd ? '&lbrctYm=' + rows[selectedRow].lbrctYmd : ''}`
      :
      `/fsm/par/pr/tr/getAllPapersReqstDealCnfirmVhcl?` +
      `${rows[selectedRow].locgovCd ? '&locgovCd=' + rows[selectedRow].locgovCd : ''}` +
      // `${rows[selectedRow].vhclNo ? '&vhclNo=' + rows[selectedRow].vhclNo : ''}` +
      `${rows[selectedRow].clclnYm ? '&clclnYm=' + rows[selectedRow].clclnYm : ''}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setVhclRows(response.data)
      } else {
        // 데이터가 없거나 실패
        setVhclRows([])
      }  

    }catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
    setVhclRows([])
    }
  }
  // const fetchDetailData = async () => {
  //   try {
  //     let endpoint: string =
  //     dataSeCd == 'RFID' ?`/fsm/par/pr/tr/getAllDelngPapersReqstRfid?&crno=${vhclRows[selectedVhclRow].crno ? vhclRows[selectedVhclRow].crno : ''}` +
  //     `${vhclRows[selectedVhclRow].locgovCd ? '&locgovCd=' + vhclRows[selectedVhclRow].locgovCd : ''}` +
  //     // `${vhclRows[selectedVhclRow].crno ? '&crno=' + vhclRows[selectedVhclRow].crno : ''}` +
  //     `${vhclRows[selectedVhclRow].vhclNo ? '&vhclNo=' + vhclRows[selectedVhclRow].vhclNo : ''}` +
  //     `${vhclRows[selectedVhclRow].giveCfmtnYn ? '&giveCfmtnYn=' + vhclRows[selectedVhclRow].giveCfmtnYn : ''}` +
  //     `${vhclRows[selectedVhclRow].lbrctYm ? '&lbrctYm=' + vhclRows[selectedVhclRow].lbrctYm : ''}`
  //     :
  //     `/fsm/par/pr/tr/getAllDelngPapersReqstDealCnfirm?` +
  //     `${vhclRows[selectedVhclRow].locgovCd ? '&locgovCd=' + vhclRows[selectedVhclRow].locgovCd : ''}` +
  //     // `${vhclRows[selectedVhclRow].vonrBrno ? '&vonrBrno=' + vhclRows[selectedVhclRow].vonrBrno : ''}` +
  //     `${vhclRows[selectedVhclRow].vhclNo ? '&vhclNo=' + vhclRows[selectedVhclRow].vhclNo : ''}` +
  //     `${vhclRows[selectedVhclRow].giveCfmtnYn ? '&giveCfmtnYn=' + vhclRows[selectedVhclRow].giveCfmtnYn : ''}` +
  //     `${vhclRows[selectedVhclRow].clclnYm ? '&clclnYm=' + rows[selectedRow].clclnYm : ''}`

  //     const response = await sendHttpRequest('GET', endpoint, null, true, {
  //       cache: 'no-store',
  //     })

  //     if (response && response.resultType === 'success' && response.data) {
  //       // 데이터 조회 성공시
  //       // setDetail(response.data[0])
  //       setDetail(vhclRows[selectedVhclRow]);
  //     } else {
  //       // 데이터가 없거나 실패
  //       setDetail(undefined);
  //     }  

  //   }catch (error) {
  //   // 에러시
  //   console.error('Error fetching data:', error)
  //   setDetail(undefined)
  //   }
  // }
  // 페이지 이동 감지 시작 //

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault();
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
  const handleRowClick = (index:number) => {
    setSelectedRow(index);
  }

  const handleVhclRowClick = (index:number) => {
    setSelectedVhclRow(index);
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

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    if(tabValue == '1') {
      setSelectedTab("1");
      setDataSeCd("RFID")
    }else if(tabValue == '2') {
      setSelectedTab("2");
      setDataSeCd("DealCnfirm")
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

  const excelDownload = async () => {
    let endpoint: string =
    `/fsm/par/pr/tr/getExcelPapersReqstRfidVhcl?` +
    `${rows[selectedRow].lbrctYmd ? '&lbrctYm=' + rows[selectedRow].lbrctYmd : ''}` +
    `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`

    getExcelFile(endpoint, '' + '차량별 RFID(자가주유현황)'+getToday()+'.xlsx')
  }

  return (
    <PageContainer title="서면신청관리" description="서면신청관리">
      {/* breadcrumb */}
      <Breadcrumb title="서면신청관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <HeaderTab 
        tabs={tabs} 
        seletedTab={selectedTab} 
        onTabChange={handleTabChange} />
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
              <CustomFormLabel
                className="input-label-display"
              >
                차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
          <hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                주유월
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">주유월 시작연월</CustomFormLabel>
              <CustomTextField type="month" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">주유월 종료연월</CustomFormLabel>
              <CustomTextField type="month" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" type="submit" color="primary">
              조회
            </Button>
            {vhclRows[selectedVhclRow] && vhclRows[selectedVhclRow].giveCfmtnYn == 'Y'? 
              <FormModal 
                size={'xl'}
                buttonLabel={'수정'} 
                title={'계좌정보수정'}
                formId='search-modal'
                formLabel='조회'
                children={<ModalContent
                  vhclNo={vhclRows[selectedVhclRow]?.vhclNo}
                  dpstrNm={vhclRows[selectedVhclRow]?.dpstrNm}
                  bankCdItems={bankCdItems} 
                  locgovCd={vhclRows[selectedVhclRow]?.locgovCd} 
                  crno={vhclRows[selectedVhclRow]?.crno} 
                  lbrctYm={vhclRows[selectedVhclRow]?.lbrctYm}              
                />}
              />
            : ''}
            {selectedRow > -1 ? 
              <Button variant="contained" onClick={() => excelDownload()} color="primary">
                엑셀
              </Button>
            : ''}
            <Button variant="contained" color="primary">
              출력
            </Button>
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}

      {/* 테이블영역 시작 */}
      <Box>
        <TableDataGrid
          headCells={dataSeCd == 'RFID' ? rfIdHeadCells : dealConfirmHeadCells} // 테이블 헤더 값
          subHeadCells={dataSeCd == 'RFID' ? rfIdSubHeadCells : dealConfirmSubHeadCells}
          title={dataSeCd == 'RFID' ? "월별 RFID(자가주유) 현황" : "월별 거래확인카드 거래집계현황"}
          selectedRowIndex={selectedRow}
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 수
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          paging={true}
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          cursor={true}
        />
      </Box>

      {selectedRow > -1 && vhclRows ?
        (<Box sx={{ mb: 3 }}>
          <TableDataGrid
            headCells={dataSeCd == 'RFID' ? rfIdVhclHeadCells : dealConfirmVhclHeadCells} // 테이블 헤더 값
            subHeadCells={dataSeCd == 'RFID' ? rfIdSubHeadCells : dealConfirmSubHeadCells}
            title={dataSeCd == 'RFID' ? "차량별 RFID(자가주유) 현황" : "차량별 거래확인카드 거래집계 현황"}
            selectedRowIndex={selectedVhclRow}
            rows={vhclRows} // 목록 데이터
            totalRows={-1} // 총 로우 수
            loading={loading} // 로딩여부
            onRowClick={handleVhclRowClick} // 행 클릭 핸들러 추가
            onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
            onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
            paging={false}
            pageable={pageable} // 현재 페이지 / 사이즈 정보
            cursor={true}
          />
        </Box>)
      : <></>
      }
      
      {selectedVhclRow > -1 ? 
      (<Box>
        <DetailDataGrid 
          dataSeCd={dataSeCd}
          detail={detail}
          koiCdItems={koicdItems}
          bankCdItems={bankCdItems}
          vhclTonCdItems={vhclTonCdItems}
        />
      </Box>)
      :
      <></>  
    }

      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
