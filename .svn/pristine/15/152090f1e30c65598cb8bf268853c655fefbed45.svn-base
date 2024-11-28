import React from 'react';

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
// MUI 그리드 한글화 import
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { HeadCell } from 'table';
import { dateTimeFormatter, getDateTimeString, brNoFormatter, getCommaNumber } from '@/utils/fsms/common/util'
type SupportedLocales = keyof typeof locales;

const remark = [
  {
    name: '일반거래',
    color: '#000000',
  },
  {
    name: '취소거래',
    color: '#FF0000',
  },
  {
    name: '취소된원거래',
    color: '#0000FF',
  },
  {
    name: '대체카드거래',
    color: '#00B050',
  },
  {
    name: '보조금지급정지/휴지',
    color: '#7030A0',
  },
  {
    name: '유종없음',
    color: '#FF3399',
  },
  {
    name: '유종불일치',
    color: '#00CC99',
  },
  {
    name: '1시간이내재주유',
    color: '#0099FF',
  },
  {
    name: '1일4회이상주유',
    color: '#663300',
  },
  {
    name: '사용리터없음',
    color: '#92D050',
  },
]

// 페이지 정보
type pageable = {
  pageNumber : number,
  pageSize : number,
  sort : string
}

// 테이블 th 정의 기능에 사용하는 props 정의
interface EnhancedTableProps {
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void;
  order: order;
  orderBy: string;
}

// TableDataGrid의 props 정의
interface ServerPaginationGridProps {
  headCells: HeadCell[]
  rows: any[] // 목록 데이터
  totalRows: number // 총 검색 결과 수
  loading: boolean // 로딩 여부
  selectedRowIndex?: number
  onPaginationModelChange: (page: number, pageSize: number) => void // 페이지 변경 핸들러 추가
  onSortModelChange: (sort: string) => void // 정렬 모델 변경 핸들러 추가
  onRowClick: (row: any) => void // 행 클릭 핸들러 추가
  pageable: pageable  // 페이지 정보
  paging: boolean // 페이징여부
}

type order = 'asc' | 'desc';

const TableDataGrid: React.FC<ServerPaginationGridProps> = ({
    headCells,
    rows,
    totalRows,
    loading,
    selectedRowIndex,
    onPaginationModelChange,
    onSortModelChange,
    onRowClick,
    pageable,
    paging,
}) => {

  // 쿼리스트링의 sort 값이 컬럼명,정렬 구조로 되어있어 분해하여 테이블에 적용
  let order : order = 'desc'; 
  let orderBy : string = '';
  if (pageable.sort !== ''){
    let sort = pageable.sort.split(','); 
    orderBy = sort[0];
    order = sort[1] == 'desc'? 'desc' : 'asc';
  }

  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleSelected = (id:string) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    setSelected(newSelected);
  }

  // 테이블 th 정의 기능
  function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
    const { headCells, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof []) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow key={'thRow'}>
          {headCells.map((headCell) => (
            <React.Fragment key={'th'+headCell.id}>
              { headCell.sortAt ?
                <TableCell
                  align={'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{whiteSpace:'nowrap'}}
                >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                <div className="table-head-text">{headCell.label}</div>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' 
                      ? 'sorted descending' 
                      : 'sorted ascending'}
                  </Box>
                  ) : null}
                </TableSortLabel>
                </TableCell>
                :
                <TableCell
                  align={'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  style={{whiteSpace:'nowrap'}}
                >
                  <div className="table-head-text">{headCell.label}</div>
                </TableCell>
              }
            </React.Fragment>
            ))}
        </TableRow>
      </TableHead>
    );
  }

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
  // sort 정렬 변경시 정렬 기준으로 데이터 다시 로드
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof []) => {
    const isAsc = orderBy === property && order === 'asc';
    onSortModelChange(String(property)+','+ (isAsc ? 'desc' : 'asc'))
  };

  // 페이지 변경시 사이즈를 유지하고 페이지 이동
  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationModelChange(newPage,pageable.pageSize)
  };

  //페이지 사이즈 변경시 0 페이지로 이동
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationModelChange(0,Number(event.target.value))
  };

  // MUI 그리드 한글화
  const locale : SupportedLocales ='koKR';
  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  function getFontColor(row: any, remarks: any) {
    let color = 'black';
    const remark = row.remark;
    for (let i = 0; i < remarks.length; i++) {
      if (remark === remarks[i].name) color = remarks[i].color;
    }
    return color;
  }

  function getCellValue(row: any, headCell: any) {
    try{
      if(headCell.format === 'brno'){
        return brNoFormatter(row[headCell.id])
      }else if(headCell.format === 'lit'){
        return Number(row[headCell.id]).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          })
      }else if(headCell.format === 'number'){
        return getCommaNumber(row[headCell.id])
      }else if(headCell.format === 'yyyymm'){
        return getDateTimeString(row[headCell.id], 'mon')?.dateString  
      }else if(headCell.format === 'yyyymmdd'){
        return getDateTimeString(row[headCell.id], 'date')?.dateString
      }else if(headCell.format === 'yyyymmddhh24miss'){
        return dateTimeFormatter(row[headCell.id])
      }else{
        return row[headCell.id]
      }
    }catch(error) {
      console.error('Error get City Code data:', error);
    }
    return '';
  }
  
  return (
    // MUI 한글화 "ThemeProvider"
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
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {!loading ? 
                rows.length > 0 ? rows.map((row: any, index) => {
                  return (
                    <TableRow 
                      key={'tr'+index}
                      hover
                      selected={selectedRowIndex == index}
                      onClick={() => onRowClick(row)}
                    >
                      {headCells.map((headCell, i) => (
                        <React.Fragment key={'tr' + index + headCell.id}>
                          {
                            <TableCell
                              className={headCell.align}
                              style={{color: getFontColor(row, remark), whiteSpace: 'nowrap'}}
                            >
                              {getCellValue(row, headCell)}
                            </TableCell>
                          }
                        </React.Fragment>
                      ))}
                    </TableRow>
                  )
                }) : 
                <TableRow key={'tr0'}>
                  <TableCell colSpan={headCells.length} className='td-center'><p>자료가 없습니다. 다른 검색조건을 선택해주세요.</p></TableCell>
                </TableRow>
              : 
              <TableRow key={'tr0'}>
                <TableCell colSpan={headCells.length} className='td-center'><p> </p></TableCell>
              </TableRow>
            }
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* <CustomFormLabel className="input-label-none" htmlFor="tablePagination" >페이지</CustomFormLabel> */}
        {!loading && paging?
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={pageable.pageSize}
            page={pageable.pageNumber}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        : ''}
      </div>
    </ThemeProvider>
  );
};

export default TableDataGrid;
