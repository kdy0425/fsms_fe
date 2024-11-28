'use client'

import { CustomFormLabel, CustomRadio, CustomSelect, CustomTextField } from "@/utils/fsms/fsm/mui-imports";
import { Button, Dialog, DialogContent, Box, TableContainer, FormControlLabel, MenuItem, RadioGroup, Table, TableBody, TableCell, TableRow, DialogProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SelectItem } from "select";
import { Row } from "../page";
import SearchModal from "./SearchModal";
import { sendHttpRequest } from "@/utils/fsms/common/apiUtils";

interface FormModalProps {
  buttonLabel: string;
  title: string;
  cityCode: SelectItem[];
  rows?: Row[];
  size?: DialogProps['maxWidth'] | 'lg';
}

export default function FormModal(props : FormModalProps) {
  const { buttonLabel, title, cityCode, rows, size} = props;
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
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setParams(
      {
        locgovCd: "",
        locgovNm: "",
        ctpvCd: "",
        locgovSeCd: "01",
        clclnLocgovCd: "",
        clclnLocgovNm: ""
      }
    )
  }, [open])

  const handleRowClick = (rowData: Row) => {
    setParams(
      (prev) => ({ ...prev, clclnLocgovCd:rowData['locgovCd'], clclnLocgovNm:rowData['locgovNm'] })
    )
  }

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setParams((prev) => ({ ...prev, [name]: value }));
  }

  const createLocgovCd = async () => {
    try {
      let endpoint: string =  `/fsm/sym/lc/cm/createLocgovCd`;

      let body = {
        locgovCd: params.locgovCd,
        locgovNm: params.locgovNm,
        ctpvCd: params.ctpvCd,
        clclnLocgovCd: params.clclnLocgovCd ? params.clclnLocgovCd : params.locgovCd
      }

      const regex = /^\d{5}$/;

      if(!regex.test(params.locgovCd)) {
        alert("지자체코드는 숫자 5자리로 입력해야 합니다.");
        return;
      }
      
      const userConfirm: boolean = confirm("지자체코드를 등록하시겠습니까?");

      if(userConfirm) {
        const response = await sendHttpRequest('POST', endpoint, body, true, {
          cache: 'no-store'
        })
  
        if (response && response.resultType === 'success' && response.data) {
          setOpen(false);
          alert("지자체코드가 등록되었습니다.");
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
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonLabel}
      </Button>
      <Dialog
        fullWidth={false}
        maxWidth={size}
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
        <Box className='table-bottom-button-group'>
          <CustomFormLabel className="input-label-display">
            <h2>{title}</h2>
          </CustomFormLabel>
          <div className=" button-right-align">
            <Button variant="contained" type='submit' form='form-modal' color="primary">저장</Button>
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </Box>
          <Box
            id='form-modal'
            onSubmit={createLocgovCd}
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
                    <TableCell className='table-title-column' style={{width:'150px', backgroundColor:'#f8f8f9'}} align={'left'}>
                      <span className="required-text">*</span>시도명
                    </TableCell>
                  <TableCell  style={{width:'450px',textAlign:'left'}} colSpan={3}>
                    <CustomSelect
                      id="ft-select-01"
                      name="ctpvCd"
                      className="custom-default-select"
                      value={params.ctpvCd}
                      onChange={handleParamChange}
                      required
                      fullWidth
                    >
                      {cityCode.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className='table-title-column' >
                      <span className="required-text">*</span>지자체구분
                    </TableCell>
                  <TableCell colSpan={3}>
                    <RadioGroup
                      row
                      id="modal-radio-useYn"
                      name="locgovSeCd"
                      value={params.locgovSeCd}
                      onChange={handleParamChange}
                      className="mui-custom-radio-group"
                    >
                      {/* <FormControlLabel
                        control={<CustomRadio id="locgovSeCd_1" name="locgovSeCd" value="1" />}
                        label="시도"
                      /> */}
                      <FormControlLabel
                        control={<CustomRadio id="locgovSeCd_0" name="locgovSeCd" value="01" />}
                        label="관할관청"
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>지자체코드
                  </TableCell>
                  <TableCell colSpan={3}>
                    <CustomTextField required type="text" id="modal-locgovCd" name="locgovCd" value={params.locgovCd} onChange={handleParamChange} fullWidth />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>지자체명
                  </TableCell>
                  <TableCell colSpan={3}>
                    <CustomTextField required type="text" id="modal-locgovNm" name="locgovNm" value={params.locgovNm} onChange={handleParamChange} fullWidth/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    정산지자체
                  </TableCell>
                  <TableCell style={{padding:"6px 0px 6px 16px", width:'20%'}}>
                    <CustomTextField type="text" id="modal-clclnLocgovCd" name="clclnLocgovCd" value={params.clclnLocgovCd} onChange={handleParamChange}/>
                  </TableCell>
                  <TableCell style={{padding:"6px 0"}}>
                    <SearchModal 
                      selectedCtpvCd={params.ctpvCd}
                      handleRowClick={handleRowClick}
                    />
                  </TableCell>
                  <TableCell style={{padding:"6px 16px 6px 0", width:'auto'}}>
                    <CustomTextField type="text" id="modal-clclnLocgovNm" name="clclnLocgovNm" value={params.clclnLocgovNm} onChange={handleParamChange} inputProps={{readOnly: true, placeholder:"등록지자체가 자동으로 매핑됩니다." }} fullWidth />
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