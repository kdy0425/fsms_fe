import { sendHttpRequest } from "./apiUtils";
import { SelectItem } from 'select'
import { sendHttpFileRequest } from '@/utils/fsms/common/apiUtils'

export const getCtpvCd = async (ctpvCd?: string, first?: string) => { // 시도 조회

  let itemArr:SelectItem[] = [];
  if(first){
    let item: SelectItem = {
      label: first,
      value: '',
    }
    itemArr.push(item);
  }

  try {
    let endpoint: string = `/fsm/cmm/cmmn/cm/getAllLocgovCd?locgovSeCd=0` 
                          + `${ctpvCd ? '&ctpvCd=' + ctpvCd : ''}`;

    const response = await sendHttpRequest('GET', endpoint, null, false);

    if (response && response.resultType === 'success' && response.data) {
      
      if(response.data.content) {
        response.data.content.map((code:any) => {
          let item: SelectItem = {
            label: code['ctpvNm'],
            value: code['ctpvCd'],
          }  
          itemArr.push(item);
        })
      }
    }
  }catch(error) {
    console.error('Error get City Code data:', error);
  }
  return itemArr;
}

export const getLocGovCd = async (ctpvCd?: string | number, locgovCd?: string, first?: string) => { // 관할관청 코드 조회

  let itemArr:SelectItem[] = [];
  if(first){
    let item: SelectItem = {
      label: first,
      value: '',
    }
    itemArr.push(item);
  }
  try {
    let endpoint: string = `/fsm/cmm/cmmn/cm/getAllLocgovCd?locgovSeCd=1` 
                          + `${ctpvCd ? '&ctpvCd=' + ctpvCd : ''}`
                          + `${locgovCd ? '&locgovCd=' + locgovCd : ''}`;

    const response = await sendHttpRequest('GET', endpoint, null, false);

    if (response && response.resultType === 'success' && response.data) {
      
      if(response.data.content) {
        response.data.content.map((code:any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['locgovCd'],
          }  
          itemArr.push(item);
        })
      }
    }
  }catch(error) {
    console.error('Error get Local Gov Code data:', error);
  }
  return itemArr;
} 

export const getCommCd = async (cdGroupNm: string, first?: string) => {

  let itemArr:SelectItem[] = [];
  if(first){
    let item: SelectItem = {
      label: first,
      value: '',
    }
    itemArr.push(item);
  }
  try {
    let endpoint: string = `/fsm/sym/cc/cm/getAllCmmnCd?cdGroupNm=${cdGroupNm}`
    

    const response = await sendHttpRequest('GET', endpoint, null, false);

    if (response && response.resultType === 'success' && response.data) {
      
      if(response.data) {
        response.data.map((code:any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm'],
          }  
          itemArr.push(item);
        })
      }
    }

  }catch(error) {
    console.error('Error get Code Group Data: ', error);
  }
  return itemArr;
}


export const getYear = (number: number, first?: string) => {
  let year = Number(new Date().getFullYear());
  let itemArr:SelectItem[] = [];
  if(first){
    let item: SelectItem = {
      label: first,
      value: '',
    }
    itemArr.push(item);
  }
  if(number>0){
    for(let i=year;i<year+number;i ++){
      let item: SelectItem = {
        label: i+'년',
        value: i+'',
      }
      itemArr.push(item);
    }
  }else{
    for(let i=year;i>year+number;i --){
      let item: SelectItem = {
        label: i+'년',
        value: i+'',
      }
      itemArr.push(item);
    }
  }
  return itemArr;
}

// 기본 검색 날짜 범위 설정
export const getDateRange = (se:string, diff:number) => {
  const today = new Date();
  const diffDate = new Date();
  if(se === 'd'){
    diffDate.setDate(today.getDate() - diff);
  }else if(se === 'm'){
    diffDate.setMonth(today.getMonth() - diff);
  }else{
    diffDate.setFullYear(today.getFullYear() - diff);
  }

  let stYear:string = String(diffDate.getFullYear());
  let stMonth:string = String(diffDate.getMonth()+1).padStart(2, '0');
  let stDate:string = String(diffDate.getDate()).padStart(2, '0');

  let edYear:string = String(today.getFullYear());
  let edMonth:string = String(today.getMonth()+1).padStart(2, '0');
  let edDate:string = String(today.getDate()).padStart(2, '0');

  let startDate = stYear
  let endDate = edYear
  if(se ==='m'){
    startDate += "-"+stMonth
    endDate += "-"+edMonth
  }else if(se === 'd'){
    startDate += "-"+stMonth+"-"+stDate;
    endDate += "-"+edMonth+"-"+edDate;
  }

  return({
    startDate: startDate,
    endDate: endDate
  })
}

// 오늘일자조회
export const getToday = () => {
  const today = new Date();
  return today.getFullYear() + String(today.getMonth()+1).padStart(2, '0') + String(today.getDate()+1).padStart(2, '0')
}

// 시작일과 종료일 비교
export const isValidDateRange = (
  changedField: string,
  changedValue: string,
  otherValue: string | undefined,
): boolean => {
  if (!otherValue) return true

  const changedDate = new Date(changedValue)
  const otherDate = new Date(otherValue)

  if (changedField === 'searchStDate') {
    return changedDate <= otherDate
  } else {
    return changedDate >= otherDate
  }
}

 // 조건 검색 변환 매칭
export const sortChange = (sort: String): String => {
  if (sort && sort != '') {
    let [field, sortOrder] = sort.split(',') // field와 sortOrder 분리하여 매칭
    if (field === 'regYmd') field = 'regDt' // DB -> regDt // DTO -> regYmd ==> 매칭 작업
    return field + ',' + sortOrder
  }
  return ''
}

//엑셀다운로드
export const getExcelFile = async (endpoint:string, name:string) => {
  try {
    const response = await sendHttpFileRequest('GET', endpoint, null, true, {
      cache: 'no-store',
    })

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
  }
}