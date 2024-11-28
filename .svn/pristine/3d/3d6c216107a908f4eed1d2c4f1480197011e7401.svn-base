import React from 'react'
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
} from '@mui/material'
import { HeadCell } from 'table'

// MUI 그리드 한글화 import
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import * as locales from '@mui/material/locale'
type SupportedLocales = keyof typeof locales

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
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { headCells, order, orderBy } = props

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

function TableTopToolbar(props: Readonly<{ totalRows: number }>) {
  return (
    <div className="data-grid-top-toolbar">
      <div className="data-grid-search-count">
        검색 결과 <span className="search-count">{props.totalRows}</span>건
      </div>
    </div>
  )
}

interface TableDataGridComponentProps {
  rowData: any[]
  headCells: HeadCell[]
  totalRows: number // 총 검색 결과 수
  loading: boolean // 로딩 여부
  onRowClick?: (row: any) => void
}

const TableDataGrid: React.FC<TableDataGridComponentProps> = ({
  rowData,
  headCells,
  totalRows,
  loading,
  onRowClick,
}) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<any>('id')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    let newSelected: readonly string[] = []
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowData.length) : 0

  const [locale, setLocale] = React.useState<SupportedLocales>('koKR')
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )

  return (
    <ThemeProvider theme={themeWithLocale}>
      <div className="data-grid-wrapper">
        <TableTopToolbar totalRows={totalRows} />

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              rowCount={rowData.length}
              headCells={headCells}
            />
            <TableBody>
              {!loading ? (
                rowData.length > 0 ? (
                  rowData.map((row: any, index) => {
                    return (
                      <TableRow key={'tr' + index}>
                        <TableCell className="td-left">{row.date}</TableCell>
                        <TableCell>{row.carNumber}</TableCell>
                        <TableCell>{row.ownerName}</TableCell>
                        <TableCell>{row.ownerIdNumber}</TableCell>
                        <TableCell>{row.buisnessNumber}</TableCell>
                        <TableCell>{row.carOwnType}</TableCell>
                        <TableCell>{row.currentCarStatus}</TableCell>
                        <TableCell>{row.manageCenter}</TableCell>
                        <TableCell>{row.managePoint}</TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow key={'tr0'}>
                    <TableCell colSpan={5} className="td-center">
                      <p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow key={'tr0'}>
                  <TableCell colSpan={5} className="td-center">
                    <p> </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </ThemeProvider>
  )
}

export default TableDataGrid
