import React, { useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// MUI 그리드 한글화 import
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { HeadCell } from 'table';
import { Row } from '../page';


import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint
} from '@/utils/fsms/common/convert'
import BlankCard from '@/app/components/shared/BlankCard';
type SupportedLocales = keyof typeof locales;

// 페이지 정보
type pageable = {
  pageNumber : number,
  pageSize : number,
  sort : string
}

// 테이블 caption
const tableCaption :string = '전국표준한도관리 목록'




// 검색 결과 건수 툴바
function TableTopToolbar(props:Readonly<{totalRows:number}>) {
  return (
    <div className="data-grid-top-toolbar">
      <div className="data-grid-search-count">
        검색 결과 <span className="search-count">{props.totalRows}</span>건
      </div>
    </div>
  );
}

// TableDataGrid의 props 정의
interface DetailDataGridProps {
  row?: Row; // row 속성을 선택적 속성으로 변경
}

type order = 'asc' | 'desc';

const DetailDataGrid: React.FC<DetailDataGridProps> = ({
  row,
}) => {


  if (!row) return null; // row가 없을 때 null 반환

  const [selectedIndex, setSelectedIndex] = useState<number | null>();




  // MUI 그리드 한글화
  const locale : SupportedLocales ='koKR';
  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );
  
  return (
    <Grid container spacing={2} className="card-container">
    <Grid item xs={12} sm={12} md={12}>
      <BlankCard className="contents-card" title="상세 정보">
        <>
          {/* 테이블영역 시작 */}
          <div className="table-scrollable">
            <table className="table table-bordered">
              <caption>상세 내용 시작</caption>
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th className="td-head" scope="row">
                    차량번호
                  </th>
                  <td>
                    {row?.vhclNo}
                  </td>
                  <th className="td-head" scope="row">
                    소유자명
                  </th>
                  <td>
                    {row?.vonrNm}
                  </td>
                  <th className="td-head" scope="row">
                    사업자등록번호
                  </th>
                  <td>
                    {formBrno(row.vonrBrno)}
                  </td>
                  <th className="td-head" scope="row">
                    주민등록번호
                  </th>
                  <td>
                    {row?.vonrRrno}
                  </td>
                </tr>
                <tr>
                  <th className="td-head" scope="row">
                    지급 정지 시작일
                  </th>
                  <td>
                    {formatDate(row.bgngYmd)}
                  </td>
                  <th className="td-head" scope="row">
                  지급 정지 종료일
                  </th>
                  <td colSpan={5}>
                    {formatDate(row.endYmd)}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row">
                  지급 정지 사유
                  </th>
                  <td colSpan={7}>
                    {row?.chgRsnCn}
                  </td>
                </tr>
                <tr>
                  <th className="td-head" scope="row">
                    등록자아이디
                  </th>
                  <td>
                    {row?.rgtrId}
                  </td>
                  <th className="td-head" scope="row">
                    등록일자
                  </th>
                  <td>
                    {formatDate(row.regDt)}
                  </td>
                  <th className="td-head" scope="row">
                    수정자아이디
                  </th>
                  <td>
                    {row?.mdfrId}
                  </td>
                  <th className="td-head" scope="row">
                    수정일자
                  </th>
                  <td>
                    {formatDate(row.mdfcnDt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 테이블영역 끝 */}
        </>
      </BlankCard>
    </Grid>
  </Grid>
    
  );
};

export default DetailDataGrid;
