import React, { useEffect, useState } from 'react';

import {
  Box,
  FormControlLabel,
  Grid,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// MUI 그리드 한글화 import
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { HeadCell } from 'table';
import { Row } from '../page';


import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint
} from '@/utils/fsms/common/convert'
import BlankCard from '@/app/components/shared/BlankCard';
import { CustomRadio } from '@/utils/fsms/fsm/mui-imports';
type SupportedLocales = keyof typeof locales;

// 페이지 정보
type pageable = {
  pageNumber : number,
  pageSize : number,
  sort : string
}

// 테이블 caption
const tableCaption :string = '전국표준한도관리 목록'




// 검색 결과 건수 툴바
function TableTopToolbar(props:Readonly<{totalRows:number}>) {
  return (
    <div className="data-grid-top-toolbar">
      <div className="data-grid-search-count">
        검색 결과 <span className="search-count">{props.totalRows}</span>건
      </div>
    </div>
  );
}

// TableDataGrid의 props 정의
interface DetailDataGridProps {
  row?: Row; // row 속성을 선택적 속성으로 변경
}

type order = 'asc' | 'desc';

const DetailDataGrid: React.FC<DetailDataGridProps> = ({
  row,
}) => {
  // if (!row) return null; // row가 없을 때 null 반환

  const [selectedIndex, setSelectedIndex] = useState<number | null>();

  // MUI 그리드 한글화
  const locale : SupportedLocales ='koKR';
  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );
  
  return (
    <Grid container spacing={2} className="card-container">
    <Grid item xs={12} sm={12} md={12}>
      <BlankCard className="contents-card" title="상세 정보">
        <>
          {/* 테이블영역 시작 */}
          <div className="table-scrollable">
            <table className="table table-bordered">
              <caption>상세 내용 시작</caption>
              <colgroup>
                <col style={{whiteSpace:'nowrap', width: 'auto' }} />
                <col style={{whiteSpace:'nowrap', width: 'auto' }} />
                <col style={{whiteSpace:'nowrap', width: 'auto' }} />
                <col style={{whiteSpace:'nowrap', width: 'auto' }} />
                <col style={{whiteSpace:'nowrap', width: 'auto' }} />
                <col style={{whiteSpace:'nowrap', width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    차량번호
                  </th>
                  <td>
                    {row?.vhclNo}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    소유자명
                  </th>
                  <td>
                    {row?.vonrNm}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    주민등록번호
                  </th>
                  <td>
                    {row?.vonrRrno}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    사업자등록번호
                  </th>
                  <td>
                    {formBrno(row?.vonrBrno)}
                  </td>
                </tr>
                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    당시 유종
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    당시 톤수
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    패턴
                  </th>
                  <td colSpan={3}>
                    {row?.chgRsnCn}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    부정수급 거래 기간
                  </th>
                  <td colSpan={7}>
                    {formatDate(row?.bgngYmd)}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    거래건수
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    거래금액
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    부정수급건수
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    부정수급액
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    유가보조금
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    환수할금액
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    환수한일자
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    환수한금액
                  </th>
                  <td>
                    {row?.chgRsnCn}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    업종
                  </th>
                  <td>
                    {row?.rgtrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    법인/개인
                  </th>
                  <td>
                    {formatDate(row?.regDt)}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    직영여부
                  </th>
                  <td>
                    {row?.mdfrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    업종구분
                  </th>
                  <td>
                    {formatDate(row?.mdfcnDt)}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}} rowSpan={3}>
                    행정처분
                  </th>
                  <td colSpan={2}>
                    <RadioGroup
                      row
                      id="chk"
                      className="mui-custom-radio-group"
                      value="01"
                    >
                      <FormControlLabel
                        control={<CustomRadio id="chk_01" name="chk" value="01" />}
                        label="진행중"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="해당없음"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="행정상제재"
                      />
                    </RadioGroup>
                  </td>

                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    조치일
                  </th>
                  <td colSpan={4}>
                    {formatDate(row?.regDt)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <RadioGroup
                      row
                      id="chk"
                      className="mui-custom-radio-group"
                      value="01"
                    >
                      <FormControlLabel
                        control={<CustomRadio id="chk_01" name="chk" value="01" />}
                        label="환수"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="환수안함"
                      />
                    </RadioGroup>
                  </td>

                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    환수금액
                  </th>
                  <td colSpan={4}>
                    {formatDate(row?.regDt)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={7}>
                  <RadioGroup
                      row
                      id="chk"
                      className="mui-custom-radio-group"
                      value="01"
                    >
                      <FormControlLabel
                        control={<CustomRadio id="chk_01" name="chk" value="01" />}
                        label="환수만"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="처분 유예"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="지급정지 6개월"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="지급정지 1년"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="감차"
                      />
                    </RadioGroup>
                  </td>
                </tr>
                
                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    조사내용 및 행정처분사유
                  </th>
                  <td colSpan={7}>
                    {formatDate(row?.bgngYmd)}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    행정처분 시작일
                  </th>
                  <td>
                    {row?.rgtrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    행정처분 종료일
                  </th>
                  <td>
                    {formatDate(row?.regDt)}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                  </th>
                  <td>
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                  </th>
                  <td>
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    주유소 공모,가담 여부
                  </th>
                  <td>
                    {row?.rgtrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    주유소명
                  </th>
                  <td>
                    {formatDate(row?.regDt)}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    사업자등록번호
                  </th>
                  <td>
                    {row?.mdfrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    불법구조변경여부
                  </th>
                  <td>
                    {formatDate(row?.mdfcnDt)}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    적발방법
                  </th>
                  <td>
                    {row?.rgtrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    기타
                  </th>
                  <td>
                    {formatDate(row?.regDt)}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    규정 위반 조항
                  </th>
                  <td>
                    {row?.mdfrId}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    기타
                  </th>
                  <td>
                    {formatDate(row?.mdfcnDt)}
                  </td>
                </tr>

                <tr>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    합동점검여부
                  </th>
                  <td>
                    <RadioGroup
                      row
                      id="chk"
                      className="mui-custom-radio-group"
                      value="01"
                    >
                      <FormControlLabel
                        control={<CustomRadio id="chk_01" name="chk" value="01" />}
                        label="예"
                      />
                      <FormControlLabel
                        control={<CustomRadio id="chk_02" name="chk" value="02" />}
                        label="아니오"
                      />
                    </RadioGroup>
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    합동점검차시
                  </th>
                  <td>
                    {formatDate(row?.regDt)}
                  </td>
                  <th className="td-head" scope="row" style={{whiteSpace:'nowrap',}}>
                    부정수급유형
                  </th>
                  <td colSpan={3}>
                    {row?.mdfrId}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 테이블영역 끝 */}
        </>
      </BlankCard>
    </Grid>
  </Grid>
    
  );
};

export default DetailDataGrid;
