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
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
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
    title: '택시의심거래상시점검',
  },
  {
    to: '/ilg/hwre',
    title: '1시간이내 재충전',
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
    id: 'crdcoNm',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '차량지자체',
  },
  {
    id: 'dlngDt',
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
    id: 'bzmnSeNm',
    numeric: false,
    disablePadding: false,
    label: '개인법인구분',
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
  },
  {
    id: 'dlngSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래유형',
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
    id: 'asstAmt',
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
]

export interface Row {
  dlngYm: string;
  locgovCd: string;
  bzmnSeCd: string;
  koiCd: string;
  sumUseLiter: string | number | null;
  avgUseLiter: string | number | null;
  aprvAmt: string;
  moliatAsstAmt: string;
  useNmtm: string | number | null;
  vhclCnt: string | number | null;
  mdfcnDt: string | number | null;
  localNm: string | number | null;
  vhclNo: string;
  brno: string;
  useLiter: string;
  trauYmd: string;
  acmlAprvAmt: string | number | null;
  acmlVatRmbrAmt: string | number | null;
  acmlIcectxRmbrAmt: string | number | null;
  bzentyNm: string;
  crdcoCd: string;
  cardNo: string;
  puchasSlipNo: string | number | null;
  dlngYmd: string | number | null;
  dailUseAcmlNmtm: string | number | null;
  dlngSeCd: string;
  asbzentyNm: string | number | null;
  frcsNm: string;
  frcsNo: string | number | null;
  frcsBrno: string | number | null;
  vatRmbrAmt: string | number | null;
  icectxRmbrAmt: string | number | null;
  sumNtsRmbrAmt: string | number | null;
  sumRmbrAmt: string | number | null;
  rtrcnDlngDt: string | number | null;
  rgtrId: string | number | null;
  regDt: string | number | null;
  mdfrId: string | number | null;
  dlngTm: string;
  acmlUseNmtm: string | number | null;
  dlngDt: string;
  othLocgovCd: string | number | null;
  oltNm: string | number | null;
  opsAmt: string | number | null;
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

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
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
        `/fsm/ilg/hwre/tx/getAllHrWtnReptElctcList?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.brNo ? '&brNo=' + params.brNo : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.bzmnSeCd ? '&bzmnSeCd=' + params.bzmnSeCd : ''}` +
        `${params.searchStDate ? '&bgngDt=' + params.searchStDate.replaceAll("-", "") : ''}` +
        `${params.searchEdDate ? '&endDt=' + params.searchEdDate.replaceAll("-", "") : ''}`

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
    
    setSelectedTab(tabValue);
  }

  return (
    <PageContainer title="1시간이내 재충전" description="1시간이내 재충전">
      {/* breadcrumb */}
      <Breadcrumb title="1시간이내 재충전" items={BCrumb} />
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
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">거래년월 시작</CustomFormLabel>
              <CustomTextField  type="month" id="ft-date-start" name="searchStDate" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              ~ 
              <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">거래년월 종료</CustomFormLabel>
              <CustomTextField type="month" id="ft-date-end" name="searchEdDate" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
              >
                사업자등록번호
              </CustomFormLabel>
              <CustomTextField name="brno" value={params.brno} onChange={handleSearchChange} fullWidth />
            </div>
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
                개인법인구분
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
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
