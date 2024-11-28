'use client'
import {
  Box,
  Button,
  FormControlLabel,
  RadioGroup,
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

import TableDataGrid, {
  ServerPaginationGridProps,
} from './_components/TableDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'
import TopDataTable from './_components/TopDataTable'
import { SelectItem } from 'select'
import {
  getCityCodes,
  getCodesByGroupNm,
  getLocalGovCodes,
} from '@/utils/fsms/common/code/getCode'
import { CheckBox } from '@mui/icons-material'
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'
import SearchModal from './_components/SearchModal'
import { brNoFormatter, getDateRange } from '@/utils/fsms/common/util'

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
    to: '/apv/vddd',
    title: '차량일별거래내역',
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
    id: 'dlngYm',
    numeric: false,
    disablePadding: false,
    label: '주유월',
  },
  {
    id: 'aprvAmt',
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
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
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
  dlngYm: string;
  vhclNo: string;
  brno: string;
  lbrctStleCd: string;
  koiCd: string;
  locgovCd: string;
  vhclSeCd: string;
  dlngNocs: string;
  aprvAmt: string;
  fuelQty: string;
  asstAmt: string;
  ftxAsstAmt: string;
  opisAmt: string;
  locgovNm: string;
  bzentyNm: string;
  lbrctStleNm: string;
  koiNm: string;
  vhclSeNm: string;
}

export interface HistoryRow {
  hstrySn: string;
  vhclNo: string;
  locgovNm: string;
  brno: string;
  bzentyNm: string | number | null;
  rprsvRrno: string | number | null;
  koiCd: string;
  vhclSeCd: string;
  delYn: string | number | null;
  dscntYn: string;
  locgovAprvYn: string | number | null;
  crno: string | number | null;
  rprsvNm: string | number | null;
  zip: string | number | null;
  addr: string | number | null;
  telno: string | number | null;
  locgovCd: string;
  locgovCdNm: string | number | null;
  bzmnSeCd: string | number | null;
  vhclSttsCd: string;
  rfidYn: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
  vonrRrno: string | number | null;
  vonrRrnoS: string | number | null;
  vonrRrnoSecure: string | number | null;
  vonrBrno: string | number | null;
  vonrBrnoS: string | number | null;
  crnoS: string | number | null;
  crnoSecure: string | number | null;
  crnoEncpt: string | number | null;
  crnoEncptS: string | number | null;
  rprsvRrnoS: string | number | null;
  rprsvRrnoSecure: string | number | null;
  vhclTonCd: string | number | null;
  lcnsTpbizCd: string | number | null;
  vhclRegYmd: string | number | null;
  yridnw: string | number | null;
  len: string | number | null;
  bt: string | number | null;
  maxLoadQty: string | number | null;
  vonrNm: string | number | null;
  vhclPsnCd: string | number | null;
  dscntYnNm: string | number | null;
  souSourcSeCd: string | number | null;
  bscInfoChgYn: string | number | null;
  locgovAprvYnNm: string | number | null;
  part1Addr: string | number | null;
  part2Addr: string | number | null;
  souSourcSeCdBiz: string | number | null;
  vonrSn: string | number | null;
  carTelno: string | number | null;
  isTodayStopCancel: string | number | null;
  todayStopCancelYear: string | number | null;
  todayStopCancelMon: string | number | null;
  todayStopCancelDay: string | number | null;
  todayStopCancelHour: string | number | null;
  todayStopCancelMin: string | number | null;
  cmSttsCd: string | number | null;
  dayoffYn: string | number | null;
  dayoffGroupNm: string | number | null;
  ntsChgYmd: string | number | null;
  bmSttsCd: string | number | null;
  custSeCd: string | number | null;
  flnm: string | number | null;
  rrno: string | number | null;
  agncyDrvBgngYmd: string | number | null;
  agncyDrvEndYmd: string | number | null;
  dayoffSeCd: string | number | null;
  dayoffTypeCd: string | number | null;
  dayoffNm: string | number | null;
  rmvBgngYmd: string | number | null;
  rmvEndYmd: string | number | null;
  rfidNm: string;
  vhclSttsNm: string;
  dscntNm: string;
  koiNm: string;
  vhclSeNm: string;
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
  const [cityCode, setCityCode] = useState<SelectItem[]>([])
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([])
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종 코드
  const [lbrctStleCdItems, setLbrctStleCdItems] = useState<SelectItem[]>([]); // 주유형태 코드

  const [isLocgovCdAll, setIsLocgovCdAll] = useState<boolean>(false) // 관할관청 전체 검색 체크여부

  const [selectedBrno, setSelecteBrno] = useState<string>('');
  const [selectedBzentyNm, setSelectedBzentyNm] = useState<string>('');
  const [selectedVhclNo, setSelectedVhclNo] = useState<string>('');

  const [listTableProps, setListTableProps] =
    useState<ServerPaginationGridProps>({
      headCells: [], // 테이블 헤더 정보
      rows: [], // 테이블 데이터
      totalRows: 0, // 총 로우 수
      loading: true, // 로딩 표시 여부
      onRowClick: (row) => console.log(row), // 행 클릭 핸들러
      onPaginationModelChange: (page, pageSize) => console.log(page, pageSize), // 페이지 및 사이즈 변경 핸들러
      onSortModelChange: (sort) => console.log(sort), // 정렬 모델 변경 핸들러
      pageable: { pageNumber: 1, pageSize: 10, sort: '' }, // 페이지 정보
    })

  // const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  // const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

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

  // 상세 모달팝업을 위한 상태값 정의
  const [open, setOpen] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryRow[] | null>(null);

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if(params.brno || params.vhclNo) {
      fetchData()
    }
  }, [flag])

   // 기본 날짜 세팅 (30일)
   const setDateRange = () => {
    const dateRange = getDateRange("month", 30);

    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))
  }

  // 초기 데이터 로드
  useEffect(() => {
    setDateRange()

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

    setFlag(!flag)
  }, [])

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
      if(!isLocgovCdAll && !params.ctpvCd) {
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

      if(!params.brno && !params.vhclNo) {
        alert("사업자등록번호 또는 차량번호를 입력해주세요.");
        return;
      }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/vmdd/bs/getAllVhcleMnbyDelngDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", '') : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", '') : ''}` +
        `${!isLocgovCdAll && params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
        `${!isLocgovCdAll && params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
        `${params.lbrctStleCd ? '&lbrctStleCd=' + params.lbrctStleCd : ''}` +
        ``

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setListTableProps((prev) => ({
          ...prev,
          headCells, // 헤더 정보
          rows: response.data.content, // 가져온 데이터
          totalRows: response.data.totalElements, // 총 로우 수
          loading: false, // 로딩 완료
          onRowClick: handleRowClick,
          onPaginationModelChange: handlePaginationModelChange,
          pageable:{
            pageNumber: response.data.pageable.pageNumber,
            pageSize: response.data.pageable.pageSize,
            sort: params.sort,
          }
        }))

        setPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })

        setSelecteBrno(response.data.content[0].brno);
        setSelectedBzentyNm(response.data.content[0].bzentyNm);
      } else {
        // 데이터가 없거나 실패
        setListTableProps((prev) => ({
          ...prev,
          rows: [],
          totalRows: 0,
          loading: false, // 로딩 완료
        }))

        setPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setListTableProps((prev) => ({
        ...prev,
        headCells, // 헤더 정보
        rows: [],
        totalRows: 0,
        loading: false, // 로딩 완료
        onRowClick: handleRowClick,
        onPaginationModelChange: handlePaginationModelChange,
      }))
      setPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    } finally {
      setLoading(false)
    }
  }
  const excelDownload = async () => {
    try {
      let endpoint: string =
      `/fsm/apv/vmdd/bs/getExcelVhcleMnbyDelngDtls?page=${params.page - 1}&size=${params.size}` +
      `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
      `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", '') : ''}` +
      `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", '') : ''}` +
      `${!isLocgovCdAll && params.ctpvCd ? '&ctpvCd=' + params.ctpvCd : ''}`+
      `${!isLocgovCdAll && params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
      `${params.brno ? '&brno=' + params.brno : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
      `${params.lbrctStleCd ? '&lbrctStleCd=' + params.lbrctStleCd : ''}`
      

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '차량일별거래내역.xlsx');
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

  // 행 클릭 시 호출되는 함수
  const handleRowClick = async (row: Row) => {
    try {
      setSelectedVhclNo(row.vhclNo);
      let endPoint = `/fsm/apv/vmdd/bs/getAllVhcleMngHis?vhclNo=${row.vhclNo}`

      const response = await sendHttpRequest("GET", endPoint, null, true, {
        cache: 'no-store'
      })

      if(response && response.resultType === 'success' && response.data) {
        setHistoryData(response.data);
        setOpen(true);
      }else {
        setHistoryData(null);
      }

    }catch(error) {
      console.error("Error ::: ", error);
      setHistoryData(null)
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
    <PageContainer title="차량일별거래내역" description="차량일별거래내역">
      {/* breadcrumb */}
      <Breadcrumb title="차량일별거래내역" items={BCrumb} />
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
                {cityCode.map((option) => (
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
                {localGovCode.map((option) => (
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
                <span className="required-text" >*</span>거래년월
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">거래년월 시작</CustomFormLabel>
              <CustomTextField  type="month" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~ 
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">거래년월 종료</CustomFormLabel>
              <CustomTextField type="month" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
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
                <span className="required-text" >*</span>차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
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
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button onClick={() => fetchData()} variant="contained" color="primary">
            {/* <Button type='submit' variant="contained" color="primary"> */}
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
      <TopDataTable
        isLoading={loading}
        brno={brNoFormatter(selectedBrno) ?? ''}
        bzentyNm={selectedBzentyNm}
        listTableProps={listTableProps}
      />
      
      <Box style={{textAlign: 'center'}}>
        <h3>※거래내역을 더블클릭하면 해당 차량의 이력조회를 확인 할 수 있습니다.</h3>
      </Box>
      {/* <TableDataGrid
          headCells={headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 수
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
        /> */}
      {/* 테이블영역 끝 */}
      <SearchModal
        open={open}
        title={'차량이력조회'}
        size={'xl'}
        handleOpen={() => {}} 
        handleClose={() => setOpen(false)} 
        selectedRow={historyData}
        vhclNo={selectedVhclNo}
        bzentyNm={selectedBzentyNm}
      />
    </PageContainer>
  )
}

export default DataList
