'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { ReactNode, useEffect, useState } from 'react';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';

interface FormDialogProps {
  buttonLabel: string;
  title: string;
  children: ReactNode;
  size?: DialogProps['maxWidth'] | 'lg';
  remote?: boolean
}


export default function FormDialog(props : FormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(props.remote !== undefined) {
      setOpen(props.remote);
    }
  }, [props.remote])

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
            <Button variant="contained" type='submit' form='form-modal' color="primary">저장</Button>
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </Box>
          <Box
            id='form-modal'
            component='form'
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              alert("SUBMIT");
            }}
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