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

import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint
} from '@/utils/fsms/common/convert'
interface DetailDataGridProps {
  rows?: Row[]
  excelHisDownload: () => void //  행 클릭 핸들러 추가
  loading?: boolean;
}

const DetailDataGrid: React.FC<DetailDataGridProps> = ({ 
  rows,
  excelHisDownload,
  loading }) => {

    if(rows === undefined){
      rows = [];
    }
  return (
    <>
    {/* 엑셀 버튼을 우측으로 정렬 */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={() => excelHisDownload()} variant="contained" color="primary">
          엑셀
        </Button>
      </Box>
    <BlankCard title="운전면허정보 이력">
    <div className="data-grid-wrapper">
        <div className="table-scrollable">
          <table className="table table-bordered">
          <TableHead>
              <TableRow>
                <TableCell colSpan={8}>운전면허정보 이력</TableCell>{/* 합계 헤더 */}
              </TableRow>
              <TableRow>
                <TableCell>순번</TableCell>
                <TableCell>주민등록번호</TableCell>
                <TableCell>면허보유여부</TableCell>
                <TableCell>정지시작일자</TableCell>
                <TableCell>정지종료일자</TableCell>
                <TableCell>취소일자</TableCell>
                <TableCell>등록일자</TableCell>
                <TableCell>수정일자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="td-center">
                    <p>로딩 중입니다...</p>
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow
                    hover
                    key={`tr${index}`}
                  >
                    <TableCell className='td-center'>{row.hstrySn ?? ''}</TableCell>
                    <TableCell className='td-center'>{row.vonrRrnoS ?? ''}</TableCell>
                    <TableCell className='td-center'>{row.psnSeCdNm ?? ''}</TableCell>
                    <TableCell className='td-center'>{formatDate(row.stopBgngYmd ?? '')}</TableCell>
                    <TableCell className='td-center'>{formatDate(row.stopEndYmd ?? '')}</TableCell>
                    <TableCell className='td-center'>{formatDate(row.rtrcnYmd ?? '')}</TableCell>
                    <TableCell className='td-center'>{formatDate(row.knpaRegDt ?? '')}</TableCell>
                    <TableCell className='td-center'>{formatDate(row.knpaMdfcnDt ?? '')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="td-center">
                    <p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
      </div>
      </BlankCard>
    </>

  )
}

export default DetailDataGrid
