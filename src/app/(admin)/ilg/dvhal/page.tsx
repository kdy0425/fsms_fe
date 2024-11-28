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

import TableDataGrid from './_components/TableDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'
import { getCityCodes, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { SelectItem } from 'select'
import HeaderTab, { Tab } from '@/app/components/tables/HeaderTab'
import { getDateRange } from '@/utils/fsms/common/util'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '부정수급관리',
  },
  {
    title: '화물의심거래상시점검',
  },
  {
    to: '/ilg/dvhal',
    title: '거리 대비 주유시간 이상주유',
  },
]

const tabs : Tab[] = [
  {value: '1', label: '의심거래내역', active: false},
  {value: '2', label: '조사대상내역', active: false},
  {value: '3', label: '조사결과조회', active: false},
  {value: '4', label: '행정처분조회', active: false},
  {value: '5', label: '지자체이첩승인', active: false},
  {value: '6', label: '지자체이첩요청', active: false},
]


const headCells: HeadCell[] = [
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'vonrBrno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
  },
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
    id: 'aprvYmd',
    numeric: false,
    disablePadding: false,
    label: '거래승인일',
  },
  {
    id: 'aprvTm',
    numeric: false,
    disablePadding: false,
    label: '거래승인시각',
  },
  {
    id: 'aprAmt',
    numeric: false,
    disablePadding: false,
    label: '거래승인금액',
  },
  {
    id: 'crtrLiter',
    numeric: false,
    disablePadding: false,
    label: '기준리터',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '사용리터',
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조금액리터',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '보조금액',
  },
  {
    id: 'ceckStlmYnNm',
    numeric: false,
    disablePadding: false,
    label: '외상결제여부',
  },
  {
    id: 'cardNoDe',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'crdcoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사명',
  },
  {
    id: 'cardSeNm',
    numeric: false,
    disablePadding: false,
    label: '카드구분명',
  },
  {
    id: 'frcsCdNo',
    numeric: false,
    disablePadding: false,
    label: '가맹점코드',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
  {
    id: 'frcsBrno',
    numeric: false,
    disablePadding: false,
    label: '가맹점 사업자번호',
  },
  {
    id: 'frcsZip',
    numeric: false,
    disablePadding: false,
    label: '가맹점 우편번호',
  },
  {
    id: 'frcsAddr',
    numeric: false,
    disablePadding: false,
    label: '가맹점 주소명',
  },
  {
    id: 'frcsLocgovNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점 관할관청',
  }
]

export interface Row {
  seqNo: string;
  exmnNo: string;
  locgovCd: string; // 관할구청 코드
  locgovNm: string; // 관할구청명
  vonrBrno: string; // 소유주사업자등록번호
  vhclNo: string; // 차량번호
  vhclTonNm: string; // 톤수
  crtrLiter: number; // 기준리터
  aprvYmd: string; // 승인일자
  aprvTm: string; // 승인시각
  aprvAmt: number; // 승인금액
  useLiter: number; // 사용리터
  asstAmtLiter: number; // 보조금액리터
  asstAmt: number; // 보조금액
  trgtAsstAmt: number;
  ceckStlmYn: string; // 외상여부코드(Y/N)
  ceckStlmYnNm: string; // 외상여부명 (예/아니요)
  cardNo: string; // 카드번호 (암호화)
  cardNoDe: string; // 카드번호 (복호화)
  crdcoNm: string; // 카드사명
  cardSeNm: string; // 카드구분명
  frcsCdNo: string; // 가맹점코드
  frcsNm: string; // 가맹점명
  frcsBrno: string; // 가맹점 사업자번호
  frcsZip: string; // 가맹점 우편번호
  frcsAddr: string; // 가맹점 주소
  vonrNm: string; // 소유자명
  mmUseLiter: number;
  mmAsstLiter: number;
  btmntUseLiter: number;
  inmonUseLiter: number;
  enmtUseLiter: number;
  mmCrtrLiter: number;
  limUseRt: number;
  trgtCfmtnId: string | number;
  cfmtnYmd: string | number;
  chk: string;
  illegalityDivCd: string;
  exmnRegYn: string | number;
  pbadmsPrcsYn: string | number;
  admdspSeCd: string | number;
  giveStopSn: string | number;
  subsChangeCarNo: string | number;
  hstrySn: string | number;
  chgRsnCn: string | number;
  bgngYmd: string | number | null;
  endYmd: string | number | null;
  ruleVltnCluCd: string | number | null;
  oltPssrpPrtiOltNm: string | number | null;
  oltPssrpPrtiBrno: string | number | null;
  dsclMthdEtcMttrCn: string | number | null;
  ruleVltnCluEtcCn: string | number | null;
  cnt: string | number | null;
  instcSpldmdTypeCd: string | number | null;
  delYn: string | number | null;
  seqSn: string | number | null;
  mvoutLocgovCd: string | number | null;
  mvinLocgovCd: string | number | null;
  sttsCd: string | number | null;
  trnsfRsnCn: string | number | null;
  rgtrId: string | number | null;
  regDt: string | number | null;
  mdfrId: string | number | null;
  mdfcnDt: string | number | null;
  bfCtpvNm: string | number | null;
  bfLocgovNm: string | number | null;
  afCtpvNm: string | number | null;
  afLocgovNm: string | number | null;
  ctpvNm: string | number | null;
  bzmnSeCd: string | number | null;
  tpbizSeCd: string | number | null;
  tpbizCd: string | number | null;
  droperYn: string | number | null;
  exmnRsltCn: string | number | null;
  dlngNocs: number;
  totlAprvAmt: string | number | null;
  totlAsstAmt: string | number | null;
  rdmActnAmt: string | number | null;
  exmnRegMdfcnid: string | number | null;
  exmnRegMdfcnDt: string | number | null;
  subsChangeVhclNo: string | number | null;
  bfdnDspsTtl: string | number | null;
  bfdnAddr: string | number | null
  bfdnDspsRsnCn: string | number | null
  bfdnDspsCn: string | number | null
  bfdnLglBssCn: string | number | null
  bfdnSbmsnOfficInstNm: string | number | null
  bfdnSbmsnOfficDeptNm: string | number | null
  bfdnSbmsnOfficPicNm: string | number | null
  bfdnSbmsnOfficAddr: string | number | null
  bfdnSbmsnOfficTelno: string | number | null
  bfdnSbmsnOfficFxno: string | number | null
  bfdnSbmsnTermCn: string | number | null
  bfdnRgnMayerNm: string | number | null
  bfdnRgtrId: string | number | null
  bfdnMdfcnYmd: string | number | null
  rdmTrgtNocs: number;
  cpeaChckYn: string | number | null
  cpeaChckCyclVl: string | number | null
  aprvYm: string | number | null
  no: string | number | null
  rdmYn: string | number | null
  dspsDt: string | number | null
  admdspRsnCn: string | number | null
  admdspBgngYmd: string | number | null
  admdspEndYmd: string | number | null
  oltPssrpPrtiYn: string | number | null
  unlawStrctChgYnCd: string | number | null
  dsclMthdCd: string | number | null
  pbadmsPrcsMdfcnDt: string | number | null
  pbadmsPrcsRegDt: string | number | null
  pbadmsPrcsMdfcnId: string | number | null
  admdspNotieDspsTtl: string | number | null
  admdspNotieAddr: string | number | null
  admdspNotieClmPrdCn: string | number | null
  admdspNotieDspsRsnCn: string | number | null
  admdspNotieLglBssCn: string | number | null
  admdspNotieClmProcssCn: string | number | null
  admdspNotieRegId: string | number | null
  admdspNotieMdfcnYmd: string | number | null
  admdspNotieRgnMayerNm: string | number | null
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

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도 코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청 코드

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

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 기본 날짜 세팅 (30일)
  const setDateRange = () => {
    const dateRange = getDateRange("date", 30);

    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    setParams((prev) => ({ ...prev, searchStDate: startDate, searchEdDate: endDate }))
  }
  
  // 초기 데이터 로드
  useEffect(() => {
    setDateRange()
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
        `/fsm/ilg/dvhal/tr/getAllDoubtDelngDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.searchStDate ? '&bgngAprvYmd=' + params.searchStDate.replaceAll("-", "") : ''}` +
        `${params.searchEdDate ? '&endAprvYmd=' + params.searchEdDate.replaceAll("-", "") : ''}`

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
  const handleRowClick = (postTsid: string) => {
    router.push(`./view/${postTsid}${qString}`) // 조회 페이지 경로
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
    console.log("VALUE ::: " , tabValue, seletedTab);
    setSelectedTab(tabValue);
  }

  return (
    <PageContainer title="거리 대비 주유시간 이상주유" description="거리 대비 주유시간 이상주유">
      {/* breadcrumb */}
      <Breadcrumb title="거리 대비 주유시간 이상주유" items={BCrumb} />
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
                기간
              </CustomFormLabel>
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">기간 시작</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~ 
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">기간 종료</CustomFormLabel>
              <CustomTextField type="date" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                가맹점명
              </CustomFormLabel>
              <CustomTextField name="frcsNm" value={params.frcsNm} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                연번
              </CustomFormLabel>
              <CustomTextField name="brno" value={params.v} onChange={handleSearchChange} fullWidth />
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
            <FormDialog
              size={'lg'}
              buttonLabel="출력"
              title="전국표준한도관리 등록"
              children={<ModalContent />}
            />
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}

      {/* 테이블영역 시작 */}
      <HeaderTab 
        tabs={tabs}
        seletedTab={seletedTab}
        onTabChange={handleTabChange} />
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
    </PageContainer>
  )
}

export default DataList
