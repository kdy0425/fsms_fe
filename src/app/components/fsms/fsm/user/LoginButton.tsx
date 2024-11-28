'use client';

import { Button } from '@mui/material';

/**
 * 로그아웃 버튼 컴포넌트
 * 
 * @returns 로그아웃 버튼
 */
const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/fsm/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        window.location.href = '/user/login';  // 홈페이지로 리다이렉트
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <Button
      className="top-btn btn-logout"
      onClick={handleLogout}
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;