'use client'
import React, {ReactNode, useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { GridSortModel } from '@mui/x-data-grid'
import TableList from './_components/TableList'
import { fetchList, updateMenuData } from './actions'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { MenuAuthrt } from '@/types/fsms/admin/menuListData'
import { Breadcrumb, PageContainer, Box, Button,} from '@/utils/fsms/fsm/mui-imports'
import { toQueryString, useMessageActions, getMessage,} from '@/utils/fsms/fsm/utils-imports'
import { ApiError, getCombinedErrorMessage } from '@/types/message'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '하위 메뉴 목록 & 상세검색',
  },
];

interface Row {
  menuGroupCd: string;
  index: number;
  menuNm: string;
  menuExpln: string;
  httpDmndMethNm: string;
  menuTypeCd: string;
  urlAddr: string;
  cdSeq: number;
  npagYn: string;
  menuTsid: string;
  menuAcsAuthrtCd: string;
  menuSeq: string;
  userTypeCds: string[];
  menuAuthrts?: MenuAuthrt[];
  button: (qString: string, cd: { menuTsid: string;}) => ReactNode;
}

type listSearchObj = {
  sort : string,
  page : number,
  size : number,
  searchValue : string,
  searchSelect : string,
  [key: string]: string | number; // 인덱스 시그니처 추가
}

export default function MenuSublist() {
  
  const querys = useSearchParams(); // 쿼리스트링을 가져옴
  const allParams:listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음
  const router = useRouter();
  const [flag, setFlag] = useState<boolean>(false); //데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]);    // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0);  //총 수
  const [loading, setLoading] = useState(false);  //로딩여부
  const { setMessage } = useMessageActions();
  
  // paginationModel과 searchParams를 합친 상태
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page?? 1) ,      // 페이지 번호는 1부터 시작
    size: Number(allParams.size?? 10) ,     // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', //검색어
    searchSelect: allParams.searchSelect ?? 'menuNm',  // 종류
    sort: allParams.sort ?? '',     // 정렬 기준 추가
    cdNm: allParams.cdNm ?? '',
    cdKornNm: allParams.cdKornNm ?? '',
    });

  // 정렬 모델 초기화 객체
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // 쿼리스트링을 읽어 초기 데이터 로드
  useEffect(() => {
    if (allParams.sort) {
      let [field, sortOrder] = allParams.sort.split(','); // 쿼리에서 field와 sortOrder 분리
      if(field === 'regDt') field = 'regYmd'; // DB -> regDt // DTO -> regYmd ==> 매칭 작업
      setSortModel([{ field, sort: sortOrder as 'asc' | 'desc' }]); // 정렬 모델 설정
    }
    setParams(prev => ({ ...prev, sort: params.sort })); // 
    setFlag(!flag)
  }, []);

  useEffect(() => {
    fetchData();
  }, [flag]);

  const [qString, setQString] = useState<string>('');   // 검색 조건을 쿼리스트링으로 변환하기 위한 객체

  // 검색 조건이 변경되면 자동으로 쿼리스트링 변경
  useEffect(()=>{
  setQString(toQueryString(params))
  },[params])

  // Fetch를 통해 데이터 갱신
  const fetchData = async () => {
    setLoading(true);
    try {
      // API에 전달할 때는 page를 0 기반으로 변환
      const response = await fetchList({ 
        ...params, 
        page: params.page - 1 // API에 전달할 페이지 번호 (0부터 시작)
      }); 
      if (response && response.resultType === 'success') {
        const formatteData = response.data.map((row: Row) => { 
          const userTypeCds = row.menuAuthrts ? row.menuAuthrts.map(auth => auth.userTypeCd) : [];
          return {
            ...row,
            userTypeCds
          }
        })
        console.log('FormatteData:', formatteData)
        setRows(formatteData);
        setTotalRows(formatteData.length);
      } else {
        console.error('Invalid data structure:', response);
        setRows([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRows([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  //sublist에서 inline으로 수정을 위한 함수들
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Row | null>(null);

  const handleEditClick = (menuTsid: string) => {
    setEditingId(menuTsid);
    const rowToEdit = rows.find(row => row.menuTsid === menuTsid);
    if (rowToEdit) {
      setEditedRow({ ...rowToEdit, userTypeCds: rowToEdit.userTypeCds });
    }
  };
  
  const handleInputChange = (field: keyof Row, value: any) => {
    setEditedRow(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleSaveClick = async (menuTsid: string) => {
    
    if (editingId && editedRow) {
      try {
        const response = await updateMenuData(editingId, editedRow);
        if (response.success) {
          setMessage(getMessage('update.success'));
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.menuTsid === menuTsid ? {...row, ...editedRow} : row
            )
          )
          setEditingId(null);
          setEditedRow(null);
        } 
      } catch (error) {
        if (error instanceof ApiError) {
          switch (error.resultType) {
            case 'fail':
              //유효성검사 오류
              setMessage({
                resultType: error.resultType,
                status: error.status,
                message: getCombinedErrorMessage(error),
              });
              break;
            case 'error':
              // 'error'는 서버 측 오류
              setMessage({
                resultType: 'error',
                status: error.status,
                message: error.message});
              break;
          }
        } 
      }
    }
  };
  
  const handleCancelClick = () => {
    setEditingId(null);
    setEditedRow(null);
  };

  const handlePaginationModelChange = (newPaginationModel: { pageSize: number }) => {
    // 페이지 번호와 페이지 사이즈를 params에 업데이트
    setParams(prev => ({ 
      ...prev, 
      size: newPaginationModel.pageSize 
    }));
    setFlag(!flag)
  };

  // 정렬시 데이터 갱신
  const handleSortModelChange = (model: GridSortModel) => {
    // 정렬 기준을 params에 업데이트
    if (model.length > 0) {
      const { field, sort } = model[0];
       // 정렬 필드 이름 매핑
      const mappedField = field === 'regYmd' ? 'regDt' : field;
      setParams(prev => ({ ...prev, sort: `${mappedField},${sort}` })); // 예: "ttl,asc"
      setSortModel(model); // 정렬 모델 업데이트
    } else {
      setParams(prev => ({ ...prev, sort: '' })); // 정렬 해제
      setSortModel([]); // 정렬 모델 초기화
    }
    setFlag(!flag) // 정렬 기준이 변경되었으므로 데이터 재조회
  };

  // 글쓰기 페이지로 이동하는 함수
  const handleWriteClick = () => {
    router.push(`./create${qString}`); // '/create'는 글쓰기 페이지의 경로입니다.
  };
  //상위 메뉴 목록으로 이동하는 함수
  const handleUpListClick = () => {
    router.push(`/sample/admin/menu/list`);
  };

  return (
    <PageContainer
      title={`${allParams.cdKornNm} 목록 & 상세검색`}
      description={`${allParams.cdKornNm} 목록 & 상세검색`}
    >
      {/* breadcrumb */}
      <Breadcrumb title={`${allParams.cdKornNm} 목록 & 상세검색`} items={BCrumb} />
      {/* end breadcrumb */}

      {/* 테이블영역 시작 */}
      <Box sx={{height: 'auto' ,width: '100%' }}>
        <TableList
          rows={rows} // 목록 데이터 값
          totalRows={totalRows} // 총 로우 수
          paginationModel={{ page: params.page - 1 , pageSize: params.size}} // 페이지, 사이즈 초기값 설정
          loading={loading}
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          sortModel={sortModel} // 초기 정렬 모델 설정
          editingId={editingId}  // row 수정 menuTsid
          handleEditClick={handleEditClick}  // row 수정 버튼
          handleSaveClick={handleSaveClick}  // row 수정 저장 버튼
          onCancelClick={handleCancelClick}  // row 수정 취소 버튼
          editedRow={editedRow}  // 수정할 row
          setEditedRow={setEditedRow}
          onInputChange={handleInputChange}  // row value change
        />
      </Box>
      <Box className="table-bottom-button-group">
          <div className="button-right-align">
              <Button variant="contained" color="primary"
              onClick={handleWriteClick}
              >
                등록
              </Button>
              <Button variant="contained" color="primary"
              onClick={handleUpListClick}
              >
                상위메뉴
              </Button>
          </div>
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  );
}