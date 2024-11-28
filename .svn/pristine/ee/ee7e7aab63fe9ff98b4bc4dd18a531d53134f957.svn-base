import { CustomSelect, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { HeadCell } from 'table';
import { Row } from '../page';


const headCells: HeadCell[] = [
  {
    id: 'procNm',
    numeric: false,
    disablePadding: false,
    label: '프로세스명',
  },
  {
    id: 'procKornNm',
    numeric: false,
    disablePadding: false,
    label: '전문내용',
  },
  {
    id: 'dlngNm',
    numeric: false,
    disablePadding: false,
    label: '송수신여부',
  },
  {
    id: 'excnBgngYmd',
    numeric: false,
    disablePadding: false,
    label: '실행시작일자',
  },
  {
    id: 'schdulExcnTm',
    numeric: false,
    disablePadding: false,
    label: '실행시작시간',
  },
  {
    id: 'excnEndYmd',
    numeric: false,
    disablePadding: false,
    label: '실행종료일자',
  },
  {
    id: 'excnEndTm',
    numeric: false,
    disablePadding: false,
    label: '실행종료시간',
  },
  {
    id: 'schdulPrgrsSttsNm',
    numeric: false,
    disablePadding: false,
    label: '오류내용',
  },
  {
    id: 'prcsNocs',
    numeric: false,
    disablePadding: false,
    label: '처리건수',
  },
  {
    id: 'errorNocs',
    numeric: false,
    disablePadding: false,
    label: '오류건수',
  },
];

interface ModalContentProps {
  rows: Row[];
}

const ModalContent = (props : ModalContentProps) => {
  const { rows } = props;
  return (
    <Box>
      <TableContainer style={{margin:'16px 0 2em 0'}}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={'small'}
        >
          <TableHead>
            <TableRow key={'thRow'}>
              {headCells.map((headCell) => (
                <React.Fragment key={'th'+headCell.id}>

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
          {rows && rows.length > 0 ? rows.map((row: any, index) => {
            return (
              <TableRow hover key={'tr'+index}>
                <TableCell>
                  {row.procNm}
                </TableCell>
                <TableCell>
                  {row.procKornNm}
                </TableCell>
                <TableCell>
                  {row.dlngNm}
                </TableCell>
                <TableCell>
                  {row.excnBgngYmd}
                </TableCell>
                <TableCell>
                  {row.schdulExcnTm}
                </TableCell>
                <TableCell>
                  {row.excnEndYmd}
                </TableCell>
                <TableCell>
                  {row.excnEndTm}
                </TableCell>
                <TableCell>
                  {row.schdulPrgrsSttsNm}
                </TableCell>
                <TableCell>
                  {row.prcsNocs}
                </TableCell>
                <TableCell>
                  {row.errorNocs}
                </TableCell>
              </TableRow>
            )
          })
          : 
          <TableRow key={'tr0'}>
            <TableCell colSpan={headCells.length} className='td-center'><p>이력 정보가 없습니다.</p></TableCell>
          </TableRow>
        }
        </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ModalContent;