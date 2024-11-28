'use client'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TvIcon from '@mui/icons-material/Tv'; // 최상위 루트 아이콘

import PageContainer from '@/components/container/PageContainer'
import { Breadcrumb } from '@/utils/fsms/fsm/mui-imports'

// utils
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { toQueryString } from '@/utils/fsms/utils'

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'

import TableDataGrid from './_components/TableDataGrid'

// types
import FormDialog from '@/app/components/popup/FormDialog'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { HeadCell } from 'table'
import ModalContent from './_components/ModalContent'
import { SelectItem } from 'select'
import { getCodesByGroupNm } from '@/utils/fsms/common/code/getCode'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '시스템관리',
  },
  {
    title: '메뉴관리',
  },
  {
    to: '/sup/menu',
    title: '메뉴관리',
  },
]

const tonData = [
  {
    value: '01',
    label: '1톤이하',
  },
  {
    value: '03',
    label: '3톤이하',
  },
  {
    value: '05',
    label: '5톤이하',
  },
  {
    value: '08',
    label: '8톤이하',
  },
  {
    value: '10',
    label: '10톤이하',
  },
]

const fuelData = [
  {
    value: 'L',
    label: 'LPG',
  },
  {
    value: 'M',
    label: '경유',
  },
]

//트리 구조의 메뉴 
type MenuItem = {
  id?: string;
  label?: string;
  hasChildren?: boolean;
  children?: MenuItem[];

  menuTsid?:string;   //메뉴ID
  menuNm?:string;     //메뉴명
  upMenuTsid?: string;//상위메뉴
  urlAddr?: string; //URL주소
  menuSeq?: string; // 메뉴순서
  menuExpln?: string;  //메뉴설명
  npagYn?: string; // 새창여부
  httpDmndMethNm?: string;// HTTP요청메소드명

};
// API로 부터 받는 urlAddr의 경로중에서 /fsm,   /** 를 제거해서 올바른 경로를 매핑하기 우
function cleanUrl(url: string): string {
  return url.replace('/fsm', '').replace('/**', '');
}

//menu ------>  MenuitemsType로 바꾸기 위한 함수
function convertRowToMenuitemsType(menu: Menu): MenuItem {
  return {
    id: menu.menuTsid,
    label: menu.menuNm,
    hasChildren: (menu.children && menu.children.length >0 ),
    children: (menu.children && menu.children.length >0 ) ? menu.children.map(convertRowToMenuitemsType) : undefined,
    // 최상위 메뉴 인지  판단하는 기준  upMenuTsid가 없으면 된다. 
    menuTsid: menu.menuTsid,
    menuNm: menu.menuNm,
    upMenuTsid:menu.upMenuTsid,
    urlAddr:menu.urlAddr,
    menuSeq:menu.menuSeq,
    menuExpln:menu.menuExpln,
    npagYn:menu.npagYn,
    httpDmndMethNm:menu.httpDmndMethNm,
  };
}


const headCells: HeadCell[] = [
  {
    id: 'vhclTonCd',
    numeric: false,
    disablePadding: false,
    label: '톤수',
  },
  {
    id: 'koiCd',
    numeric: false,
    disablePadding: false,
    label: '유종',
  },
  {
    id: 'crtrAplcnYmd',
    numeric: false,
    disablePadding: false,
    label: '고시기준일',
  },
  {
    id: 'crtrYear',
    numeric: false,
    disablePadding: false,
    label: '기준년도',
  },
  {
    id: 'avgUseLiter',
    numeric: false,
    disablePadding: false,
    label: '월지급기준량(L)',
  },
  {
    id: 'limUseRt',
    numeric: false,
    disablePadding: false,
    label: '한도비율(%)',
  },
  {
    id: 'crtrLimLiter',
    numeric: false,
    disablePadding: false,
    label: '한도리터(L)',
  },
]



export interface Row {
  // id:string;
  vhclTonCd?: string // 톤수
  koiCd?: string // 유종
  crtrAplcnYmd?: string // 고시기준일
  crtrYear?: string // 기준년도
  avgUseLiter: string // 월지급기준량
  limUseRt?: string // 한도비율
  crtrLimLiter?: string // 한도리터
}

// 메뉴 리스트들 
export interface Menu {
  children?: Menu[];      // 하위 메뉴 
  menuTsid?: string;      // 메뉴ID   
  menuNm?: string;        // 메뉴명   
  upMenuTsid?: string;    // 상위메뉴
  urlAddr?: string;       //  URL 주소 
  menuSeq?: string;       // 메뉴 순서
  useYn?: string;         // 사용 여부
  menuExpln?: string;     //메뉴 설명
  npagYn?: string;        //새창여부 
  httpDmndMethNm?: string;// Http 요청 메서드명 
}

const rowData: Row[] = [
]

// 목록 조회시 필요한 조건
type listSearchObj = {
  sort: string
  page: number
  size: number
  searchValue: string
  searchSelect: string
  searchStDate: string
  searchEdDate: string
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
  const [menus, setMenus] = useState<Menu[]>([]) // 가져온 메뉴 데이터
  const [rows, setRows] = useState<Row[]>([]) // 가져온 로우 데이터
  const [menuItem, setMenuItem] = useState<MenuItem[]>([]) // 가져온 로우 데이터

  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [loading, setLoading] = useState(false) // 로딩여부
  const [httpMethodItems, setHttpMethodItems] = useState<SelectItem[]>([]);
  const [npagYnItems, setNpagYnItems] = useState<SelectItem[]>([]);

  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>();




  // 목록 조회를 위한 객체 (쿼리스트링에서 조건 유무를 확인 하고 없으면 초기값 설정)
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page ?? 1), // 페이지 번호는 1부터 시작
  size: Number(allParams.size ?? 10), // 기본 페이지 사이즈 설정
  searchValue: allParams.searchValue ?? '', // 검색어
  searchSelect: allParams.searchSelect ?? 'ttl', // 종류
  searchStDate: allParams.searchStDate ?? '', // 시작일
  searchEdDate: allParams.searchEdDate ?? '', // 종료일
  sort: allParams.sort ?? '', // 정렬 기준 추가
  // 여기에 추가된 필드들은 빈 문자열로 초기화해 줍니다.
  upMenuTsid: allParams.upMenuTsid ?? '',
  menuSeq: allParams.menuSeq ?? '',
  menuNm: allParams.menuNm ?? '',
 // httpDmndMethNm: allParams.httpDmndMethNm ?? '',
  urlAddr: allParams.urlAddr ?? '',
 // npagYn: allParams.npagYn ?? '',
  menuExpln: allParams.menuExpln ?? '',
  })
  //
  const [pageable, setPageable] = useState<pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 10, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  const [ton, setTon] = useState('1톤이하')
  const [fuel, setFuel] = useState('L')
  const [date, setDate] = useState('2024-10-15')

  const handleTonChange = (event: any) => {
    setTon(event.target.value)
  }

  const handleFuelChange = (event: any) => {
    setFuel(event.target.value)
  }

  const handleDateChange = (event: any) => {
    setDate(event.target.value)
  }



  // 모달 내에서 트리 항목을 더블 클릭 시 (상위 메뉴 값만 업데이트하고 모달 닫기)
  const handleDoubleClickMenuFromModal = (event: React.MouseEvent,menu: MenuItem) => {
    event.stopPropagation(); // 이벤트 전파를 막음
    console.log(menu);
    setParams((prev) => ({
      ...prev,
      upMenuTsid: menu.menuTsid ?? '', // 상위 메뉴 ID만 업데이트
    }));
    handleCloseModal(); // 메뉴 선택 후 모달 닫기
  };



  // 원하는 신규 내용을 받으려고 세팅한다. 
  const handleClickNew = () =>{

    //선택된 메뉴 없애기
    setSelectedMenuItem(null);

    //Params 값 초기화 
    setParams({
      ...params, // 이전 값을 유지
      upMenuTsid:'',            //상위메뉴
      menuSeq: '',                  // 메뉴순서
      menuNm: '',                    // 메뉴명
      httpDmndMethNm:  '',    // HTTP 요청 메서드명 
      urlAddr: '',                  // URL 주소 
      npagYn: '',                    // 새창여부 
      menuExpln: '',              // 메뉴설명
      // 다른 필드들도 이전 상태에서 유지합니다.
    });

  }






const renderTree = (nodes: MenuItem, depth: number = 0, fromModal: boolean = false) => (
  <TreeItem
    key={nodes.id}
    nodeId={nodes.id as string}
    label={
      <Box display="flex" alignItems="center">
        {nodes.hasChildren ? (
          <FolderIcon sx={{ color: '#FFD700', marginRight: 1 }} /> // 폴더 아이콘
        ) : (
          <InsertDriveFileIcon sx={{ color: '#E0E0E0', marginRight: 1, borderRadius: '4px' }} /> // 파일 아이콘
        )}
        {nodes.label}
      </Box>
    }
    onClick={() => {
      if (!fromModal) handleSelectMenu(nodes); // 모달이 아닌 경우에만 handleClickMenu 실행
    }}
    onDoubleClick={(event) => {
      if (fromModal) handleDoubleClickMenuFromModal(event,nodes); // 모달에서 더블 클릭 시 handleDoubleClickMenuFromModal 실행
    }}    
    icon={null} // icon 속성을 비워둠
    sx={{ paddingLeft: depth * 2 }}
  >
    {nodes.children && nodes.children.map((node) => renderTree(node, depth + 1, fromModal))}
  </TreeItem>
);



  // 플래그를 통한 데이터 갱신
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
  useEffect(() => {
    fetchData()
  }, [flag])

  // 초기 데이터 로드
  useEffect(() => {
    setFlag(!flag)
    // HTTP요청메소드 코드그룹 세팅
    getCodesByGroupNm('787').then((res) => {
      if(res) {
        let httpMethodCodes: SelectItem[] = [];

        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm']
          } 

          httpMethodCodes.push(item);
        })

        setHttpMethodItems(httpMethodCodes);
      }
    })

    // 사용여부 코드그룹 세팅
    getCodesByGroupNm('116').then((res) => {
      if(res) {
        let npagYnCodes: SelectItem[] = [];

        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm']
          } 

          npagYnCodes.push(item);
        })
        setNpagYnItems(npagYnCodes);
      }
    })
  }, [])

  // 검색 조건을 쿼리스트링으로 변환하기 위한 객체
  const [qString, setQString] = useState<string>('')

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(() => {
    setQString(toQueryString(params))
  }, [params])


  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setParams((prev) => ({...prev, [name]: value}));
  }

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    
    setLoading(true)
    try {
      // 검색 조건에 맞는 endpoint 생성
      let endpoint: string =
        `/fsm/sym/fmm/cm/getAllFsmMenu`

      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      if (response && response.resultType === 'success' && response.data) {

        console.log(response.data);
        // 데이터를 저장 
        setMenus(response.data);
        setMenuItem(response.data.map((menu: Menu) => convertRowToMenuitemsType(menu)));
        //데이터를 Tree구조 형식에 맞게 변환 

      } else {
        // 데이터가 없거나 실패
        console.error('No Menu System data found or request failed');
      }
    } catch (error) {
      // 에러시
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 페이지 이동 감지 시작 //

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setParams((prev) => ({ ...prev, page: 1 })) // 첫 페이지로 이동
    setFlag(!flag)
  }

  // 페이지 번호와 페이지 사이즈를 params에 업데이트
  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setParams((prev) => ({
      ...prev,
      page: page + 1, // 실제 DB에서 조회시 -1을 하므로 +1 추가해서 넘겨야함. 페이지는 1로 보이지만 DB에선 0으로 조회
      size: pageSize,
    }))
    setFlag(!flag)
  }

  // 정렬시 데이터 갱신
  const handleSortModelChange = (sort: string) => {
    // 정렬 기준을 params에 업데이트
    setParams((prev) => ({ ...prev, sort: sort })) // 예: "ttl,asc"
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  }

  // 행 클릭 시 호출되는 함수
  const handleRowClick = (postTsid: string) => {
    router.push(`./view/${postTsid}${qString}`) // 조회 페이지 경로
  }

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
    if (name === 'searchStDate' || name === 'searchEdDate') {
      const otherDateField =
        name === 'searchStDate' ? 'searchEdDate' : 'searchStDate'
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

    if (changedField === 'searchStDate') {
      return changedDate <= otherDate
    } else {
      return changedDate >= otherDate
    }
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


  const [openModal, setOpenModal] = useState(false);

  // 메뉴 조회 모달 열기
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // 메뉴 조회 모달 닫기
  const handleCloseModal = () => {
    setOpenModal(false);
  };


  // 메뉴 선택 시 데이터 세팅
  const handleSelectMenu = (menu: MenuItem) => {
    setSelectedMenuItem(menu);
    setParams((prev) => ({
      ...prev,
      upMenuTsid: menu.upMenuTsid ?? '',
      menuSeq: menu.menuSeq ?? '',
      menuNm: menu.menuNm ?? '',
      httpDmndMethNm: menu.httpDmndMethNm ?? '',
      urlAddr: menu.urlAddr ?? '',
      npagYn: menu.npagYn ?? '',
      menuExpln: menu.menuExpln ?? '',
    }));
    handleCloseModal(); // 메뉴 선택 후 모달 닫기
  };

  

  return (
    <PageContainer title="메뉴관리" description="메뉴관리">
      {/* breadcrumb */}
      <Breadcrumb title="메뉴관리" items={BCrumb} />
      {/* end breadcrumb */}



      {/* 검색영역 시작 */}
      <Box component="form" onSubmit={handleAdvancedSearch} sx={{ mb: 2 }}>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button onClick={handleClickNew} variant="contained" color="primary">
              신규
            </Button>
            <Button variant="contained" color="primary">
              저장
            </Button>
            <Button variant="contained" color="primary">
              수정
            </Button>
            <Button variant="contained" color="primary">
              삭제
            </Button>
          </div>
        </Box>
      </Box>
      {/* 검색영역 시작 */}


  {/* Flex 컨테이너를 사용하여 TreeView와 Table을 가로로 배치 */}
  <Box sx={{ display: 'flex', gap: 2, p: 2 }}>


  <Box sx={{ flex: 1, border: '1px solid lightgray', p: 2 }}>
  <TreeView
    aria-label="menu-tree"
    defaultCollapseIcon={<RemoveIcon />} // - 아이콘
    defaultExpandIcon={<AddIcon />} // + 아이콘
    sx={{ height: 'auto', flexGrow: 1, maxWidth: 400, overflowY: 'auto', border: '1px solid lightgray', p: 1 }}
  >
    {menuItem.map((menu) => renderTree(menu))}
  </TreeView>


      {/* Other components like Table, Button, etc. */}
    </Box>

      <Box sx={{ flex: 1, border: '1px solid lightgray', p: 2 }}>

      <TableContainer>
          <Table>
            <TableBody>
            <TableRow>
              <TableCell className='table-title-column' style={{minWidth:'300px', width:'25%'}}>
                <span className="required-text">*</span>상위메뉴
              </TableCell>
              <TableCell colSpan={2}>
                <CustomTextField name="upMenuTsid" value={params.upMenuTsid} onChange={handleParamChange} required fullWidth />
              </TableCell>
              <TableCell >
                <Button onClick={handleOpenModal} variant="contained" color="primary">
                  메뉴조회
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column' style={{minWidth:'300px', width:'25%'}}>
                <span className="required-text">*</span>메뉴순서
              </TableCell>
              <TableCell colSpan={3}>
                <CustomTextField name="menuSeq" value={params.menuSeq} onChange={handleParamChange} required fullWidth />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column' style={{minWidth:'300px', width:'25%'}}>
                <span className="required-text">*</span>메뉴명
              </TableCell>
              <TableCell colSpan={3}>
                <CustomTextField name="menuNm" value={params.menuNm} onChange={handleParamChange} required fullWidth />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className='table-title-column'>
              <span className="required-text" >*</span>HTTP요청메소드명
              </TableCell>
              <TableCell colSpan={3}>
                <select
                  name="httpDmndMethNm"
                  className="custom-default-select"
                  style={{width:'100%'}}
                  value={params.httpDmndMethNm} // 추가
                  onChange={handleParamChange} // 추가
                >
                  {httpMethodItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column' >
                <span className="required-text" >*</span>URL주소
              </TableCell>
              <TableCell colSpan={2}>
                <CustomTextField name="urlAddr" value={params.urlAddr} onChange={handleParamChange} required fullWidth />
              </TableCell>
              <TableCell >
                <Button variant="contained" color="primary">
                프로그램조회
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column'>
              새창여부
              </TableCell>
              <TableCell 
              colSpan={3} >
                <select
                  name="npagYn"
                  className="custom-default-select"
                  style={{width:'100%'}}
                >
                  {npagYnItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column'>
                메뉴설명
              </TableCell>
              <TableCell colSpan={3}>
                <CustomTextField 
                  name="menuExpln" 
                  value={params.menuExpln} 
                  multiline
                  minRows={4} // 원하는 초기 줄 수
                  onChange={handleParamChange} 
                  style={{width:'100%'}}
                />
              </TableCell>
            </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      {/* 테이블영역 끝 */}
      </Box>

      {/* <Box className="table-bottom-button-group">
          <div className="button-right-align">
              <Button variant="contained" color="primary"
              onClick={handleWriteClick}
              >
                등록
              </Button>
          </div>
      </Box> */}

     {/* 모달 컴포넌트 */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>메뉴 선택</DialogTitle>
        <DialogContent>
          <TreeView
            aria-label="menu-tree-modal"
            defaultCollapseIcon={<RemoveIcon />}
            defaultExpandIcon={<AddIcon />}
            sx={{ height: 'auto', flexGrow: 1, maxWidth: 400, overflowY: 'auto', border: '1px solid lightgray', p: 1 }}
          >
            {menuItem.map((menu) => renderTree(menu, 0, true))} {/* fromModal 플래그를 true로 설정 */}
          </TreeView>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default DataList
