import { SelectItem } from 'select'

export const getDateTimeString = (DtString: string, target?:'date' | 'time' | 'mon') => { // yyyymmddhhmmss 형식을 yyyy-mm-dd / hh:mm:ss 형식으로 각각 반환함
  if(DtString && DtString.trim().length > 0) {
    if(DtString.length == 14) {
      let year = DtString.substring(0,4);
      let month = DtString.substring(4,6);
      let day = DtString.substring(6,8);
  
      let hour = DtString.substring(8,10);
      let minute = DtString.substring(10,12);
      let seconds = DtString.substring(12,14);
  
      let dateString = year+"-"+month+"-"+day;
      let timeString = hour+":"+minute+":"+seconds;
    
      return({"dateString": dateString,  "timeString": timeString});
    }else if(target == 'mon') {
      let year = DtString.substring(0,4);
      let month = DtString.substring(4,6).padStart(2, '0');
  
      let dateString = year+"-"+month;
  
      return({"dateString": dateString,  "timeString": ''});
    }else if(target == 'date') {
      let year = DtString.substring(0,4);
      let month = DtString.substring(4,6);
      let day = DtString.substring(6,8);
  
      let dateString = year+"-"+month+"-"+day;
  
      return({"dateString": dateString,  "timeString": ''});
    }else if(target == 'time') {
      let hour = DtString.substring(0,2);
      let minute = DtString.substring(2,4);
      let seconds = DtString.substring(4,6);
  
      let timeString = hour+":"+minute+":"+seconds;
  
      return({"dateString": '',  "timeString": timeString});
    }
  }
}

export const dateTimeFormatter = (dateString:string) => {
  const paresedDate = getDateTimeString(dateString);

  return paresedDate?.dateString +'\n'+ paresedDate?.timeString
}

// 사업자번호 "-" 삽입
export const brNoFormatter = (brNo: string) => {
  if(brNo && brNo.length == 10) {
    const brNo1 = brNo.substring(0,3);
    const brNo2 = brNo.substring(3,5);
    const brNo3 = brNo.substring(5,10);

    return `${brNo1}-${brNo2}-${brNo3}`;
  }
}

export const getDateRange = (format: "date" | "month", days: 30 | 60 | 90 | 180 | 365) => {
  // 기본 검색 날짜 범위 설정 (30일)
  const today = new Date();
  const beforeDate = new Date();
  
  if(format === "date") {
    beforeDate.setDate(today.getDate() - days);
  }else if(format === "month") {
    beforeDate.setMonth(today.getMonth() - days/30);
  }

  let stYear:string = String(beforeDate.getFullYear());
  let stMonth:string = String(beforeDate.getMonth()+1).padStart(2, '0');
  let stDate:string = String(beforeDate.getDate()).padStart(2, '0');
  let edYear = String(today.getFullYear());
  let edMonth = String(today.getMonth()+1).padStart(2, '0');
  let edDate = String(today.getDate()).padStart(2, '0');
  
  let startDate:string = '';
  let endDate:string = ''

  if(format === "date") {
    startDate = stYear+"-"+stMonth+"-"+stDate;
    endDate = edYear+"-"+edMonth+"-"+edDate;
  }else if(format === "month") {
    startDate = stYear+"-"+stMonth;
    endDate = edYear+"-"+edMonth;
  }

  return {
    startDate: startDate,
    endDate: endDate
  }
}

export const getCommaNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}