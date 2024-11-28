import {
  Grid,
  Button,
  Select,
  ThemeProvider,
  useTheme,
  createTheme,
  TableContainer,
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import * as locales from '@mui/material/locale'
import { Row } from '../page'
import BlankCard from '@/app/components/shared/BlankCard'
import { HeadCell } from 'table'
import React from 'react'
import { orderBy } from 'lodash'
type SupportedLocales = keyof typeof locales

const headCells: HeadCell[] = [
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'ownerNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'dlngSeCd',
    numeric: false,
    disablePadding: false,
    label: '구분',
  },
  {
    id: 'aprvYmd',
    numeric: false,
    disablePadding: false,
    label: '승인일시',
  },
  {
    id: 'apprvNo',
    numeric: false,
    disablePadding: false,
    label: '승인번호',
  },
  {
    id: 'apprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '사용리터',
  },
  {
    id: 'spareAmt',
    numeric: false,
    disablePadding: false,
    label: '보조금액',
  },
  {
    id: 'spareLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
  },
  {
    id: 'cancelYmdt',
    numeric: false,
    disablePadding: false,
    label: '취소 원거래일시',
  },
  {
    id: 'crdcoCd',
    numeric: false,
    disablePadding: false,
    label: '카드사',
  },
  {
    id: 'cardNo',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'frcsNm',
    numeric: false,
    disablePadding: false,
    label: '가맹점명',
  },
  {
    id: 'rmrkCn',
    numeric: false,
    disablePadding: false,
    label: '비고',
  },
]

// 테이블 th 정의 기능에 사용하는 props 정의
interface EnhancedTableProps {
  headCells: HeadCell[]
}

// 테이블 th 정의 기능
function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
  const { headCells } = props
  return (
    <TableHead className="table-cell-auto">
      <TableRow key={'thRow'}>
        {headCells.map((headCell) => (
          <React.Fragment key={'th' + headCell.id}>
            {headCell.sortAt ? (
              <TableCell
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                // sortDirection={orderBy === headCell.id ? order : false}
              ></TableCell>
            ) : (
              <TableCell
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
              >
                <div className="table-head-text">{headCell.label}</div>
              </TableCell>
            )}
          </React.Fragment>
        ))}
      </TableRow>
    </TableHead>
  )
}

type DetailDataGridProps = {
  rows: Row[]
  loading: boolean
}

const DetailDataGrid = (props: DetailDataGridProps) => {
  const { rows, loading } = props

  // MUI 그리드 한글화
  const locale: SupportedLocales = 'koKR'
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )

  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12}>
        <BlankCard className="contents-card" title="상세내역">
          <>
            {/* 테이블영역 시작 */}
            <ThemeProvider theme={themeWithLocale}>
              <div className="data-grid-wrapper">
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                  >
                    <EnhancedTableHead headCells={headCells} />
                    <TableBody>
                      {!loading ? ( // 로딩에 대한 상태값 세팅 필요
                        rows.length > 0 ? (
                          rows.map((row: any, index) => {
                            return (
                              <TableRow key={'tr' + index}>
                                <TableCell className="table-cell-auto">
                                  {row.vhclNo}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.ownerNm}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.dlngSeCd}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.aprvYmd}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.apprvNo}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.apprvAmt}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.useLiter}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.spareAmt}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.spareLiter}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.cancelYmdt}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.crdcoCd}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.cardNo}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.frcsNm}
                                </TableCell>
                                <TableCell className="table-cell-auto">
                                  {row.rmrkCn}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow key={'tr0'}>
                            <TableCell colSpan={5} className="td-center">
                              <p>
                                자료가 없습니다. 다른 검색조건을 선택해주세요.
                              </p>
                            </TableCell>
                          </TableRow>
                        )
                      ) : (
                        <TableRow key={'tr0'}>
                          <TableCell colSpan={10} className="td-center">
                            <p> </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </ThemeProvider>
          </>
        </BlankCard>
      </Grid>
    </Grid>
  )
}

export default DetailDataGrid
