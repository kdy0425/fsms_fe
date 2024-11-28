import { Box, Table, ThemeProvider, createTheme, useTheme } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import * as locales from '@mui/material/locale'
import { Row } from '../../acsim/page'
import { HeadCell } from 'table'
import React from 'react'
import TableDataGrid, { ServerPaginationGridProps } from './TableDataGrid'
import BlankCard from '@/app/components/shared/BlankCard'
type SupportedLocales = keyof typeof locales

interface TopDataTableProps {
  isLoading: boolean
  brno: string // 사업자등록번호
  bzentyNm: string // 업체명
  listTableProps: ServerPaginationGridProps // 월별 데이터 list의 props
}

const TopDataTable: React.FC<TopDataTableProps> = ({
  isLoading,
  brno,
  bzentyNm,
  listTableProps,
}) => {
  // MUI 그리드 한글화
  const locale: SupportedLocales = 'koKR'
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )

  return (
    <ThemeProvider theme={themeWithLocale}>
      <Box>
        <div className="table-scrollable">
          <table className="table table-bordered">
            <caption>가이드 타이틀 테이블 요약</caption>
            <colgroup>
              <col style={{ width: '20%' }}></col>
              <col style={{ width: 'auto' }}></col>
              <col style={{ width: '20%' }}></col>
              <col style={{ width: 'auto' }}></col>
            </colgroup>
            <tbody>
              <tr>
                <th className="td-head" scope="row">
                  사업자등록번호
                </th>
                <td>{brno}</td>
                <th className="td-head" scope="row">
                  업체명
                </th>
                <td>{bzentyNm}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Box>
      <Box sx={{ padding: '32px 0' }}>
        <TableDataGrid
          headCells={listTableProps.headCells} // 테이블 헤더 값
          rows={listTableProps.rows} // 목록 데이터
          totalRows={listTableProps.totalRows} // 총 로우 수
          loading={listTableProps.loading} // 로딩여부
          onRowClick={listTableProps.onRowClick} // 행 클릭 핸들러 추가
          onPaginationModelChange={listTableProps.onPaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={listTableProps.onSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={listTableProps.pageable} // 현재 페이지 / 사이즈 정보
        />
      </Box>
    </ThemeProvider>
  )
}

export default TopDataTable
