import React, { useEffect,useState } from 'react';
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
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { HeadCell } from 'table';
import { Row } from '../page';
import {
  getLabelFromCode,
  getNumtoWon,
  formatDate
} from '@/utils/fsms/common/convert'

type SupportedLocales = keyof typeof locales;

// 페이지 정보
type pageable = {
  pageNumber: number,
  pageSize: number,
  sort: string
}

// 테이블 caption
const tableCaption: string = '전국표준한도관리 목록'

// 테이블 th 정의 기능에 사용하는 props 정의
interface EnhancedTableProps {
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void;
  order: order;
  orderBy: string;
}

// 테이블 th 정의 기능
function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
  const { headCells, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof []) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell rowSpan={2}>청구월</TableCell>
        <TableCell rowSpan={2}>카드사</TableCell>
        <TableCell rowSpan={2}>업종구분</TableCell>
        <TableCell rowSpan={2}>유종</TableCell>
        <TableCell rowSpan={2}>지급확정</TableCell>
        <TableCell rowSpan={2}>확정일자</TableCell>
        <TableCell colSpan={8}>확정정보</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>구분</TableCell>
        <TableCell>매출건수</TableCell>
        <TableCell>회원수</TableCell>
        <TableCell>국토부사용량</TableCell>
        <TableCell>단위</TableCell>
        <TableCell>매출금</TableCell>
        <TableCell>개인부담금</TableCell>
        <TableCell>국토부보조금</TableCell>
      </TableRow>
    </TableHead>
  );
}

// 검색 결과 건수 툴바
function TableTopToolbar(props: Readonly<{ totalRows: number }>) {
  return (
    <div className="data-grid-top-toolbar">
      <div className="data-grid-search-count">
        검색 결과 <span className="search-count">{props.totalRows}</span>건
      </div>
    </div>
  );
}

// TableDataGrid의 props 정의
interface ServerPaginationGridProps {
  headCells: HeadCell[]
  rows: Row[] // 목록 데이터
  totalRows: number // 총 검색 결과 수
  loading: boolean // 로딩 여부
  onPaginationModelChange: (page: number, pageSize: number) => void // 페이지 변경 핸들러 추가
  onSortModelChange: (sort: string) => void // 정렬 모델 변경 핸들러 추가
  onRowClick: (postTsid: Row) => void // 행 클릭 핸들러 추가
  pageable: pageable // 페이지 정보
  getLabelFromCity: (value: string) => string,
  getLabelFromLocalGov: (value: string) => string,
  getLabelFromKoi: (value: string) => string,
  getLabelFormCrdCod: (value: string) => string,
  getLabelFromBzmnSe: (value: string) => string,
}

type order = 'asc' | 'desc';

const TableDataGrid: React.FC<ServerPaginationGridProps> = ({
  headCells,
  rows,
  totalRows,
  loading,
  onPaginationModelChange,
  onSortModelChange,
  onRowClick,
  pageable,
  getLabelFromCity,
  getLabelFromLocalGov,
  getLabelFromKoi,
  getLabelFormCrdCod,
  getLabelFromBzmnSe,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>();
  let order: order = 'desc';
  let orderBy: string = '';
  
  if (pageable.sort !== '') {
    let sort = pageable.sort.split(',');
    orderBy = sort[0];
    order = sort[1] === 'desc' ? 'desc' : 'asc';
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof []) => {
    const isAsc = orderBy === property && order === 'asc';
    onSortModelChange(String(property) + ',' + (isAsc ? 'desc' : 'asc'));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationModelChange(newPage, pageable.pageSize);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationModelChange(0, Number(event.target.value));
  };

  const handleRowClick = (index: number, row: Row) => {
    setSelectedIndex(index);
    onRowClick(row);
  };

  const locale: SupportedLocales = 'koKR';
  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const getDdlnYn = (aprvCode :string):string =>{
    let result = aprvCode;

    switch (aprvCode) {
      case 'Y':
          result = '확정';
          break;
      case 'N':
          result = '미확정';
          break;
    }
      

    return result;
  }

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
            <caption>
              {tableCaption}
            </caption>
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {!loading ?
                rows.length > 0 ? rows.map((row: any, index) => {
                  return (
                    <TableRow  key={`tr${index}`} 
                    hover
                    onClick={() => handleRowClick(index, row) } 
                    selected={index == selectedIndex}
                  >
                      <TableCell>{formatDate(row.clclnYm)}</TableCell>
                      <TableCell>{getLabelFormCrdCod(row.crdcoCd)}</TableCell>
                      <TableCell>{getLabelFromBzmnSe(row.bzmnSeCd)}</TableCell>
                      <TableCell>{getLabelFromKoi(row.koiCd)}</TableCell>
                      <TableCell>{getDdlnYn(row.ddlnYn)}</TableCell>
                      <TableCell>{formatDate(row.ddlnYmd)}</TableCell>
                      <TableCell>{row.clmAprvYn}</TableCell>
                      <TableCell>{getNumtoWon(row.dlngNocs)}</TableCell>
                      <TableCell>{row.userCnt}</TableCell>
                      <TableCell>{row.useLiter}</TableCell>
                      <TableCell>{row.usageUnit}</TableCell>
                      <TableCell>{getNumtoWon(row.slsAmt)}</TableCell>
                      <TableCell>{getNumtoWon(row.indvBrdnAmt)}</TableCell>
                      <TableCell>{getNumtoWon(row.moliatAsstAmt)}</TableCell>
                    </TableRow>
                  )
                }) :
                  <TableRow key={'tr0'}>
                    <TableCell colSpan={14} className='td-center'>
                      <p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p>
                    </TableCell>
                  </TableRow>
                :
                <TableRow key={'tr0'}>
                  <TableCell colSpan={14} className='td-center'><p> </p></TableCell>
                </TableRow>
              }
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
    </ThemeProvider>
  );
};

export default TableDataGrid;
