import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  crno?: string //법인등록번호
  bzentyNm?: string // 업체명
  rprsvNm?: string // 대표자명?
  telno?: string // 전화번호
  addr?: string // 주소
}

const sampleContentDetailData: DetailDataType = {
  crno: '110111-345401',
  bzentyNm: '(주)거승',
  rprsvNm: '김학준',
  telno: '010-2222-2222',
  addr: '강남대로 12길 8',
}

interface DetailDataGridProps {
  data?: DetailDataType
}

const BrnoDetailDataGrid: React.FC<DetailDataGridProps> = ({ data }) => {
  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12} sm={12} md={12}>
        <BlankCard className="contents-card" title="사업자정보">
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
                      법인등록번호
                    </th>
                    <td>{data?.crno ?? sampleContentDetailData.crno}</td>
                    <th className="td-head" scope="row">
                      업체명
                    </th>
                    <td>
                      {data?.bzentyNm ?? sampleContentDetailData.bzentyNm}
                    </td>
                    <th className="td-head" scope="row">
                      대표자명
                    </th>
                    <td>{data?.rprsvNm ?? sampleContentDetailData.rprsvNm}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      전화번호
                    </th>
                    <td>{data?.telno ?? sampleContentDetailData.telno}</td>
                    <th className="td-head" scope="row">
                      주소
                    </th>
                    <td colSpan={3}>
                      {data?.addr ?? sampleContentDetailData.addr}
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

export default BrnoDetailDataGrid
