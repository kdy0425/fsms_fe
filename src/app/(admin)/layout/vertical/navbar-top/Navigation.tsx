import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import NavListing from './NavListing/NavListing';
import DetailSearch from './DetailSearch';

// components 모듈
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

const Navigation = () => {
  
  const [openSearchLayer, setOpenSearchLayer] = React.useState(false);

  const onFocus = (e: any) => {
    setOpenSearchLayer(true);
  };
  const onBlur = (e: any) => {
    setOpenSearchLayer(false);
  };

  return (
    <Box className="top-navigation-wrapper top-nevi-all">
      {/* ------------------------------------------- */}
      {/* 상단 메뉴 */}
      {/* ------------------------------------------- */}
      <Container className="top-navigation-inner top-total-search">

        {/* 최대 높이와 스크롤 기능 추가 */}
            <NavListing />

        {/* 통합검색 시작 */}
        {/* <div className="total-search-wrapper">
          <div className="total-search-inner">
            <div className="input-group">
              
              <CustomFormLabel htmlFor="ft-fname-input-01" className="input-label-none">label명</CustomFormLabel>
              <CustomTextField 
                id="ft-fname-input-01" 
                className="form-control total-search-bar" 
                placeholder="검색어를 입력하세요." 
                onFocus={(e: any) => onFocus(e)}
                onBlur={(e: any) => onBlur(e)}
              />
              <span className="input-group-btn">
                <Button variant="contained" color="primary" className="btn search-btn" title="검색어 버튼"></Button>
              </span>

            </div> */}

            {/* 상세검색 */}
            {/* <DetailSearch />
          </div> */}

          {/* 통합검색 흰트 시작 */}
          {/* <div className="search-layer">
            <div className={openSearchLayer ? 'search-select on' : 'search-select'}>
              <ul>
                <li>검색어</li>
                <li>검색어</li>
                <li>검색어</li>
              </ul>
            </div>
          </div> */}
          {/* 통합검색 흰트 끝 */}
        {/* </div> */}
        {/* 통합검색 끝 */}

        <div className="navbar-btn-wrapper">
          <a href="/site-map" className="header-right-menu header-menu-all">전체메뉴 열기</a>
        </div>

      </Container>
    </Box>
  );
};

export default Navigation;
