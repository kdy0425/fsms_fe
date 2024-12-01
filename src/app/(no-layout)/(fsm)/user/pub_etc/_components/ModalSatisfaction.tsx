import React, { ReactNode, useContext, useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
} from '@mui/material'
import {
  CustomFormLabel,
} from '@/utils/fsms/fsm/mui-imports'
import { IconX } from '@tabler/icons-react';

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

    const [isChecked, setIsChecked] = useState(false);
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '기타') {
        setIsChecked(true);
    } else {
        setIsChecked(false);
    }
    };
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.buttonLabel}
      </Button>
      <Dialog
        fullWidth={false}
        maxWidth={false}
        sx={{
            "& .MuiDialog-paper": {
                width: "800px",
                maxWidth: "800px",
            },
        }}
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <Box className="table-bottom-button-group">
            <CustomFormLabel className="modal_title">
                <h2>{props.title}</h2>
            </CustomFormLabel>
                <div className="button-right-align">
                <IconButton
                    color="inherit"
                    sx={{
                    color: '#000',
                    padding: 0
                    }}
                    onClick={handleClose}   q
                >
                <IconX size="2rem" />
                </IconButton>
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
                        <div className="arrow_title flex_align_center">
                            <h4>설문조사기간 : 2023-09-01 ~ 2023-09-07</h4>
                        </div>
                        <p className="modal_text">본 설문조사는 유가보조금 관리시스템(FSMS)에 대한 만족 정도를 조사하여 FSMS 운영시 보다 나은 서비스 제공 및 만족도 향상을 위해 최선을 다하고자 함이오니, 많은 참여 부탁드립니다. 아울러 응답하신 내용은 시스템 개선을  위한 참고자료로만 활용되며 다른 목적으로는 사용되지 않습니다. 감사합니다.</p>
                    </div>
                    <div className="modal_section">
                        <div className="survey_form">
                            <div className="survey_item">
                                <div className="q">
                                    <div className="num">1</div>
                                    <div className="subject">업무 처리를 위해 시스템을 어느 정도 활용하고 계십니까?</div>
                                </div>
                                <div className="cnt">
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        100~80%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        80~60%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        60~40%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        40~20%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        20~0%
                                    </label>
                                </div>
                            </div>
                            <div className="survey_item">
                                <div className="q">
                                    <div className="num">2</div>
                                    <div className="subject">유가보조금 업무 처리시 시스템에서 제공되는 정보는 충분하다고 생각하십니까?</div>
                                </div>
                                <div className="cnt">
                                <label className="checkbox inline">
                                    <input
                                        type="radio"
                                        name="radio2"
                                        value="매우 만족"
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ck_icon"></span>
                                    매우 만족
                                </label>
                                <label className="checkbox inline">
                                    <input
                                        type="radio"
                                        name="radio2"
                                        value="만족"
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ck_icon"></span>
                                    만족
                                </label>
                                <label className="checkbox inline">
                                    <input
                                        type="radio"
                                        name="radio2"
                                        value="보통"
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ck_icon"></span>
                                    보통
                                </label>
                                <label className="checkbox inline">
                                    <input
                                        type="radio"
                                        name="radio2"
                                        value="불만족"
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ck_icon"></span>
                                    불만족
                                </label>
                                <label className="checkbox inline">
                                    <input
                                        type="radio"
                                        name="radio2"
                                        value="매우 불만족"
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ck_icon"></span>
                                    매우 불만족
                                </label>
                                <label className="checkbox inline" style={{ marginTop: 12 }}>
                                    <input
                                        type="radio"
                                        name="radio2"
                                        value="기타"
                                        onChange={handleRadioChange}
                                        checked={isChecked}
                                    />
                                    <span className="ck_icon"></span>
                                    기타
                                    <input
                                        type="text"
                                        placeholder="기타 의견을 작성해주세요."
                                        className="input_type1 size_28"
                                        readOnly={!isChecked}
                                    />
                                </label>
                                </div>
                            </div>
                            <div className="survey_item">
                                <div className="q">
                                    <div className="num">3</div>
                                    <div className="subject">유가보조금관리시스템에서 개선이 가장 시급한 기능은 무엇입니까?</div>
                                </div>
                                <div className="cnt">
                                    <div className="input_group">
                                        <div className="input">
                                            <textarea name="" id="" placeholder='자유롭게 작성해주세요.' className='input_type1'></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="survey_item">
                                <div className="q">
                                    <div className="num">4</div>
                                    <div className="subject">업무 처리를 위해 시스템을 어느 정도 활용하고 계십니까?</div>
                                </div>
                                <div className="cnt">
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        100~80%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        80~60%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        60~40%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        40~20%
                                    </label>
                                    <label className='checkbox inline'>
                                        <input type="radio" name="radio1"/>
                                        <span className="ck_icon"></span>
                                        20~0%
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal_btns">
                        <button type="button" className='btn_tb3'>설문응답 완료</button>
                    </div>
                </div>
            </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default RegisterModalForm
