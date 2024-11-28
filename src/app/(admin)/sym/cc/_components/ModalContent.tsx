import { CustomRadio, CustomSelect, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, FormControlLabel, MenuItem, RadioGroup, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Row } from '../page';

interface ModalFormProps {
  data?: Row;
  dataType: 'group' | 'code'
  formType: 'create' | 'update'
  groupNm?: string
  title?: string
  handleOpen?: () => any
  handleClose?: () => any
}

const RegisterModalForm = (props: ModalFormProps) => {
  const {data, dataType, formType, groupNm, title, handleOpen, handleClose} = props;

  const [open, setOpen] = useState(false);

  const [params, setParams] = useState<Row>({
    cdGroupNm: "", // 코드그룹명
    cdNm: "", // 코드명
    cdKornNm: "", // 코드그룹한글명
    cdExpln: "", // 코드설명
    cdSeq: "", // 코드 순서
    useYn: "", // 사용여부
    cdSeNm: "", // 코드구분명?
    comCdYn: "", // 공통코드여부
  });

  // 수정 팝업일때 해당 row 내 데이터를 params에 바인딩
  useEffect(() => {
    if(formType == 'update' && data) {
      setParams(data);
    }
  },[])

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  
  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
  }

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = event.target

    setParams(prev => ({ ...prev, [name]: value }));
  }

  return (
      <Box>
      <TableContainer style={{margin:'16px 0 4em 0'}}>
        {/* <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}> */}
          <Table aria-labelledby="tableTitle">
            {dataType == 'group' ? 
              <TableBody>
                <TableRow>
                  <TableCell style={{width:'150px'}} align={'left'}>
                    코드그룹명
                  </TableCell>
                  <TableCell  style={{width:'500px',textAlign:'left'}}>
                    {formType == 'update' ? params.cdGroupNm :
                    <CustomTextField type="text" id="modal-cdGroupNm" name="cdGroupNm" onChange={handleParamChange} value={params.cdGroupNm} fullWidth />
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드그룹한글명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdKornNm" name="cdKornNm" onChange={handleParamChange} value={params.cdKornNm} fullWidth />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드구분명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdSeNm" name="cdSeNm" onChange={handleParamChange} value={params.cdSeNm} fullWidth  />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드설명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdExpln" name="cdExpln" onChange={handleParamChange} value={params.cdExpln} fullWidth multiline rows={5}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    사용여부
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
                  <TableCell className="td-head">
                    공통코드여부
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
                  <TableCell style={{width:'150px'}} align={'left'}>
                    코드그룹명
                  </TableCell>
                  <TableCell  style={{width:'500px',textAlign:'left'}}>
                    {params.cdGroupNm ? params.cdGroupNm : groupNm}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdNm" name="cdNm" onChange={handleParamChange} value={params.cdNm} fullWidth />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드한글명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdKornNm" name="cdKornNm" onChange={handleParamChange} value={params.cdKornNm} fullWidth  />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드설명
                  </TableCell>
                  <TableCell>
                    <CustomTextField type="text" id="modal-cdExpln" name="cdExpln" onChange={handleParamChange} value={params.cdExpln} fullWidth multiline rows={5}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    코드순서
                  </TableCell>
                  <TableCell style={{textAlign: 'left'}}>
                    <CustomTextField type="text" id="modal-cdSeq" name="cdSeq" onChange={handleParamChange} value={params.cdSeq}  />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="td-head">
                    사용여부
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
        {/* </Box> */}
      </TableContainer>
    </Box>
  );
}

export default RegisterModalForm;