'use client'

// page.tsx
import React, { useState } from 'react';
import SearchHeaderTab from './_components/SearchHeaderTab';
import { Box } from '@mui/material';
import TexiPage from './_components/Texi/TexiPage';
import BusPage from './_components/Bus/BusPage';
import FreightPage from './_components/Freight/FreightPage';

const Page = () => {
  // 상위 컴포넌트에서 탭 상태 관리
    const [selectedTab, setSelectedTab] = useState('1');

    const handleTabChange = (newValue : string) => {
        setSelectedTab(newValue);
    };



    

    return (
        <>
        {/* SearchHeaderTab 컴포넌트에 상태와 핸들러 전달 */}
        <SearchHeaderTab value={selectedTab} onChange={handleTabChange} />
        {/* 조건부 렌더링 */}
        {selectedTab === '1' && (
            <div>
                <h2>화물 관련 정보 (추후 삭제)</h2>
                <FreightPage/>
            </div>
        )}
        {selectedTab === '2' && (
            <div>
                {/* 택시 탭에 대한 내용 */}
                <h2>택시 관련 정보(추후 삭제)</h2>
                <TexiPage/>
            </div>
        )}
        {selectedTab === '3' && (
            <div>
                {/* 버스 탭에 대한 내용 */}
                <h2>버스 관련 정보(추후 삭제)</h2>
                <BusPage/>
            </div>
        )}
        </>
    );
    };

export default Page;
