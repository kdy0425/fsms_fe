import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  carNumber: string
  ownerName: string
  ownerIdNumber: string
  buisnessNumber: string
  startDate: string
  endDate: string
  reason: string
  creatorId: string
  createDate: string
  updatedId?: string
  updateDate?: string
}

const sampleContentDetailData: DetailDataType = {
  carNumber: '서울00바0000',
  ownerName: '홍길동',
  ownerIdNumber: '890303-222222',
  buisnessNumber: '123-456-789-00',
  startDate: '2024-10-16',
  endDate: '2024-10-16',
  reason:
    '휴지 사유에 대한 내용 내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
  creatorId: '담당자A',
  createDate: '2024-10-16',
  updatedId: '담당자A',
  updateDate: '2024-10-16',
}

interface DetailDataGridProps {
  data?: DetailDataType
}

const DetailDataGrid: React.FC<DetailDataGridProps> = ({ data }) => {
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
                      {data?.carNumber ?? sampleContentDetailData.carNumber}
                    </td>
                    <th className="td-head" scope="row">
                      소유자명
                    </th>
                    <td>
                      {data?.ownerName ?? sampleContentDetailData.ownerName}
                    </td>
                    <th className="td-head" scope="row">
                      사업자등록번호
                    </th>
                    <td>
                      {data?.buisnessNumber ??
                        sampleContentDetailData.buisnessNumber}
                    </td>
                    <th className="td-head" scope="row">
                      주민등록번호
                    </th>
                    <td>
                      {data?.ownerIdNumber ??
                        sampleContentDetailData.ownerIdNumber}
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      휴지시작일
                    </th>
                    <td>
                      {data?.startDate ?? sampleContentDetailData.startDate}
                    </td>
                    <th className="td-head" scope="row">
                      휴지종료일
                    </th>
                    <td colSpan={5}>
                      {data?.endDate ?? sampleContentDetailData.endDate}
                    </td>
                  </tr>

                  <tr>
                    <th className="td-head" scope="row">
                      휴지사유
                    </th>
                    <td colSpan={7}>
                      {data?.reason ?? sampleContentDetailData.reason}
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      등록자아이디
                    </th>
                    <td>
                      {data?.creatorId ?? sampleContentDetailData.creatorId}
                    </td>
                    <th className="td-head" scope="row">
                      등록일자
                    </th>
                    <td>
                      {data?.createDate ?? sampleContentDetailData.createDate}
                    </td>
                    <th className="td-head" scope="row">
                      수정자아이디
                    </th>
                    <td>
                      {data?.updatedId ?? sampleContentDetailData.updatedId}
                    </td>
                    <th className="td-head" scope="row">
                      수정일자
                    </th>
                    <td>
                      {data?.updateDate ?? sampleContentDetailData.updateDate}
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

export default DetailDataGrid
