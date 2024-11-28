'use client'

import { sendHttpRequest } from "@/utils/fsms/common/apiUtils";
import { CustomFormLabel, CustomTextField } from "@/utils/fsms/fsm/mui-imports";
import { Box, Button, Dialog, DialogContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import { HeadCell } from "table";
import { Row } from "../page";

const headCells: HeadCell[] = [
  {
    id: 'ctpvCd',
    numeric: false,
    disablePadding: false,
    label: '시도코드',
  },
  {
    id: 'ctpvNm',
    numeric: false,
    disablePadding: false,
    label: '시도명',
  },
  {
    id: 'sggCd',
    numeric: false,
    disablePadding: false,
    label: '기관코드',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '기관명',
  },
]

interface SearchModalProps {
  selectedCtpvCd?: string;
  handleRowClick: (row: Row) => void;
}

export default function SearchModal(props: SearchModalProps) {
  const { selectedCtpvCd, handleRowClick } = props;
  const [params, setParams] = useState(
    {
      locgovCd: "",
      locgovNm: "",
      ctpvCd: "",
      locgovSeCd: "01",
      clclnLocgovCd: "",
      clclnLocgovNm: ""
    }
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    // searchLocgov();
  };

  const handleClose = () => {
    setOpen(false);
    setRows([]);
  };

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setParams((prev) => ({ ...prev, [name]: value }));
  }

  const searchLocgov = async () => {
    try {
      let endpoint: string =  `/fsm/sym/lc/cm/getAllLocgovCd?&locgovSeCd=1&locgovNm=${params.locgovNm}`  
      // + `${selectedCtpvCd ? '&ctpvCd=' + selectedCtpvCd : ''}`;

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      });

      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRows(response.data.content)
      }

    }catch(error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <React.Fragment>
    <IconButton onClick={handleClickOpen} ><IconSearch /></IconButton>

    <Dialog
        fullWidth={false}
        maxWidth={'md'}
        open={open}
        onClose={handleClose}
    >
        <DialogContent>
          <Box className='table-bottom-button-group'>
            <CustomFormLabel className="input-label-display">
              <h2>지자체조회</h2>
            </CustomFormLabel>
            <div className=" button-right-align">
              <Button variant="contained" onClick={searchLocgov} color="primary">
                  조회
             </Button>
             <Button variant="contained" color="inherit" onClick={handleClose}>닫기</Button>
            </div>
          </Box>
          
          <Box> 
            <Box className="sch-filter-box">
                <div className="filter-form">
                  <div className="form-group">
                    <CustomFormLabel className="input-label-display" htmlFor="search-locgovNm-01">
                      지자체명
                    </CustomFormLabel>
                    <CustomTextField type="text" id="search-locgovNm-01" name="locgovNm" value={params.locgovNm || ''} onChange={handleParamChange} fullWidth />
                  </div>
                </div>
            </Box>
          </Box>
          
          <TableContainer style={{margin:'16px 0 2em 0', minHeight:500}}>
            <Table
              sx={{ minWidth: 600 }}
              aria-labelledby="tableTitle"
              size={'small'}
            >
              <TableHead>
                <TableRow>
                { headCells.map((headCell) => (
                  <TableCell
                  key={headCell.id}
                  align={'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  >
                    <div className="table-head-text">
                          {headCell.label}
                    </div>
                  </TableCell>
                ))}
                </TableRow>
              </TableHead>
              <TableBody>
              { rows ? rows.map((row: any, index) => (
                <TableRow hover key={'tr'+index} onClick={() => {handleRowClick(row);setOpen(false)}}>
                  <TableCell>
                    {row.ctpvCd}
                  </TableCell>
                  <TableCell>
                    {row.ctpvNm}
                  </TableCell>
                  <TableCell>
                    {row.sggCd}
                  </TableCell>
                  <TableCell>
                    {row.locgovNm}
                  </TableCell>
                </TableRow>
              )) : 
                <TableRow key={'tr0'}>
                  <TableCell colSpan={headCells.length} className='td-center'><p></p></TableCell>
                </TableRow>
              }
              </TableBody>
            </Table>
          </TableContainer>
      </DialogContent>
    </Dialog>
    </React.Fragment>
  );
}