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

import TableDataGrid from '@/app/components/tables/CommDataGrid'

// types
import FormDialog from './_components/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell, Pageable } from 'table'
import { getCtpvCd, getDateRange, getCommCd, getToday, getExcelFile, getLocGovCd } from '@/utils/fsms/common/comm'
import ModalContent from './_components/ModalContent'
import { SelectItem } from 'select'

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
    to: '/apv/bbsr',
    title: '사업자별청구현황',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'vhclTonCd',
    numeric: false,
    disablePadding: false,
    label: '청구년월',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '지자체명',
  },
  {
    id: 'crtrAplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '사업자번호',
  },
  {
    id: 'crtrYear',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'avgUseLiter',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'limUseRt',
    numeric: false,
    disablePadding: false,
    label: '거래건수',
  },
  {
    id: 'crtrLimLiter',
    numeric: false,
    disablePadding: false,
    label: '거래금액',
  },
  {
    id: 'vhclTonCd',
    numeric: false,
    disablePadding: false,
    label: '개인부담금',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
  },
  {
    id: 'crtrAplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
  },
  {
    id: 'crtrYear',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
  },
  {
    id: 'avgUseLiter',
    numeric: false,
    disablePadding: false,
    label: '주유·충전량',
  },
  {
    id: 'limUseRt',
    numeric: false,
    disablePadding: false,
    label: '취소 거래건수',
  },
  {
    id: 'crtrLimLiter',
    numeric: false,
    disablePadding: false,
    label: '취소 거래금액',
  },
  {
    id: 'vhclTonCd',
    numeric: false,
    disablePadding: false,
    label: '취소 개인부담금',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '취소 유가보조금',
  },
  {
    id: 'crtrAplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '취소 유류세연동보조금',
  },
  {
    id: 'crtrYear',
    numeric: false,
    disablePadding: false,
    label: '취소 유가연동보조금',
  },
  {
    id: 'avgUseLiter',
    numeric: false,
    disablePadding: false,
    label: '취소 주유·충전량',
  },
]

export interface Row {
  clclnYm?: string // 청구년월
  locgovCd?: string // 지자체코드
  locgovNm?: string // 지자체명
  brno?: string // 사업자번호
  bzentyNm?: string // 업체명
  koiCd?: string // 유종코드
  koiNm?: string // 유종
  prttnYn?: string // 분할여부
  aprvCnt?: string // 거래건수
  fuelQty?: string // 주유·충전량
  slsAmt?: string // 거래금액
  indvClmAmt?: string // 개인부담금
  asstAmt?: string // 보조금액
  ftxAsstAmt?: string // 유류세보조금액
  opisAmt?: string // 유가연동보조금액
  casstAmt?: string // 취소 보조금액
  cfuelQty?: string // 취소 주유·충전량
  cindvClmAmt?: string // 취소 개인부담금액
  caprvCnt?: string // 취소 건수
  copisAmt?: string // 취소 유가연동보조금액
  cslsAmt?: string // 취소 거래금액
  cftxAsstAmt?: string // 취소 유류세연동보조금액
}

export interface ModalRow {
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

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  const [ctpvCdItems, setCtpvCdItems] = useState<SelectItem[]>([]); // 시도코드
  const [locgovCdItems, setLocgovCdItems] = useState<SelectItem[]>([]); // 관할관청코드
  const [koicdItems, setKoicdItems] = useState<SelectItem[]>([]); // 유종코드

  const [modalRows, setModalRows] = useState<ModalRow[]>([]);
  const [modalTotalRows, setModalTotalRows] = useState(0);
  const [selectedRow, setSelectedRow] = useState<Row>();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const [modalParams, setModalParams] = useState({
    clclnYm: '',
    locgovCd: '',
    brno: '',
    koiCd: '',
    prttnYn: '',
    vhclSeCd: ''
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
    if (params.ctpvCd || params.locgovCd) {
        fetchData()
    }
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
        setParams((prev) => ({ ...prev, ctpvCd: itemArr[0].value })) // 첫번째 아이템으로 기본값 설정
    })

    getCommCd('599', '전체').then((itemArr) => setKoicdItems(itemArr)) // 유종코드
  }, [])

  useEffect(() => { // 시도 코드 변경 시 관할관청 재조회
    // 관할관청
    if (params.ctpvCd) {
        getLocGovCd(params.ctpvCd).then((itemArr) => {
            setLocgovCdItems(itemArr);
            setParams((prev) => ({ ...prev, locgovCd: itemArr[0].value })) // 첫번째 아이템으로 기본값 설정
        })
    }
  }, [params.ctpvCd])

  useEffect(() => {
    if (modalParams.locgovCd) {
        // 상세 내역 조회
        fetchModalData();
    }
  }, [modalParams])

  function formatDate(dateString:string) {
    // 입력 형식이 YYYY-MM-DD인지 확인
    if (!/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // "-" 제거하고 반환
    return dateString.replace("-", "");
  }

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      if (!params.ctpvCd) {
        alert("시도명을 선택해주세요.");
        return;
      }

      if (!params.locgovCd) {
        alert("관할관청을 선택해주세요.");
        return;
      }

      if (!params.searchStDate || params.searchEdDate) {
        alert("청구년월을 입력해주세요.");
        return;
      }

      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/cal/bsnsr/bs/getAllBsnmSbsidyRqestCur?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` + 
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` + 
        `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}` + 
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}`

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
      setModalRows([])
      setModalTotalRows(0)
    }
  }

  const excelDownload = async () => {
    let endpoint: string =
        `/fsm/cal/bsnsr/bs/getExcelBsnmSbsidyRqestCur?` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` + 
        `${params.searchStDate ? '&bgngDt=' + formatDate(params.searchStDate) : ''}` + 
        `${params.searchEdDate ? '&endDt=' + formatDate(params.searchEdDate) : ''}` + 
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}`

    getExcelFile(endpoint, BCrumb[BCrumb.length - 1].title + "_" + getToday() + ".xlsx");
  }

  const fetchModalData = async () => {
    setLoading(true)

    try {
        let endpoint: string =
            `/fsm/cal/bsnsr/bs/getAllBsnmSbsidySetlCur?` +
            `${modalParams.clclnYm ? '&clclnYm=' + modalParams.clclnYm : ''}` + 
            `${modalParams.locgovCd ? '&locgovCd=' + modalParams.locgovCd : ''}` + 
            `${modalParams.koiCd ? '&koiCd=' + modalParams.koiCd : ''}` +
            `${modalParams.brno ? '&brno=' + modalParams.brno : ''}` + 
            `${modalParams.prttnYn ? '&prttnYn=' + modalParams.prttnYn : ''}` + 
            `&vhclSeCd=`
        
        const response = await sendHttpRequest('GET', endpoint, null, true, {
            cache: 'no-store',
        })
        if (response && response.resultType === 'success' && response.data) {
            // 데이터 조회 성공시
            setModalRows(response.data);
        }
        
    } catch (error) {
        console.error('no such fetching data:', error)
        setModalRows([])
    } finally {
        setLoading(false)
    }
  }

  const modalExcelDownload = async (selectedRow: Row) => {
    if (selectedRow == undefined) {
      alert('엑셀파일을 다운로드할 데이터가 없습니다.');
      return;
    }

    let endpoint: string = 
      `/fsm/cal/bsnsr/bs/getExcelBsnmSbsidySetlCur?` + 
      `${selectedRow.clclnYm ? '&clclnYm=' + formatDate(selectedRow.clclnYm) : ''}` + 
      `${selectedRow.locgovCd ? '&locgovCd=' + selectedRow.locgovCd : ''}` +
      `${selectedRow.brno ? '&brno=' + selectedRow.brno : ''}` + 
      `${selectedRow.koiCd ? '&koiCd=' + selectedRow.koiCd : ''}` + 
      `${selectedRow.prttnYn ? '&prttnYn=' + selectedRow.prttnYn : ''}`

      getExcelFile(endpoint, BCrumb[BCrumb.length - 1].title + "_외상결제거래내역_" + getToday() + ".xlsx");
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
    setModalRows([])
    setModalTotalRows(0);
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = (row: Row) => {
    setModalParams((prev) => ({
        ...prev,
        clclnYm: row.clclnYm ? row.clclnYm : '',
        locgovCd: row.locgovCd ? row.locgovCd : '',
        brno: row.brno ? row.brno : '',
        koiCd: row.koiCd ? row.koiCd : '',
        prttnYn: row.prttnYn ? row.prttnYn : ''
    }))
  }

  const handleModalOpen = async () => {
    if (selectedRow) {
      await fetchModalData();
      setIsModalOpen(true);
    } else {
      alert('행을 먼저 선택하세요');
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
    <PageContainer title="사업자별청구현황" description="사업자별청구현황">
      {/* breadcrumb */}
      <Breadcrumb title="사업자별청구현황" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-01">
                <span className="required-text">*</span>시도명
              </CustomFormLabel>
              <select
                id="ft-select-01"
                className="custom-default-select"
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
                <span className="required-text">*</span>관할관청
              </CustomFormLabel>
              <select
                id="ft-select-02"
                className="custom-default-select"
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
                <span className="required-text">*</span>청구년월
              </CustomFormLabel>
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-start"
              >
                청구년월 시작
              </CustomFormLabel>
              <CustomTextField type="month" id="ft-date-start" value={params.searchStDate} onChange={handleSearchChange} fullWidth />
              <CustomFormLabel
                className="input-label-none"
                htmlFor="ft-date-end"
              >
                청구년월 종료
              </CustomFormLabel>
              <CustomTextField type="month" id="ft-date-end" value={params.searchEdDate} onChange={handleSearchChange} fullWidth />
            </div>
          </div><hr></hr>
          <div className="filter-form">
            <div className="form-group">
                <CustomFormLabel className="input-label-display">
                    사업자등록번호
                </CustomFormLabel>
                <CustomTextField type="text" id="ft-brno" value={params.brno} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display" htmlFor="ft-select-03">
                유종
              </CustomFormLabel>
              <select
                id="ft-select-03"
                className="custom-default-select"
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
            <FormDialog
              size="lg"
              buttonLabel="결제된 외상거래"
              title="외상거래 결제내역"
              seletedRow={selectedRow as Row}
              excelDownloadDetail={modalExcelDownload}
              children={<ModalContent rows={modalRows} />}
              onOpen={() => handleModalOpen()}
            />
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}

      {/* 테이블영역 시작 */}
      <Box>
        <TableDataGrid 
          headCells={headCells}
          rows={rows}
          totalRows={totalRows}
          loading={loading}
          onRowClick={handleRowClick}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          pageable={pageable}
          paging={true}
        />
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  )
}

export default DataList
