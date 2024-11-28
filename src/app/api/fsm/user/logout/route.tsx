'use server'

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

/**
 * 유가보조금포털시스템 로그아웃 처리 API
 * 
 * @returns Root Page
 */
export async function POST() {

  // Delete Cookie For JWT
  const cookieStore = cookies();
  cookieStore.delete('JWT');
  
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_LOCAL_DOMAIN));
}