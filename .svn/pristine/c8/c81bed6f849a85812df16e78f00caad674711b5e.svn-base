import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  vhclNo: string // 차량번호
  ownerNm: string // 소유자명
  brno: string // 사업자등록번호
  rrno: string // 주민등록번호
  crno: string // 법인등록번호
  price: string // 체납환수금액
  bgngAplcnYmd: string // 시행일자
  reason: string // 등록사유

  creatorId: string // 등록자id
  createDate: string // 등록일자
  updatedId?: string // 수정자id
  updateDate?: string // 수정일자
}

const sampleContentDetailData: DetailDataType = {
  vhclNo: '서울00바0000',
  ownerNm: '홍길동',
  brno: '000-00-0000',
  rrno: '901012-1******',
  crno: '000000-0******',
  price: '1,000,000',
  bgngAplcnYmd: '2024-10-11',
  reason: '부정수급환수금 체납으로 인한 향후 지급될 보조금에서 차감되도록 등록',
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
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th className="td-head" scope="row">
                      차량번호
                    </th>
                    <td>{data?.vhclNo ?? sampleContentDetailData.vhclNo}</td>
                    <th className="td-head" scope="row">
                      소유자명
                    </th>
                    <td>{data?.ownerNm ?? sampleContentDetailData.ownerNm}</td>
                    <th className="td-head" scope="row">
                      사업자등록번호
                    </th>
                    <td>{data?.brno ?? sampleContentDetailData.brno}</td>
                    <th className="td-head" scope="row">
                      주민등록번호
                    </th>
                    <td>{data?.rrno ?? sampleContentDetailData.rrno}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      법인등록번호
                    </th>
                    <td>{data?.crno ?? sampleContentDetailData.crno}</td>
                    <th className="td-head" scope="row">
                      체납환수금액
                    </th>
                    <td>{data?.price ?? sampleContentDetailData.price}</td>
                    <th className="td-head" scope="row">
                      시행일자
                    </th>
                    <td>
                      {data?.bgngAplcnYmd ??
                        sampleContentDetailData.bgngAplcnYmd}
                    </td>
                    <th className="td-head" scope="row" />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      등록사유
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
