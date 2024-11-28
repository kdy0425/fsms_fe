"use client";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

// components

import PageContainer from '@/components/container/PageContainer';
import AuthLogin from './AuthLogin';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Logo from '@/app/(admin)/layout/shared/logo/Logo';
import { useMessageActions } from '@/store/MessageContext'; // 메시지 액션 훅 임포트
import { ApiError, ApiResponse, getCombinedErrorMessage } from '@/types/message';
import { apiClient } from '@/utils/fsms/common/apiUtils';
import { getAuthInfo } from '@/utils/fsms/common/user/authUtils';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setMessage, clearMessage } = useMessageActions(); // 메시지 설정 함수 사용

  const [lgnId, setLgnId] = useState('');
  const [pswd, setPswd] = useState('');

  const handleLgnIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLgnId(e.target.value);
  }

  const handlePswdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPswd(e.target.value);
  }

  /** 로그인 요청 */
  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();

    try {
      const response: ApiResponse = await apiClient({
        endpoint: '/api/fsm/user/login',
        method: 'POST',
        body: { lgnId, pswd },
      });
      setMessage({
        resultType: 'success',
        status: response.status,
        message: response.message});
      setTimeout(() => {
        clearMessage();
        router.push('/'); // 홈페이지로 리다이렉트
      }, 2000);
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.resultType) {
          case 'fail':
            //유효성검사 오류
            setMessage({
              resultType: error.resultType,
              status: error.status,
              message: getCombinedErrorMessage(error),
            });
            break;
          case 'error':
            // 'error'는 서버 측 오류
            setMessage({
              resultType: 'error',
              status: error.status,
              message: error.message});
            break;
        }
      }
    }
  };

  /** 로그인 완료 후 페이지 새로고침 */
  useEffect(() => {
    router.refresh();
  }, []);

  /** 비로그인 접근으로 인한 리다이렉트 시 */
  useEffect(() => {
    const redirected = searchParams.get('redirected');
    if (redirected === 'true') {
      // alert('로그인 후 이용해주시기 바랍니다.');
    }
  }, [searchParams]);

  /** 로그인 정보 호출 - 예시 */
  const loginInfoChk = async () => {
    const authInfo = await getAuthInfo();

    if (authInfo.isLoggedIn) {
      alert('로그인 상태입니다.'
        + '\r'
        + '\r아이디: ' + authInfo.authSttus.lgnId
        + '\r사용자명: ' + authInfo.authSttus.userNm
        + '\r권한목록: ' + authInfo.authSttus.authorities
      );
    } else {
      alert('현재 비로그인 상태입니다.');
    }
  }

  return (
    <PageContainer title="로그인 페이지" description="로그인 페이지 가이드">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>

              <form onSubmit={ loginSubmit }>
                <AuthLogin
                  subtitle={
                    <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                      <Typography
                        component={Link}
                        href="/user/signup"
                        fontWeight="500"
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                        }}
                      >
                        회원가입
                      </Typography>
                    </Stack>
                  }
                  handleLgnIdChange={ handleLgnIdChange }
                  handlePswdChange={ handlePswdChange }
                />
              </form>

              <br/>
              <button onClick={ loginInfoChk }>현재 로그인정보 조회</button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

