import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'
import { Row } from '../page'
import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint
} from '@/utils/fsms/common/convert'


interface DetailRentalDataGrid {
  row?: Row
}

const DetailRentalDataGrid: React.FC<DetailRentalDataGrid> = ({ row }) => {


  if (!row) return null; // row가 없을 때 null 반환

  return (



    <Grid container spacing={2} className="card-container">
      <Grid item xs={12} sm={12} md={12}>
        <BlankCard className="contents-card" title="대차정보">
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
                      차명
                    </th>
                    <td>{row?.vhclNm ??''}</td>
                    <th className="td-head" scope="row">
                      차종
                    </th>
                    <td>{row?.carmdlCdNm ?? ''}</td>
                    <th className="td-head" scope="row">
                      유형(구분)
                    </th>
                    <td>
                      {row?.typeCdNm ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                    세부유형
                    </th>
                    <td>{row?.detailTypeCdNm ?? ''}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      차대번호 
                    </th>
                    <td>{row?.vin ?? ''}</td>
                    <th className="td-head" scope="row">
                      연식
                    </th>
                    <td>
                      {formatDate(row?.yridnw) ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      최대적재량
                    </th>
                    <td>
                      {getNumtoWon(row?.maxLoadQty) ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      총중량
                    </th>
                    <td>
                      {getNumtoWon(row?.scrcarTotlWt) ?? ''}
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
  )
}

export default DetailRentalDataGrid
