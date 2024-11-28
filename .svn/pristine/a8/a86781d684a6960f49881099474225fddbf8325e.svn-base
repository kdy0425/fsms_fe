import { sendHttpRequest } from '@/utils/fsms/common/apiUtils';
import { CustomFormLabel, CustomRadio, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, Button, FormControlLabel, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SelectItem } from 'select';
import { HeadCell } from 'table';
import { Row } from '../page';
import FormModal from './FormModal';
import TableDataGrid from './TableDataGrid';

const rfIdHeadCells: HeadCell[] = [
  {
    id: 'checkitem',
    numeric: false,
    disablePadding: false,
    label: '',
    format:'checkbox'
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'crno',
    numeric: false,
    disablePadding: false,
    label: '법인등록번호',
  },
  {
    id: 'lbrctYmdTm',
    numeric: false,
    disablePadding: false,
    label: '주유일시',
    format: 'yyyymmddhh24miss'
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '주유리터',
    format: 'lit',
    align:'td-right'
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
    format: 'lit',
    align:'td-right'
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align:'td-right'
  },
  {
    id: 'giveCfmtnTxt',
    numeric: false,
    disablePadding: false,
    label: '지급여부',
  },
  {
    id: 'giveCfmtnYmdD',
    numeric: false,
    disablePadding: false,
    label: '지급일자',
    format: 'yyyymmdd'
  },
];
const dealConfirmHeadCells: HeadCell[] = [
  {
    id: 'checkitem',
    numeric: false,
    disablePadding: false,
    label: '',
    format:'checkbox'
  },
  {
    id: 'vonrNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'vonrBrno',
    numeric: false,
    disablePadding: false,
    label: '법인등록번호',
  },
  {
    id: 'aprvYmdTm',
    numeric: false,
    disablePadding: false,
    label: '주유일시',
    format: 'yyyymmddhh24miss'
  },
  {
    id: 'totlUseLiter',
    numeric: false,
    disablePadding: false,
    label: '주유리터',
    format: 'lit',
    align:'td-right'
  },
  {
    id: 'totlAsstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
    format: 'lit',
    align:'td-right'
  },
  {
    id: 'totlAsstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align:'td-right'
  },
  {
    id: 'giveCfmtnTxt',
    numeric: false,
    disablePadding: false,
    label: '지급여부',
  },
  {
    id: 'giveCfmtnYmdD',
    numeric: false,
    disablePadding: false,
    label: '지급일자',
    format: 'yyyymmdd'
  },
];

const headCells: HeadCell[] = [
  {
    id: 'checkitem',
    numeric: false,
    disablePadding: false,
    label: '',
    format:'checkbox'
  },
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '소유자명',
  },
  {
    id: 'vhclNo',
    numeric: false,
    disablePadding: false,
    label: '차량번호',
  },
  {
    id: 'crno',
    numeric: false,
    disablePadding: false,
    label: '법인등록번호',
  },
  {
    id: 'lbrctYmdTm',
    numeric: false,
    disablePadding: false,
    label: '주유일시',
    format: 'yyyymmddhh24miss'
  },
  {
    id: 'useLiter',
    numeric: false,
    disablePadding: false,
    label: '주유리터',
    format: 'lit',
    align:'td-right'
  },
  {
    id: 'asstAmtLiter',
    numeric: false,
    disablePadding: false,
    label: '보조리터',
    format: 'lit',
    align:'td-right'
  },
  {
    id: 'asstAmt',
    numeric: false,
    disablePadding: false,
    label: '유가보조금',
    format: 'number',
    align:'td-right'
  },
  {
    id: 'giveCfmtnTxt',
    numeric: false,
    disablePadding: false,
    label: '지급여부',
  },
  {
    id: 'giveCfmtnYmdD',
    numeric: false,
    disablePadding: false,
    label: '지급일자',
    format: 'yyyymmdd'
  },
];

const accHeadCells: HeadCell[] = [
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
  clclnYm: string
  dataSeCd: string
  vonrBrno: string;
  giveCfmtnYn: string;
  bzentyNm:string;
  vonrNm:string;
  bankCdItems: SelectItem[]
}

interface EditContentProps {
  locgovCd: string;
  vhclNo: string;
  crno: string;
  lbrctYm: string;
  clclnYm: string;
  dataSeCd: string;
  vonrBrno: string;
  bankCdItems: SelectItem[]
  remoteClose: () => void;
}

interface RfidConfirmBody {
  bankCd: string;
  actno: string;
  dpstrNm: string;
  crno: string;
  locgovCd: string;
  vhclNo: string;
  lbrctYmd: string;
  lbrctTm: string;
}

interface DealConfirmBody {
  bankCd: string;
  actno: string;
  dpstrNm: string;
  vhclNo: string;
  crno: string;
  crdcoCd: string;
  cardNo: string;
  aprvYmd: string;
  aprvTm: string;
  aprvNo: string;
  clclnSn: string;
}

const EditModalContent = (props: EditContentProps) => {
  const {locgovCd, crno, lbrctYm, vhclNo, bankCdItems, remoteClose, clclnYm, dataSeCd} = props
  const [body, setBody] = useState({
    locgovCd: locgovCd,
    vhclNo: vhclNo,
    dpstrNm: '',
    bankCd: '',
    actno:'',
    crno: crno,
    lbrctYm: lbrctYm,
    clclnYm: clclnYm
  });

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target
    
    setBody(prev => ({ ...prev, [name]: value }));
  }

  const editData = async () => {
    try {
      let endpoint: string = dataSeCd == 'RFID' ? `/fsm/par/pr/tr/updateAcnutPapersReqstRfid` : `/fsm/par/pr/tr/updateAcnutPapersReqstDealCnfirm`
    
      const response = await sendHttpRequest('PUT', endpoint, body, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success') {
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

const ConfirmModalContent = (props: ModalContentProps) => {
  const {locgovCd, crno, lbrctYm, vhclNo, dpstrNm, bankCdItems, clclnYm, vonrBrno, dataSeCd, giveCfmtnYn} = props;
  const [rows , setRows] = useState<Row[]>([]);
  const [accountRows, setAccountRows] = useState<Row[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [remoteFlag, setRemoteFlag] = useState<boolean | undefined>(undefined);
  const [params, setParams] = useState({
    bankCd: '',
    actno: '',
    crno: crno,
    vonrBrno: vonrBrno,
    locgovCd: locgovCd,
    vhclNo: vhclNo,
    dpstrNm: dpstrNm,
    lbrctYm: lbrctYm,
    lbrctTm: '',
    clclnYm: clclnYm,
    giveCfmtnYn: giveCfmtnYn,
    searchType: '',
  });
  const [papersReqstList, setPapersReqstList] = useState<any[]>();

  // 카드거래 상세내역 조회
  const fetchData = async () => {
    try {
      let endpoint: string =
      dataSeCd == 'RFID' ? `/fsm/par/pr/tr/getAllDelngPapersReqstRfid?&crno=${params.crno ? params.crno : ''}` +
      `${params.lbrctYm ? '&lbrctYm=' + params.lbrctYm : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      // `${params.giveCfmtnYn ? '&giveCfmtnYn=' + params.giveCfmtnYn : ''}` +
      `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`
      :
      `/fsm/par/pr/tr/getAllDelngPapersReqstDealCnfirm?&vonrBrno=${params.vonrBrno ? params.vonrBrno : ''}` + // vonrBrno 없으면 에러남, 확인필요
      `${params.clclnYm ? '&clclnYm=' + params.clclnYm : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.giveCfmtnYn ? '&giveCfmtnYn=' + params.giveCfmtnYn : ''}` +
      `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`

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

  // 계좌조회
  const fetchAccountData = async () => {
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
        setAccountRows(response.data)
      } else {
        // 데이터가 없거나 실패
        setAccountRows([])
      }  
    }catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
    setAccountRows([])
    }
  }

  const searchData = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await fetchData();
  }
  const searchAccountData = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await fetchAccountData();
  }

  const confirmGive = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    sendConfirmGive()
  }

  useEffect(() => {
    fetchAccountData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [params.searchType])

  const sendConfirmGive = async () => {
    try {
      let endpoint: string =
      dataSeCd == 'RFID' ? `/fsm/par/pr/tr/decisionPapersReqstRfid` : `/fsm/par/pr/tr/decisionPapersReqstDealCnfirm`

      if(!papersReqstList || papersReqstList.length < 1) {
        return alert('지급확정건을 선택해주세요.')
      }

      if(!accountRows[selectedRow]) {
        return alert('지급계좌를 선택해주세요.')
      }else {
        let body = {
          papersReqstList : papersReqstList
        }
  
        const response = await sendHttpRequest('PUT', endpoint, body, true, {
          cache: 'no-store',
        })
  
        if (response && response.resultType === 'success') {
          alert(response.message)
        } else {
          alert("실패 :: " + response.message);
        }  
      }
    }catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
    }
  }

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

  const handleCheckChange = (rows: Row[]) => {
    let selectList:any[] = [];
    if(rows) {
      dataSeCd == "RFID" ?
        rows.map((row) => {
          let reqData:RfidConfirmBody = {
            "bankCd": accountRows[selectedRow]?.bankCd ? accountRows[selectedRow]?.bankCd : '',
            "actno": accountRows[selectedRow]?.actno ? accountRows[selectedRow]?.actno : '',
            "dpstrNm": accountRows[selectedRow]?.dpstrNm ? accountRows[selectedRow]?.dpstrNm : '',
            "crno": row.crno,
            "locgovCd": row.locgovCd,
            "vhclNo": row.vhclNo,
            "lbrctYmd": row.lbrctYmd,
            "lbrctTm": row.lbrctTm 
          }
          selectList.push(reqData);
        })
      :
        rows.map((row) => {
          let reqData:DealConfirmBody =  {
            "bankCd": accountRows[selectedRow]?.bankCd ? accountRows[selectedRow]?.bankCd : '',
            "actno": accountRows[selectedRow]?.actno ? accountRows[selectedRow]?.actno : '',
            "dpstrNm": accountRows[selectedRow]?.dpstrNm ? accountRows[selectedRow]?.dpstrNm : '',
            "vhclNo": row.vhclNo,
            "crno": row.crno,
            "crdcoCd": row.crdcoCd,
            "cardNo": row.cardNo,
            "aprvYmd": row.aprvYmd,
            "aprvTm": row.aprvTm,
            "aprvNo": row.aprvNo,
            "clclnSn": row.clclnSn
        }

        selectList.push(reqData);
      })
    }
    setPapersReqstList(selectList);
  }

  const accountInfoSelector = () => {
    if(papersReqstList && papersReqstList.length > 0) {
      let copyArr: any[] = [];
      
      papersReqstList?.map((item) => {
        let data = {
          ...item, 
          actno: accountRows[selectedRow].actno,
          bankCd: accountRows[selectedRow].bankCd,
          dpstrNm: accountRows[selectedRow].dpstrNm
        }

        copyArr.push(data);
      })
      setPapersReqstList(copyArr);
    }
  }
  useEffect(() =>{
    console.log(papersReqstList);
  }, [papersReqstList])

  useEffect(() => {
    accountInfoSelector()
  }, [selectedRow])

  return (
    <Box style={{minWidth: 1200}}>
        <Box component="form" id="confirm-modal" onSubmit={confirmGive} sx={{ mb: 2 }}>
          <Box className="sch-filter-box">
            <div className="filter-form">
              <div className="form-group" style={{maxWidth:'30rem'}}>
                <CustomFormLabel className="input-label-display">
                  대상선택
                </CustomFormLabel>
                <RadioGroup
                  row
                  id="chk"
                  className="mui-custom-radio-group"
                  onChange={handleSearchChange}
                  value={params.searchType}
                >
                  <FormControlLabel
                    control={<CustomRadio id="chk_01" name="searchType" value="" />}
                    label="전체"
                  />
                  <FormControlLabel
                    control={<CustomRadio id="chk_02" name="searchType" value="crno" />}
                    label="선택된 사업자"
                  />
                  <FormControlLabel
                    control={<CustomRadio id="chk_02" name="searchType" value="vhclNo" />}
                    label="선택된 차량"
                  />
                </RadioGroup>
              </div>
            </div>
          </Box>
        </Box>
      <Table sx={{mb:2}} style={{border:'1px solid #dadadb', maxWidth:300}}>
        <TableRow>
          <TableHead>
            <TableCell className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>소유자명</TableCell>
          </TableHead>
            <TableCell style={{whiteSpace:'nowrap', width: '100px'}}>{dataSeCd == 'RFID' ? props.bzentyNm : props.vonrNm}</TableCell>
          <TableHead>
            <TableCell className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>법인등록번호</TableCell>
          </TableHead>
            <TableCell style={{whiteSpace:'nowrap', width: '100px'}}>{dataSeCd == 'RFID' ? props.crno : props.vonrBrno}</TableCell>
        </TableRow>
      </Table>
      <Box>
        <TableDataGrid 
          headCells={dataSeCd == 'RFID' ? rfIdHeadCells : dealConfirmHeadCells} 
          rows={rows} 
          totalRows={-1} 
          loading={false} 
          onPaginationModelChange={()=>{}} 
          onSortModelChange={()=>{}} 
          onRowClick={()=>{}} 
          onCheckChange={handleCheckChange}
          paging={false} 
          pageable={{
            pageNumber: 0,
            pageSize: 0,
            sort: ''
          }}
        />
      </Box>

        <Box className='table-bottom-button-group'>
          <CustomFormLabel className="input-label-display">
            <h3>계좌정보</h3>
          </CustomFormLabel>
          <div className=" button-right-align">
            <Button variant="contained" type='submit' form="search-modal" color="primary">조회</Button>
          </div>
        </Box>
      <Box component="form" id="search-modal" onSubmit={searchAccountData} sx={{ mb: 2 }}>
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
              {accHeadCells.map((headCell) => (
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
          {accountRows.map((row: any, index) => {
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
                  clclnYm={clclnYm} 
                  dataSeCd={dataSeCd} 
                  vonrBrno={vonrBrno}              
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
                {accountRows[selectedRow]?.dpstrNm}
              </TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                금융기관
              </div>
              </TableCell>
              <TableCell >
                {accountRows[selectedRow]?.bankNm}
              </TableCell>
              <TableCell className="td-head" scope="row" style={{ width: '100px' }}>
              <div className="table-head-text td-left">
                계좌번호
              </div>
              </TableCell>
              <TableCell >
                {accountRows[selectedRow]?.actno}
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

export default ConfirmModalContent;