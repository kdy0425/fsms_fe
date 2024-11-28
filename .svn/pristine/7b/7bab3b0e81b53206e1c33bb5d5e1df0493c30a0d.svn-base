'use client'
import {
  Box,
  Button
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { BlankCard, Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

// types
import TableDataGrid from '@/app/components/tables/CommDataGrid'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getCommCd, getExcelFile, getToday } from '@/utils/fsms/common/comm'
import { SelectItem } from 'select'
import { HeadCell } from 'table'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '거래정보',
  },
  {
    title: '주유(충전)소 관리',
  },
  {
    to: '/apv/smou',
    title: '특별관리주유소 이용자조회',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'frcsBrno',
    numeric: false,
    disablePadding: false,
    label: '사업자번호',
    format: 'brno'
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
  {
    id: 'bltBgngYmd',
    numeric: false,
    disablePadding: false,
    label: '시작일자',
    format: 'yyyymmdd'
  },
  {
    id: 'bltEndYmd',
    numeric: false,
    disablePadding: false,
    label: '종료일자',
    format: 'yyyymmdd'
  },
  {
    id: 'bltSttsCdNm', // ?
    numeric: false,
    disablePadding: false,
    label: '상태',
  },
  {
    id: 'locgovNm', // ?
    numeric: false,
    disablePadding: false,
    label: '등록 관할관청',
  },
]

const detailHeadCells: HeadCell[] = [
  {
    id: 'prcsSeCdNm',
    numeric: false,
    disablePadding: false,
    label: '이용구분',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'crdcoCdNm',
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
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vonrBrno',
    numeric: false,
    disablePadding: false,
    label: '소유자사업자등록번호',
    format: 'brno'
  },
  {
    id: 'vonrRrnoS',
    numeric: false,
    disablePadding: false,
    label: '주민등록번호',
  },
]

export interface Row {
  frcsBrno: string;
  bltSn: number;
  frcsNm: string;
  shFrcsCdNo: string;
  kbFrcsCdNo: string;
  wrFrcsCdNo: string;
  ssFrcsCdNo: string;
  hdFrcsCdNo: string;
  bltBgngYmd: string;
  bltEndYmd: string;
  bltSttsCd: string;
  bltSttsCdNm: string;
  bltRmvRsnCd: string;
  bltRmvRsnCdNm: string;
  bltRmvYmd: string;
  locgovCd: string;
  locgovNm: string;
  bltRsnCn: string;
  trsmYn: string;
  trsmDt: string;
  rgtrId: string;
  regDt: string;
  mdfrId: string;
  mdfcnDt: string;
  crdcoCd: string;
  crdcoCdNm: string;
  frcsCdNo: string;
  cardNo: string;
  cardNoS: string;
  prcsSeCd: string;
  prcsSeCdNm: string;
  frstDlngYmd: string;
  lastDlngYmd: string;
  vhclNo: string;
  vonrBrno: string;
  vonrNm: string;
  vonrRrno: string;
  vonrRrnoS: string;
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
  const [dFlag, setDflag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const [detailRows, setDetailRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [detailTotalRows, setDetailTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [prcsSeCdItems, setPrcsSeCdItems] = useState<SelectItem[]>([]);

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

  const [detailParams, setDetailParams] = useState<listSearchObj>({
    page: Number(1), // 상세 이용자정보 페이징
    size: Number(10), // 상세 이용자정보 사이즈
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

  const [detailPageable, setDetailPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if(params.frcsBrno || params.frcsNm) {
      fetchData()
      setSelectedRow(null);
      setSelectedIndex(-1);
    }
  }, [flag])
  
  useEffect(() => {
    if(selectedRow) {
      fetchDetailData(selectedRow)
      setDetailParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    }
  }, [dFlag])

  // 초기 데이터 로드
  useEffect(() => {
    getCommCd('599', '전체').then((itemArr) => setPrcsSeCdItems(itemArr))// 이용구분 코드
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
        `/fsm/apv/smou/tr/getAllSpeclMngOlt?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.frcsBrno ? '&frcsBrno=' + params.frcsBrno : ''}` +
        `${params.frcsNm ? '&frcsNm=' + params.frcsNm : ''}` +
        `${params.vonrBrno ? '&vonrBrno=' + params.vonrBrno : ''}` +
        `${params.vonrNm ? '&vonrNm=' + params.vonrNm : ''}` +
        `${params.prcsSeCd ? '&prcsSeCd=' + params.prcsSeCd : ''}`
        // `${params.bltSn ? '&bltSn=' + params.bltSn : ''}` 

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

  const fetchDetailData = async (row: Row) => {
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/smou/tr/getAllSpeclMngOltUser?page=${detailParams.page - 1}&size=${detailParams.size}` +
        `${detailParams.sort ? '&sort=' + sortChange(detailParams.sort) : ''}` +
        `${row.frcsBrno ? '&frcsBrno=' + row.frcsBrno : ''}` +
        // `${params.frcsNm ? '&frcsNm=' + params.frcsNm : ''}` +
        `${row.vonrBrno ? '&vonrBrno=' + row.vonrBrno : ''}` +
        `${row.vonrNm ? '&vonrNm=' + row.vonrNm : ''}` +
        `${row.prcsSeCd ? '&prcsSeCd=' + row.prcsSeCd : ''}` +
        `${row.bltSn ? '&bltSn=' + row.bltSn : ''}` 

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setDetailRows(response.data.content)
        setDetailTotalRows(response.data.totalElements)
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
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setDetailRows([])
      setDetailTotalRows(0)
      setDetailPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    }
  }

  const excelDownload = async (row: Row) => { // 엑셀다운로드 api 없음 (241126)
    let endpoint: string =
    `/fsm/apv/ld/cm/getExcelLbrctDtls?` +
    `${detailParams.sort ? '&sort=' + sortChange(detailParams.sort) : ''}` +
    `${row.frcsBrno ? '&frcsBrno=' + row.frcsBrno : ''}` +
    // `${params.frcsNm ? '&frcsNm=' + params.frcsNm : ''}` +
    `${row.vonrBrno ? '&vonrBrno=' + row.vonrBrno : ''}` +
    `${row.vonrNm ? '&vonrNm=' + row.vonrNm : ''}` +
    `${row.prcsSeCd ? '&prcsSeCd=' + row.prcsSeCd : ''}` +
    `${row.bltSn ? '&bltSn=' + row.bltSn : ''}` 

    getExcelFile(endpoint, BCrumb[BCrumb.length-1].title + '_'+getToday()+'.xlsx')
}

  // 페이지 이동 감지 시작 //

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()

    if(!params.frcsBrno) {
      alert("사업자등록번호를 입력해주세요");
      return;
    }

    if(!params.frcsNm) {
      alert("가맹점명을 입력해주세요.");
      return;
    }

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

  const handleDetailPagenationChange = (page: number, pageSize: number) => {
    setDetailParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setDflag(!dFlag);
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = (row: Row, index?: number) => {
    console.log("ROW ::: ", row);

    setSelectedIndex(index?? -1);
    setSelectedRow(row);
    setDflag(!dFlag);
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
    <PageContainer
      title="특별관리주유소 이용자조회"
      description="특별관리주유소 이용자조회"
    >
      {/* breadcrumb */}
      <Breadcrumb title="특별관리주유소 이용자조회" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-frcsBrno"
                  required
                >
                  사업자등록번호
                </CustomFormLabel>
                <CustomTextField type="text" name="frcsBrno" id="ft-frcsBrno" value={params.frcsBrno} onChange={handleSearchChange} fullWidth />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-frcsNm"
                  required
                >
                  가맹점명
                </CustomFormLabel>
                <CustomTextField type="text" name="frcsNm" id="ft-frcsNm" value={params.frcsNm} onChange={handleSearchChange} fullWidth />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-car-name"
                >
                  대표자명
                </CustomFormLabel>
                <CustomTextField type="text" id="ft-car-name" value={''} onChange={handleSearchChange} fullWidth />
              </div>
            </div>
            <hr></hr>
            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-vonrBrno"
                >
                  소유자사업자등록번호
                </CustomFormLabel>
                <CustomTextField type="text" name="vonrBrno" id="ft-vonrBrno" value={params.vonrBrno} onChange={handleSearchChange} fullWidth />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-vonrNm"
                >
                  소유자명
                </CustomFormLabel>
                <CustomTextField type="text" name="vonrNm" id="ft-vonrNm" value={params.vonrNm} onChange={handleSearchChange} fullWidth />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-prcsSeCd"
                >
                  이용구분
                </CustomFormLabel>
                <select
                  id="ft-prcsSeCd-select-01"
                  className="custom-default-select"
                  name="prcsSeCd"
                  value={params.prcsSeCd}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {prcsSeCdItems.map((option) => (
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
            {detailRows && detailRows.length > 0 ? 
             <Button variant="contained" color="primary">
              엑셀
            </Button>
            : ''} 
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
          selectedRowIndex={selectedIndex}
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          paging
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          cursor
        />
      </Box>

      {selectedRow && selectedIndex > -1 ?
      <Box>
        <BlankCard className="contents-card" title="특별관리주유소 이용자 조회">
          <TableDataGrid
            headCells={detailHeadCells} // 테이블 헤더 값
            rows={detailRows} // 목록 데이터
            totalRows={detailTotalRows} // 총 로우 수
            loading={loading} // 로딩여부
            onRowClick={() => {}} // 행 클릭 핸들러 추가
            onPaginationModelChange={handleDetailPagenationChange} // 페이지 , 사이즈 변경 핸들러 추가
            onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
            paging
            pageable={detailPageable} // 현재 페이지 / 사이즈 정보
          />
        </BlankCard>
      </Box>
      : <></>}
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
