import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react';
import { HeadCell } from 'table';
import { Row } from '../page';

const headCells: HeadCell[] = [
  {
    id: 'hstrySn',
    numeric: true,
    disablePadding: false,
    label: '순번',
  },
  {
    id: 'mdfcnDt',
    numeric: false,
    disablePadding: false,
    label: '변경일자',
    align: 'td-left',
  },
  {
    id: 'locgovNm',
    numeric: false,
    disablePadding: false,
    label: '관할관청',
  },
  {
    id: 'vhclSttsNm',
    numeric: false,
    disablePadding: false,
    label: '차량상태',
  },
  {
    id: 'koiNm',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'vhclSeNm',
    numeric: false,
    disablePadding: false,
    label: '면허업종',
  },
  {
    id: 'dscntYnNm',
    numeric: false,
    disablePadding: false,
    label: '할인여부',
  },
  {
    id: 'rfidNm',
    numeric: false,
    disablePadding: false,
    label: 'RFID차량여부',
  },
];

const rows: Row[] = []

interface RegisterModalFormProps {
  rows: Row[] | [];
}

const RegisterModalForm : React.FC<RegisterModalFormProps> = ({
  rows,
}) => {
  const [params, setParams] = useState({
      vhclTonCd: "10톤이하", // 톤수
      koiCd: "LPG", // 유종
      crtrAplcnYmd: "", // 고시기준일
      crtrYear: "", // 기준년도
      avgUseLiter: "", // 월지급기준량
      limUseRt: "", // 한도비율
      crtrLimLiter: "" // 한도리터                // 정렬 기준 추가
  });

  return (
  <Box>
      <TableContainer style={{margin:'16px 0 4em 0'}}>
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
              {rows.map((row: any, index) => {
                return (
                  <TableRow key={'tr' + index}>
                    {/* 만약에 index 안 될 경우 useRef 사용하자 */}
                    <TableCell style={{whiteSpace:'nowrap'}}>{Number(row.hstrySn).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.mdfcnDt}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.locgovNm}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.vhclSttsNm}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.koiNm}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.vhclSeNm}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.dscntYnNm}</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>{row.rfidNm}</TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
      </Table>
      </TableContainer>
  </Box>
  );
}

export default RegisterModalForm;