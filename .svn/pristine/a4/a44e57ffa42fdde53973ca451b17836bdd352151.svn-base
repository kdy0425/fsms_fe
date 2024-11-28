'use client'

import { CustomFormLabel, CustomRadio, CustomSelect, CustomTextField } from "@/utils/fsms/fsm/mui-imports";
import { Button, Dialog, DialogContent, Box, TableContainer, FormControlLabel, MenuItem, RadioGroup, Table, TableBody, TableCell, TableRow, DialogProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SelectItem } from "select";
import { Row } from "../page";
import { sendHttpRequest } from "@/utils/fsms/common/apiUtils";

interface FormModalProps {
  buttonLabel?: string;
  title: string;
  isOpen: boolean
  setOpen: (isOpen: boolean) => void;
  cardCode: SelectItem[];
  bankCode: SelectItem[];
  dataSeCode: SelectItem[];
  locgovCode: SelectItem[];
  data?: Row;
  size?: DialogProps['maxWidth'] | 'lg';
}

export default function FormModal(props : FormModalProps) {
  const { buttonLabel, title, cardCode, bankCode, dataSeCode, data, size, isOpen, setOpen, locgovCode} = props;
  const [params, setParams] = useState<Row>(
    {
      dataSeCd: "",
      locgovCd: "", 
      crdcoCd: "",
      actno: "",
      bankCd: "",
      delYn: "",
      ctpvNm: "",
      locgovNm: "",
      bankNm: "",
      dataSeNm: "",
      crdcoNm: ""
    }
  );
  
  const handleClickOpen = () => {
    setParams({
      dataSeCd: data?.dataSeCd ?? "",
      dataSeNm: data?.dataSeNm ?? "",
      ctpvCd: data?.ctpvCd ?? "",
      ctpvNm: data?.ctpvNm ?? "",
      locgovCd: data?.locgovCd ?? "", 
      locgovNm: data?.locgovNm ?? "",
      crdcoCd: "",
      actno: "",
      bankCd: "",
      delYn: "",
      bankNm: "",
      crdcoNm: ""
    })
    setOpen(true);
  };

  const handleClose = () => {
    setParams({
      dataSeCd: "",
      dataSeNm: "",
      ctpvCd: "",
      ctpvNm: "",
      locgovCd: "", 
      locgovNm: "",
      crdcoCd: "",
      actno: "",
      bankCd: "",
      delYn: "",
      bankNm: "",
      crdcoNm: ""
    })
    setOpen(false);
  };

  useEffect(() => {
    console.log("DATA ::: " , data);
    if(data) {
      setParams(data);
    }
  }, [data])

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setParams((prev) => ({ ...prev, [name]: value }));
  }

  const createSbsidyRcpmnyAcnut = async () => {
    try {
      let endpoint: string =  `/fsm/sym/sra/cm/createSbsidyRcpmnyAcnut`;

      let body = {
        locgovCd: params.locgovCd,
        dataSeCd: params.dataSeCd,
        crdcoCd: params.crdcoCd,
        bankCd: params.bankCd,
        actno: params.actno
      }

      if(!params.dataSeCd) {
        alert('업종구분을 선택해야 합니다.');
      }
      
      const userConfirm: boolean = confirm("보조금계좌정보를 신규로 등록하시겠습니까?");

      if(userConfirm) {
        const response = await sendHttpRequest('POST', endpoint, body, true, {
          cache: 'no-store'
        })
  
        if (response && response.resultType === 'success' && response.data) {
          setOpen(false);
          alert("보조금계좌정보가 등록되었습니다.");
        }
      } else {
        return ;
      }
    } catch(error) {
      console.error("Error Post Data : ", error);
    }
  }

  return (
    <React.Fragment>
      { buttonLabel ?  
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonLabel}
      </Button> : ''
      }
      <Dialog
        fullWidth={false}
        maxWidth={size}
        open={isOpen}
        onClose={handleClose}
      >
        <DialogContent>
        <Box className='table-bottom-button-group'>
          <CustomFormLabel className="input-label-display">
            <h2>{title}</h2>
          </CustomFormLabel>
          <div className=" button-right-align">
            <Button variant="contained" type='submit' form='form-modal' color="primary">저장</Button>
            <Button variant="contained" type='button' color="error">삭제</Button>
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </Box>
          <Box
            id='form-modal'
            onSubmit={createSbsidyRcpmnyAcnut}
            component='form'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'full',
            }}
          >
          <TableContainer style={{margin:'16px 0 2em 0'}}>
            <Table
              sx={{ minWidth: 600 }}
              aria-labelledby="tableTitle"
              size={'small'}
            >
              <TableBody>
                <TableRow>
                  <TableCell className='table-title-column' style={{width:'150px'}} align={'left'}>
                    <span className="required-text">*</span>업종구분
                  </TableCell>
                  <TableCell  style={{width:'300px',textAlign:'left'}}>
                    {params.dataSeCd?
                      params.dataSeNm
                    :
                    <select
                        id="search-select-dataSeCd"
                        className="custom-default-select"
                        name="dataSeCd"
                        value={params.dataSeCd}
                        onChange={handleParamChange}
                        style={{ width: '100%' }}
                      >
                        {dataSeCode.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                    }
                  </TableCell>

                  <TableCell className='table-title-column' style={{width:'150px'}} align={'left'}>
                    <span className="required-text">*</span>관할관청
                  </TableCell>
                  <TableCell style={{width:'300px',textAlign:'left'}}>
                    {params.locgovCd ? 
                      (params.ctpvNm+" "+params.locgovNm) 
                      :
                      <select
                        id="search-select-locgovCd"
                        className="custom-default-select"
                        name="locgovCd"
                        value={params.locgovCd}
                        onChange={handleParamChange}
                        style={{ width: '100%' }}
                      >
                        {locgovCode.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    }
                  </TableCell>
                </TableRow>
                <TableRow> 
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>카드사구분
                  </TableCell>
                  <TableCell  style={{width:'300px',textAlign:'left'}}>
                    <select
                      id="ft-select-crdcoCd"
                      name="crdcoCd"
                      className="custom-default-select"
                      value={params.crdcoCd}
                      onChange={handleParamChange}
                      required
                      style={{ width: '100%' }}
                    >
                      {cardCode.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>거래은행
                  </TableCell>
                  <TableCell style={{width:'300px',textAlign:'left'}}>
                    <select
                      id="ft-select-bankCd"
                      name="bankCd"
                      className="custom-default-select"
                      value={params.bankCd}
                      onChange={handleParamChange}
                      required
                      style={{ width: '100%' }}
                    >
                      {bankCode.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>계좌번호
                  </TableCell>
                  <TableCell colSpan={3}>
                    <CustomTextField name="actno" value={params.actno} onChange={handleParamChange} fullWidth />
                  </TableCell>
                </TableRow>
            </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}