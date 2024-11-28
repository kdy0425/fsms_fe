import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React, { useState } from 'react'
import { HeadCell } from 'table'
import { Row } from '../page'

import {
  formatDate
} from '@/utils/fsms/common/convert'
const headCells: HeadCell[] = [
  {
    id: 'index',
    numeric: false,
    disablePadding: false,
    label: 'No',
  },
  {
    id: 'dlngDt',
    numeric: false,
    disablePadding: false,
    label: '거래일시'
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'cnptSeNm',
    numeric: false,
    disablePadding: false,
    label: '거래구분',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'cardNo',
    numeric: false,
    disablePadding: false,
    label: '카드번호',
  },
  {
    id: 'stlmAprvYmd',
    numeric: false,
    disablePadding: false,
    label: '결제일자',
  },
  {
    id: 'aprvAmt',
    numeric: false,
    disablePadding: false,
    label: '승인금액',
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
  },
  {
    id: 'ftxAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유류세연동보조금',
  },
  {
    id: 'opisAmt',
    numeric: false,
    disablePadding: false,
    label: '유가연동보조금',
  },
  {
    id: 'fuelQty',
    numeric: false,
    disablePadding: false,
    label: '연료량',
  },
]

const rows: Row[] = []


interface RegisterModalFormProps {
  rows: Row[] | [];
}

// 
const RegisterModalForm : React.FC<RegisterModalFormProps> =  ({
  rows ,
}) => {
  const [params, setParams] = useState({
    vhclTonCd: '10톤이하', // 톤수
    koiCd: 'LPG', // 유종
    crtrAplcnYmd: '', // 고시기준일
    crtrYear: '', // 기준년도
    avgUseLiter: '', // 월지급기준량
    limUseRt: '', // 한도비율
    crtrLimLiter: '', // 한도리터                // 정렬 기준 추가
  })

  return (
    <Box>
      <TableContainer style={{ margin: '16px 0 4em 0' }}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={'small'}
        >
          <TableHead>
          <TableRow key={'thRow'}>
            {headCells.map((headCell) => (
              <TableCell
                style={{whiteSpace:'nowrap'}}
                key={'th' + headCell.id}
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
              >
                <div className="table-head-text">{headCell.label}</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
          <TableBody>
            {rows.map((row: any, index) => {
              return (
                <TableRow key={'tr' + index}>
                  {/* 만약에 index 안 될 경우 useRef 사용하자 */}
                  <TableCell style={{whiteSpace:'nowrap'}}>{index +1}</TableCell>                
                  <TableCell style={{whiteSpace:'nowrap'}}>{formatDate(row.dlngDt)}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap'}}>{row.bzentyNm}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap'}}>{row.cnptSeNm}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap'}}>{row.vhclNo}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap'}}>{row.cardNo}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap'}}>{formatDate(row.stlmAprvYmd)}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap', textAlign:'right'}}>{row.aprvAmt.toLocaleString('ko-KR')}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap', textAlign:'right'}}>{row.asstAmt.toLocaleString('ko-KR')}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap', textAlign:'right'}}>{row.ftxAsstAmt.toLocaleString('ko-KR')}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap', textAlign:'right'}}>{row.opisAmt.toLocaleString('ko-KR')}</TableCell>
                  <TableCell style={{whiteSpace:'nowrap', textAlign:'right'}}>{row.fuelQty.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>


    </Box>
  )
}

export default RegisterModalForm
