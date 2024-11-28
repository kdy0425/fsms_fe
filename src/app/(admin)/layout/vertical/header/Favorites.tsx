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
} from '@mui/material';
import Link from 'next/link';

import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '@/components/forms/theme-elements/CustomCheckbox';

const Favorites = () => {

  const [showDrawer, setShowDrawer] = useState(false);
  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  return (
    <div className="favorites-group">
      <Link 
        href="#" 
        onClick={() => setShowDrawer(true)}
        className="top-btn btn-favorites"
        > 즐겨찾는 메뉴
      </Link>

      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Drawer
        className="custom-modal-box-wrapper"
        anchor="top"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{ sx: { maxWidth: '1000px', width: '1000px', top: '100px', left: '50%', marginLeft: '-500px', height: '600px' } }}
      >
        <div className="custom-modal-box-inner">

          <div className="custom-modal-box-title">
            <Typography variant="h2" fontWeight={600}>
              즐겨찾는 메뉴
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

          <div className="custom-modal-box-ex">
            <p>메인 화면에서 유가보조금 메뉴를 빠르게 접속 할 수 있도록 메뉴를 설정할 수 있습니다. (최대 6개 지정)</p>
          </div>

          {/* ------------------------------------------- */}
          {/* 컨텐츠  */}
          {/* ------------------------------------------- */}
          <div className="custom-modal-box-contents">

            <div className="favorites-box">
              <div className="selected-box-group">
                <span className="ir">선택된 자주 찾는 정보 메뉴 목록입니다.</span>
                <ul className="selected-box">
                  <li className="selected-tab active">
                    <Link href="#" title="적극행정 새창으로 열기" className="tab-page-link" target="_blank">
                      <div className="selected-img">
                        <Image
                          src="/images/svgs/favorites-icon-01.svg"
                          alt="logo"
                          height={44}
                          width={136}
                          priority
                        />
                      </div>
                      <div className="selected-text">
                        <span>보조금 지급대상</span>
                      </div>
                    </Link>
                  </li>
                  <li className="selected-tab"><span>선택하세요</span></li>
                  <li className="selected-tab"><span>선택하세요</span></li>
                  <li className="selected-tab"><span>선택하세요</span></li>
                  <li className="selected-tab"><span>선택하세요</span></li>
                  <li className="selected-tab"><span>선택하세요</span></li>
                </ul>
              </div>
              <div className="tab-menu-box-group">
                <div className="tab-menu">
                  <div className="form-group">
                    <CustomFormLabel htmlFor="ft-fname-checkbox-02" className="input-label-none">label명</CustomFormLabel>
                    <FormGroup id="ft-fname-checkbox-02" aria-label="checkbox-group-02" className="mui-custom-checkbox-group">
                      <FormControlLabel
                        value="checkbox1_1"
                        control={<CustomCheckbox defaultChecked />}
                        label="보조금 지급대상"
                      />
                      <FormControlLabel
                        value="checkbox1_2"
                        control={<CustomCheckbox />}
                        label="지급액 산정방법"
                      />
                      <FormControlLabel
                        value="checkbox1_3"
                        control={<CustomCheckbox />}
                        label="자주묻는 질문"
                      />
                      <FormControlLabel
                        value="checkbox1_4"
                        control={<CustomCheckbox />}
                        label="보조금 지급현황"
                      />
                      <FormControlLabel
                        value="checkbox1_5"
                        control={<CustomCheckbox />}
                        label="부정수급 현황"
                      />
                      <FormControlLabel
                        value="checkbox1_6"
                        control={<CustomCheckbox />}
                        label="유류카드 발급현황"
                      />
                      <FormControlLabel
                        value="checkbox1_7"
                        control={<CustomCheckbox />}
                        label="기타 메뉴"
                      />
                      <FormControlLabel
                        value="checkbox1_8"
                        control={<CustomCheckbox />}
                        label="기타 메뉴"
                      />
                      <FormControlLabel
                        value="checkbox1_9"
                        control={<CustomCheckbox />}
                        label="기타 메뉴"
                      />
                      <FormControlLabel
                        value="checkbox1_10"
                        control={<CustomCheckbox />}
                        label="기타 메뉴"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </Drawer>
    </div>
  );
};

export default Favorites;
