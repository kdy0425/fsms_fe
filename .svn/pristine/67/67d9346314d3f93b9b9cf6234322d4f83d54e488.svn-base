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
interface FormDialogProps {
    buttonLabel: string;
    title: string;
    children: React.ReactNode;
    excelDownloadDetail: (selectedRow:Row)=>void;
    seletedRow: Row;
    size?: DialogProps['maxWidth'];
    onOpen?: () => void; // onOpen 프롭 추가
}


const FormDialog: React.FC<FormDialogProps> = ({ buttonLabel, title, children, excelDownloadDetail, seletedRow, size, onOpen }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        if (onOpen) onOpen(); // 열기 전에 onOpen 호출
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

return (
<>
    <Button variant="outlined" onClick={handleClickOpen}>
        {buttonLabel}
    </Button>
    <Dialog fullWidth={false} maxWidth={size} open={open} onClose={handleClose}>
        <DialogContent>
            <Box className="table-bottom-button-group">
                <h2>{title}</h2>
                <div className="button-right-align">
                    <Button onClick={() => excelDownloadDetail(seletedRow)} variant="contained" type="submit" form="form-modal" color="primary">
                        액셀
                    </Button>
                    <Button onClick={handleClose}>닫기</Button>
                </div>
            </Box>
            <div className="filter-form">
                <div className="form-group">
                    <CustomFormLabel className="input-label-display" htmlFor="ft-clcln-ym">
                        청구년월
                    </CustomFormLabel>
                    <CustomTextField  name="clclnYm" value={seletedRow ? seletedRow.clclnYm : '' } type="text" id="ft-clcln-ym" fullWidth disabled />
                </div>
                <div className="form-group">
                    <CustomFormLabel className="input-label-display" htmlFor="ft-card-number">
                        사업자번호
                    </CustomFormLabel>
                    <CustomTextField name="brno" value={ seletedRow ? seletedRow.brno : '' } type="text" id="ft-brno" fullWidth disabled />
                </div>
                <div className="form-group">
                    <CustomFormLabel className="input-label-display" htmlFor="ft-bzenty-name">
                        업체명
                    </CustomFormLabel>
                    <CustomTextField  name="bzentyNm" value={ seletedRow ? seletedRow.bzentyNm : '' } type="text" id="ft-bzenty-name" fullWidth disabled />
                </div>
            </div>
            <Box id="form-modal" component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'full' }}>
                {children}
            </Box>
        </DialogContent>
    </Dialog>
</>
);
};

export default FormDialog;