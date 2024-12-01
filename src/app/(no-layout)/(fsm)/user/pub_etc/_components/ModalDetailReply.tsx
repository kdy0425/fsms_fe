import React, { ReactNode, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
} from '@mui/material'
import {
  CustomFormLabel,
} from '@/utils/fsms/fsm/mui-imports'

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

const RegisterModalForm = (props: ModalFormProps) => {
  const { reloadFunc } = props
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
                    저장
                </Button>
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
                                            소송
                                        </td>
                                        <th>
                                            <span className="required">*</span>업무구분
                                        </th>
                                        <td>
                                            화물
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>제목
                                        </th>
                                        <td colSpan={3}>
                                            면허취소자에 대한 유가보조금 환수 및 지급정지
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>내용
                                        </th>
                                        <td colSpan={3}>
                                        면허취소자에 대한 유가보조금 환수 및 지급정지에 대한 재결서 입니다.<br/>
                                        첨부파일 참조하시길 바랍니다.
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="required">*</span>첨부파일
                                        </th>
                                        <td colSpan={3}>
                                            <div className="download_list">
                                                <div className="item">
                                                    <a href="#" download>
                                                        첨부파일.jpg
                                                    </a>
                                                </div>
                                                <div className="item">
                                                    <a href="#" download>
                                                        첨부파일_첨부파일.hwp
                                                    </a>
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
