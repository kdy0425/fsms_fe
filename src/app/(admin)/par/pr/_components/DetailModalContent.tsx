import { sendHttpRequest } from '@/utils/fsms/common/apiUtils';
import { CustomFormLabel, CustomRadio, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, Button, FormControlLabel, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SelectItem } from 'select';
import { HeadCell } from 'table';
import { Row } from '../page';
import FormModal from './FormModal';
import TableDataGrid from '@/app/components/tables/CommDataGrid';
import { getExcelFile, getToday } from '@/utils/fsms/common/comm';

const rfIdHeadCells: HeadCell[] = [
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
    // format: 'yyyymmdd'
  },
];
const dealConfirmHeadCells: HeadCell[] = [
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

interface ModalContentProps {
  dataSeCd: string
  locgovCd: string
  crno: string
  lbrctYm: string
  vhclNo: string
  vonrBrno: string
  giveCfmtnYn: string
  clclnYm:string
}

const DetailModalContent = (props: ModalContentProps) => {
  const {locgovCd, crno, lbrctYm, vhclNo, vonrBrno, giveCfmtnYn, clclnYm, dataSeCd} = props;
  const [rows , setRows] = useState<Row[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [remoteFlag, setRemoteFlag] = useState<boolean | undefined>(undefined);
  const [params, setParams] = useState({
    locgovCd: locgovCd,
    crno: crno,
    vhclNo: vhclNo,
    lbrctYm: lbrctYm,
    vonrBrno: vonrBrno,
    giveCfmtnYn: '',
    searchType: '',
    clclnYm:clclnYm
  });

  const fetchData = async () => {
    try {
      let endpoint: string =
      dataSeCd == 'RFID' ? `/fsm/par/pr/tr/getAllDelngPapersReqstRfid?&crno=${params.crno ? params.crno : ''}` + // 안들어가면 에러나서 일단 무조건 들어가게 세팅
      `${params.lbrctYm ? '&lbrctYm=' + params.lbrctYm : ''}` +
      // `${params.searchType == 'brno' && params.crno ? params.crno : ''}` +
      `${params.searchType == 'vhclNo' && params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.giveCfmtnYn ? '&giveCfmtnYn=' + params.giveCfmtnYn : ''}` +
      `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`
      :
      `/fsm/par/pr/tr/getAllDelngPapersReqstDealCnfirm?` +
      `${params.searchType == 'brno' && params.vonrBrno ? '&vonrBrno=' + params.vonrBrno : ''}` +
      `${params.searchType == 'vhclNo' && params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.clclnYm ? '&clclnYm=' + params.clclnYm : ''}` +
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

  useEffect(() => {
    fetchData();
  }, [params.searchType, params.giveCfmtnYn])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target

    setParams(prev => ({ ...prev, [name]: value }));
  }

  const excelDownload = async () => {
    let endpoint: string =
    `/fsm/par/pr/tr/getExcelDelngPapersReqstRfid?&crno=${params.crno ? params.crno : ''}` +
      `${params.lbrctYm ? '&lbrctYm=' + params.lbrctYm : ''}` +
      `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
      `${params.giveCfmtnYn ? '&giveCfmtnYn=' + params.giveCfmtnYn : ''}` +
      `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}`

    getExcelFile(endpoint, '' + '자가주유상세내역_'+getToday()+'.xlsx')
  }

  const submitExcel = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    excelDownload()
  } 

  return (
    <Box style={{minWidth: 1200}}>
      <Box component="form" id="detail-modal" onSubmit={submitExcel}>
      <Box className="sch-filter-box" sx={{ mb: 2 }}>
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
        <hr></hr>
        <div className="filter-form">
          <div className="form-group">
            <CustomFormLabel className="input-label-display">
              보조금 지급여부
            </CustomFormLabel>
            <RadioGroup
              row
              id="giveCfmtnYn"
              className="mui-custom-radio-group"
              onChange={handleSearchChange}
              value={params.giveCfmtnYn}
            >
              <FormControlLabel
                control={<CustomRadio id="giveCfmtnYn_01" name="giveCfmtnYn" value="" />}
                label="전체"
              />
              <FormControlLabel
                control={<CustomRadio id="giveCfmtnYn_02" name="giveCfmtnYn" value="N" />}
                label="미지급"
              />
              <FormControlLabel
                control={<CustomRadio id="giveCfmtnYn_02" name="giveCfmtnYn" value="Y" />}
                label="지급확정"
              />
            </RadioGroup>
          </div>
        </div>
      </Box>
      <TableDataGrid 
        headCells={dataSeCd == 'RFID' ? rfIdHeadCells : dealConfirmHeadCells} 
        rows={rows} 
        totalRows={-1} 
        loading={false} 
        onPaginationModelChange={()=>{}} 
        onSortModelChange={()=>{}} 
        onRowClick={()=>{}} 
        paging={false} 
        pageable={{
          pageNumber: 0,
          pageSize: 0,
          sort: ''
        }}
      />
      </Box>
    </Box>
  );
}

export default DetailModalContent;