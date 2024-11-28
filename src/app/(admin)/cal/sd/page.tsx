'use client'
import {
  Box,
  Button,
  FormControlLabel,
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

import BusSetleTrauModal from './_components/BusSetleTrauModal' // 외상결제 거래내역 모달
import VhclHistModal from './_components/VhclHistModal' // 차량이력조회 모달

// types
import FormDialog from './_components/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell, Pageable } from 'table'
import { getDateRange, getCommCd, getToday, getExcelFile } from '@/utils/fsms/common/comm'
import { SelectItem } from 'select'
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '보조금청구',
  },
  {
    title: '버스청구',
  },
  {
    to: '/cal/sd',
    title: '결제내역조회',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'remark',
    numeric: false,
    disablePadding: false,
    label: '보조금정산',
    align: 'td-left',
  },
  {
    id: 'cnptSeCd',
    numeric: false,
    disablePadding: false,
    label: '거래원',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자번호',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
    align: 'td-left',
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
    id: 'dlngYmdtm',
    numeric: false,
    disablePadding: false,
    label: '거래일시',
  },
  {
    id: 'origDlngYmdtm',
    numeric: false,
    disablePadding: false,
    label: '원거래일시',
  },
  {
    id: 'dlngSeCd',
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
    id: 'crdCoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'cardNoS',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '주유소명',
    align: 'td-left',
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
    format: 'number',
    align: 'td-right',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '보조금',
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
]

const remarks = [
  {
    name: '일반거래',
    color: '#000000',
  },
  {
    name: '취소거래',
    color: '#FF0000',
  },
  {
    name: '취소된원거래',
    color: '#0000FF',
  },
  {
    name: '대체카드거래',
    color: '#00B050',
  },
  {
    name: '보조금지급정지/휴지',
    color: '#7030A0',
  },
  {
    name: '유종없음',
    color: '#FF3399',
  },
  {
    name: '유종불일치',
    color: '#00CC99',
  },
  {
    name: '1시간이내재주유',
    color: '#0099FF',
  },
  {
    name: '1일4회이상주유',
    color: '#663300',
  },
  {
    name: '사용리터없음',
    color: '#92D050',
  },
]

export interface Row {
  remark?: string; // 보조금정산
  cnptSeCd?: string; // 거래원
  brno?: string; // 사업자번호
  bzentyNm?: string; // 업체명
  vhclNo?: string; // 차량번호
  vhclSeNm?: string; // 면허업종
  dlngYmdtm?: string; // 거래일시
  origDlngYmdtm?: string; // 원거래일시
  dlngSeCd?: string; // 거래구분(코드값이므로 거래구분명을 가져올 함수 필요)
  cardSeNm?: string; // 카드구분
  crdcoNm?: string; // 카드사
  cardNoS?: string; // 카드번호
  frcsNm?: string; // 가맹점(주유소/충전소명)
  aprvAmt?: string; // 승인금액
  koiNm?: string; // 거래유종
  lbrctStleNm?: string; // 주유형태
  fuelQty?: string; // 연료량
  asstAmt?: string; // 보조금
  fxtAsstAmt?: string; // 유류세연동보조금
  opisAmt?: string; // 유가연동보조금

  koiCd?: string // 유종코드
  splitYn?: string // 분할결제 여부
  sltmAprvNo?: any // 결제승인번호
  sltmCardNo?: any // 결제카드번호
  sltmAprvYmd?: any // 결제승인일자
}

export interface BusSetleTrauDetailRow {
  brno?: string; // 사업자번호
  bzentyNm?: string; // 업체명
  vhclNo?: string; // 차량번호
  dlngYmdtm?: string; // 승인일자시간
  cardNoS?: string; // 암호화카드번호
  frcsNm?: string; // 주유소명
  aprvAmt?: string; // 승인금액
  lbrctStleNm?: string; // 주유형태
  fuelQty?: string; // 연료량
  asstAmt?: string; // 보조금
  splitYn?: string; // 분할결제여부
  unsetlAmt?: string; // 미결제금액
  ftxAsstAmt?: string; // 유류세연동보조금
  opisAmt?: string; // 유가연동보조금
  koiNm?: string; // 유종
  vhclSeNm?: string; // 면허업종
  cardSeNm?: string; // 카드구분
  crdcoNm?: string; // 카드사
}

export interface VhclHistDetailRow {
  hstrySn?: string; // 순번
  mdfcnDt?: string; // 변경일자
  locgovNm?: string; // 관할관청
  vhclSttsNm?: string; // 차량상태
  koiNm?: string; // 유종
  vhclSeNm?: string; // 면허업종
  dscntYnNm?: string; // 할인여부
  rfidNm?: string; // RFID차량여부
}

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  detailSort: string
  detailPage: number
  detailSize: number
  searchValue: string
  searchSelect: string
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

  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종 코드
  const [crdcoCdItems, setCrdcoCdItems] = useState<SelectItem[]>([]); // 카드사 코드
  const [cardSeCdItems, setCardSeCdItems] = useState<SelectItem[]>([]); // 카드 구분 코드

  const [selectedRow, setSelectedRow] = useState<Row>(); // 선택된 Row를 저장할 state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal 오픈 상태
  const [busSetleTrauDetailRows, setBusSetleTrauDetailRows] = useState<BusSetleTrauDetailRow[]>([]); // 상세 로우 데이터
  const [vhclHistDetailRows, setVhclHistDetailRows] = useState<VhclHistDetailRow[]>([]); // 상세 로우 데이터

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

  //
  const [pageable, setPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if (params.vhclNo || params.brno) {
      fetchData()
    }
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

    const dateRange = getDateRange('d', 30);
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    setParams((prev) => ({...prev, searchStDate: startDate, searchEdDate: endDate}))

    getCommCd('599', '전체').then((itemArr) => setKoicdItems(itemArr))// 유종코드
    getCommCd('543', '전체').then((itemArr) => setCrdcoCdItems(itemArr))// 카드사구분코드
    getCommCd('545', '전체').then((itemArr) => setCardSeCdItems(itemArr))// 카드구분코드
  }, [])

  function formatDate(dateString:string) {
    // 입력 형식이 YYYY-MM-DD인지 확인
    if (!/^\d{4}-\d{2}-\{2}$/.test(dateString)) {
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
        `/fsm/cal/sd/bs/getAllSetleDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.includeCancel ? '&includeCancel=' + params.includeCancel : ''}` +
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` +
        `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}` + 
        `${params.vchlNo ? '&vchlNo=' + params.vchlNo : ''}` + 
        `${params.brno ? '&brno=' + params.brno : ''}` + 
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` + 
        `${params.crdcoCd ? '&crdcoCd=' + params.crdcoCd : ''}` + 
        `${params.cardSeCd ? '&cardSeCd=' + params.cardSeCd : ''}` +
        `${params.cardNo ?  '&cardNo=' + params.cardNo : ''}` + 
        `&excelYn=N`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        console.log(response.data);
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

  const fetchBusSetleTrauData = async (selectedRow: Row | undefined) => {
    if (selectedRow == undefined) {
      alert('가져온 데이터가 없습니다.');
      return;
    }

    if (selectedRow.cardSeNm !== '결제체크' && selectedRow.cardSeNm !== '결제신용') {
      setIsModalOpen(false);
      const crdcoNm = selectedRow.crdcoNm;
      alert(`'${crdcoNm}'의 거래내역이 아닙니다.`);
      return;
    }
    
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/cal/sd/bs/getAllBusSetleTrauDtls?` + 
        `${selectedRow.koiCd ? '&koiCd=' + selectedRow.koiCd : ''}` +
        `${selectedRow.splitYn ? '&prttnYn=' + selectedRow.splitYn : ''}` + 
        `${selectedRow.sltmAprvNo ? '&slmtAprvNo=' + selectedRow.sltmAprvNo : ''}` + 
        `${selectedRow.sltmCardNo ? '&slmtCardNo=' + selectedRow.sltmCardNo : ''}` +
        `${selectedRow.sltmAprvYmd ? '&slmtAprvYmd=' + selectedRow.sltmAprvYmd : ''}`
      
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setBusSetleTrauDetailRows(response.data);
      }
    } catch (error) {
      // 에러시
      console.error('no such fetching data:', error)
      setBusSetleTrauDetailRows([]);
    }
  }

  const fetchVchlHistData = async (selectedRow: Row | undefined) => {
    if (selectedRow == undefined) {
      setIsModalOpen(false);
      alert('가져온 데이터가 없습니다.');
      return;
    }

    if (!selectedRow.vhclNo) {
      setIsModalOpen(false);
      alert('차량번호가 없습니다.');
      return;
    }

    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/cal/sd/bs/getAllVhcleMngHis?` + 
        `${selectedRow.vhclNo ? '&vhclNo=' + selectedRow.vhclNo : ''}` +
        `${selectedRow.bzentyNm ? '&bzentyNm=' + selectedRow.bzentyNm : ''}` 
      
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setVhclHistDetailRows(response.data);
      }
    } catch (error) {
      // 에러시
      console.error('no such fetching data:', error)
      setVhclHistDetailRows([]);
    } finally {
    }
  }

  const excelDownload = async () => {

    let endpoint: string = 
      `/fsm/cal/sd/bs/getExcelSetleDtls?` + 
      `${params.includeCancel ? '&includeCancel=' + params.includeCancel : ''}` +
      `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` + 
      `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` +
      `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}` + 
      `${params.vchlNo ? '&vchlNo=' + params.vchlNo : ''}` + 
      `${params.brno ? '&brno=' + params.brno : ''}` + 
      `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` + 
      `${params.crdcoCd ? '&crdcoCd=' + params.crdcoCd : ''}` + 
      `${params.cardSeCd ? '&cardSeCd=' + params.cardSeCd : ''}` + 
      `${params.cardNo ? '&cardNo=' + params.cardNo : ''}`

      getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_' + getToday() + ".xlsx");
  }

  const excelDownloadDetail = async (selectedRow: Row) => {
    if (selectedRow === undefined || !busSetleTrauDetailRows) {
      alert('엑셀파일을 다운로드할 데이터가 없습니다.')
      return;
    }

    if (selectedRow.cardSeNm !== '결제체크' && selectedRow.cardSeNm !== '결제신용') {
      const crdcoNm = selectedRow.crdcoNm;
      alert(`'${crdcoNm}'의 거래내역이 아닙니다.`);
      return;
    }

    let endpoint: string = 
      `/fsm/cal/sd/bs/getExcelBusSetleTrauDtls?` +
      `${selectedRow.koiCd ? '&koiCd=' + selectedRow.koiCd : ''}` +
      `${selectedRow.splitYn ? '&prttnYn=' + selectedRow.splitYn : ''}` + 
      `${selectedRow.sltmAprvNo ? '&slmtAprvNo=' + selectedRow.sltmAprvNo : ''}` + 
      `${selectedRow.sltmCardNo ? '&slmtCardNo=' + selectedRow.sltmCardNo : ''}` +
      `${selectedRow.sltmAprvYmd ? '&slmtAprvYmd=' + selectedRow.sltmAprvYmd : ''}`

      getExcelFile(endpoint, BCrumb[BCrumb.length - 1].title + '_외상결제거래내역_' + getToday() + ".xlsx");
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
    console.log(params.page);
    setParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    console.log(params.page);
    setFlag(!flag)
    setBusSetleTrauDetailRows([])
    setVhclHistDetailRows([])
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

  const handleModalOpen = async (type:string) => {
    console.log(isModalOpen);
    if (selectedRow != undefined && selectedRow) {
      if (type === 'BusSetleTrau') {
        await fetchBusSetleTrauData(selectedRow);
      } else if (type === 'VhclHist') {
        await fetchVchlHistData(selectedRow);
      }
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      alert('행을 먼저 선택하세요.');
    }
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
      if (name === 'includeCancel') {
        if (value === 'on' || value === 'N') {
          setParams((prev) => ({ ...prev, [name]: 'Y' }))
        } else {
          setParams((prev) => ({ ...prev, [name]: 'N' }))
        }
      } else {
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
    <PageContainer title="결제내역조회" description="결제내역조회">
      {/* breadcrumb */}
      <Breadcrumb title="결제내역조회" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                <span className="required-text">*</span>결제일자
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">결제일자 시작일</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">결제일자 종료일</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group" style={{maxWidth:'10rem'}}>
                <FormControlLabel control={<CustomCheckbox name='includeCancel' value={params.includeCancel} onChange={handleSearchChange}/>} label="취소 포함"/>
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
                카드사구분
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="crdcoCd"
                value={params.crdcoCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {crdcoCdItems.map((option) => (
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
                카드구분
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
                name="cardSeCd"
                value={params.cardSeCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {cardSeCdItems.map((option) => (
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
                <span className="required-text">*</span>차량번호
              </CustomFormLabel>
              <CustomTextField name="vchlNo" value={params.vchlNo} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                <span className="required-text">*</span>사업자등록번호
              </CustomFormLabel>
              <CustomTextField name="brno" value={params.brno} onChange={handleSearchChange} fullWidth />
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
            <FormDialog
              size="lg"
              buttonLabel="결제된 외상거래"
              title="외상거래 결제내역"
              seletedRow = {selectedRow as Row}
              type="BusSetleTrau"
              excelDownloadDetail={excelDownloadDetail}
              children={<BusSetleTrauModal rows={busSetleTrauDetailRows}/>}
              onOpen={() => handleModalOpen('BusSetleTrau')}
            />
            <FormDialog
              size="lg"
              buttonLabel="차량이력조회"
              title="차량이력조회"
              seletedRow = {selectedRow as Row}
              type="VhclHist"
              children={<VhclHistModal rows={vhclHistDetailRows}/>}
              onOpen={() => handleModalOpen('VhclHist')}
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
          paging={true}
        />
      </Box>
      {/* 테이블영역 끝 */}

      {/* 범례 영역 시작 */}
      <Box>
        <div className="contents-explanation-cc">
          <div className="contents-explanation-inner">
            {remarks.map((remark, index) => (
              <div className="contents-explanation-text" style={{color:remark.color, width: "10%"}}>
                <span style={{color:remark.color}}>■</span>{remark.name}
              </div>
            ))}
          </div>
        </div>
      </Box>
      {/* 범례 영역 끝*/}
    </PageContainer>
  )
}

export default DataList
