import React, { ReactNode, useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridRenderCellParams } from '@mui/x-data-grid';
import { koKR } from '@mui/x-data-grid/locales/koKR';
import {Button, MenuItem, CustomSelect, FormControlLabel, RadioGroup, FormGroup, CustomTextField} from '@/utils/fsms/fsm/mui-imports'
import { FormControl, FormHelperText, Radio} from '@mui/material';
import { FieldConfig, FormErrors } from '@/types/form';
import { useForm } from '@/store/useForm';
import { CodeObj } from '@/app/(no-layout)/(fsm)/user/signup/_types/CodeObjList';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import { MenuAuthrt } from '@/types/fsms/admin/menuListData';
import { validateField } from '@/utils/fsms/common/validation';
import EditableCell from './EditableCell';

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

interface ServerPaginationGridProps {
  rows: Row[];
  totalRows: number;
  paginationModel: GridPaginationModel;
  loading: boolean;
  onPaginationModelChange: (newPaginationModel: GridPaginationModel) => void;
  onSortModelChange: (sortModel: GridSortModel) => void;
  sortModel: GridSortModel;
  editingId: string | null;
  handleEditClick: (menuTsid: string) => void;
  handleSaveClick: (menuTsid: string) => void;
  onCancelClick: () => void;
  editedRow: Row | null;
  setEditedRow: React.Dispatch<React.SetStateAction<Row | null>>;
  onInputChange: (field: keyof Row, value: any) => void;
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

const TableList: React.FC<ServerPaginationGridProps> = ({
rows,
totalRows,
paginationModel,
loading,
onPaginationModelChange,
onSortModelChange,
sortModel,
editingId,
handleEditClick,
handleSaveClick,
onCancelClick,
editedRow,
onInputChange,
}) => {
const tableHeight = useMemo(() => {
  const rowHeight = 55;
  const headerHeight = 56;
  const paginationHeight = 52;
  return totalRows * rowHeight + headerHeight + paginationHeight;
}, [totalRows]);

//MAA001이 아닐때 CdList reset
useEffect(() => {
  if (editedRow && editedRow.menuAcsAuthrtCd !== 'MAA001') {
    if (editedRow.userTypeCds.length > 0) {
      onInputChange('userTypeCds', []);
    }
  }
}, [editedRow, onInputChange]);

const fieldConfig: FieldConfig[] = [
  { name: 'menuNm', label: '메뉴명', type: 'text', validation: { required: true, minLength: 3, maxLength: 200}},
  { name: 'urlAddr', label: 'URL주소', type: 'text', validation: { required: true, min: 1, max: 2000 }},
  { name: 'menuSeq', label: '메뉴순서', type: 'number', validation: { required: true, min: 1 }},
  { name: 'menuTypeCd', label: '메뉴유형', type: 'select', validation: { required: true }},
  { name: 'httpDmndMethNm', label: 'HTTP요청메소드명', type: 'select', validation: { required: true }},
  { name: 'menuAcsAuthrtCd', label: '메뉴접근권한코드', type: 'select', validation: { required: true }},
  { name: 'npagYn', label: '새창여부', type: 'select', validation: { required: true }},
];
const formRef = useRef<HTMLFormElement | null>(null);
const { getInputProps} = useForm(fieldConfig, formRef);
const [errors, setErrors] = useState<FormErrors>({});

//setErrors 초기화
const resetErrors = () => {
  setErrors({});
};

const handleSubmit = useCallback(
  (onSubmit: (data: Row) => void | Promise<void>) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (editingId && editedRow) {
        const newErrors = validateForm(editedRow, fieldConfig);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          try {
            await onSubmit(editedRow);
          } catch (error) {
            console.error('Form submission error:', error);
          }
        }
      }
    },
  [editingId, editedRow, fieldConfig]
);

const validateForm = (data: Row, fields: FieldConfig[]): FormErrors => {
  const errors: FormErrors = {};
  fields.forEach(field => {
    const value = data[field.name as keyof Row];
    if (field.validation) {
      let error: string | null = null;

      if (field.type === 'checkbox') {
        // checkbox 타입일 경우 배열로 처리
        error = validateField(value as string[], field.validation, field);
      } else {
        error = validateField(value as FormDataEntryValue, field.validation, field);
      }

      if (error) {
        errors[field.name] = error;
      }
    }
  });
  return errors;
};

/* 메뉴유형 코드, 접근권한 코드, 사용자 유형 호출 useEffect() */
interface CodeListResponse {
  data: CodeObj[];
}
const [menuTypeCodeList, setMenuTypeCodeList] = React.useState<CodeListResponse>({ data: [] });
const [menuAcsAuthrtCodeList, setMenuAcsAuthrtCodeList] = React.useState<CodeListResponse>({ data: [] });
const [userTypeCodeList, setUserTypeCodeList] = useState<{ data: CodeObj[] }>({ data: [] });

  useEffect(() => {
    const cdGroupNms = ['menu_type_cd', 'menu_acs_authrt_cd', 'user_type_cd'];
    const getCodeObjLists = async () => {
      try {
        const results = await Promise.all(cdGroupNms.map(async (cdGroupNm) => {
          const response = await fetch('/api/common/code/cds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cdGroupNm: cdGroupNm,
              upCdNms: cdGroupNm === 'user_type_cd' ? 'USR002' : '',
            }),
          });
          return await response.json();
        }));
        
      results.forEach((data, index) => {
        if (data.resultType === 'error') {
          alert(`Error for ${cdGroupNms[index]}: ${data.message}`);
        } else {
          switch(cdGroupNms[index]) {
            case 'menu_type_cd':
              setMenuTypeCodeList(data); 
              break;
            case 'menu_acs_authrt_cd':
              setMenuAcsAuthrtCodeList(data); 
              break;
            case 'user_type_cd':
              setUserTypeCodeList(data);
              break;
            }
        }
      });
    } catch (error) {
      console.error('Error fetching code lists:', error);
    }
  };
  getCodeObjLists();
  }, []);

  const selectHttpData = [
  { value: 'GET', label: 'GET',},
  { value: 'POST', label: 'POST',},
  { value: 'PUT', label: 'PUT',},
  { value: 'DELETE', label: 'DELETE',},];

const renderEditableCell = useCallback((params: GridRenderCellParams, fieldName: keyof Row) => {
  return (
    <EditableCell
      params={params}
      fieldName={fieldName}
      editingId={editingId}
      editedRow={editedRow}
      errors={errors}
      onInputChange={onInputChange}
      getInputProps={getInputProps}
      fieldConfig={fieldConfig}
      menuTypeCodeList={menuTypeCodeList}
      menuAcsAuthrtCodeList={menuAcsAuthrtCodeList}
      userTypeCodeList={userTypeCodeList}
      selectHttpData={selectHttpData}
    />
  );
}, [editingId, editedRow, onInputChange, errors, menuTypeCodeList, menuAcsAuthrtCodeList]);

const onEditClick = useCallback((menuTsid: string) => {
  resetErrors(); // 에러 상태 초기화
  handleEditClick(menuTsid); // 부모 컴포넌트의 handleEditClick 호출
}, [handleEditClick, resetErrors]);

const columns: GridColDef[] = [
  { 
    field: 'menuTypeCd', 
    headerName: '메뉴유형', 
    width: 130, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: true,
    renderCell: (params) => renderEditableCell(params, 'menuTypeCd'),
  },
  { 
    field: 'menuNm', 
    headerName: '메뉴명', 
    width: 150, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: true,
    renderCell: (params) => renderEditableCell(params, 'menuNm'),
  },
  { 
    field: 'httpDmndMethNm', 
    headerName: '요청메소드명', 
    width: 100, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: false,
    renderCell: (params) => renderEditableCell(params, 'httpDmndMethNm'),
  },
  { 
    field: 'menuAcsAuthrtCd', 
    headerName: '메뉴접근권한', 
    width: 120, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: true,
    renderCell: (params) => renderEditableCell(params, 'menuAcsAuthrtCd'),
  },
  {
    field: 'userTypeCd',
    headerName: '회원유형', 
    width: 180,
    headerAlign: 'center', 
    align: 'center', 
    sortable: true,
    renderCell: (params) => renderEditableCell(params, 'userTypeCds'),    
  },
  { 
    field: 'urlAddr', 
    headerName: 'url주소', 
    width: 150, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: false,
    renderCell: (params) => renderEditableCell(params, 'urlAddr'),
  },
  { 
    field: 'npagYn', 
    headerName: '새창', 
    width: 190, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: true,
    renderCell: (params) => renderEditableCell(params, 'npagYn'),
  },
  { field: 'menuSeq', 
    headerName: '메뉴순서', 
    width: 150, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: true,
    renderCell: (params) => renderEditableCell(params, 'menuSeq'),
  },
  { 
    field: 'button', 
    headerName: '편집버튼', 
    width: 100, 
    sortable: false,
    headerAlign: 'center', 
    align: 'center',
    renderCell: (params) => {
      const isEditing = params.row.menuTsid === editingId;
      if (isEditing) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button 
                   onClick={handleSubmit(() => handleSaveClick(params.row.menuTsid))}
                  variant="contained"
                  color="primary"
                  size="small">저장</Button>
               <Button onClick={onCancelClick} variant="outlined" color="secondary" size="small">취소</Button>
          </div>
        );
      }
      return (
        <Button 
          onClick={() => onEditClick(params.row.menuTsid)}
          aria-label="수정">
          수정
        </Button>
      );
    },
  },
];

return (
  <div style={{ width: '100%'}}>
    <DataGrid
      rows={rows}
      columns={columns}
      paginationModel={paginationModel}
      paginationMode="server"
      onPaginationModelChange={onPaginationModelChange}
      rowCount={totalRows}
      loading={loading}
      hideFooter
      getRowId={(row) => row.menuTsid}
      localeText={customLocaleText}
      initialState={{pagination: { paginationModel: { pageSize: paginationModel.pageSize } }}}
      onSortModelChange={onSortModelChange}
      sortModel={sortModel}
      rowHeight={150} // 기본 행 높이 설정
      sx={{
        '& .MuiDataGrid-cell': {
          display: 'flex',
          whiteSpace: 'normal', // 줄바꿈 허용
          lineHeight: '1.5', // 줄 간격 조정
          justifyContent: 'center', //가로 가운데 정렬
          alignItems: 'center', // 세로 가운데 정렬
        },
      }}
    />
  </div>
);
};

export default TableList;