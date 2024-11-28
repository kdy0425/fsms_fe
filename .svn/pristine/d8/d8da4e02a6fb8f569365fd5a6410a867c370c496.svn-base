
    'use client'
import React, { useEffect, useState } from 'react'
import { Box, Grid, Button, MenuItem, Stack } from '@mui/material'
import { Label } from '@mui/icons-material'

import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'
import PageContainer from '@/components/container/PageContainer'
import { useRouter, useSearchParams } from 'next/navigation'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'


// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import { SelectItem } from 'select'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { toQueryString } from '@/utils/fsms/utils'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { ButtonGroupActionProps } from './Freight/DetailDataGrid'
import CheckBoxTableGrid from './Freight/CheckBoxTableGrid'

    const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: '기준관리',
    },
    {
        title: '자격관리',
    },
    {
        to: '/stn/lttm',
        title: '지자체이관전입관리',
    },
    ]



    export interface Row {
    id: number
    requestDate?: string // 요청일자
    ownerIdBuisnessNumber?: string // 주민사업자번호
    companyName?: string // 업체명
    carNumber?: string // 차량번호
    transferOutOffice?: string // 전출관청
    transferInOffice?: string // 전입관청
    processStatus?: string // 처리상태
    }

    const headCells: HeadCell[] = [
    {
        id: 'requestDate',
        numeric: false,
        disablePadding: false,
        label: '요청일자',
    },
    {
        id: 'ownerIdBuisnessNumber',
        numeric: false,
        disablePadding: false,
        label: '주민사업자번호',
    },
    {
        id: 'companyName',
        numeric: false,
        disablePadding: false,
        label: '업체명',
    },
    {
        id: 'carNumber',
        numeric: false,
        disablePadding: false,
        label: '차량번호',
    },
    {
        id: 'transferOutOffice',
        numeric: false,
        disablePadding: false,
        label: '전출관청',
    },
    {
        id: 'transferInOffice',
        numeric: false,
        disablePadding: false,
        label: '전입관청',
    },
    {
        id: 'processStatus',
        numeric: false,
        disablePadding: false,
        label: '처리상태',
    },
    ]

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


    const rowData: Row[] = []

    // 상세정보에 있는 Button actions
    const buttonGroupActions: ButtonGroupActionProps = {
    onClickApporveAllBtn: function (): void {
        alert('일괄승인 버튼 눌림')
    },
    onClickDeclineAllBtn: function (): void {
        alert('일괄거절 버튼 눌림')
    },
    onClickApproveBtn: function (): void {
        alert('승인 버튼 눌림')
    },
    onClickDeclineBtn: function (): void {
        alert('거절 버튼 눌림')
    },
    onClickCancelBtn: function (): void {
        alert('취소 버튼 눌림')
    },
    onClickCheckMoveCenterHistoryBtn: function (): void {
        alert('관할관청 버튼 눌림')
    },
    }

    const BusPage = () => {
    const router = useRouter() // 화면이동을 위한객체
    const querys = useSearchParams() // 쿼리스트링을 가져옴
    const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음


    const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
    const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
    const [totalRows, setTotalRows] = useState(0) // 총 수
    const [loading, setLoading] = useState(false) // 로딩여부

    const [cityCode, setCityCode] = useState<SelectItem[]>([])  //        시도 코드
    const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([]) // 관할관청 코드
    const [prcsSttsCode, setPrcsSttsCode] = useState<SelectItem[]>([]) // 처리 상태 코드


    const [city, setCity] = useState('서울')
    const [authority, setAuthority] = useState('강남구')
    const [carNumber, setCarNumber] = useState('')
    const [date, setDate] = useState('2024-10-16')

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



    // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
    useEffect(() => {
        fetchData()
    }, [flag])
    
    
    // 조건 검색 변환 매칭
    const sortChange = (sort: String): String => {
        if (sort && sort != '') {
        let [field, sortOrder] = sort.split(',') // field와 sortOrder 분리하여 매칭
        if (field === 'regYmd') field = 'regDt' // DB -> regDt // DTO -> regYmd ==> 매칭 작업
        return field + ',' + sortOrder
        }
        return ''
    }

    // Fetch를 통해 데이터 갱신
    const fetchData = async () => {
        setLoading(true)
        try {
        // 검색 조건에 맞는 endpoint 생성
        let endpoint: string =
            `/fsm/stn/osi/tr/opratStopInfo?page=${params.page - 1}&size=${params.size}` +
            `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
            `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
            `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` 


        const response = await sendHttpRequest('GET', endpoint, null, true, {
            cache: 'no-store',
        })
        if (response && response.resultType === 'success' && response.data) {
            // 데이터 조회 성공시

            setRows(response.data.content)
            setTotalRows(response.data.totalElements)
            setPageable({
            pageNumber: response.data.pageable.pageNumber,
            pageSize: response.data.pageable.pageSize,
            sort: params.sort,
            })
        } else {
            // 데이터가 없거나 실패
            setRows([])
            setTotalRows(0)
            setPageable({
            pageNumber: 1,
            pageSize: 10,
            sort: params.sort,
            })
        }
        } catch (error) {
        // 에러시
        console.error('Error fetching data:', error)
        setRows([])
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


    // 초기 데이터 로드
    useEffect(() => {
        setFlag(!flag)

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

        let prcsSttsCodes: SelectItem[] = [
        {
            label: '전체',
            value: '',
        },
        ]

        // 시도명 select item setting
        getCityCodes().then((res) => {
        if (res) {
            res.map((code: any) => {
            let item: SelectItem = {
                label: code['locgovNm'],
                value: code['ctpvCd'],
            }

            cityCodes.push(item)
            })
        }
        setCityCode(cityCodes)
        })

        // 관할관청 select item setting
        getLocalGovCodes().then((res) => {
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


        // 처리상태 코드 
        getCodesByGroupNm('038').then((res) => {
        let itemArr:SelectItem[] = []
        if(res) {
            res.map((code: any) => {
            let item: SelectItem = {
                label: code['cdKornNm'],
                value: code['cdNm'],
            }

            prcsSttsCodes.push(item)
            })
        }
        setPrcsSttsCode(prcsSttsCodes);
        });
    }, [])

        // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
        const [qString, setQString] = useState<string>('')

        // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
        useEffect(() => {
        setQString(toQueryString(params))
        }, [params])
    
    
        useEffect(() => {
        let locgovCodes: SelectItem[] = [
            {
            label: '전체',
            value: '',
            },
        ]
    
        // 관할관청 select item setting
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

        // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
        const handleAdvancedSearch = (event: React.FormEvent) => {
        event.preventDefault()
        setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
        setFlag(!flag)
        }


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
    
    return (
        <PageContainer
        title="지자체이관전입관리"
        description="지자체이관전입관리 페이지"
        >
        {/* breadcrumb */}
        <Breadcrumb title="지자체이관전입관리" items={BCrumb} />
        {/* end breadcrumb */}


        <Box className="sch-filter-box">
            <div className="form-list">
            <div className="filter-form">
                <div className="form-group">
                <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                <span className="required-text" >*</span>시도명
                </CustomFormLabel>
                <select
                    id="ft-city-select-01"
                    className="custom-default-select"
                    value={params.ctpvCd}
                    onChange={handleSearchChange}
                    style={{ width: '50%' }}
                >
                    { cityCode.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                <span className="required-text" >*</span>관할관청
                </CustomFormLabel>
                <select
                    id="ft-city-select-01"
                    className="custom-default-select"
                    name="locgovCd"
                    value={authority}
                    onChange={handleSearchChange}
                    style={{ width: '50%' }}
                >
                    {localGovCode.map((option) => (
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
                    차량번호
                </CustomFormLabel>
                <CustomTextField  name="vhclNo"               
                    style={{ width: '50%' }}
                    value={params.vhclNo ?? ''}
                    onChange={handleSearchChange}  type="text" id="ft-vhclNo" fullWidth />
                </div>
            </div>

            {/* 신청일자 datePicker */}
            <hr></hr>
            <div className="filter-form">
            <div className="form-group">
                    <CustomFormLabel className="input-label-display">
                    신청일자
                    </CustomFormLabel>
                    <CustomFormLabel className="input-label-none" htmlFor="ft-date-start">신청 시작일</CustomFormLabel>
                    <CustomTextField  type="date" id="ft-date-start" name="bgngDt" value={params.bgngDt} onChange={handleSearchChange} fullWidth />
                    ~ 
                    <CustomFormLabel className="input-label-none" htmlFor="ft-date-end">신청종료일</CustomFormLabel>
                    <CustomTextField type="date" id="ft-date-end" name="endDt" value={params.endDt} onChange={handleSearchChange} fullWidth />
                </div>
                <div className="form-group">
                <CustomFormLabel className="input-label-display" htmlFor="ft-ton">
                    처리상태
                </CustomFormLabel>
                <select
                    id="ft-city-select-01"
                    className="custom-default-select"
                    name="prcsSttsCode"
                    value={params.prcsSttsCode ?? ''}
                    onChange={handleSearchChange}
                    style={{ width: '50%' }}
                >
                    {prcsSttsCode.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>
            </div>
            </div>
        </Box>

        {/* 검색영역 끝 */}

        <Grid style={{ marginBottom: '8px' }}>
            <Box className="table-bottom-button-group">
            <div className="button-right-align">
                <Button variant="contained" color="primary">
                조회
                </Button>
                <Button variant="contained" color="primary">
                신규
                </Button>
                <Button variant="contained" color="primary">
                엑셀
                </Button>
            </div>
            </Box>
        </Grid>
        {/* 검색영역 끝 */}

        {/* 테이블영역 시작 */}

        {/* <CheckBoxTableGrid
            headCells={headCells}
            rowData={rowData}
            totalRows={rowData.length}
            loading={loading}
            detailBtnGroupActions={buttonGroupActions}
        /> */}
        {/* 테이블영역 끝 */}
        </PageContainer>
    )
    }

    export default BusPage
