'use client'
import {
  Box,
  Button,
  FormControlLabel,
  RadioGroup
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb, CustomRadio } from '@/utils/fsms/fsm/mui-imports'

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
import FormModal from './_components/FormModal'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '시스템관리',
  },
  {
    title: '시스템일반',
  },
  {
    to: '/sym/cc',
    title: '공통코드관리',
  },
]


const headCells: HeadCell[] = [
  {
    id: 'cdGroupNm',
    numeric: false,
    disablePadding: false,
    label: '코드그룹명',
  },
  {
    id: 'cdKornNm',
    numeric: false,
    disablePadding: false,
    label: '코드그룹한글명',
  },
  {
    id: 'cdSeNm',
    numeric: false,
    disablePadding: false,
    label: '코드구분명',
  },
  {
    id: 'cdExpln',
    numeric: false,
    disablePadding: false,
    label: '코드설명',
  },
  {
    id: 'useNm',
    numeric: false,
    disablePadding: false,
    label: '사용여부',
  },
  {
    id: 'comCdYn',
    numeric: false,
    disablePadding: false,
    label: '공통코드여부',
  },
  {
    id: 'edit',
    numeric: false,
    disablePadding: false,
    label: '수정',
  },
]

const headCells_code: HeadCell[] = [
  {
    id: 'cdGroupNm',
    numeric: false,
    disablePadding: false,
    label: '코드그룹명',
  },
  {
    id: 'cdNm',
    numeric: false,
    disablePadding: false,
    label: '코드명',
  },
  {
    id: 'cdKornNm',
    numeric: false,
    disablePadding: false,
    label: '코드한글명',
  },
  {
    id: 'cdExpln',
    numeric: false,
    disablePadding: false,
    label: '코드설명',
  },
  {
    id: 'cdSeq',
    numeric: false,
    disablePadding: false,
    label: '코드순서',
  },
  {
    id: 'useYn',
    numeric: false,
    disablePadding: false,
    label: '사용여부',
  },
  {
    id: 'edit',
    numeric: false,
    disablePadding: false,
    label: '수정',
  },
]

export interface Row {
  cdGroupNm: string; // 코드그룹명
  cdNm: string; // 코드명
  cdKornNm: string; // 코드그룹한글명
  cdExpln: string; // 코드설명
  cdSeq: string | number; // 코드 순서
  useYn: string; // 사용여부
  cdSeNm: string; // 코드구분명?
  comCdYn: string; // 공통코드여부
  useNm?: string; //사용여부 한글 (사용 / 미사용)
}

interface Row_code {
  cdGroupNm: string;
  cdNm: string;
  cdKornNm: string;
  cdExpln: string;
  cdSeq: string;
  useYn: string;
}

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  sort_c: string
  page_c: number
  size_c: number
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

  // 코드 그룹
  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); // 선택된 로우 인덱스
  
  // 공통 코드
  const [rows_c, setRows_c] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows_c, setTotalRows_c] = useState(0) // 총 수
  const [loading_c, setLoading_c] = useState(false) // 로딩여부

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    page_c: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size_c: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    searchStDate: allParams.searchStDate ?? '', // 시작일
    searchEdDate: allParams.searchEdDate ?? '', // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
    sort_c: allParams.sort ?? '', // 정렬 기준 추가
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 5, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })
  const [pageable_c, setPageable_c] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 5, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    if(params.cdNm_c || params.cdKornNm_c) { // 코드명/코드한글명을 조회하면 그룹 검색결과는 비움
      setRows([])
      setTotalRows(0)
      fetchCodeData(null);
    }else {
      fetchData();
    }
  }, [flag])

  useEffect(() => {
    if(rows.length > 0) {
      fetchCodeData(rows[0].cdGroupNm);
    }else {
      setRows_c([]);
      setTotalRows_c(0);
    }
  }, [rows])

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

  // 쿼리스트링, endpoint, 메서드(로딩), 페이지, 파싱할때 타입 (rowtype 채택한 타입으로 아무거나 되게 )
  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/sym/cc/cm/getAllCmmnCdGroup?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.cdGroupNm ? '&cdGroupNm=' + params.cdGroupNm : ''}` +
        `${params.cdKornNm ? '&cdKornNm=' + params.cdKornNm : ''}` +
        `${params.cdNm ? '&cdNm=' + params.cdNm : ''}` +
        `${params.useYn ? '&useYn=' + params.useYn : ''}`

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
          pageSize: 5,
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
        pageSize: 5,
        sort: params.sort,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCodeData = async (cdGroupNm:string | null) => {
    setLoading_c(true)
    try {
      let endpoint: string =`/fsm/sym/cc/cm/getAllCmmnCd?page=${params.page_c - 1}&size=${params.size_c}` +
          `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` + 
          `${cdGroupNm ? '&cdGroupNm=' + cdGroupNm : ''}` +
          `${params.cdNm_c ? '&cdNm=' + params.cdNm_c : ''}` + 
          `${params.cdKornNm_c ? '&cdKornNm=' + params.cdKornNm_c : ''}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRows_c(response.data)
        setTotalRows_c(response.data.length)
        // setPageable_c({
        //   pageNumber: response.data.pageable.pageNumber,
        //   pageSize: response.data.pageable.pageSize,
        //   sort: params.sort,
        // })
      } else {
        // 데이터가 없거나 실패
        setRows_c([])
        setTotalRows_c(0)
        // setPageable_c({
        //   pageNumber: 1,
        //   pageSize: 5,
        //   sort: params.sort_c,
        // })
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows_c([])
      setTotalRows_c(0)
      // setPageable_c({
      //   pageNumber: 1,
      //   pageSize: 5,
      //   sort: params.sort_c,
      // })
    } finally {
      setLoading_c(false)
    }
  }

  // 페이지 이동 감지 시작 //

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
    setSelectedRowIndex(0);
  }
  
  const handleReload = () => {
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
    setSelectedRowIndex(0);
  }

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setSelectedRowIndex(0);
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
  const handleRowClick = (index: number) => {
    const rowData: Row = rows[index];
    const cdGroupNm: string = rowData['cdGroupNm']

    if(cdGroupNm) {
      fetchCodeData(cdGroupNm);
    }
    setSelectedRowIndex(index);
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
      title="공통코드 관리"
      description="공통코드 관리"
    >
      {/* breadcrumb */}
      <Breadcrumb title="공통코드 관리" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-cdGroupNm"
              >
                코드그룹명
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-cdGroupNm" name="cdGroupNm" value={params.cdGroupNm || ''} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
            <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-cdKornNm"
              >
                코드그룹한글명
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-cdKornNm" name="cdKornNm" value={params.cdKornNm || ''} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group" style={{ width: 'inherit' }}>
              <CustomFormLabel className="input-label-display">
                사용여부
              </CustomFormLabel>
              <RadioGroup
                row
                id="useYn"
                value={params.useYn || ''}
                onChange={handleSearchChange}
                className="mui-custom-radio-group"
              >
                <FormControlLabel
                  control={<CustomRadio id="chk_Y" name="useYn" value="Y" />}
                  label="사용"
                />
                <FormControlLabel
                  control={<CustomRadio id="chk_N" name="useYn" value="N" />}
                  label="미사용"
                />
              </RadioGroup>
            </div>
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group">
            <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-cdNm-02"
              >
                코드명
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-cdNm-02" name="cdNm_c" value={params.cdNm_c || ''} onChange={handleSearchChange} fullWidth />
            </div>
            <div className="form-group">
            <CustomFormLabel
                className="input-label-display"
                htmlFor="ft-cdKornNm-02"
              >
                코드한글명
              </CustomFormLabel>
              <CustomTextField type="text" id="ft-cdKornNm-02" name="cdKornNm_c" value={params.cdKornNm_c || ''} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <CustomFormLabel className="input-label-display">
            <h3>코드그룹</h3>
          </CustomFormLabel>
          <div className="button-right-align">
            <Button variant="contained" type="submit" color="primary">
              조회
            </Button>
            <FormModal
              buttonLabel='신규'
              title='코드그룹등록'
              dataType='group'
              formType="create"
              reloadFunc={handleReload}
            />
          </div>
        </Box>
      </Box>
      {/* 검색영역 끝 */}

      {/* 코드그룹 테이블영역 시작 */}
      <Box> 
        <TableDataGrid
          type={'g'}
          headCells={headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          totalRows={totalRows} // 총 로우 수
          selectedRowIndex={selectedRowIndex}
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
          reloadFunc={handleReload}
        />
      </Box>
      {/* 코드그룹 테이블영역 끝 */}

      {/* 공통코드 테이블영역 시작 */}
      <Box>
        <Box className="table-bottom-button-group">
            <CustomFormLabel className="input-label-display">
              <h3>공통코드</h3>
            </CustomFormLabel>
            <div className="button-right-align">
              <FormModal
                buttonLabel='신규'
                title='공통코드등록'
                dataType='code'
                formType="create"
                groupNm={rows[selectedRowIndex] ? rows[selectedRowIndex].cdGroupNm : ''}
              />
            </div>
          </Box>
          <TableDataGrid
            type={'c'}
            headCells={headCells_code} // 테이블 헤더 값
            rows={rows_c} // 목록 데이터
            totalRows={totalRows_c} // 총 로우 수
            loading={loading_c} // 로딩여부
            onRowClick={handleRowClick} // 행 클릭 핸들러 추가
            onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
            onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
            pageable={pageable_c} // 현재 페이지 / 사이즈 정보
            reloadFunc={handleReload}
          />
      </Box>
      {/* 공통코드 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
