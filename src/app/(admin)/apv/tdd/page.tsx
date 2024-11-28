'use client'
import {
  Box,
  Button,
  Grid,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import {  sendHttpFileRequest, sendHttpRequest  } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import TableDataGrid from './_components/TableDataGrid'
import DetailTableDataGrid from './_components/DetailTableDataGrid'
import {
  getCodesByGroupNm,
  getCityCodes,
  getLocalGovCodes,
} from '@/utils/fsms/common/code/getCode'

import { SelectItem } from 'select'


// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '택시주유정보',
  },
  {
    to: '/apv/tdd',
    title: '택시거래내역',
  },
]

const headCells: HeadCell[] = [
  {
    id: 'bzentyNm',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  {
    id: 'brno',
    numeric: false,
    disablePadding: false,
    label: '사업자등록번호',
  },
  {
    id: 'rprsvNm',
    numeric: false,
    disablePadding: false,
    label: '대표자명',
  },
  {
    id: 'pid',
    numeric: false,
    disablePadding: false,
    label: '대표자주민등록번호',
  },
]

export interface Row {
  bzentyNm?: string  // 업체명
  brno?: string     //사업자번호
  rprsvNm?: string    // 대표자명
  pid?: string  // 대표자 주민등록번호 

  crdcoCd?: string // 카드사코드(카드사명),
  cardNo?: string //카드번호
  dlngSeCd?: string //거래구분
  trauYmd?: string //거래일자
  dlngTm?: string //거래시각
  dailUseAcmlNmtm?: string //거래순번
  vhclNo?: string //차량번호
  // brno?: string //사업자번호
  koiCd?: string //유종
  // bzentyNm?: string //업체명
  frcsNm?: string //가맹점명
  frcsBrno?: string //가맹점사업자번호
  cdKornNm?: string // 가맹점 지역      
  literAcctoUntprc?: string //사용량단가구분   !!파라미터 정의서  : 리터당단가구분
  literAcctoUntprcSeCd?: string //사용량당단가       !!파라미터 정의서 : 리터당단가 
  useLiter?: string //가맹점 사용량        파라미터 정의서 : 사용리터
  moliatUseLiter?: string // 국토부 사용량       
  usageUnit?: string // 단위    //파라미터 정의서 사용단위 : 사용단위
  aprvAmt?: string // 승인금액
  vhclPorgnUntprc?: string // 차량등록지 지역별평균단가   //파라미터 정의서: 차량등록지 단가
  moliatAsstAmt?: string // 유가연동보조금 사용량당단가  //파라미터 정의서 : 유가연동보조금
  koiTaxIlSubsidyA?: string // 유류세\n연동보조금(a)        // 에매함. 파라미터 정의서 :국토부보조금
  sumNtsRmbrAmt?: string // 유류세\n연동보조금(b)        //    파라미터 정의서 : 국세청보조금
  sumRmbrAmt?: string // 유류세\n연동보조금(a+b)     //   파라미터 정의서 : 총보조금 
  pbillAmt?: string // 수급자\n부담금              
  rtrcnDlngDt?: string // 거래취소일자             
  noDiscountReason?: string //미할인사유      //문의 들어감
}

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  searchValue: string
  searchSelect: string
  bgngDt: string
  endDt: string
  [key: string]: string | number // 인덱스 시그니처 추가
}

// 조회하여 가져온 정보를 Table에 넘기는 객체
type pageable = {
  pageNumber: number
  pageSize: number
  sort: string
}

const DataList = () => {
  const router = useRouter() // 화면이동을 위한객체
  const querys = useSearchParams() // 쿼리스트링을 가져옴
  const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음

  const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [flagDetail, setFlagDetail] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [rowsDetails, setRowDetails] = useState<Row[]>([]) // 가져온 로우 디테일 데이터
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부

  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
    size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', // 검색어
    searchSelect: allParams.searchSelect ?? 'ttl', // 종류
    bgngDt: String(allParams.bgngDt ?? ''), // 시작일
    endDt: String(allParams.endDt ?? ''), // 종료일
    sort: allParams.sort ?? '', // 정렬 기준 추가
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })


    //Selct Code 세팅 
  // fuelData 상태를 SelectItem[] 타입으로 설정
  const [koiCdCode, setKoiCdCode] = useState<SelectItem[]>([]) //       유종 코드
  // cardCompanyData 상태를 SelectItem[] 타입으로 설정
  const [crdcoCode, setCrdCode] = useState<SelectItem[]>([])           //카드사 코드
  // fuelData 상태를 SelectItem[] 타입으로 설정
  const [dlngSeCdCode, setDlngSeCdCode] = useState<SelectItem[]>([]);
  // cityCode 상태를 SelectItem[] 타입으로 설정
  const [cityCode, setCityCode] = useState<SelectItem[]>([])  //        시도 코드
  // localGovCode 상태를 SelectItem[] 타입으로 설정
  const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([]) // 관할관청 코드


  const [selectedRow, setSelectedRow] = useState<Row>();



  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  useEffect(() => {
    if (selectedRow) {
      fetchDetailData(selectedRow as Row);
    }
  }, [flagDetail]);

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)

      // 카드사
      let crdcoCodes: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ]
    
      // 유종
      let koiCodes: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ]

       // 거래구분 
      let purchaseStatusCodes: SelectItem[] = [
        {
          label: '전체',
          value: '',
        },
      ]

          // select item setting
    let cityCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]
    let locgovCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]

    // 시도명 select item setting
    getCityCodes().then((res) => {
      if (res && Array.isArray(res)) {
        const dynamicCityData = [{ label: '전체', value: '' }]; // 기본 옵션
        res.forEach((item) => {
          dynamicCityData.push({
            label: item.locgovNm,
            value: item.ctpvCd,
          });
        });
        setCityCode(dynamicCityData); // 올바른 데이터로 업데이트
      } else {
        console.error('getCityCodes fail.');
      }
    });

    // 관할관청 select item setting
    getLocalGovCodes().then((res) => {
      if (res && Array.isArray(res)) {
        const dynamicLocalGovData = [{ label: '전체', value: '' }]; // 기본 옵션
        res.forEach((item) => {
          dynamicLocalGovData.push({
            label: item.locgovNm,
            value: item.locgovCd,
          });
        });
        setLocalGovCode(dynamicLocalGovData); // 올바른 데이터로 업데이트
      } else {
        console.error('getLocalGovCodes dynamicLocalGovData fail.');
      }
    });
      
     // 카드사 select item setting
    getCodesByGroupNm('CCGC').then((res: {resultType: string; data: any[]}) => {

          if (res && Array.isArray(res)) { // res가 배열인지 확인
            const dynamicCardComData: SelectItem[] =  [{ label: '전체', value: '' }]; // 기본 옵션
            res.forEach((item) => {
              dynamicCardComData.push({
                label: item.cdKornNm,
                value: item.cdNm,
              });
          });
          setCrdCode(dynamicCardComData)
        }else{
          console.error("getCodesByGroupNm dynamicCardComData fail.");
        }
      }
    )

    // 거래구분 select item setting
    getCodesByGroupNm('DLNG').then((res: {resultType: string; data: any[]}) => {
      if (res && Array.isArray(res)) { // res가 배열인지 확인
        const dynamicPurchaseStatus: SelectItem[] =  [{ label: '전체', value: '' }]; // 기본 옵션
        res.forEach((item) => {
          dynamicPurchaseStatus.push({
            label: item.cdKornNm,
            value: item.cdNm,
          });
      });
        setDlngSeCdCode(dynamicPurchaseStatus)
      }else{
        console.error("getCodesByGroupNm dynamicPurchaseStatus fail.");
      }
    }
  )
    
  // 유종 데이터를 가져와서 fuelData 업데이트
  getCodesByGroupNm('599').then((res: any[]) => {
    if (res && Array.isArray(res)) { // res가 배열인지 확인
      const dynamicFuelData: SelectItem[] = [{ label: '전체', value: '' }]; // 기본 옵션
      res.forEach((item) => {
        dynamicFuelData.push({
          label: item.cdKornNm,
          value: item.cdNm,
        });
      });
      setKoiCdCode(dynamicFuelData); // fuelData 상태 업데이트
    } else {
      console.error("getCodesByGroupNm dynamicFuelData fail.");
    }
  });
}, []);

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])

  
  useEffect(() => {
    if (!params.ctpvCd) return; // cityCode가 비어있으면 실행하지 않음

    let locgovCodes: SelectItem[] = [
      {
        label: '전체',
        value: '',
      },
    ]
  
    // 선택한 시도에 해당하는 관할 관청을 가져오기 위한 비동기 함수 호출
    getLocalGovCodes(params.ctpvCd).then((res) => {
      if (res) {
        res.map((code: any) => {
          let item: SelectItem = {
            label: code['locgovNm'],
            value: code['locgovCd'],
          }

          locgovCodes.push(item)
        })
      }

      setLocalGovCode(locgovCodes)
    })
  }, [params.ctpvCd])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/tdd/tx/getAllTaxiBzentyDtls?` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.brno ? '&brno=' + params.brno : ''}` +
        `${params.bzentyNm ? '&bzentyNm=' + params.bzentyNm : ''}` +
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` 
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        setRows(response.data)
        setTotalRows(0)
        setRowDetails([]);
        setPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        setRows([])
        setRowDetails([]);
        setPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows(rows)
      setPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    } finally {
      setLoading(false)
    }
  }



    function formatDate(dateStr:string) {
    return dateStr.replace(/-/g, '');
  }

  // 상세 정보 fetch
  const fetchDetailData = async (row: Row) => {
    setLoading(true)

    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/apv/tdd/tx/getAllTaxiDelngDtls?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.searchValue ? '&' + params.searchSelect + '=' + params.searchValue : ''}` +
        `${params.bgngDt ? '&bgngDt=' + params.bgngDt : ''}` +
        `${params.endDt ? '&endDt=' + params.endDt : ''}`+
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.frcsNm ? '&frcsNm=' + params.frcsNm : ''}` +
        `${row.brno ? '&brno=' + row.brno : ''}` +
        `${row.bzentyNm ? '&bzentyNm=' + row.bzentyNm : ''}` +
        `${params.koiCd ? '&koiCd=' + params.koiCd : ''}` 



      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRowDetails(response.data.content)
        setTotalRows(response.data.totalElements)
        setPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        console.error('empty data : fetching Details ')
        setRowDetails([])
        setTotalRows(0)
        setPageable({
          pageNumber: 1,
          pageSize: 10,
          sort: params.sort,
        })
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching Details data:', error)
      setRowDetails([])
      setTotalRows(0)
      setPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
      })
    } finally {
      setLoading(false)
    }
  }

  // 페이지 이동 감지 시작 //
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault();

      setFlag((prevFlag) => !prevFlag);
  };

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setFlagDetail(!flagDetail)
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlagDetail(!flagDetail) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  // Update handleRowClick to call fetchCompanyDetails
  const handleRowClick = (row: Row) => {
    setSelectedRow(row)
    fetchDetailData(row);
  };

  // 글쓰기 페이지로 이동하는 함수
  const handleWriteClick = () => {
    router.push(`./create${qString}`) // '/create'는 글쓰기 페이지의 경로입니다.
  }

  // 페이지 이동 감지 종료 //

  // 시작일과 종료일 비교 후 일자 변경
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {

    const { name, value } = event.target

    if (name === 'bgngDt' || name === 'endDt') {
      const otherDateField =
        name === 'bgngDt' ? 'endDt' : 'bgngDt'
      const otherDate = params[otherDateField]

      if (isValidDateRange(name, value, otherDate)) {
        setParams((prev) => ({ ...prev, [name]: value }))
      } else {
        alert('종료일은 시작일보다 빠를 수 없습니다.')
      }
    } else {
      setParams((prev) => ({ ...prev, [name]: value }))
    }
  }

  // 시작일과 종료일 비교
  const isValidDateRange = (
    changedField: string,
    changedValue: string,
    otherValue: string | undefined,
  ): boolean => {
    if (!otherValue) return true

    const changedDate = new Date(changedValue)
    const otherDate = new Date(otherValue)

    if (changedField === 'bgngDt') {
      return changedDate <= otherDate
    } else {
      return changedDate >= otherDate
    }
  }


  const onPageChange = ():void =>{

  }

  // 조건 검색 변환 매칭
  const sortChange = (sort: String): String => {
    if (sort && sort != '') {
      let [field, sortOrder] = sort.split(',') // field와 sortOrder 분리하여 매칭
      if (field === 'regYmd') field = 'regDt' // DB -> regDt // DTO -> regYmd ==> 매칭 작업
      return field + ',' + sortOrder
    }
    return ''
  }



  // 추후에 액셀 다운로드 API 나오면 연동! 
  const excelDownload = async () => {
    try {
      let endpoint: string =
      `/sample?page=${params.page - 1}&size=${params.size}` 

      const response = await sendHttpFileRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      alert('추후에 액셀 다운로드 API 나오면 연동! ')
      console.log(response);
      // const url = window.URL.createObjectURL(new Blob([response]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'test.xlsx');
      // document.body.appendChild(link);
      // link.click();
      // if (response && response.resultType === 'success' && response.data) {
      //   // 데이터 조회 성공시
        
      // } else {
      //   // 데이터가 없거나 실패
       
      // }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
      setRows([])
      setTotalRows(0)
    }
  }

  return (
    <PageContainer title="택시거래내역" description="택시거래내역">
      {/* breadcrumb */}
      <Breadcrumb title="택시거래내역" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="sch-filter-box">
          <div className="form-list">
            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-ton"
                >
                  <span className="required-text" >*</span>시도명
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  value={params.ctpvCd}
                  name="ctpvCd"
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  { cityCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-ton"
                >
                  <span className="required-text" >*</span>관할관청
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  value={params.locgovCd}
                  name="locgovCd"
                  onChange={handleSearchChange }
                  style={{ width: '100%' }}
                >
                  {localGovCode.map((option, index) => (
                    <option key={`${option.value}-${index}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <CustomFormLabel className="input-label-display">
                <span className="required-text" >*</span>거래일자
                </CustomFormLabel>
                <CustomFormLabel
                  className="input-label-none"
                  htmlFor="ft-date-start"
                >
                  시작일 
                </CustomFormLabel>
                <CustomTextField 
                  value={params.bgngDt}
                  onChange={handleSearchChange} 
                  name="bgngDt"
                  type="date" id="ft-date-start" fullWidth />
                <CustomFormLabel
                  className="input-label-none"
                  htmlFor="ft-date-end"
                >
                  종료일
                </CustomFormLabel>
                <CustomTextField 
                  value={params.endDt}
                  name="endDt"
                  onChange={handleSearchChange}
                type="date"  id="ft-date-end" fullWidth />
              </div>
            </div>

            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fname"
                >
                  차량번호
                </CustomFormLabel>
                <CustomTextField
                  id="ft-fname"
                  placeholder=""
                  fullWidth
                  name="vhclNo"
                  text={params.vhclNo}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fname"                >
                  사업자등록번호
                </CustomFormLabel>
                <CustomTextField
                  id="ft-fname"
                  placeholder=""
                  fullWidth
                  name="brno"
                  text={params.brno}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-ton"
                >
                  거래구분
                </CustomFormLabel>
                <select
                  id="ft-ton-select-01"
                  className="custom-default-select"
                  name="dlngSeCd"
                  value={params.dlngSeCd}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {dlngSeCdCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div><hr></hr>
            <div className="filter-form">
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fuel"
                >
                  카드사명
                </CustomFormLabel>
                <select
                  id="ft-fuel-select-02"
                  className="custom-default-select"
                  name="crdcoCd"
                  value={params.crdcoCd}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {crdcoCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fname"
                >
                  업체명
                </CustomFormLabel>
                <CustomTextField
                  id="ft-fname"
                  placeholder=""
                  fullWidth
                  text={params.bzentyNm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fname"
                >
                  가맹점명
                </CustomFormLabel>
                <CustomTextField
                  id="ft-fname"
                  placeholder=""
                  fullWidth
                  name="frcsNm"
                  text={params.frcsNm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-group">
                <CustomFormLabel
                  className="input-label-display"
                  htmlFor="ft-fuel"
                >
                  유종
                </CustomFormLabel>
                <select
                  id="ft-fuel-select-02"
                  className="custom-default-select"
                  name="koiCd"
                  value={params.koiCd}
                  onChange={handleSearchChange}
                  style={{ width: '100%' }}
                >
                  {koiCdCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Box>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button type="submit" variant="contained" color="primary">
              조회
            </Button>
            <FormDialog
              buttonLabel="신규"
              title="택시거래내역 등록"
              children={<ModalContent />}
            />
            {/* <Button variant="contained" color="primary">
              신규
            </Button> */}
            {/* <Button variant="contained" color="primary">
              수정
            </Button>
            <Button variant="contained" color="primary">
              삭제
            </Button> */}
            <Button onClick={() => excelDownload()} variant="contained" color="primary">
              엑셀
            </Button>
          </div>
        </Box>
      </Box>
      {/* 검색영역 종료 */}

      {/* 테이블영역 시작 */}
      <Box>
        <TableDataGrid
          headCells={headCells} // 테이블 헤더 값
          rows={rows} // 목록 데이터
          loading={loading} // 로딩여부
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          totalRows={totalRows} // 총 로우 수
        />
      </Box>
      {/* 테이블영역 끝 */}

      {/* 상세 영역 시작 */}
      <Grid item xs={4} sm={4} md={4}>
        <DetailTableDataGrid 
          rows={rowsDetails} 
          loading={loading} 
          totalRows={totalRows}
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          pageable={pageable} // 현재 페이지 / 사이즈 정보
        />
      </Grid>
      {/* 상세 영역 끝 */}
    </PageContainer>
  )
}

export default DataList
