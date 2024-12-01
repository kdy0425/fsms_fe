import React, { ReactNode, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
} from '@mui/material'
import { TextField, Select, MenuItem, Checkbox, FormControlLabel,FormControl, InputLabel,RadioGroup } from '@mui/material';
import { CustomFormLabel, CustomSelect, CustomTextField,CustomRadio } from '@/utils/fsms/fsm/mui-imports';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';

// 신규 등록 모달창의 경우 당장에 받아야할 것들이 없음.
interface ModalFormProps {
  buttonLabel: string
  title: string
  size?: DialogProps['maxWidth'] | 'lg'
  reloadFunc: () => void
  // data?: Row;
  // handleOpen?: () => any
  // handleClose?: () => any
}

interface FileWithId {
    id: string;
    file: File;
}

const RegisterModalForm = (props: ModalFormProps) => {
    const { reloadFunc } = props
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const [params, setParams] = useState({
    });
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target
        setParams(prev => ({ ...prev, [name]: value }));
    }

    //첨부파일
    const [files, setFiles] = useState<FileWithId[]>([]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      const selectedFiles = Array.from(event.target.files).map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      event.target.value = "";
    };
  
    const handleFileDelete = (id: string) => {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.buttonLabel}
      </Button>
      <Dialog
        fullWidth={false}
        maxWidth={props.size}
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <Box className="table-bottom-button-group">
            <CustomFormLabel className="modal_title">
                <h2>{props.title}</h2>
            </CustomFormLabel>
                <div className="button-right-align">
                <Button
                    variant="contained"
                    type="submit"
                    form="form-modal"
                    color="primary"
                >
                    수정
                </Button>
                <Button variant="contained" type='button' color="error">삭제</Button>
                <Button onClick={handleClose}>닫기</Button>
                </div>
            </Box>
            <Box
                id="form-modal"
                component="form"
                sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
                width: 'full',
                }}
            > 
                <div className="modal_content">
                    <div className="modal_section">
                        <div className='form_table_type1'>
                            <table>
                                <colgroup>
                                    <col style={{ width: '200px' }} />
                                    <col style={{ width: 'calc(50% - 200px)' }} />
                                    <col style={{ width: '200px' }} />
                                    <col style={{ width: 'calc(50% - 200px)' }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>구분
                                        </th>
                                        <td>
                                            <div className="input_group">
                                                <div className="input">
                                                    <CustomSelect
                                                        id="searchSelect"
                                                        name=""
                                                        defaultValue={"소송"}
                                                        onChange={handleSearchChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        >
                                                        <MenuItem value="소송">소송</MenuItem>
                                                        <MenuItem value="1">1</MenuItem>
                                                        <MenuItem value="2">2</MenuItem>
                                                    </CustomSelect>
                                                </div>
                                            </div>
                                        </td>
                                        <th>
                                            <span className="required">*</span>업무구분
                                        </th>
                                        <td>
                                            <div className="input_group">
                                                <div className="input">
                                                    <CustomSelect
                                                        id="searchSelect"
                                                        name=""
                                                        defaultValue={"화물"}
                                                        onChange={handleSearchChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        >
                                                        <MenuItem value="화물">화물</MenuItem>
                                                        <MenuItem value="1">1</MenuItem>
                                                        <MenuItem value="2">2</MenuItem>
                                                    </CustomSelect>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>제목
                                        </th>
                                        <td colSpan={3}>
                                            <div className="input_group">
                                                <div className="input">
                                                    <TextField
                                                        fullWidth
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>내용
                                        </th>
                                        <td colSpan={3}>
                                            <div className="input_group">
                                                <div className="input">
                                                    <textarea name="" id=""></textarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>첨부파일
                                        </th>
                                        <td colSpan={3}>
                                            <div className="file_upload">
                                                <div className="upload">
                                                    <label htmlFor="file_input" className="btn_tb1">
                                                    파일선택
                                                    <input
                                                        id="file_input"
                                                        type="file"
                                                        multiple
                                                        onChange={handleFileChange}
                                                    />
                                                    </label>
                                                    <span className="file_count">
                                                    {files.length > 0
                                                        ? `선택된 파일 ${files.length}개`
                                                        : "선택된 파일 없음"}
                                                    </span>
                                                </div>
                                                <div className="files">
                                                {files.map(({ id, file }) => (
                                                    <div className="item" key={id}>
                                                        <div className="input_group">
                                                        <div className="input">
                                                            <span className="file_name">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn_tb2"
                                                            onClick={() => handleFileDelete(id)}
                                                        >
                                                            삭제
                                                        </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="modal_section">
                        <div className="arrow_title flex_align_center">
                            <h3>댓글</h3>
                            <div className="r">
                                <div className="list_total"><strong>2</strong>개의 댓글</div>
                            </div>
                        </div>
                        <div className="reply_list">
                            <div className="item">
                                <div className="cnt">
                                    <div className="info">
                                        <span className="name"><strong>관리자</strong></span>
                                        <span className="date">2023-11-27 06:29:08</span>
                                    </div>
                                    <div className="text">
                                        첨부파일에 상세한 내용이 나와있으니 참고 부탁드립니다.
                                    </div>
                                </div>
                                <div className="btns">
                                    <button type='button' className='btn_tb2'>삭제</button>
                                </div>
                            </div>
                            <div className="item">
                                <div className="cnt">
                                    <div className="info">
                                        <span className="name">김유가</span>
                                        <span className="date">2023-11-27 06:29:08</span>
                                    </div>
                                    <div className="text">
                                        첨부파일에 상세한 내용이 나와있으니 참고 부탁드립니다.
                                    </div>
                                </div>
                                <div className="btns">
                                    <button type='button' className='btn_tb2'>삭제</button>
                                </div>
                            </div>
                        </div>
                        <div className="reply_form">
                            <form action="">
                                <div className="top">
                                    <div className="title">댓글내용<span className="required">*</span></div>
                                    <div className="btns">
                                        <button type='button' className='btn_tb1'>등록</button>
                                    </div>
                                </div>
                                <div className="input">
                                    <textarea name="" id=""></textarea>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default RegisterModalForm
