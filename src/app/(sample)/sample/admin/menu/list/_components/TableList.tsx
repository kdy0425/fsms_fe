import React, { ReactNode, useMemo } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel  } from '@mui/x-data-grid';
import { koKR } from '@mui/x-data-grid/locales/koKR';

interface Row {
  menuGroupCd: string;
  index: number;
  cdNm: string;
  cdKornNm: string;
  cdSeq: number;
  button: (qString: string, cd: { cdNm: string; cdKornNm: string }) => ReactNode;
}

interface ServerPaginationGridProps {
  rows: Row[];
  totalRows: number;
  paginationModel: GridPaginationModel;
  loading: boolean;
  onPaginationModelChange: (newPaginationModel: GridPaginationModel) => void;
  onSortModelChange: (sortModel: GridSortModel) => void; // 정렬 모델 변경 핸들러 추가
  onRowClick: (cdNm: string, cdKornNm: string) => void; // 행 클릭 핸들러 추가
  sortModel: GridSortModel; // 초기 정렬 모델 추가
}

const customLocaleText = {
  // 메뉴 텍스트 한글화
  ...koKR.components.MuiDataGrid.defaultProps.localeText,
  noRowsLabel: '조회된 데이터가 없습니다.',
  columnMenuSortAsc: '오름차순 정렬',
  columnMenuSortDesc: '내림차순 정렬',
  columnMenuFilter:'필터',
  columnMenuHideColumn: '열 숨기기',
  columnMenuShowColumns: '열 표시',
  columnMenuManageColumns: '열 설정',
  columnMenuUnsort:'정렬 해제',
  columnsManagementSearchTitle:'검색',
  columnsManagementShowHideAllText:'모두보기/숨김',
  columnsManagementReset:'초기화',
  footerRowSelected: (count:number) => ``, //`${count.toLocaleString()} 줄선택` 하단의 툴바에 표시
}
const columns: GridColDef[] = [
  { field: 'index',
    headerName: '번호',
    width: 150,
    sortable: true,
    headerAlign: 'center', 
    align: 'center',
    renderCell: (params)=> (
      <div style={{ display: 'flex', justifyContent: 'center', 
        alignItems: 'center', width: '100%', height: '100%' }}>
        <p>
          {params.row.index}
        </p>
      </div>)
  },
  { field: 'cdNm',
    headerName: '코드명',
    type: 'string',
    width: 200,
    headerAlign: 'center',  // 헤더 가운데 정렬
    align: 'center',        // 셀 내용 가운데 정렬
    sortable: true,         // 정렬 기준 사용 여부
  },
  { field: 'cdKornNm', 
    headerName: '메뉴명', 
    width: 300, 
    sortable: true,
    headerAlign: 'center', 
    align: 'center',
   },
  { field: 'cdSeq',
    headerName: '코드순서',
    width: 200,
    headerAlign: 'center', 
    align: 'center',       
    sortable: true,
  },
  { field: 'button', 
    headerName: '편집버튼', 
    width: 200 , 
    sortable: false,
    headerAlign: 'center', 
    align: 'center',
    renderCell: (params) => (
    <>
      <button 
        type='button'
        onClick={() => params.row.onRowClick(params.row.cdNm, params.row.cdKornNm)} // 클릭 시 핸들러 호출
      >
        하위 조회
      </button>
      </>)},
];

const ListTable: React.FC<ServerPaginationGridProps> = ({
  rows,
  totalRows,
  paginationModel,
  loading,
  onPaginationModelChange,
  onSortModelChange, // 정렬 모델 변경 핸들러 추가
  onRowClick, // 행 클릭 핸들러 추가
  sortModel, // 초기 정렬 모델 추가
}) => {

     // 동적으로 테이블 높이 계산
    const tableHeight = useMemo(() => {
    const rowHeight = 55; // 각 행의 높이
    const headerHeight = 56; // 헤더 높이
    const paginationHeight = 52; // 페이지네이션 높이

    // 페이지 사이즈에 따라 높이 계산
    const height = totalRows * rowHeight + headerHeight + paginationHeight;

    return height; // 높이 반환
  }, [totalRows]);
  
  return (
    <div style={{ height: tableHeight, width: '100%' }}>
      <DataGrid
        rows={rows.map((row, index) => ({
          ...row,
          onRowClick, // 각 행에 핸들러 추가
          index: index +1,
        }))}
        columns={columns} // 컬럼 설정
        paginationModel={paginationModel} //값 설정
        paginationMode="server"  // 해당 모드를 선택해야 페이지 이동을 통해 데이터를 서버에서 가져온다
        onPaginationModelChange={onPaginationModelChange} // 페이지, 사이즈 변경 함수
        rowCount={totalRows} // 총 로우수
        loading={loading} // 로딩 여부
        getRowId={(row) => row.cdNm} // 해당 행의 아이디
        initialState={{pagination: { paginationModel: { pageSize: paginationModel.pageSize } },}} // 초기 사이즈 설정값 설정
        onSortModelChange={onSortModelChange} // 정렬 모델 변경 핸들러 전달
        sortModel={sortModel} // 초기 정렬 모델 전달
        //sortingOrder={['asc','desc']} 정렬 선택
        //disableColumnSort // 모든 열의 정렬 기능 비활성화
      />
    </div>
  );
};

export default ListTable;
