'use client'
import {
  Box,
  Button,
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
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import DetailDialog from '@/app/components/popup/DetailDialog'
import ModalContent from './_components/ModalContent'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '시스템관리',
  },
  {
    title: '연계정보관리',
  },
  {
    to: '/sym/trcc',
    title: '화물 카드협약사 연계관리',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'reExc',
    numeric: false,
    disablePadding: false,
    label: '재실행',
  },
  {
    id: 'procNm',
    numeric: false,
    disablePadding: false,
    label: '프로세스명',
  },
  {
    id: 'procKornNm',
    numeric: false,
    disablePadding: false,
    label: '전문내용',
  },
  {
    id: 'dlngNm',
    numeric: false,
    disablePadding: false,
    label: '송수신여부',
  },
  {
    id: 'useYn',
    numeric: false,
    disablePadding: false,
    label: '사용여부',
  },
  {
    id: 'schdulSeCd',
    numeric: false,
    disablePadding: false,
    label: '스케줄구분',
  },
  {
    id: 'schdulExcnYmd',
    numeric: false,
    disablePadding: false,
    label: '실행일자',
  },
  {
    id: 'excnBgngYmd',
    numeric: false,
    disablePadding: false,
    label: '실행시작일자',
  },
  {
    id: 'excnBgngTm',
    numeric: false,
    disablePadding: false,
    label: '실행시작시간',
  },
  {
    id: 'excnEndYmd',
    numeric: false,
    disablePadding: false,
    label: '실행종료일자',
  },
  {
    id: 'excnEndTm',
    numeric: false,
    disablePadding: false,
    label: '실행종료시간',
  },
  {
    id: 'excnNocs',
    numeric: false,
    disablePadding: false,
    label: '실행건수',
  },
  {
    id: 'schdulPrgrsSttsNm',
    numeric: false,
    disablePadding: false,
    label: '오류내용',
  },
  {
    id: 'prcsNocs',
    numeric: false,
    disablePadding: false,
    label: '처리건수',
  },
  {
    id: 'errorNocs',
    numeric: false,
    disablePadding: false,
    label: '오류건수',
  },
]

export interface Row {
  procNm: string;
  procKornNm: string;
  dlngCd: string;
  dlngNm: string;
  useYn: string;
  schdulSeCd: string;
  schdulExcnYmd: string;
  schdulExcnTm: string;
  excnBgngYmd: string;
  excnBgngTm: string;
  excnEndYmd: string;
  excnEndTm: string;
  excnNocs: string;
  schdulPrgrsSttsCd: string;
  schdulPrgrsSttsNm: string;
  prcsNocs: string;
  errorNocs: string;
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

const dlngSelectItem = [
  {
    label: "전체",
    value: ""
  },
  {
    label: "송신",
    value: "S"
  },
  {
    label: "수신",
    value: "R"
  }
]

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [historyRow, setHistoryRow] = useState<Row[]>([]);
  const [open, setOpen] = useState<boolean>(false)

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

  // 초기 데이터 로드
  useEffect(() => {
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
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/sym/trcc/tr/getAllTruckCardCntc?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.dlngCd ? '&dlngCd=' + params.dlngCd : ''}` +
        `${params.procNm ? '&procNm=' + params.procNm : ''}`;


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

  const fetchHistoryData = async (procNm:string) => {
    // 이력 데이터 호출
    let endpoint : string = `/fsm/sym/trcc/tr/getAllTruckCardCntcHst?procNm=${procNm}`;

    const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
    })
    
    if (response && response.resultType === 'success' && response.data) {
      setHistoryRow(response.data)
    }
  }

  const reExcute = async (procNm:string, event: React.MouseEvent<unknown>) => {
    event.stopPropagation()
    let endpoint : string = `/fsm/sym/trcc/tr/excuteTruckCardCntc?procNm=${procNm}`;

    const response = await sendHttpRequest('PUT', endpoint, {
      procNm: procNm
    }, true)

    if (response && response.resultType === 'success') {
      alert(response.message);
      setParams((prev) => ({ ...prev, page: params.page }))
      setFlag(!flag)
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
  const handleRowClick = async (procNm:string) => {
    fetchHistoryData(procNm).then(() => {
      setOpen(true);
    })
  }

  const handleClose = () => {
    setOpen(false);
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
        return;
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
      title="화물 카드협약사 연계관리"
      description="화물 카드협약사 연계관리"
    >
      {/* breadcrumb */}
      <Breadcrumb title="화물 카드협약사 연계관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-procNm">프로세스명</CustomFormLabel>
              <CustomTextField type="text" id="ft-procNm" name="procNm" onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                송수신여부
              </CustomFormLabel>
              <select
                id="ft-dlngNm-select-01"
                className="custom-default-select"
                name="dlngCd"
                value={params.dlngCd}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              >
                {dlngSelectItem.map((option) => (
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
          onClickButton={reExcute}
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
        />
        <DetailDialog 
          isOpen={open}
          title={'연계처리이력'}
          size={'xl'}
          handleClickClose={handleClose}
          children={<ModalContent rows={historyRow}/>}
        />
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
