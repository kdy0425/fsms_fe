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
                    <div className="calendar_wrap">
                        <div className="calendar_date">
                            <button type="button" className='calendar_date_btn prev'>이전 달</button>
                            <div className="date">2024년 11월</div>
                            <button type="button" className='calendar_date_btn next'>다음 달</button>

                            <button className="btn_tb3" id="calendar_excel_btn" type="button">
                                <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.63 14h8.727M7.994 10.727 4.176 7.454M7.994 10.727l3.819-3.273M7.993 10.727V2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>
                                엑셀다운로드
                            </button>
                        </div>
                        <div className="calendar_dates">
                            <table>
                                <thead>
                                    <tr>
                                        <th>일</th>
                                        <th>월</th>
                                        <th>화</th>
                                        <th>수</th>
                                        <th>목</th>
                                        <th>금</th>
                                        <th>토</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <span className="day">1</span>
                                            <div className="cnt">가</div>
                                        </td>
                                        <td>
                                            <span className="day">2</span>
                                            <div className="cnt">나</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="day">3</span>
                                            <div className="cnt">5, 4</div>
                                        </td>
                                        <td>
                                            <span className="day">4</span>
                                            <div className="cnt">1, 2</div>
                                        </td>
                                        <td>
                                            <span className="day">5</span>
                                            <div className="cnt">나</div>
                                        </td>
                                        <td>
                                            <span className="day">6</span>
                                            <div className="cnt">다, 라(월), 수, 라(목), 수</div>
                                        </td>
                                        <td>
                                            <span className="day">7</span>
                                            <div className="cnt">라, 라(월), 목</div>
                                        </td>
                                        <td>
                                            <span className="day">8</span>
                                            <div className="cnt">나</div>
                                        </td>
                                        <td>
                                            <span className="day">9</span>
                                            <div className="cnt">다</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="day">10</span>
                                            <div className="cnt">다, 라(월), 일, 라(목), 일 </div>
                                        </td>
                                        <td>
                                            <span className="day">11</span>
                                            <div className="cnt">나, 라(월), 월</div>
                                        </td>
                                        <td>
                                            <span className="day">12</span>
                                            <div className="cnt">다</div>
                                        </td>
                                        <td className='today'>
                                            <span className="day">13</span>
                                            <div className="cnt">다, 라(월), 수, 라(목), 수</div>
                                        </td>
                                        <td>
                                            <span className="day">14</span>
                                            <div className="cnt">라, 라(월), 목</div>
                                        </td>
                                        <td>
                                            <span className="day">15</span>
                                            <div className="cnt">다</div>
                                        </td>
                                        <td>
                                            <span className="day">16</span>
                                            <div className="cnt">다</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="day">17</span>
                                            <div className="cnt">다, 라(월), 일, 라(목), 일 </div>
                                        </td>
                                        <td>
                                            <span className="day">18</span>
                                            <div className="cnt">다, 라(월), 월</div>
                                        </td>
                                        <td>
                                            <span className="day">19</span>
                                            <div className="cnt">가</div>
                                        </td>
                                        <td>
                                            <span className="day">20</span>
                                            <div className="cnt">다, 라(월), 수, 라(목), 수</div>
                                        </td>
                                        <td>
                                            <span className="day">21</span>
                                            <div className="cnt">라, 라(월), 목</div>
                                        </td>
                                        <td>
                                            <span className="day">22</span>
                                            <div className="cnt">가</div>
                                        </td>
                                        <td>
                                            <span className="day">23</span>
                                            <div className="cnt">다</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="day">24</span>
                                            <div className="cnt">다, 라(월), 일, 라(목), 일 </div>
                                        </td>
                                        <td>
                                            <span className="day">25</span>
                                            <div className="cnt">다, 라(월), 월</div>
                                        </td>
                                        <td>
                                            <span className="day">26</span>
                                            <div className="cnt">나</div>
                                        </td>
                                        <td>
                                            <span className="day">27</span>
                                            <div className="cnt">다, 라(월), 수, 라(목), 수</div>
                                        </td>
                                        <td>
                                            <span className="day">28</span>
                                            <div className="cnt">라, 라(월), 목</div>
                                        </td>
                                        <td>
                                            <span className="day">29</span>
                                            <div className="cnt">나</div>
                                        </td>
                                        <td>
                                            <span className="day">30</span>
                                            <div className="cnt">다</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
