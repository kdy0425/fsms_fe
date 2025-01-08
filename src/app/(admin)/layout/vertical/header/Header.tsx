import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from '@/store/hooks'
import UserProfile from './UserProfile'
import { AppState } from '@/store/store'
import Logo from '../../shared/logo/Logo'
import Navigation from './Navigation'
import { useContext, useEffect, useState } from 'react'
import Badge from '@mui/material/Badge';

import { userProfileType } from '@/types/auth/auth'
import { getAuthInfo } from '@/utils/fsms/common/user/authUtils'
import Favorites from './Favorites'
import LogoutButton from '@/app/components/fsms/fsm/user/LoginButton'
import UserAuthContext from '@/app/components/context/UserAuthContext'


/* 로고빼고 다 가림 */
type HeaderProps = {
  hideLogin?: boolean;
};

const Header = ({ hideLogin = false }: HeaderProps) => {
  // drawer
  const customizer = useSelector((state: AppState) => state.customizer)
  const dispatch = useDispatch()

  const { setUserAuthInfo } = useContext(UserAuthContext);

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

  /* 회원프로필 */
  const [authStatus, setAuthStatus] = useState<userProfileType>({})
  /* 로그인 여부 */
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  /** 토큰 기반 로그인 정보 호출 및 할당 */
  useEffect(() => {
    const fetchAuthInfo = async () => {
      const authInfo = await getAuthInfo()

      setAuthStatus(authInfo.authSttus)
      setIsLoggedIn(authInfo.isLoggedIn)

      setUserAuthInfo(authInfo.authSttus);
    }
    fetchAuthInfo()
  }, [])

  return (
    <AppBarStyled position="relative" color="default" className="header-wrapper">
      <ToolbarStyled className="header-inner">
        <Logo />
        <Box flexGrow={1} />
        {/* 회원가입에서 로고빼고 다 가림 */}
        {!hideLogin && (
        <Stack spacing={1} direction="row" alignItems="center">
          {/* 로그인/프로필 분기처리 */}
            <>
              {/* <UserProfile
                userNm={authStatus.userNm}
                authorities={authStatus.authorities}
              /> */}
              <Stack spacing={1} className="global-link-wrapper">
                <span className="username-zone"><span className="username"></span>님이 로그인하셨습니다.</span>
                <LogoutButton />
                <Button className="top-btn btn-mypage">마이페이지</Button>
                {/* 즐겨찾는 메뉴 */}
                <Favorites />
                <Button className="top-btn btn-sitemap">사이트맵</Button>
              <Button className="top-btn btn-alarm">
                <Badge color="primary" badgeContent={3}>
                  알림
                </Badge>
            </Button>
              </Stack>
            </>
            <Stack spacing={1} className="global-link-wrapper">
              <Link className="top-btn btn-login" href={'/user/login'}>로그인</Link>
            </Stack>
        </Stack>
        )}
      </ToolbarStyled>
    </AppBarStyled>
  )
}

export default Header
