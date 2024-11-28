import React, { useState } from 'react'

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
import { HeadCell } from 'table'
import { visuallyHidden } from '@mui/utils'
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'

// MUI 그리드 한글화 import
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import * as locales from '@mui/material/locale'

import DetailDataGrid from './DetailDataGrid'
import { ButtonGroupActionProps } from './DetailDataGrid'
import { Row } from './FreightPage'


type SupportedLocales = keyof typeof locales

// 페이지 정보
type pageable = {
  pageNumber: number
  pageSize: number
  sort: string
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}


// Row를 받아서 수정조회삭제시 사용될 값들을 조합한 고유 식별자 스트링을 반환해준다. 
function rowGetId(row : Row){
  return row.vhclNo ?? '' +',' + row.exsLocgovCd ?? ''+',' 
  + row.chgLocgovCd ?? '' +',' + row.aplySn ?? ''+',' + row.prcsSttsCd ?? '' 
}

function stableSort<T>(array: any[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }

    return a[1] - b[1]
  })

  return stabilizedThis.map((el) => el[0])
}

interface EnhancedTableProps {
  headCells: HeadCell[]
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    headCells,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler =
    (property: keyof []) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

    

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            tabIndex={-1}
            inputProps={{
              'aria-labelledby': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <div className="table-head-text">{headCell.label}</div>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface TableBottomToolbarProps {
  numSelected: number
}

function TableBottomToolbar(props: TableBottomToolbarProps) {
  const { numSelected } = props

  return (
    <div className="data-grid-bottom-toolbar">
      {numSelected > 0 ? (
        <div className="data-grid-select-count action">
          총 {numSelected}건 선택
        </div>
      ) : (
        <div className="data-grid-select-count">총 0건 선택</div>
      )}
    </div>
  )
}

interface TableDataGridComponentProps {
  rows: Row[]
  locRows: Row[]
  headCells: HeadCell[]
  totalRows: number // 총 검색 결과 수
  locTotalRows: number // 총 관할관청 이관 갯수 
  locPageable: pageable // 관활관청 이관 페이징 
  loading: boolean // 로딩 여부
  onPaginationModelChange: (page: number, pageSize: number) => void // 페이지 변경 핸들러 추가
  onSortModelChange: (sort: string) => void // 정렬 모델 변경 핸들러 추가
  onRowClick: (row :Row) => void //  행 클릭 핸들러 추가
  pageable: pageable // 페이지 정보
  detailBtnGroupActions: ButtonGroupActionProps
}

const CheckBoxTableGrid: React.FC<TableDataGridComponentProps> = ({
  rows,

  locRows,
  locTotalRows,
  locPageable,
  headCells,

  totalRows,
  loading,
  onPaginationModelChange,
  onSortModelChange,
  onRowClick,
  pageable,
  detailBtnGroupActions,
}) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<any>('calories')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [selectedRow, setSelectedRow] = React.useState<Row>()


  const [selectedRows, setSelectedRows] = useState<Row[]>([]) // 선택된 Row들을 추적



  // 정렬요청
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof [],
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }



  // // handleSelect
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => (rowGetId(row)) ) // 신청 일련번호를 넣어줌 
      console.log(newSelecteds);
      setSelected(newSelecteds)
      setSelectedRows(rows) // 모든 Row들을 선택된 상태로 설정
      return
    }
    setSelected([])
    setSelectedRows([]) // 선택된 Row들을 초기화
    return 
  }

 // 단일 Row 선택 핸들러
 const handleClick = (event: React.MouseEvent<unknown>, name: string, row: Row) => {
  const selectedIndex = selected.indexOf(name)
  let newSelected: readonly string[] = []
  let newSelectedRows: Row[] = []

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, name)
    newSelectedRows = newSelectedRows.concat(selectedRows, row)
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1))
    newSelectedRows = newSelectedRows.concat(selectedRows.slice(1))
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1))
    newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1))
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    )
    newSelectedRows = newSelectedRows.concat(
      selectedRows.slice(0, selectedIndex),
      selectedRows.slice(selectedIndex + 1),
    )
  }

  setSelected(newSelected)
  setSelectedRows(newSelectedRows)

  // 항상 선택된 행으로 업데이트합니다.
  setSelectedRow(row)
}

  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationModelChange(newPage, pageable.pageSize)
  }

  //페이지 사이즈 변경시 0 페이지로 이동
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onPaginationModelChange(0, Number(event.target.value))
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1


  // MUI 그리드 한글화
  const [locale, setLocale] = React.useState<SupportedLocales>('koKR')
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )

  return (
    // MUI 한글화 "ThemeProvider"
    <ThemeProvider theme={themeWithLocale}>
      <div className="data-grid-wrapper">
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} className="td-center">
                    <p>로딩 중입니다...</p>
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((row, index) => {
                  const isItemSelected = isSelected(rowGetId(row))
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      key={`tr${index}`}
                      onClick={(event) => handleClick(event, rowGetId(row),row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <CustomCheckbox
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.prcsYmd}</TableCell>
                      <TableCell>{row.vonrRrno}</TableCell>
                      <TableCell>{row.vonrNm}</TableCell>
                      <TableCell>{row.vhclNo}</TableCell>
                      <TableCell>{row.exsLocgovNm}</TableCell>
                      <TableCell>{row.chgLocgovNm}</TableCell>
                      <TableCell>{row.prcsSttsCdNm}</TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={headCells.length} className="td-center">
                    <p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </TableContainer>
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

      {/* 상세 영역 시작*/}
      {selected.length > 0 && (
        <Grid item xs={4} sm={4} md={4}>
          <DetailDataGrid 
          btnActions={detailBtnGroupActions} 
          data={selectedRow}
          locTotalRows={locTotalRows} 
          locRows ={locRows}
          locPageable={locPageable}
          selectedRows={selectedRows}
          />
        </Grid>
      )}
      {/* 상세 영역 끝 */}

    </ThemeProvider>
  )
}

export default CheckBoxTableGrid
