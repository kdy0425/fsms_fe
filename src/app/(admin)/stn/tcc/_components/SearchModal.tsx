import { getCommCd } from '@/utils/fsms/common/comm';
import { CustomFormLabel, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, Button, Dialog, DialogContent, DialogProps, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SelectItem } from 'select';
import { HeadCell } from 'table';


const headCells: HeadCell[] = [
  {
    id: 'mnfctrNm',
    numeric: false,
    disablePadding: false,
    label: '제작사명',
  },
  {
    id: 'vhclNm',
    numeric: false,
    disablePadding: false,
    label: '차명',
  },
  {
    id: 'frmNm',
    numeric: false,
    disablePadding: false,
    label: '형식',
  },
  {
    id: 'yridnw',
    numeric: false,
    disablePadding: false,
    label: '연식',
  },
  {
    id: 'dtaMngNo',
    numeric: false,
    disablePadding: false,
    label: '제원관리번호',
  },
  {
    id: 'tnkCpcty',
    numeric: false,
    disablePadding: false,
    label: '탱크용량',
  },
  {
    id: 'vhclTonNm',
    numeric: false,
    disablePadding: false,
    label: '톤수',
  },
];

export interface SearchRow {
  mnfctrNm: string; // 제작사명
  vhclNm: string; // 차명
  frmNm: string; // 형식
  yridnw: string; // 연식
  dtaMngNo: string; // 제원관리번호
  tnkCpcty: string; // 탱크용량
  vhclTonNm: string; // 톤수
}

const makerData = [
  {
    value: '',
    label: '전체',
  },
  {
    value: 'Volvo',
    label: 'Volvo',
  },
  {
    value: '다임러',
    label: '다임러',
  },
  {
    value: '만트럭버스코리아',
    label: '만트럭버스코리아',
  },
  {
    value: '스카니아',
    label: '스카니아',
  },
  {
    value: '쌍용',
    label: '쌍용',
  },
  {
    value: '이베코',
    label: '이베코',
  },
  {
    value: '타타대우',
    label: '타타대우',
  },
  {
    value: '한국지엠',
    label: '한국지엠',
  },
  {
    value: '현대/기아',
    label: '현대/기아',
  },
]

// 조회하여 가져온 정보를 Table에 넘기는 객체
type Pageable = {
  pageNumber: number
  pageSize: number
  sort: string
}

interface ModalFormProps {
  buttonLabel: string;
  size: DialogProps['maxWidth'] | 'lg';
  title: string;
  fetchData: (params: any) => void;
  excelDownload: (params: any) => void;
  rows: SearchRow[];
  totalRows: number;
  pageable: Pageable
}

const SearchModal = (props: ModalFormProps) => {
  const {fetchData, excelDownload, rows, totalRows, pageable} = props;

  const [params, setParams] = useState({
    page: Number(1), // 페이지 번호는 1부터 시작
    size: Number(10),
    sort: '',
    mnfctrNm: "", // 제작사명
    vhclNm: "", // 차명
    frmNm: "", // 형식
    yridnw: "", // 제원관리번호
    vhclTonNm: "", // 톤수
    // 정렬 기준 추가
  });

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [tons, setTons] = useState<SelectItem[]>([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
  }

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setFlag(!flag)
  }

  // 페이지 변경시 사이즈를 유지하고 페이지 이동
  const handleChangePage = (event: unknown, newPage: number) => {
    handlePaginationModelChange(newPage, pageable.pageSize)
  }

  //페이지 사이즈 변경시 0 페이지로 이동
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handlePaginationModelChange(0, Number(event.target.value))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target

    setParams(prev => ({ ...prev, [name]: value }));
  }
  
  useEffect(() => {
    getCommCd('971', '전체').then((itemArr) => setTons(itemArr)) // 톤수
  }, [])

  useEffect(() => {
    if(params.mnfctrNm && params.mnfctrNm !== '') {
      fetchData(params);
    }
  }, [flag])

  return (
    <>
     <Button variant="outlined" onClick={handleClickOpen}>
        {props.buttonLabel}
      </Button>
      <Dialog
        fullWidth={false}
        maxWidth={props.size}
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
        <Box className='table-bottom-button-group'>
          <CustomFormLabel className="input-label-display">
            <h2>{props.title}</h2>
          </CustomFormLabel>
          <div className=" button-right-align">
            <Button variant="contained" type='submit' form='search-form' color="primary">조회</Button>
            <Button variant="contained" onClick={() => excelDownload(params)} color="primary">전체 엑셀다운로드</Button>
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </Box>
        <TableContainer style={{margin:'16px 0 4em 0'}}>
          <Box component="form" id='search-form' onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
            <Box className="sch-filter-box">
              <div className="filter-form">
                <div className="form-group">
                  <CustomFormLabel
                    className="input-label-display"
                    htmlFor="ft-mnfctrNm"
                  >
                    제작사명
                  </CustomFormLabel>
                  <select
                    id="ft-mnfctrNm-select-02"
                    className="custom-default-select"
                    name="mnfctrNm"
                    value={params.mnfctrNm}
                    onChange={handleSearchChange}
                    style={{ width: '100%' }}
                  >
                    {makerData.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <CustomFormLabel className="input-label-display" htmlFor="ft-car-name">차명</CustomFormLabel>
                  <CustomTextField type="text" value={params.vhclNm} id="ft-car-name" fullWidth />
                </div>
                <div className="form-group">
                  <CustomFormLabel className="input-label-display" htmlFor="ft-car-frmNm">형식</CustomFormLabel>
                  <CustomTextField type="text" value={params.frmNm} id="ft-car-frmNm" fullWidth />
                </div>
              </div><hr></hr>
              <div className="filter-form">
                <div className="form-group">
                  <CustomFormLabel className="input-label-display" htmlFor="ft-car-name">제원관리번호</CustomFormLabel>
                  <CustomTextField type="text" value={params.yridnw} id="ft-car-name" fullWidth />
                </div>
                <div className="form-group">
                  <CustomFormLabel
                    className="input-label-display"
                    htmlFor="ft-tons"
                  >
                    톤수
                  </CustomFormLabel>
                  <select
                    id="ft-tons-select-02"
                    className="custom-default-select"
                    name="vhclTonNm"
                    value={params.vhclTonNm}
                    onChange={handleSearchChange}
                    // style={{ width: '100%' }}
                  >
                    {tons.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Box>
          </Box>

          <Table
            sx={{ minWidth: 1000 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <TableHead>
              <TableRow key={'thRow'}>
                {headCells.map((headCell) => (
                  <React.Fragment key={'th'+headCell.id+'_modal'}>

                  <TableCell
                    align={'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                  >
                  <div className="table-head-text">
                        {headCell.label}
                  </div>
                  </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row: any, index) => {
              return (
                <TableRow key={'tr'+index}>
                  <TableCell>
                    {row.mnfctrNm}
                  </TableCell>
                  <TableCell>
                    {row.vhclNm}
                  </TableCell>
                  <TableCell>
                    {row.frmNm}
                  </TableCell>
                  <TableCell>
                    {row.yridnw}
                  </TableCell>
                  <TableCell>
                    {row.dtaMngNo}
                  </TableCell>
                  <TableCell>
                    {Number(row.tnkCpcty).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {row.vhclTonNm}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={pageable.pageSize}
            page={pageable.pageNumber}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchModal;