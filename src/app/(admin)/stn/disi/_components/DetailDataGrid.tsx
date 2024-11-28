import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'
import { Row } from '../page'
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
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import * as locales from '@mui/material/locale'

import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint
} from '@/utils/fsms/common/convert'
import { Pageable } from 'table'
import { CustomFormLabel } from '@/utils/fsms/fsm/mui-imports'

type SupportedLocales = keyof typeof locales


interface DetailDataGridProps {
  rows?: Row[]
  excelHisDownload: () => void //  행 클릭 핸들러 추가
  totalRows: number;
  paging: boolean;
  onPaginationModelChange : (page: number, pageSize: number) => void // 페이지 변경 핸들러 추가
  pageable: Pageable // 페이지 정보
  loading: boolean // 로딩 여부

}

const DetailDataGrid: React.FC<DetailDataGridProps> = ({ 
  rows,
  excelHisDownload,
  loading,
  totalRows,
  paging,
  pageable,
  onPaginationModelChange,
}) => {



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

    if(rows === undefined){
      rows = [];
    }

      // MUI 그리드 한글화
  const locale: SupportedLocales = 'koKR'
  const theme = useTheme()
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  )



  return (
    <>
    {/* 엑셀 버튼을 우측으로 정렬 */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={() => excelHisDownload()} variant="contained" color="primary">
          엑셀
        </Button>
      </Box>
    <ThemeProvider theme={themeWithLocale}>

    <BlankCard title="의무보험 가입정보 이력">
    <div className="data-grid-wrapper">
        <div className="table-scrollable">
          <table className="table table-bordered">
          <TableHead>
              <TableRow>
                <TableCell colSpan={17}>의무보험 가입정보 이력</TableCell>{/* 합계 헤더 */}
              </TableRow>
              <TableRow>
                <TableCell>순번</TableCell>
                <TableCell style={{whiteSpace:'nowrap'}}>차량번호</TableCell>
                <TableCell>{'당일수신\n상태'}</TableCell>

                <TableCell>{'대인1보험\n상태'}</TableCell>
                <TableCell>{'대인1보험\n시기일자'}</TableCell>
                <TableCell>{'대인1보험\n종기일자'}</TableCell>
                <TableCell>{'대인2보험\n상태'}</TableCell>
                <TableCell>{'대인2보험\n시기일자'}</TableCell>
                <TableCell>{'대인2보험\n종기일자'}</TableCell>

                <TableCell>{'대물보험\n상태'}</TableCell>
                <TableCell>{'대물보험\n시기일자'}</TableCell>
                <TableCell>{'대물보험\n종기일자'}</TableCell>
                <TableCell style={{whiteSpace:'nowrap'}}>보험사</TableCell>
                <TableCell style={{whiteSpace:'nowrap'}}>보험종목</TableCell>
                <TableCell style={{whiteSpace:'nowrap'}}>계약번호</TableCell>
                <TableCell style={{whiteSpace:'nowrap'}}>등록일자</TableCell>
                <TableCell style={{whiteSpace:'nowrap'}}>수정일자</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={17} className="td-center">
                    <p>로딩 중입니다...</p>
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow
                    hover
                    key={`tr${index}`}
                  >
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.sn ?? ''}</TableCell> {/* 역순 번호 */}                    
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.vonrRrno ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.insrncSttsCd ?? ''}</TableCell>

                    <TableCell className='td-center'>{row.twdpsn1SeCdNm ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.twdpsn1EraYmd ?? '')}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.twdpsn1EotYmd ?? '')}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.twdpsn2SeCdNm ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.twdpsn2EraYmd ?? '')}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.twdpsn2EotYmd ?? '')}</TableCell>

                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.sbsttCdNm ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.sbsttEraYmd ?? '')}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.sbsttEotYmd ?? '')}</TableCell>

                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.insrncCoCdNm ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.insrncClsSetuCdNm ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{row.insrncCtrtNo ?? ''}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.regDt ?? '')}</TableCell>
                    <TableCell className='td-center' style={{whiteSpace:'nowrap'}}>{formatDate(row.mdfcnDt ?? '')}</TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={17} className="td-center">
                    <p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
              
          {!loading && paging? 
            <>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRows}
              rowsPerPage={pageable.pageSize}
              page={pageable.pageNumber}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </>
            : ''}
        </div>
      
      </div>
      </BlankCard>

      </ThemeProvider>

    </>

  )
}

export default DetailDataGrid
