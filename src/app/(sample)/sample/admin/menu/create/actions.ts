'use server'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils';

export interface MenuData {
  menuNm: string
  urlAddr: string
  menuSeq: string
  menuTypeCd: string
  httpDmndMethNm: string
  menuAcsAuthrtCd: string
  npagYn: string
  menuGroupCd: string
  menuExpln: string
  userTypeCds: string[]
}

export async function createMenu(prevState: any, formData: FormData): Promise<any> {
  const menu: MenuData = {
    menuNm: formData.get('menuNm') as string,
    urlAddr: formData.get('urlAddr') as string,
    menuSeq: formData.get('menuSeq') as string,
    menuTypeCd: formData.get('menuTypeCd') as string,
    httpDmndMethNm: formData.get('httpDmndMethNm') as string,
    menuAcsAuthrtCd: formData.get('menuAcsAuthrtCd') as string,
    npagYn: formData.get('npagYn') as string,
    menuGroupCd: formData.get('menuGroupCd') as string,
    menuExpln: formData.get('menuExpln') as string,
    userTypeCds: formData.getAll('userTypeCds') as string[],
  };

    try {
      const response = await sendHttpRequest(
        'POST',
        `/admin/menu/menuGroups/${menu.menuGroupCd}`,
        menu,
        true // JWT 토큰 사용
      );

    if (response.resultType === 'success') {
      return { success: true };
    } else {
      return { error: response || 'An error occurred while creating the menu.' };
    }
  } catch (error) {
    console.error('Error creating menu:', error);
    return { error: 'An unexpected error occurred.' };
  }
}