'use client'
import { CustomFormLabel } from '@/utils/fsms/fsm/mui-imports';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React, { ReactNode, useEffect, useState } from 'react';


interface FormModalProps {
  buttonLabel: string;
  title: string;
  children: ReactNode;
  formId?: string;
  formLabel?: string | '저장' | '조회';
  size?: DialogProps['maxWidth'] | 'lg';
  remoteFlag?: boolean
  pringBtn?: boolean
}


export default function FormModal(props : FormModalProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(props.remoteFlag !== undefined && props.remoteFlag == false) {
      setOpen(false);
    }
  }, [props.remoteFlag])

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
        <Box className='table-bottom-button-group'>
          <CustomFormLabel className="input-label-display">
            <h2>{props.title}</h2>
          </CustomFormLabel>
          <div className=" button-right-align">
            <Button variant="contained" type='submit' form={props.formId} color="primary">{props.formLabel}</Button>
            {props.pringBtn ? <Button>출력</Button> : ''} 
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'full',
            }}
          >
            {props.children}
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}