import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  processDate: string // 처리일자
  reason: string // 사유
  creatorId: string // 등록자id
  createDate: string // 등록일자
  updatedId?: string // 수정자id
  updateDate?: string // 수정일자
}

const sampleContentDetailData: DetailDataType = {
  processDate: '2024-10-16',
  reason:
    '휴지 사유에 대한 내용 내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
  creatorId: '담당자A',
  createDate: '2024-10-16',
  updatedId: '담당자A',
  updateDate: '2024-10-16',
}

interface DetailDataGridProps {
  data?: DetailDataType
  onClickCancelBtn?: () => void // 말소 취소 (말소 상태인 경우에만 액션 있음)
}

const DetailDataGrid: React.FC<DetailDataGridProps> = ({
  data,
  onClickCancelBtn,
}) => {
  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12}>
        <BlankCard className="contents-card" title="상세 정보">
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '12px',
            }}
          >
            {onClickCancelBtn && (
              <Button
                variant="contained"
                color="primary"
                onClick={onClickCancelBtn}
              >
                말소취소
              </Button>
            )}
          </div>
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
                      처리일자
                    </th>
                    <td colSpan={7}>
                      {data?.processDate ?? sampleContentDetailData.processDate}
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      사유
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
