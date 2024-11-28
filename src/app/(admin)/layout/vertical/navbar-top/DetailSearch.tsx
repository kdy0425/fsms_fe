import React, { useState } from 'react';
import Image from "next/image";
import { IconX } from '@tabler/icons-react';
import {
    Box,
    Typography,
    Drawer,
    IconButton,
    FormControlLabel,
    FormGroup, 
    RadioGroup,
    Button
} from '@mui/material';
import Link from 'next/link';

import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomRadio from '@/components/forms/theme-elements/CustomRadio';
import CustomCheckbox from '@/components/forms/theme-elements/CustomCheckbox';

const DetailSearch = () => {

    const [showDrawer, setShowDrawer] = useState(false);
    const handleDrawerClose = () => {
    setShowDrawer(false);
    };

    return (
        <div className="search-group">

        <Button variant="contained" color="dark" onClick={() => setShowDrawer(true)}>
            상세검색
        </Button>

        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        <Drawer
            className="custom-modal-box-wrapper"
            anchor="top"
            open={showDrawer}
            onClose={() => setShowDrawer(false)}
            PaperProps={{ sx: { maxWidth: '800px', width: '800px', top: '100px', left: '50%', marginLeft: '-400px', height: '425px' } }}
        >
            <div className="custom-modal-box-inner">

            <div className="custom-modal-box-title">
                <Typography variant="h2" fontWeight={600}>
                상세검색
                </Typography>
                <Box>
                <IconButton
                    className="custom-modal-close"
                    color="inherit"
                    sx={{
                    color: '#000',
                    }}
                    onClick={handleDrawerClose}
                >
                    <IconX size="2rem" />
                </IconButton>
                </Box>
            </div>

            {/* ------------------------------------------- */}
            {/* 컨텐츠  */}
            {/* ------------------------------------------- */}
            <div className="custom-modal-box-contents">

            <div className="detail-search-box">
              {/* 상세검색 시작 */}

                <table className="table">
                    <colgroup>
                    <col style={{ width: "20%" }}></col>
                    <col style={{ width: "auto" }}></col>
                    </colgroup>
                    <tbody>
                    <tr>
                        <td className="td-head">검색범위</td>
                        <td className="t-left">
                        <div className="form-group">
                            <CustomFormLabel htmlFor="ft-fname-checkbox-01" className="input-label-none">검색범위</CustomFormLabel>
                            <FormGroup row id="ft-fname-checkbox-01" aria-label="checkbox-group-01" className="mui-custom-checkbox-group">
                            <FormControlLabel
                                value="checkbox1_1"
                                control={<CustomCheckbox defaultChecked />}
                                label="전체"
                            />
                            <FormControlLabel
                                value="checkbox1_2"
                                control={<CustomCheckbox />}
                                label="제목"
                            />
                            <FormControlLabel
                                value="checkbox1_3"
                                control={<CustomCheckbox />}
                                label="내용"
                            />
                            <FormControlLabel
                                value="checkbox1_4"
                                control={<CustomCheckbox />}
                                label="첨부파일"
                            />
                            <FormControlLabel
                                value="checkbox1_5"
                                control={<CustomCheckbox />}
                                label="등록자"
                            />
                            </FormGroup>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="td-head">검색기간</td>
                        <td className="t-left">
                        <div className="form-inline">
                            <div className="form-group">
                            <div className="form-inline">
                                <div className="form-group">
                                <CustomFormLabel htmlFor="ft-fname-datepicker-06" className="input-label-none">기간</CustomFormLabel>
                                <div id="ft-fname-datepicker-06" className="form-group">
                                    <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">기간 시작일</CustomFormLabel>
                                    <CustomTextField type="date" id="ft-date-start" fullWidth /> ~
                                    <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">기간 종료일</CustomFormLabel>
                                    <CustomTextField type="date" id="ft-date-end" fullWidth />
                                </div>
                                </div>
                            </div>
                            </div>
                            <Button variant="contained" color="dark">1주일</Button>
                            <Button variant="contained" color="dark">1개월</Button>
                            <Button variant="contained" color="dark">3개월</Button>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="td-head">검색방법</td>
                        <td className="t-left">
                        <div className="form-group">
                            <CustomFormLabel htmlFor="ft-fname-radio-01" className="input-label-none">label명</CustomFormLabel>
                            <RadioGroup row id="ft-fname-radio-01" aria-label="radio-group-01" name="radio-group-01" defaultValue="radio1_1" className="mui-custom-radio-group">
                            <FormControlLabel 
                                value="radio1_1" 
                                control={<CustomRadio />} 
                                label="모두 포함된 결과(AND)" 
                            />
                            <FormControlLabel
                                value="radio1_2"
                                control={<CustomRadio />}
                                label="하나라도 포함된 결과(OR)"
                            />
                            </RadioGroup>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>

            {/* 상세검색 끝 */}
            <div className="table-bottom-control t-center">
                <Button variant="contained" color="primary">검색</Button>
                <Button variant="contained" color="dark" onClick={handleDrawerClose}>취소</Button>
            </div>

            </div>

        </div>
        </Drawer>
    </div>
    );
};

export default DetailSearch;
