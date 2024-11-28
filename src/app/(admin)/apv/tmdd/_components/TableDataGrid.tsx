import React, { useEffect } from 'react'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Grid,

} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
// MUI 그리드 한글화 import
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import * as locales from '@mui/material/locale'
import { HeadCell } from 'table'
import { Row } from '../page'

import {
  getNumtoWon,
  formatDate,
  formBrno,
} from '@/utils/fsms/common/convert'

type SupportedLocales = keyof typeof locales

// 페이지 정보
type pageable = {
  pageNumber: number
  pageSize: number
  sort: string
}

// 테이블 caption
const tableCaption: string = '전국표준한도관리 목록'

// 테이블 th 정의 기능에 사용하는 props 정의
interface EnhancedTableProps {
  headCells: HeadCell[]
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void
  order: order
  orderBy: string
}

// 테이블 th 정의 기능
function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
  const { headCells, order, orderBy, onRequestSort } = props
  const createSortHandler =
    (property: keyof []) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  
    return (
      <TableHead>
        <TableRow key={'thRow'}>
          {headCells.map((headCell) => (
            <React.Fragment key={'th' + headCell.id}>
              {headCell.sortAt ? (
                <TableCell
                  // className="table-cell-auto"
                  align={'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  style={{ whiteSpace: 'nowrap' }}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.label.split('\n').map((line, index) => (
                    <div key={index}>{line}</div> // 줄바꿈된 텍스트를 div로 감싸서 표시
                  ))}
                </TableCell>
              ) : (
                <TableCell
                  // className="table-cell-auto"
                  align={'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {headCell.label.split('\n').map((line, index) => (
                    <div key={index}>{line}</div> // 줄바꿈된 텍스트를 div로 감싸서 표시
                  ))}
                </TableCell>
              )}
            </React.Fragment>
          ))}
        </TableRow>
      </TableHead>
    )
  }

// 검색 결과 건수 툴바
function TableTopToolbar(props: Readonly<{ totalRows: number }>) {
  return (
    <div className="data-grid-top-toolbar">
      <div className="data-grid-search-count">
        검색 결과 <span className="search-count">{props.totalRows}</span>건
      </div>
    </div>
  )
}

// TableDataGrid의 props 정의
interface ServerPaginationGridProps {
  headCells: HeadCell[]
  rows: Row[] // 목록 데이터
  totalRows: number // 총 검색 결과 수
  loading: boolean // 로딩 여부
  onPaginationModelChange: (page: number, pageSize: number) => void // 페이지 변경 핸들러 추가
  onSortModelChange: (sort: string) => void // 정렬 모델 변경 핸들러 추가
  onRowClick: (postTsid: string) => void // 행 클릭 핸들러 추가
  pageable: pageable // 페이지 정보
}

type order = 'asc' | 'desc'

const TableDataGrid: React.FC<ServerPaginationGridProps> = ({
  headCells,
  rows,
  totalRows,
  loading,
  onPaginationModelChange,
  onSortModelChange,
  onRowClick,
  pageable,
}) => {
  // 쿼리스트링의 sort 값이 컬럼명,정렬 구조로 되어있어 분해하여 테이블에 적용
  let order: order = 'desc'
  let orderBy: string = ''
  if (pageable.sort !== '') {
    let sort = pageable.sort.split(',')
    orderBy = sort[0]
    order = sort[1] == 'desc' ? 'desc' : 'asc'
  }

  // sort 정렬 변경시 정렬 기준으로 데이터 다시 로드
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof [],
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    onSortModelChange(String(property) + ',' + (isAsc ? 'desc' : 'asc'))
  }

  // 페이지 변경시 사이즈를 유지하고 페이지 이동
  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationModelChange(newPage, pageable.pageSize)
  }

  //페이지 사이즈 변경시 0 페이지로 이동
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onPaginationModelChange(0, Number(event.target.value))
  }

  // MUI 그리드 한글화
  const locale: SupportedLocales = 'koKR'
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )


  return (
    // MUI 한글화 "ThemeProvider"
    <ThemeProvider theme={themeWithLocale}>
    <div className="data-grid-wrapper">
        <TableTopToolbar totalRows={totalRows} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <caption>{tableCaption}</caption>
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {!loading ? (
                rows.length > 0 ? (
                  rows.map((row: any, index) => {
                    return (
                      <TableRow key={'tr' + index}>
                        <TableCell className="table-cell-auto">{row.crdcoNm}</TableCell>
                        <TableCell className="table-cell-auto">{row.locgovNm}</TableCell>
                        <TableCell className="table-cell-auto">{formatDate(row.trauDt)}</TableCell>
                        <TableCell className="table-cell-auto">{row.vhclNo}</TableCell>
                        <TableCell className="table-cell-auto">{formBrno(row.brno)}</TableCell>
                        <TableCell className="table-cell-auto">{row.dlngSeNm}</TableCell>
                        <TableCell className="table-cell-auto">{row.dailUseAcmlNmtm}</TableCell>
                        <TableCell className="table-cell-auto">{row.literAcctoUntprcSeNm}</TableCell>
                        <TableCell className="table-cell-auto">{row.literAcctoUntprc}</TableCell>
                        <TableCell className="table-cell-auto">{row.useLiter}</TableCell>
                        <TableCell className="table-cell-auto">{row.moliatUseLiter}</TableCell>

                        {/* 단위  */}
                        <TableCell className="table-cell-auto">{row.koiUnitNm}</TableCell>
                        <TableCell className="table-cell-auto">{getNumtoWon(row.aprvAmt)}</TableCell>


                        {/* //수급자부담금 */}
                        <TableCell className="table-cell-auto">{getNumtoWon(row.pbillAmt)}</TableCell>
                        <TableCell className="table-cell-auto">{getNumtoWon(row.vhclPorgnUntprc)}</TableCell>
                        <TableCell className="table-cell-auto">{getNumtoWon(row.literAcctoOpisAmt)}</TableCell>

                        {/* 국토부 부조금 */}
                        <TableCell className="table-cell-auto">{getNumtoWon(row.exsMoliatAsstAmt)}</TableCell>
                        <TableCell className="table-cell-auto">{getNumtoWon(row.opisAmt)}</TableCell>
                        <TableCell className="table-cell-auto">{getNumtoWon(row.moliatAsstAmt)}</TableCell>
                        <TableCell className="table-cell-auto">{row.koiNm}</TableCell>
                        <TableCell className="table-cell-auto">{row.bzentyNm}</TableCell>
                        <TableCell className="table-cell-auto">{row.frcsNm}</TableCell>
                        <TableCell className="table-cell-auto">{formBrno(row.frcsBrno)}</TableCell>
                        <TableCell className="table-cell-auto">{row.cardNo}</TableCell>
                        <TableCell className="table-cell-auto">{row.rtrcnDlngDt}</TableCell>
                        <TableCell className="table-cell-auto">{row.aprvRspnsNm}</TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow key={'tr0'}>
                    <TableCell colSpan={26} className="td-center">
                      <p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow key={'tr0'}>
                  <TableCell colSpan={26} className="td-center">
                    <p> </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <CustomFormLabel className="input-label-none" htmlFor="tablePagination" >페이지</CustomFormLabel> */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={pageable.pageSize}
          page={pageable.pageNumber}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </ThemeProvider>
  )
}

export default TableDataGrid