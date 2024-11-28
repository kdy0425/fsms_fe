'use server'

import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { getJwtToken } from '@/utils/fsms/common/user/jwtTokenUtils'

export async function fetchList(obj: listParamObj) {
  let data

  let url: string = `${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/menu/menuGroups?`

  let page: string = `page=${obj.page}`
  let size: string = `size=${obj.size}`
  let sort: string = obj.sort ? `&sort=${obj.sort}` : '';
  let searchWord: string = obj.searchValue? `&${obj.searchSelect}=${obj.searchValue}` : ''

  const jwtToken = getJwtToken()
  //console.log (`${url + page + size + sort + searchWord}`)
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