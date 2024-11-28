import { formBrno } from '@/utils/fsms/common/convert';
import { CustomFormLabel, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { Box, Button, Dialog, DialogContent, DialogProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { HistoryRow } from '../page';

interface SearchModalProps {
  title: string;
  open: boolean
  handleOpen: () => void;
  handleClose: () => void;
  selectedRow: HistoryRow[] | null;
  vhclNo: string;
  bzentyNm: string;
  size?: DialogProps['maxWidth'];
}

const SearchModal = (props : SearchModalProps) => {
  const { open, title, handleOpen, handleClose, selectedRow, size, vhclNo, bzentyNm} = props;

  return (
    <Box>
    <Dialog fullWidth={false}  maxWidth={size} open={open} onClose={handleClose}>
        <DialogContent style={{minHeight: '500px'}}>
            <Box className="table-bottom-button-group" sx={{mb:2}}>
                <h3>{title}</h3>
                <div className="button-right-align">
                    <Button onClick={handleClose}>닫기</Button>
                </div>
            </Box>
            <Box className="sch-filter-box" sx={{mb:2}}>
              <div className="form-group">
                  <CustomFormLabel
                      className="input-label-display"
                      htmlFor="ft-car-name"
                  >
                      차량번호
                  </CustomFormLabel>
                  <CustomTextField  name="vhclNo"
                  value={vhclNo ?? ''}
                  disabled
                  type="text" id="ft-car-name" fullWidth />
              </div>

              <div className="form-group">
                  <CustomFormLabel
                      className="input-label-display"
                      htmlFor="ft-car-name"
                  >
                  업체명
              </CustomFormLabel>
              <CustomTextField  name="bzentyNm"
                  value={bzentyNm}
                  disabled
                  type="text" id="ft-car-name" fullWidth />
              </div>
            </Box>
           
            <Box id="form-modal" component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'full' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><div className="table-head-text">순번</div></TableCell>
                      <TableCell><div className="table-head-text">변경일자</div></TableCell>
                      <TableCell><div className="table-head-text">관할관청</div></TableCell>
                      <TableCell><div className="table-head-text">차량상태</div></TableCell>
                      <TableCell><div className="table-head-text">유종</div></TableCell>
                      <TableCell><div className="table-head-text">면허업종</div></TableCell>
                      <TableCell><div className="table-head-text">할인여부</div></TableCell>
                      <TableCell><div className="table-head-text">RFID차량여부</div></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                    selectedRow? selectedRow.map((row:any, index) => {
                      return (<TableRow key={'searchModalRow'+index}>
                        <TableCell>
                          {Number(row?.hstrySn)}
                        </TableCell>
                        <TableCell>
                          {row?.mdfcnDt}
                        </TableCell>
                        <TableCell>
                          {row?.locgovNm}
                        </TableCell>
                        <TableCell>
                          {row?.vhclSttsNm}
                        </TableCell>
                        <TableCell>
                          {row?.koiNm}
                        </TableCell>
                        <TableCell>
                          {row?.vhclSeNm}
                        </TableCell>
                        <TableCell>
                          {row?.dscntNm}
                        </TableCell>
                        <TableCell>
                          {row?.rfidNm}
                        </TableCell>
                      </TableRow>
                      )
                    }): ''} 
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
        </DialogContent>
    </Dialog>
    </Box>
  )
}

export default SearchModal;