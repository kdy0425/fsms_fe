import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from "next/link";
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from '@/store/hooks';
import UserProfile from './UserProfile';
import { AppState } from '@/store/store';
import Logo from "../../shared/logo/Logo";
import Navigation from './Navigation';
import { useEffect, useState } from 'react';

import { userProfileType } from "@/types/auth/auth";
import { getAuthInfo } from '@/utils/fsms/common/user/authUtils';

const Header = () => {
  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  /* 회원프로필 */
  const [authSttus, setAuthSttus] = useState<userProfileType>({ });
  /* 로그인 여부 */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /** 토큰 기반 로그인 정보 호출 및 할당 */
  useEffect(() => {
    const fetchAuthInfo = async () => {
      const authInfo = await getAuthInfo();

      setAuthSttus(authInfo.authSttus);
      setIsLoggedIn(authInfo.isLoggedIn);
    };
    fetchAuthInfo();
  }, []);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>

        <Logo />

        <Box flexGrow={1} />

        <Navigation />

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          {/* 로그인/프로필 분기처리 */}
          {isLoggedIn ? (
            <>
              <UserProfile
                userNm={ authSttus.userNm }
                authorities={ authSttus.authorities }
              />
            </>
          ) : (
            <Button
                color="inherit"
                sx={{ color: (theme) => theme.palette.text.secondary }}
                variant="text"
                href="/user/login"
                component={Link}
              >
                로그인
            </Button>
          )}
        </Stack>

      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
