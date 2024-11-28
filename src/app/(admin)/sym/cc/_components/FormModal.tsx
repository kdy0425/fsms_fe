import { CustomFormLabel, CustomRadio, CustomSelect, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, Button, Dialog, DialogContent, FormControlLabel, MenuItem, RadioGroup, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Row } from '../page';
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils';

interface ModalFormProps {
  data?: Row;
  buttonLabel: string;
  dataType: 'group' | 'code'
  formType: 'create' | 'update'
  groupNm?: string
  title?: string
  reloadFunc?: () => void;
}

const RegisterModalForm = (props: ModalFormProps) => {
  const {data, buttonLabel, dataType, formType, groupNm, title, reloadFunc} = props;

  const [open, setOpen] = useState(false);

  const [params, setParams] = useState<Row>({
    cdGroupNm: "", // 코드그룹명
    cdNm: "", // 코드명
    cdKornNm: "", // 코드그룹한글명
    cdExpln: "", // 코드설명
    cdSeNm: "", // 코드구분명?
    cdSeq: "", // 코드 순서
    useYn: "Y", // 사용여부
    comCdYn: "Y", // 공통코드여부
  });

  // 수정 팝업일때 해당 row 내 데이터를 params에 바인딩
  useEffect(() => {
    if(formType == 'update' && data) {
      setParams(data);
    }

    if(dataType == 'code' && groupNm) {
      setParams(prev => ({ ...prev, cdGroupNm: groupNm }));
    }
  },[open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target

    setParams(prev => ({ ...prev, [name]: value }));
  }

  const createCode = async (type : "group" | "code") => {

    let endpoint: string = type == 'group' ? `/fsm/sym/cc/cm/createCmmnCdGroup` : `/fsm/sym/cc/cm/createCmmnCd`;

    const userConfirm = confirm(type == 'group' ? "코드그룹정보를 등록하시겠습니까?" : "공통코드를 등록하시겠습니까?");

    if(userConfirm) {
      const response = await sendHttpRequest('POST', endpoint, params, true, {
        cache: 'no-store',
      })
      
      if (response && response.resultType === 'success') {
        alert(response.message);
        reloadFunc?.();
        setOpen(false);
      }else {
        alert(response.message);
      }
    }else {
      return;
    }
  }
  const updateCode = async (type : "group" | "code") => {

    let endpoint: string = type == 'group' ? `/fsm/sym/cc/cm/updateCmmnCdGroup` : `/fsm/sym/cc/cm/updateCmmnCd`;

    const userConfirm = confirm(type == 'group' ? "코드그룹정보를 저장하시겠습니까?" : "공통코드를 저장하시겠습니까?");

    if(userConfirm) {
      const response = await sendHttpRequest('PUT', endpoint, params, true, {
        cache: 'no-store',
      })
      
      if (response && response.resultType === 'success') {
        alert(response.message);
        reloadFunc?.();
        setOpen(false);
      }else {
        alert(response.message);
      }
    }else {
      return;
    }
  }
  const deleteCode = async (type : "group" | "code") => {

    let endpoint: string = type == 'group' ? `/fsm/sym/cc/cm/deleteCmmnCdGroup` : `/fsm/sym/cc/cm/deleteCmmnCd`;

    const userConfirm = confirm(type == 'group' ? "코드그룹정보를 삭제하시겠습니까?" : "공통코드를 삭제하시겠습니까?");

    if(userConfirm) {
      const response = await sendHttpRequest('DELETE', endpoint, params, true, {
        cache: 'no-store',
      })
      
      if (response && response.resultType === 'success') {
        alert(response.message);
        reloadFunc?.();
        setOpen(false);
      }else {
        alert(response.message);
      }
    }else {
      return;
    }
  }

  return (
      <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonLabel}
      </Button>
      <Dialog
        fullWidth={false}
        maxWidth={'lg'}
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <Box className='table-bottom-button-group'>
            <CustomFormLabel className="input-label-display">
              <h2>{title}</h2>
            </CustomFormLabel>
            <div className=" button-right-align">
                <Button variant="contained" color="primary" onClick={formType == 'create' ? () => createCode(dataType) : () => updateCode(dataType)}>저장</Button>
                {formType == 'update' ? <Button variant="contained" color="error" onClick={() => deleteCode(dataType)}>삭제</Button> : ''}
                <Button variant="contained" color="inherit" onClick={(handleClose)}>닫기</Button>
            </div>
          </Box>
          <TableContainer style={{margin:'16px 0 4em 0'}}>
          <Table aria-labelledby="tableTitle">
            {dataType == 'group' ? 
              <TableBody>
                <TableRow>
                  <TableCell className='table-title-column' style={{width:'150px'}} align={'left'}>
                    <span className="required-text">*</span>코드그룹명
                  </TableCell>
                  <TableCell  style={{width:'500px',textAlign:'left'}}>
                    {formType == 'update' ? params.cdGroupNm :
                    <CustomTextField type="text" id="modal-cdGroupNm" name="cdGroupNm" onChange={handleParamChange} value={params.cdGroupNm} fullWidth />
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>코드그룹한글명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdKornNm" name="cdKornNm" onChange={handleParamChange} value={params.cdKornNm} fullWidth />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    코드구분명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdSeNm" name="cdSeNm" onChange={handleParamChange} value={params.cdSeNm} fullWidth  />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    코드설명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdExpln" name="cdExpln" onChange={handleParamChange} value={params.cdExpln} fullWidth multiline rows={5}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>사용여부
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      id="modal-radio-useYn"
                      name="useYn"
                      value={params.useYn}
                      onChange={handleParamChange}
                      className="mui-custom-radio-group"
                    >
                      <FormControlLabel
                        control={<CustomRadio id="chk_Y" name="useYn" value="Y" />}
                        label="사용"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_N" name="useYn" value="N" />}
                        label="미사용"
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>공통코드여부
                  </TableCell>
                  <TableCell style={{textAlign:'left'}}>
                    <CustomSelect
                      id="modal-select-comCdYn"
                      name="comCdYn"
                      value={params.comCdYn}
                      onChange={handleParamChange}
                      variant="outlined"
                      style={{width:'150px'}}
                    >
                      <MenuItem key={'N'} value={'N'}>
                        N
                      </MenuItem>
                      <MenuItem key={'Y'} value={'Y'}>
                        Y
                      </MenuItem>
                    </CustomSelect>
                  </TableCell>
                </TableRow>
            </TableBody>
            :
            <TableBody>
                <TableRow>
                  <TableCell className='table-title-column' style={{width:'150px'}} align={'left'}>
                    <span className="required-text">*</span>코드그룹명
                  </TableCell>
                  <TableCell  style={{width:'500px',textAlign:'left'}}>
                    {params.cdGroupNm ? params.cdGroupNm : groupNm}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>코드명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdNm" name="cdNm" onChange={handleParamChange} value={params.cdNm} fullWidth />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>코드한글명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdKornNm" name="cdKornNm" onChange={handleParamChange} value={params.cdKornNm} fullWidth  />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>코드설명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdExpln" name="cdExpln" onChange={handleParamChange} value={params.cdExpln} fullWidth multiline rows={5}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    코드순서
                  </TableCell>
                  <TableCell style={{textAlign: 'left'}}>
                    <CustomTextField type="text" id="modal-cdSeq" name="cdSeq" onChange={handleParamChange} value={params.cdSeq}  />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='table-title-column'>
                    <span className="required-text">*</span>사용여부
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      id="modal-radio-useYn"
                      name="useYn"
                      value={params.useYn}
                      onChange={handleParamChange}
                      className="mui-custom-radio-group"
                    >
                      <FormControlLabel
                        control={<CustomRadio id="chk_Y" name="useYn" value="Y" />}
                        label="사용"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_N" name="useYn" value="N" />}
                        label="미사용"
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
            </TableBody>
          }
          </Table>
      </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default RegisterModalForm;