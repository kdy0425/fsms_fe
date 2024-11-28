import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

import { Row } from './BsPage';
import { dateTimeFormatter, getDateTimeString, brNoFormatter, getCommaNumber} from '@/utils/fsms/common/util';

interface DetailProps {
  data: Row;
}

const BsDetailGrid: React.FC<DetailProps> = ({data}) => {
  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12} sm={12} md={12}>
        <>
          {/* 테이블영역 시작 */}
          <div className="table-scrollable">
            <table className="table table-bordered">
              <caption>상세 내용 시작</caption>
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th className="td-head" scope="row">
                    차량번호
                  </th>
                  <td>
                    {data.vhclNo}
                  </td>
                  <th className="td-head" scope="row">
                    휴지시작일
                  </th>
                  <td>
                    {getDateTimeString(data.pauseBgngYmd, 'date')?.dateString}
                  </td>
                  <th className="td-head" scope="row">
                    휴지종료일
                  </th>
                  <td colSpan={3}>
                    {getDateTimeString(data.pauseEndYmd, 'date')?.dateString}
                  </td>
                </tr>
                <tr>
                  <th className="td-head" scope="row">
                    휴지사유
                  </th>
                  <td colSpan={7}>
                    {data.pauseRsnCn}
                  </td>
                </tr>
                <tr>
                  <th className="td-head" scope="row">
                    등록자아이디
                  </th>
                  <td>
                    {data.rgtrId}
                  </td>
                  <th className="td-head" scope="row">
                    등록일자
                  </th>
                  <td>
                    {getDateTimeString(data.regDt, 'date')?.dateString}
                  </td>
                  <th className="td-head" scope="row">
                    수정자아이디
                  </th>
                  <td>
                    {data.mdfrId}
                  </td>
                  <th className="td-head" scope="row">
                    수정일자
                  </th>
                  <td>
                    {getDateTimeString(data.mdfcnDt, 'date')?.dateString}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 테이블영역 끝 */}
        </>
      </Grid>
    </Grid>
  )
}

export default BsDetailGrid
