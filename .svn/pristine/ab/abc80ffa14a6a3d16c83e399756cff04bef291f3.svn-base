import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  vhclNo?: string // 차량번호
  locgovNm?: string // 관할관청
  vonrNm?: string // 소유자명
  rrno?: string // 주민등록번호
  brno?: string // 사업자등록번호
  rfidYn?: '개인' | '법인' | string // 차량소유구분
  koiCd?: string // 유종
  tons?: string // 톤수

  vhclSeCd?: '일반화물' | string // 면허업종
  vhclFinalStatus?: '정상' | string // 차량최종상태

  requestDate?: string // 요청일자
  transferOutOffice?: string // 전출관청
  transferInOffice?: string // 전입관청

  processStatus?: '요청' | string // 처리상태
  processDate?: string // 처리일자
  declineReason?: string // 거절사유

  creatorId: string // 등록자id
  createDate: string // 등록일자
  updatedId?: string // 수정자id
  updateDate?: string // 수정일자
}

const sampleContentDetailData: DetailDataType = {
  vhclNo: '서울 00바1234',
  locgovNm: '서울 강남구',
  vonrNm: '홍길동',
  rrno: '940920-188378',
  brno: '000-00-000000',
  rfidYn: '법인',
  koiCd: '경유',
  tons: '1톤이하',
  vhclSeCd: '일반화물',
  vhclFinalStatus: '정상',
  requestDate: '2024-09-22',
  transferOutOffice: '서울 영등포구',
  transferInOffice: '서울 강남구',
  processStatus: '요청',
  processDate: '2024-10-16',
  declineReason: '',
  creatorId: '담당자A',
  createDate: '2024-10-16',
  updatedId: '담당자A',
  updateDate: '2024-10-16',
}

interface DetailDataGridProps {
  data?: DetailDataType
  btnActions?: ButtonGroupActionProps
}

export interface ButtonGroupActionProps {
  onClickApporveAllBtn: () => void // 일괄승인 버튼 action
  onClickDeclineAllBtn: () => void // 일괄거절 버튼 action
  onClickApproveBtn: () => void // 승인 버튼 action
  onClickDeclineBtn: () => void // 거절 버튼 action
  onClickCancelBtn: () => void // 취소 버튼 action
  onClickCheckMoveCenterHistoryBtn: () => void // 관할관청 이관이력 버튼 action
}

const DetailDataGrid: React.FC<DetailDataGridProps> = ({
  data,
  btnActions,
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
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={btnActions?.onClickApporveAllBtn}
            >
              일괄승인
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={btnActions?.onClickDeclineAllBtn}
            >
              일괄거절
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={btnActions?.onClickApproveBtn}
            >
              승인
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={btnActions?.onClickDeclineBtn}
            >
              거절
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={btnActions?.onClickCancelBtn}
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={btnActions?.onClickCheckMoveCenterHistoryBtn}
            >
              관할관청 이관이력
            </Button>
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
                      차량번호
                    </th>
                    <td>{data?.vhclNo ?? sampleContentDetailData.vhclNo}</td>
                    <th className="td-head" scope="row">
                      관할관청
                    </th>
                    <td>
                      {data?.locgovNm ?? sampleContentDetailData.locgovNm}
                    </td>
                    <th className="td-head" scope="row">
                      소유자명
                    </th>
                    <td>{data?.vonrNm ?? sampleContentDetailData.vonrNm}</td>
                    <th className="td-head" scope="row">
                      주민등록번호
                    </th>
                    <td>{data?.rrno ?? sampleContentDetailData.rrno}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      사업자등록번호
                    </th>
                    <td>{data?.brno ?? sampleContentDetailData.brno}</td>
                    <th className="td-head" scope="row">
                      차량소유구분
                    </th>
                    <td>{data?.rfidYn ?? sampleContentDetailData.rfidYn}</td>
                    <th className="td-head" scope="row">
                      유종
                    </th>
                    <td>{data?.koiCd ?? sampleContentDetailData.koiCd}</td>
                    <th className="td-head" scope="row">
                      톤수
                    </th>
                    <td>{data?.tons ?? sampleContentDetailData.tons}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      면허업종
                    </th>
                    <td>
                      {data?.vhclSeCd ?? sampleContentDetailData.vhclSeCd}
                    </td>
                    <th className="td-head" scope="row">
                      차량최종상태
                    </th>
                    <td>
                      {data?.vhclFinalStatus ??
                        sampleContentDetailData.vhclFinalStatus}
                    </td>
                    <th className="td-head" scope="row"></th>
                    <td />
                    <th className="td-head" scope="row"></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      요청일자
                    </th>
                    <td>
                      {data?.requestDate ?? sampleContentDetailData.requestDate}
                    </td>
                    <th className="td-head" scope="row">
                      전출관청
                    </th>
                    <td>
                      {data?.transferOutOffice ??
                        sampleContentDetailData.transferOutOffice}
                    </td>
                    <th className="td-head" scope="row">
                      전입관청
                    </th>
                    <td>
                      {data?.transferInOffice ??
                        sampleContentDetailData.transferInOffice}
                    </td>
                    <th className="td-head" scope="row"></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      처리상태
                    </th>
                    <td>
                      {data?.processStatus ??
                        sampleContentDetailData.processStatus}
                    </td>
                    <th className="td-head" scope="row">
                      처리일자
                    </th>
                    <td>
                      {data?.processDate ?? sampleContentDetailData.processDate}
                    </td>
                    <th className="td-head" scope="row">
                      거절사유
                    </th>
                    <td>
                      {data?.declineReason ??
                        sampleContentDetailData.declineReason}
                    </td>
                    <th className="td-head" scope="row"></th>
                    <td />
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
