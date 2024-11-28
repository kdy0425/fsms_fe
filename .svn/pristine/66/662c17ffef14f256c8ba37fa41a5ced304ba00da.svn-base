'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { ReactNode, useState } from 'react';
import { CustomFormLabel, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Row } from '../page';
import { formatDate } from '@/utils/fsms/common/convert'
interface FormDialogProps {
    buttonLabel: string;
    title: string;
    children: React.ReactNode;
    type: string;
    excelDownloadDetail?: (selectedRow:Row)=>void;
    seletedRow: Row;
    size?: DialogProps['maxWidth'];
    onOpen?: () => void; // onOpen 프롭 추가
}


const FormDialog: React.FC<FormDialogProps> = ({ buttonLabel, title, children, excelDownloadDetail, seletedRow, size, onOpen, type }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        if (onOpen) onOpen(); // 열기 전에 onOpen 호출
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getDlngYmd = (dlngYmdtm: string) => {
        let date = formatDate(dlngYmdtm);

        return date.substring(0, 10);
    }

    const getDlngTm = (dlngYmdtm: string) => {
        let date = formatDate(dlngYmdtm);

        return date.substring(12);
    }

return (
<>
    <Button variant="outlined" onClick={handleClickOpen}>
        {buttonLabel}
    </Button>
    <Dialog fullWidth={false} maxWidth={size} open={open} onClose={handleClose}>
        <DialogContent>
            <Box className="table-bottom-button-group">
                <h2>{title}</h2>
                {type === "BusSetleTrau" ? 
                    <div className="button-right-align">
                        <Button onClick={() => excelDownloadDetail?.(seletedRow)} variant="contained" type="submit" form="form-modal" color="primary">
                        액셀
                        </Button>
                        <Button onClick={handleClose}>닫기</Button>
                    </div>
                : 
                    <div className="button-right-align">
                        <Button onClick={handleClose}>닫기</Button>
                    </div>
                }
                
            </Box>
            
            {type === "BusSetleTrau" ? 
                <div className="filter-form">
                    <div className="form-group">
                        <CustomFormLabel
                            className="input-label-display"
                            htmlFor="ft-aprv-ymd"
                        >
                            승인일자
                        </CustomFormLabel>
                        <CustomTextField  name="dlngYmd"
                        value={seletedRow ? getDlngYmd(seletedRow.dlngYmdtm ?? '') : ''
                        }
                        type="text" id="ft-aprv-ymd" fullWidth disabled />
                    </div>
                    <div className="form-group">
                        <CustomFormLabel
                            className="input-label-display"
                            htmlFor="ft-aprv-tm"
                        >
                            승인시간
                        </CustomFormLabel>
                        <CustomTextField  name="dlngTm"
                        value={seletedRow ? getDlngTm(seletedRow.dlngYmdtm ?? '') : ''
                        }
                        type="text" id="ft-aprv-tm" fullWidth disabled />
                    </div>
                    <div className="form-group">
                        <CustomFormLabel
                            className="input-label-display"
                            htmlFor="ft-card-number"

                        >
                        결제카드번호
                    </CustomFormLabel>
                    <CustomTextField  name="slmtCardNo"
                        value={ seletedRow ? seletedRow.sltmCardNo : ''
                        }
                        type="text" id="ft-card-number" fullWidth disabled />
                    </div>
                </div>
            :
                <div className="filter-form">
                    <div className="form-group">
                        <CustomFormLabel
                            className="input-label-display"
                            htmlFor="ft-car-Nnumber"
                        >
                            차량번호
                        </CustomFormLabel>
                        <CustomTextField  name="vhclNo"
                        value={seletedRow ? seletedRow.vhclNo : ''
                        }
                        type="text" id="ft-car-number" fullWidth disabled />
                    </div>
                    <div className="form-group">
                        <CustomFormLabel
                            className="input-label-display"
                            htmlFor="ft-biz-name"

                        >
                        업체명
                    </CustomFormLabel>
                    <CustomTextField  name="bzentyNm"
                        value={ seletedRow ? seletedRow.bzentyNm : ''
                        }
                        type="text" id="ft-biz-name" fullWidth disabled />
                    </div>
                </div>
            }
            <Box id="form-modal" component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'full' }}>
                {children}
            </Box>
        </DialogContent>
    </Dialog>
</>
);
};

export default FormDialog;