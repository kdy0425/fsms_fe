
    'use client'
import React, { useEffect, useState } from 'react'
import { Box, Grid, Button, MenuItem, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TableContainer, TableBody, TableRow, TableHead, TableSortLabel } from '@mui/material'
import { Label } from '@mui/icons-material'

import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'
import PageContainer from '@/components/container/PageContainer'
import { useRouter, useSearchParams } from 'next/navigation'
import { visuallyHidden } from '@mui/utils';

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import DetailDialog from '@/app/components/popup/DetailDialog';

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import { SelectItem } from 'select'
import { getCityCodes, getCodesByGroupNm, getLocalGovCodes } from '@/utils/fsms/common/code/getCode'
import { toQueryString } from '@/utils/fsms/utils'
import { sendHttpFileRequest, sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { ButtonGroupActionProps } from './DetailDataGrid'
import CheckBoxTableGrid from './CheckBoxTableGrid'
import FormModal from './FormModal'
import { Table } from '@mui/material'
import { TableCell } from '@mui/material'

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



export  interface Row {
    prcsYmd?: string  // 요청일자 
    chk? : string // 체크박스 
    aplySn? : string 

    locgovCd?: string; // 관할관청 코드
    locgovNm?: string; // 관할관청 명
    vonrNm?: string; // 차량소유자명
    vhclNo?: string; // 차량번호
    koiCd?: string; // 유종코드
    koiCdNm?: string; // 유종
    koiNm?:string //유종
    vhclTonCd?: string; // 톤수코드
    vhclTonCdNm?: string; // 톤수
    CRNO?: string; // 법인등록번호 (원본)
    crnoS?: string; // 법인등록번호 (복호화)
    vonrRrno?: string; // 주민등록번호 (원본)
    vonrRrnoS?: string; // 주민등록번호 (복호화)
    vonrRrnoSecure?: string; // 주민등록번호 (별표)
    lcnsTpbizCd?: string; // 업종코드
    vhclSeCd?: string; // 차량구분코드
    vhclRegYmd?: string; // 차량등록일자
    YRIDNW?: string; // 연식
    LEN?: string; // 길이
    BT?: string; // 너비
    maxLoadQty?: string; // 최대적재수량
    vhclSttsCd?: string; // 차량상태코드
    vonrBrno?: string; // 차주사업자등록번호
    vhclPsnCd?: string; // 소유구분코드
    delYn?: string; // 삭제여부
    dscntYn?: string; // 할인여부
    souSourcSeCd?: string; // 원천소스구분코드
    bscInfoChgYn?: string; // 기본정보변경여부
    locgovAprvYn?: string; // 지자체승인여부
    rgtrId?: string; // 등록자아이디
    regDt?: string; // 등록일시
    mdfrId?: string; // 수정자아이디
    mdfcnDt?: string; // 수정일시
    prcsSttsCd?: string; // 처리상태코드
    prcsSttsCdDtlNm?: string; // 처리상태 상세
    prcsSttsCdNm?: string; // 처리상태명
    handleDt?: string; // 처리일자
    rfslRsnCn?: string; // 거절사유
    reqDt?: string; // 등록일자
    dmndSeCd?: string; // 요청구분코드
    carLocgovCd?: string; // 차량의 지자체코드
    carLocgovNm?: string; // 차량의 지자체명
    crnoSecure?: string; // 법인등록번호 (별표)
    vhclTonNm?: string; // 톤수명
    lcnsTpbizNm?: string; // 면허업종명
    vhclSttsNm?: string; // 차량최종상태명
    vhclPsnNm?: string; // 차량소유구분명
    exsLocgovCd?: string; // 기존지자체코드
    exsLocgovNm?: string; // 기존지자체명
    chgLocgovCd?: string; // 변경지자체코드
    chgLocgovNm?: string; // 변경지자체명
    bzentyNm?: string; // 업체명
    processStatus?: string; // 처리상태
    ftxAsstAmt?: string; // 유류세연동보조금
    opisAmt?: string; // 유가연동보조금
    aprvAmt?: string; // 승인금액
    fuelQty?: string; // 연료량

    aplcnYmd?: string;      // 적용일자
    hstrySn?: string;       // 이력일련번호
    trsmYn?: string;        // 전송여부
    trsmDt?: string;        // 전송일시 

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


    const HistoryHeadCells: HeadCell[] = [
        {
            id: 'hstrySn',
            numeric: false,
            disablePadding: false,
            label: '연번',
        },
        {
            id: 'aplcnYmd',
            numeric: false,
            disablePadding: false,
            label: '적용일',
        },
        {
            id: 'vonrRrnoSecure',
            numeric: false,
            disablePadding: false,
            label: '주민등록번호',
        },
        {
            id: 'vonrNm',
            numeric: false,
            disablePadding: false,
            label: '소유자명',
        },
        {
            id: 'crnoS',
            numeric: false,
            disablePadding: false,
            label: '사업자등록번호',
        },
        {
            id: 'exsLocgovNm',
            numeric: false,
            disablePadding: false,
            label: '이관전 관할관청',
        },
        {
            id: 'chgLocgovNm',
            numeric: false,
            disablePadding: false,
            label: '이관후 관할관청',
        },
    ]


    interface CardHistoryProps {
    data?: Row[],
    // headCells: HeadCell[]
    }
    type order = 'asc' | 'desc';

    // 테이블 th 정의 기능에 사용하는 props 정의
    interface EnhancedTableProps {
        headCells: HeadCell[];
        onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void;
        order: order;
        orderBy: string;
    }

    // 테이블 th 정의 기능
    function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {

    const { headCells, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof []) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
        <TableRow key={'thRow'}>
            {headCells.map((headCell) => (
            <React.Fragment key={'th'+headCell.id}>
            { headCell.sortAt ?
            <TableCell
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
            <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
            >
            <div className="table-head-text">
                {headCell.label}
            </div>
            {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
                ) : null}
            </TableSortLabel>
            </TableCell>
            :
            <TableCell style={{whiteSpace:'nowrap'}}
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
            >
            <div className="table-head-text">
                    {headCell.label}
            </div>
            </TableCell>
            }
            </React.Fragment>
            ))}
            
        </TableRow>
        </TableHead>
    );
    }


    function CardHistoryTable(props: CardHistoryProps) {
    const { data } = props;
    return(
        <>
        <TableContainer>
        <Table
            sx={{ minWidth: '750px' }}
            aria-labelledby="tableTitle"
            size={'medium'}
        >
            <EnhancedTableHead 
            headCells={HistoryHeadCells} 
            onRequestSort={() => {}} 
            order={'desc'} 
            orderBy={''}        
            />
            <TableBody>
            {data?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.hstrySn || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.aplcnYmd || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.vonrRrnoSecure || ''}</TableCell>

                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.vonrNm || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.CRNO || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.exsLocgovNm || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap'    }}>{row.chgLocgovNm || ''}</TableCell>
                        </TableRow>
                    ))}

            </TableBody>
        </Table>
        </TableContainer>
        </>
    )
    }

    // 목록 조회시 필요한 조건
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


    const FreightPage = () => {

    const router = useRouter() // 화면이동을 위한객체
    const querys = useSearchParams() // 쿼리스트링을 가져옴
    const allParams: listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음
    

    const [Locflag, setLocFlag] = useState<boolean>(false) // 이관 이력 데이터 갱신을 위한 플래그 설정
    const [flag, setFlag] = useState<boolean>(false) // 데이터 갱신을 위한 플래그 설정
    const [detailflag, setDetailFlag] = useState<number>(0) // 데이터 갱신을 위한 플래그 설정

    const [confirmOpen, setConfirmOpen] = useState(false) // 다이얼로그 상태
    const [dialogContent, setDialogContent] = useState<string>('') // 다이얼로그 내용
    const [dialogActionType, setDialogActionType] = useState<string>('') // 다이얼로그 액션 타입


    const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
    const [totalRows, setTotalRows] = useState(0) // 총 수
    const [loading, setLoading] = useState(false) // 로딩여부

    // 관할관청 이관이력 조회
    const [locRows, setLocRows] = useState<Row[]>([]) // 가져온 로우 데이터
    const [locTotalRows, setLocTotalRows] = useState(0) // 총 수
    const [locLoading, setLocLoading] = useState(false) // 
    const [locOpen, setLocOpen] = useState(false) // 이관이력 Dialog 상태 



    const [cityCode, setCityCode] = useState<SelectItem[]>([])  //        시도 코드
    const [localGovCode, setLocalGovCode] = useState<SelectItem[]>([]) // 관할관청 코드
    const [prcsSttsCode, setPrcsSttsCode] = useState<SelectItem[]>([]) // 처리 상태 코드

    const [selectedRow, setSelectedRow] = useState<Row | undefined>() // 선택된 Row를 저장할 state
    const [callCheckedRow, setCallCheckedRow] = useState<Row[]>([]) // check된 Row 리스트들. 


    

    const [isModalOpen, setIsModalOpen] = useState(false);    // modal   오픈 상태 

    const [open, setOpen] = useState<boolean>(false);

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

    // 관할관청 이관이력에 관련된 pageable info
    const [locPageable, setLocPageable] = useState<pageable>({
        pageNumber: 1, // 페이지 번호는 1부터 시작
        pageSize: 10, // 기본 페이지 사이즈 설정
        sort: '', // 정렬 기준
    })


    // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
    useEffect(() => {
        console.log('change flag ~!')
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
    }, 
    [])



    // 정렬시 데이터 갱신
    const handleSortModelChange = (sort: string) => {
        // 정렬 기준을 params에 업데이트
        setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
        setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
    }

    // 행 클릭 시 호출되는 함수
    const handleRowClick = (selectedRow: Row) => {
        console.log('행클릭시 호출 함수',selectedRow)
        setSelectedRow(selectedRow);
    }

    
    // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
    const [qString, setQString] = useState<string>('')

    // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
    useEffect(() => {
        setQString(toQueryString(params))
    }, [params])


        
    useEffect(() => {
        console.log('params. ctpvCd 가 변경됨')
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
        console.log('search 버튼 클릭')
        event.preventDefault()
        setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
        setFlag(!flag)
    }


    const handleDetailSearch = (event: React.FormEvent) => {
        event.preventDefault();
        setDetailFlag((prev) => prev + 1); // 플래그 증가
    };

    // 페이지 번호와 페이지 사이즈를 params에 업데이트
    const handlePaginationModelChange = (page: number, pageSize: number) => {
        setParams((prev) => ({
            ...prev,
            page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
            size: pageSize,
            }))
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

    
 // Fetch를 통해 데이터 갱신
    const fetchData = async () => {
    setLoading(true)
    console.log('fetchData  start')
    try {
    // 검색 조건에 맞는 endpoint 생성
    let endpoint: string =
        `/fsm/stn/lttm/tr/getAllLgovTrnsfrnRequst?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.bgngDt ? '&bgngDt=' + (params.bgngDt+'').replace(/-/g, ""): ''}` +
        `${params.endDt ? '&endDt=' + (params.endDt+'').replace(/-/g, ""):''}` +
        `${params.prcsSttsCd ? '&prcsSttsCd=' + params.prcsSttsCd : ''}` 

        console.log('enpoint',endpoint)

    const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
    })
    if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시

        console.log('response.data.content',response.data.content)
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
    setRows(rowData)
    setTotalRows(rowData.length)
    setPageable({
        pageNumber: 1,
        pageSize: 10,
        sort: params.sort,
    })
    } finally {
    setLoading(false)
    }
    }


    // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
    useEffect(() => {
        fetchLocData()
    }, [!Locflag])


    //화물 이관 이력 조회
    const fetchLocData = async () => {
        console.log('이관 이력 조희 메서드 호출')
        if(selectedRow === undefined){
            console.log('selectRow가 없음.')
            return;
        }
        setLoading(true)
        console.log('fetchData  start')
        try {
        // 검색 조건에 맞는 endpoint 생성
        let endpoint: string =
            `/fsm/stn/lttm/tr/getAllLgovTrnsfrnHst?`+
            `${selectedRow.vhclNo ? '&vhclNo=' + selectedRow.vhclNo : ''}` 
            console.log('enpoint',endpoint)
        const response = await sendHttpRequest('GET', endpoint, null, true, {
            cache: 'no-store',
        })

        console.log('이관 이력 엔드포인트%%',endpoint)

        if (response && response.resultType === 'success' && response.data) {
            // 데이터 조회 성공시

            console.log(' 이관 이력 response.data.content',response.data.content)
            setLocRows(response.data.content)
            setLocTotalRows(response.data.totalElements)
            setLocPageable({
                pageNumber: response.data.pageable.pageNumber,
                pageSize: response.data.pageable.pageSize,
                sort: params.sort,
            })
        } else {
            // 데이터가 없거나 실패
            setLocRows([])
            setLocTotalRows(0)
            setLocPageable({
                pageNumber: 1,
                pageSize: 10,
                sort: params.sort,
            })
        }
        } catch (error) {
        // 에러시
        console.error('Error fetching data:', error)
        setLocRows(rowData)
        setLocTotalRows(rowData.length)
        setLocPageable({
            pageNumber: 1,
            pageSize: 10,
            sort: params.sort,
        })
        } finally {
        setLoading(false)
        }
    }



     // 데이터 수정하는 메서드
    const putData = async (row : Row, sttCode : string) => {
        setLoading(true)
        console.log('fetchData  start')
        try {
        // 검색 조건에 맞는 endpoint 생성
        let endpoint: string =
            `/fsm/stn/lttm/tr/updateLgovTrnsfrnRequst`
        const response = await sendHttpRequest('PUT', endpoint, {
            vhclNo: row.vhclNo,
            exsLocgovCd: row.exsLocgovCd,
            chgLocgovCd: row.chgLocgovCd,
            aplySn: row.aplySn,
            prcsSttsCd: sttCode,
        }, true, {
            cache: 'no-store',
        })
        if (response && response.resultType === 'success') {
            // 데이터 조회 성공시
            console.log('response.data.content',response.resultType)
            return 'success'

        } else {
            // 데이터가 없거나 실패
            return 'failed'
        }
        } catch (error) {
        // 에러시
        console.error('Error fetching data:', error)
        return 'failed'
        } finally {
        setLoading(false)
        }
    }

        // 승인/거절/취소 버튼 클릭 시 다이얼로그 오픈
    const handleActionClick = (row: Row, actionType: string) => {
        setSelectedRow(row) // 선택한 Row 설정
        setDialogActionType(actionType)

        // 다이얼로그에 표시할 내용을 설정합니다.
        switch (actionType) {
        case 'approve':
            setDialogContent('관할관청 이관을 승인 하시겠습니까?')
            break
        case 'decline':
            setDialogContent('관할관청 이관을 거절 하시겠습니까?')
            break
        case 'cancel':
            setDialogContent('관할관청 전입요청을 취소 하시겠습니까??')
            break
        default:
            break
        }
        setConfirmOpen(true) // 다이얼로그 오픈
    }



    const handleCloseLocDialog = () =>{
        setLocOpen(false)
    }

    // 확인 다이얼로그에서 확인 버튼을 누를 때 승인 요청 처리
    // 확인 다이얼로그에서 확인 버튼을 누를 때 데이터 수정 처리
    const handleConfirm = async () => {
        if (!selectedRow) return

        let sttCode = ''
        switch (dialogActionType) {
        case 'approve':
            sttCode = '02' // 승인 코드
            break
        case 'decline':
            sttCode = '03' // 거절 코드
            break
        case 'cancel':
            sttCode = '04' // 취소 코드
            break
        default:
            break
        }

        // 승인(02) 거절(03) 이면서 요청수신(01) 이 아닐 경우 
        // 취소(04) 이면서 요청발신(02) 이 아닐 경우 
        if(!(((sttCode ==='02' ||sttCode ==='03')  
            && selectedRow.dmndSeCd === '01') || (sttCode ==='04' 
        && selectedRow.dmndSeCd === '02'))){
            alert('올바른 요청이 아닙니다.')
            return;
        }

        console.log(sttCode)
        console.log(selectedRow.dmndSeCd)

        setLoading(true)
        try {
        const result = await putData(selectedRow, sttCode)

        if (result === 'success') {
            alert('요청이 성공적으로 처리되었습니다.')
        } else {
            alert('요청 처리에 실패했습니다.')
        }

        setFlag((prev) => !prev) // 데이터 갱신을 위한 플래그 토글
        } catch (error) {
        console.error('Error processing data:', error)
        alert('요청 중 오류가 발생했습니다.')
        } finally {
        setLoading(false)
        setConfirmOpen(false) // 다이얼로그 닫기
        }
    }



    // 상세정보에 있는 Button actions
    const buttonGroupActions: ButtonGroupActionProps = {

        // 체크 박스 선택된 행 전체 승인
        onClickApporveAllBtn: function (rows : Row[]): void {

            //01 == 요청  / 요청이 아닌 경우가 있을 때 필터링
            const invalidRows = rows.filter(row => row.dmndSeCd !== '01');
            
            //승인 요청 취소
            if (invalidRows.length > 0) {
                alert('승인할 수 없는 항목이 포함되어 있습니다. \n 요청수신 상태만 승인 일괄요청 가능합니다.');
                return;
            }

            rows.map((row) =>  { putData(row,'02')})
            setFlag((prev) => !prev)
        },

        // 체크 박스 선택된 행 전체 거절 
        onClickDeclineAllBtn: function (rows : Row[]): void {

            //01 == 요청  / 요청이 아닌 경우가 있을 때 필터링
            const invalidRows = rows.filter(row => row.dmndSeCd !== '01');
            
            //거절 요청 취소
            if (invalidRows.length > 0) {
                alert('거절할 수 없는 항목이 포함되어 있습니다. \n 요청수신 상태만 거절 일괄요청 가능합니다. ');
                return;
            }
    
            rows.map((row) =>  { putData(row,'03')})
            setFlag((prev) => !prev)
        },

        // 승인 버튼 클릭 시 다이얼로그 오픈
        onClickApproveBtn: async function (row: Row): Promise<void> {
            handleActionClick(row, 'approve')
        },

        // 거절 버튼 클릭 시 다이얼로그 오픈
        onClickDeclineBtn: async function (row: Row): Promise<void>  {
            handleActionClick(row, 'decline')
        },
        // 취소 버튼 클릭 시 다이얼로그 오픈
        onClickCancelBtn: async function (row: Row): Promise<void>  {
            handleActionClick(row, 'cancel')
        },
        onClickCheckMoveCenterHistoryBtn: function (row: Row): void {
            setSelectedRow(row)
            console.log('이관 이력 버튼 클릭 했음')
            setLocFlag((prev) => !prev)
            console.log('이관 useEffect 플래그 수정')
            setLocOpen(true)
            console.log('이관 이력 모달 오픈 ')
        },
    }

        const handleCloseConfirm = () => {
            setConfirmOpen(false);
        };


    const excelDownload = async () => {
        try {
        let endpoint: string =
        `/fsm/stn/lttm/tr/getExcelLgovTrnsfrnRequst?page=${params.page - 1}&size=${params.size}` +
        `${params.sort ? '&sort=' + sortChange(params.sort) : ''}` +
        `${params.locgovCd ? '&locgovCd=' + params.locgovCd : ''}` +
        `${params.vhclNo ? '&vhclNo=' + params.vhclNo : ''}` +
        `${params.bgngDt ? '&bgngDt=' + params.bgngDt : ''}` +
        `${params.endDt ? '&endDt=' + params.endDt : ''}` +
        `${params.prcsSttsCd ? '&prcsSttsCd=' + params.prcsSttsCd : ''}` 
    
        const response = await sendHttpFileRequest('GET', endpoint, null, true, {
            cache: 'no-store',
        })
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'test.xlsx');
        document.body.appendChild(link);
        link.click();
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
        <PageContainer
        title="지자체이관전입관리" description="지자체이관전입관리 페이지">
        {/* breadcrumb */}
        <Breadcrumb title="지자체이관전입관리" items={BCrumb} />
        {/* end breadcrumb */}

         {/* 검색영역 시작 */}
        <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
            <Box className="sch-filter-box">
                <div className="filter-form">
                    <div className="form-group">
                    <CustomFormLabel className="input-label-display" htmlFor="ft-ctpvCd">
                    <span className="required-text" >*</span>시도명
                    </CustomFormLabel>
                    <select
                        id="ft-ctpvCd"
                        className="custom-default-select"
                        name='ctpvCd'
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
                    <CustomFormLabel className="input-label-display" htmlFor="ft-locgovCd">
                    <span className="required-text" >*</span>관할관청
                    </CustomFormLabel>
                    <select
                        id="ft-locgovCd"
                        className="custom-default-select"
                        name="locgovCd"
                        value={params.locgovCd}
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
                        htmlFor="ft-vhclNo"
                    >
                        차량번호
                    </CustomFormLabel>
                    <CustomTextField  
                    name="vhclNo"               
                        style={{ width: '50%' }}
                        value={params.vhclNo ?? ''}
                        onChange={handleSearchChange}  type="text" id="ft-vhclNo" fullWidth />
                    </div>
                </div>
                <hr></hr> 
                {/* 신청일자 datePicker */}
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
                    <CustomFormLabel className="input-label-display" htmlFor="ft-prcsSttsCode">
                        처리상태
                    </CustomFormLabel>
                    <select
                        id="ft-prcsSttsCode"
                        className="custom-default-select"
                        name="prcsSttsCd"
                        value={params.prcsSttsCd ?? ''}
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
            </Box>
                <Box className="table-bottom-button-group">
                    <div className="button-right-align">
                        <Button type="submit" variant="contained" color="primary">
                            조회
                        </Button>
                        <FormModal
                            size={'lg'}
                            buttonLabel="신규"
                            title="전입등록"
                            isOpen={open}
                            setOpen={setOpen}
                            />
                        <Button onClick={() => excelDownload()} variant="contained" color="primary">
                            엑셀
                        </Button>
                    </div>
                </Box>
        </Box>

        <DetailDialog 
            title= '관할관청 이관 이력'
            isOpen={locOpen}
            handleClickClose={handleCloseLocDialog}
            size={'xl'}
            children={<CardHistoryTable data={locRows} />} 
        />
        {/* 검색영역 끝 */}

        {/* 확인 다이얼로그 */}
        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
            <DialogTitle>관할관청 이관</DialogTitle>
            <DialogContent>
                <DialogContentText>{dialogContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirm} color="primary">
                취소
                </Button>
                <Button onClick={handleConfirm} color="primary">
                확인
                </Button>
            </DialogActions>
        </Dialog>

        {/* 테이블영역 시작 */}

        <CheckBoxTableGrid
            headCells={headCells} // 테이블 헤더 값
            rows={rows} // 목록 데이터
            totalRows={totalRows} // 총 로우 수

            locRows={locRows}
            locTotalRows={locTotalRows}
            locPageable={locPageable}
        

            loading={loading}
            detailBtnGroupActions={buttonGroupActions}
            onRowClick={handleRowClick} // 행 클릭 핸들러 추가
            onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
            onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
            pageable={pageable} // 현재 페이지 / 사이즈 정보
        />
        {/* 테이블영역 끝 */}
        </PageContainer>
    )
    }

    export default FreightPage
