import React, { useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import * as locales from '@mui/material/locale'
import { HeadCell } from 'table'
import { Row } from '../page'

type SupportedLocales = keyof typeof locales

const tableCaption: string = '전국표준한도관리 목록'

interface EnhancedTableProps {
  headCells: HeadCell[]
}

// Table header component without sorting functionality
function EnhancedTableHead(props: EnhancedTableProps) {
  const { headCells } = props

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            <div className="table-head-text">{headCell.label}</div>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

// Top toolbar showing the total row count
function TableTopToolbar(props: { totalRows: number }) {
  return (
    <div className="data-grid-top-toolbar">
      <div className="data-grid-search-count">
        검색 결과 <span className="search-count">{props.totalRows}</span>건
      </div>
    </div>
  )
}

// Main TableDataGrid component without pagination or sorting
interface TableDataGridProps {
  headCells: HeadCell[]
  rows: Row[]
  loading: boolean
  onRowClick: (row :Row) => void
  totalRows: number
}

const TableDataGrid: React.FC<TableDataGridProps> = ({
  headCells,
  rows,
  loading,
  onRowClick,
  totalRows,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>();
  // Setting up MUI localization for Korean
  const locale: SupportedLocales = 'koKR'
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )

  const handleRowClick = (index: number, row: Row) => {
    setSelectedIndex(index);
    onRowClick(row);
  };

  return (
    <ThemeProvider theme={themeWithLocale}>
      <div className="data-grid-wrapper">
        <TableTopToolbar totalRows={totalRows} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
            <caption>{tableCaption}</caption>
            <EnhancedTableHead headCells={headCells} />
            <TableBody>
              {!loading ? (
                rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow hover  key={`tr${index}`} onClick={() => handleRowClick(index, row) } 
                    selected={index == selectedIndex}>
                      <TableCell>{row.bzentyNm}</TableCell>
                      <TableCell>{row.brno}</TableCell>
                      <TableCell>{row.rprsvNm}</TableCell>
                      <TableCell>{row.pid}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="td-center">
                      자료가 없습니다. 다른 검색조건을 선택해주세요.
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="td-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ThemeProvider>
  )
}

export default TableDataGrid
