import { sendHttpRequest } from '@/utils/fsms/common/apiUtils';
import { CustomFormLabel, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SelectItem } from 'select';
import { HeadCell } from 'table';
import { Row } from '../page';
import FormModal from './FormModal';



const headCells: HeadCell[] = [
  {
    id: 'vhclTonCd',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '금융기관',
  },
  {
    id: 'crtrAplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '예금주명',
  },
  {
    id: 'crtrYear',
    numeric: false,
    disablePadding: false,
    label: '계좌번호',
  },
];

interface ModalContentProps {
  locgovCd: string
  crno: string
  lbrctYm: string
  vhclNo: string
  dpstrNm: string
  bankCdItems: SelectItem[]
}

interface EditContentProps {
  locgovCd: string;
  vhclNo: string;
  crno: string;
  lbrctYm: string;
  bankCdItems: SelectItem[]
  remoteClose: () => void;
}

const EditModalContent = (props: EditContentProps) => {
  const {locgovCd, crno, lbrctYm, vhclNo, bankCdItems, remoteClose} = props
  const [body, setBody] = useState({
    locgovCd: locgovCd,
    vhclNo: vhclNo,
    dpstrNm: '',
    bankCd: '',
    actno:'',
    crno: crno,
    lbrctYm: lbrctYm,
  });

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target
    
    setBody(prev => ({ ...prev, [name]: value }));
  }

  const editData = async () => {
    try {
      let endpoint: string = `/fsm/par/pr/tr/updateAcnutPapersReqstRfid`
    
      const response = await sendHttpRequest('PUT', endpoint, body, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        alert(response.message)
      } else {
        // 데이터가 없거나 실패
        alert("실패 :: " + response.message);
      }  
    }catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
    }
  }
  
  const updateData = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await editData();
    remoteClose()
  }
  return (
    <Box component="form" id="edit-modal" onSubmit={updateData} sx={{mb:2}}>
      <TableContainer>
        <Table className="table table-bordered">
          <TableBody>
            <TableRow>
              <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                예금주명
              </div>
              </TableCell>
              <TableCell colSpan={4}>
                <CustomTextField name="dpstrNm" value={body.dpstrNm} onChange={handleBodyChange}/>
              </TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                금융기관
              </div>
              </TableCell>
              <TableCell >
                <select
                id="ft-select-02"
                className="custom-default-select"
                name="bankCd"
                value={body.bankCd}
                onChange={handleBodyChange}
                style={{ width: '100%' }}
              >
              {bankCdItems.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
              </TableCell>
              <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                계좌번호
              </div>
              </TableCell>
              <TableCell >
                <CustomTextField name="actno" value={body.actno} onChange={handleBodyChange}/>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const ModalContent = (props: ModalContentProps) => {
  const {locgovCd, crno, lbrctYm, vhclNo, dpstrNm, bankCdItems} = props;
  const [rows , setRows] = useState<Row[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [remoteFlag, setRemoteFlag] = useState<boolean | undefined>(undefined);
  const [params, setParams] = useState({
    vhclNo: vhclNo,
    dpstrNm: dpstrNm,
  });

  const fetchData = async () => {
    try {
      let endpoint: string =
      `/fsm/par/pr/tr/getAllAcnutPapersReqst?dataSeCd=RFID` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.dpstrNm ? '&dpstrNm=' + params.dpstrNm : ''}`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRows(response.data)
      } else {
        // 데이터가 없거나 실패
        setRows([])
      }  
    }catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
    setRows([])
    }
  }

  const searchData = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await fetchData();
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target

    setParams(prev => ({ ...prev, [name]: value }));
  }

  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  }

  const remoteClose = () => {
    setRemoteFlag(false);
  }

  return (
    <Box>
      <Box component="form" id="search-modal" onSubmit={searchData} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="filter-form">
            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                차량번호
              </CustomFormLabel>
              <CustomTextField name="vhclNo" value={params.vhclNo} onChange={handleSearchChange} fullWidth />
            </div>

            <div className="form-group">
              <CustomFormLabel className="input-label-display">
                예금주명
              </CustomFormLabel>
              <CustomTextField name="dpstrNm" value={params.dpstrNm} onChange={handleSearchChange} fullWidth />
            </div>
          </div>
        </Box>
      </Box>
      <TableContainer style={{margin:'16px 0 4em 0', maxHeight: 300}}>
        <Table
          sx={{ minWidth: 500 }}
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
              <TableRow key={'tr'+index} selected={index === selectedRow}  onClick={() => handleRowClick(index)}>
                <TableCell>
                  {row.vhclNo}
                </TableCell>
                <TableCell>
                  {row.bankNm}
                </TableCell>
                <TableCell>
                  {row.dpstrNm}
                </TableCell>
                <TableCell>
                  {row.actno}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        </Table>
      </TableContainer>

    {selectedRow > -1 ? 
      <TableContainer>
        <Box className="table-bottom-button-group" sx={{mb:2}}>
          <div className="button-right-align">
            <FormModal 
              buttonLabel={'신규등록'} 
              title={'계좌신규등록'} 
              formId='edit-modal'
              formLabel='저장'
              remoteFlag={remoteFlag}
              children={
                <EditModalContent
                  locgovCd={locgovCd} 
                  vhclNo={vhclNo} 
                  crno={crno} 
                  lbrctYm={lbrctYm} 
                  bankCdItems={bankCdItems}
                  remoteClose={remoteClose}             
              />}            
            />
            <Button>계좌정보 삭제</Button>
          </div>
        </Box>
        <Table className="table table-bordered">
          <TableBody>
            <TableRow>
              <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                예금주명
              </div>
              </TableCell>
              <TableCell colSpan={4}>
                {rows[selectedRow]?.dpstrNm}
              </TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                금융기관
              </div>
              </TableCell>
              <TableCell >
                {rows[selectedRow]?.bankNm}
              </TableCell>
              <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                계좌번호
              </div>
              </TableCell>
              <TableCell >
                {rows[selectedRow]?.actno}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      :
      ''
    }
    </Box>
  );
}

export default ModalContent;