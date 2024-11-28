'use server'

import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getJwtToken } from '@/utils/fsms/common/user/jwtTokenUtils'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { MenuData } from '@/types/fsms/admin/menuListData'

interface depthMenuParamObj extends listParamObj {
  cdNm? : string | number | undefined,
}

export async function fetchList(obj: depthMenuParamObj) {
  let data
  let url: string = `${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/menu/menuGroups/${obj.cdNm}?`
  let size: string = `&size=${obj.size}`
  let sort: string = obj.sort ? `sort=${obj.sort}` : ''
  let searchWord: string = obj.searchValue? `&${obj.searchSelect}=${obj.searchValue}` : ''

  const jwtToken = getJwtToken()
  try {
    const response = await fetch(`${url + size + sort + searchWord}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('DB 연결 에러')
    }
    data = await response.json()
  } catch (error) {
    console.error('Fetch Error: ', error)
  }
  return data
}

export const updateMenuData = async (menuTsid: string, menuData: MenuData) => {
  try {
    const response = await sendHttpRequest(
      'PUT',
      `/admin/menu/${menuTsid}`,
      menuData,
      true // JWT 사용 (필요에 따라 조정)
    );
    if (response.resultType === 'success') {
      return { success: true };
    } else {
      return { error: response || 'An error occurred while update the menu.' };
    }
  } catch (error) {
    console.error('Error update menu:', error);
    return { error: 'An unexpected error occurred.' };
  }
}