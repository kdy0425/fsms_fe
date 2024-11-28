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
  Button,
} from '@mui/material'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import * as locales from '@mui/material/locale'

type SupportedLocales = keyof typeof locales

interface ButtonProps {
  label: string
  color: 'primary' | 'dark'
  onClick: () => void
}

interface ColspanTableComponentProps {
  headerCells: any[]
  colspanTitles?: string[]
  rowData: any[]
  onRowClick?: (row: any) => void
  buttonGroupTop?: ButtonProps[]
  buttonGroupBottom?: ButtonProps[]
}

const ColspanTableComponent: React.FC<ColspanTableComponentProps> = ({
  headerCells,
  colspanTitles,
  rowData,
  onRowClick,
  buttonGroupTop,
  buttonGroupBottom,
}) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [locale] = React.useState<SupportedLocales>('koKR')
  const theme = useTheme()
  const themeWithLocale = createTheme(theme, locales[locale])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <ThemeProvider theme={themeWithLocale}>
      <Box sx={{ width: '100%' }}>
        {/* 테이블 상단 버튼 그룹 시작 */}
        {buttonGroupTop && buttonGroupTop.length > 0 && (
          <div className="table-top-control">
            {buttonGroupTop.map((button, index) => (
              <Button
                key={index}
                variant="contained"
                color={button.color}
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
        {/* 테이블 상단 버튼 그룹 끝 */}

        <TableContainer>
          <Table>
            <caption>가이드 타이틀 테이블 요약</caption>
            <colgroup>
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: 'auto' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                {colspanTitles &&
                  colspanTitles.map((title, index) => (
                    <TableCell
                      key={index}
                      colSpan={5}
                      style={{
                        whiteSpace: 'pre-wrap',
                        borderRight:
                          index < headerCells.length - 1
                            ? '1px solid #ccc'
                            : 'none',
                      }}
                    >
                      {title}
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                {headerCells.map((headerCell, index) => (
                  <TableCell
                    key={index}
                    style={{
                      whiteSpace: 'pre-wrap',
                      borderRight: '1px solid #ccc',
                    }}
                  >
                    <TableSortLabel>{headerCell.label}</TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.carNumber}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.ownerName}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.ownerType}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.carStatus}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.carRegisterDate}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.adult1_insurance_status}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.adult1_insurance_startDate}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.adult1_insurance_endDate}
                    </TableCell>
                    <TableCell
                      style={{ width: 'auto', borderRight: '1px solid #ccc' }}
                    >
                      {row.adult2_insurance_status}
                    </TableCell>
                    <TableCell style={{ width: 'auto' }}>
                      {row.adult2_insurance_startDate}
                    </TableCell>
                  </TableRow>
                ))}
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
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} / ${count}`
          }
        />

        {/* 테이블 하단 버튼 그룹 시작 */}
        {buttonGroupBottom && buttonGroupBottom.length > 0 && (
          <div className="table-bottom-control">
            {buttonGroupBottom.map((button, index) => (
              <Button
                key={index}
                variant="contained"
                color={button.color}
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
        {/* 테이블 하단 버튼 그룹 끝 */}
      </Box>
    </ThemeProvider>
  )
}

export default ColspanTableComponent
