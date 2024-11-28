'use client'
import React, { ReactNode } from 'react';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
import { useSearchParams } from 'next/navigation'
import { Box, Button, MenuItem } from '@mui/material';

import Breadcrumb from '@/fsm/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';

// components
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { GridSortModel } from '@mui/x-data-grid'; 
import ListTable from './_components/TableList'

import { toQueryString } from '@/utils/fsms/utils'
import { fetchList } from './actions';

import { listParamObj } from '@/types/fsms/fsm/listParamObj'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '메뉴 목록 & 상세검색',
  },
];

//select
const selectData = [
  { value: 'cdNm', label: '코드명',},
  { value: 'cdKornNm', label: '메뉴명',},
];

interface Row {
  menuGroupCd: string;
  index: number;
  cdNm: string;
  cdKornNm: string;
  cdSeq: number;
  button: (qString: string, cd: { cdNm: string; cdKornNm: string }) => ReactNode;
}

type listSearchObj = {
  sort : string,
  page : number,
  size : number,
  searchValue : string,
  searchSelect : string,
  [key: string]: string | number; // 인덱스 시그니처 추가
}

export default function MenuList() {
  
  const querys = useSearchParams(); // 쿼리스트링을 가져옴
  const allParams:listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음
  const router = useRouter();

  const [flag, setFlag] = useState<boolean>(false); //데이터 갱신을 위한 플래그 설정
  const [rows, setRows] = useState<Row[]>([]);    // 가져온 로우 데이터
  const [totalRows, setTotalRows] = useState(0);  //총 수
  const [loading, setLoading] = useState(false);  //로딩여부
  
  // paginationModel과 searchParams를 합친 상태
  const [params, setParams] = useState<listSearchObj>({
    page: Number(allParams.page?? 1) ,      // 페이지 번호는 1부터 시작
    size: Number(allParams.size?? 10) ,     // 기본 페이지 사이즈 설정
    searchValue: allParams.searchValue ?? '', //검색어
    searchSelect: allParams.searchSelect ?? 'cdNm',  // 종류
    sort: allParams.sort ?? '',     // 정렬 기준 추가
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
  

  // 플래그를 통한 데이터 갱신 - 같은 함수안에서 호출하면 이전 데이터를 가져와 갱신이 안됨
  // 플래그의 변화를 통해 현재 정보를 기준으로 데이터를 가져오기위해 설정
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
      if (response && response.resultType === 'success' && response.data) {
        setRows(response.data);
        setTotalRows(response.data.length);
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

  const handlePaginationModelChange = (newPaginationModel: { pageSize: number }) => {
    // 페이지 번호와 페이지 사이즈를 params에 업데이트
    setParams(prev => ({ 
      ...prev, 
      size: newPaginationModel.pageSize 
    }));
    setFlag(!flag)
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
      setParams(prev => ({ ...prev, [name]: value }));
  };

  // 검색시 검색 조건에 맞는 데이터 갱신 및 1페이지로 이동
  const handleAdvancedSearch = (event: React.FormEvent) => {
    event.preventDefault();
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
  // 행 클릭 시 호출되는 함수
  const handleRowClick = (cdNm: string, cdKornNm: string) => {
    router.push(`./sublist?cdNm=${cdNm}&cdKornNm=${cdKornNm}`); // 하위 메뉴 페이지 경로
  };

  return (
    <PageContainer
      title="메뉴 게시판 목록 & 상세검색"
      description="메뉴 게시판 목록 & 상세검색"
    >
      {/* breadcrumb */}
      <Breadcrumb title="메뉴 게시판 목록 & 상세검색" items={BCrumb} />
      {/* end breadcrumb */}

      {/* 테이블영역 시작 */}
      <Box sx={{ width: '100%' }}>
        <ListTable
          rows={rows} // 목록 데이터 값
          totalRows={totalRows} // 총 로우 수
          paginationModel={{ page: params.page - 1, pageSize: params.size }} // 페이지, 사이즈 초기값 설정
          loading={loading}
          onPaginationModelChange={handlePaginationModelChange} // 페이지 , 사이즈 변경 핸들러 추가
          onSortModelChange={handleSortModelChange} // 정렬 모델 변경 핸들러 추가
          onRowClick={handleRowClick} // 행 클릭 핸들러 추가
          sortModel={sortModel} // 초기 정렬 모델 설정
        />
        
      </Box>
      {/* 테이블영역 끝 */}
    </PageContainer>
  );
}