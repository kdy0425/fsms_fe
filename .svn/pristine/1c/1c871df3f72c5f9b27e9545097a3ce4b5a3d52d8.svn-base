import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  vhclNo?: string // 차량번호
  locgov?: string // 관할관청
  vhclSeCd?: string // 면허업종

  brno?: string // 차주사업자등록번호
  rprsvRrno?: string // 차주주민등록번호
  rprsvNm?: string // 차주명
  koiCd?: string // 유종
  tons?: string // 톤수
  rfidYn?: string // 소유구분

  rgtrId?: string // 등록자아이디
  regDt?: string // 등록일자
  mdfrId?: string // 수정자아이디
  mdfcnDt?: string // 수정일자
}

const sampleContentDetailData: DetailDataType = {
  vhclNo: '서울90바1768',
  locgov: '서울 강남구',
  vhclSeCd: '일반화물',
  brno: '123-12-21345',
  rprsvRrno: '700123-1212134',
  rprsvNm: '김학준',
  koiCd: '경유',
  tons: '12톤이하',
  rfidYn: '법인',

  rgtrId: 'hoy11',
  regDt: '2024-10-22',
  mdfrId: 'hoy11',
  mdfcnDt: '2024-10-22',
}

interface DetailDataGridProps {
  data?: DetailDataType
  onClickManageMileageBtn: () => void // 주행거리관리 버튼 ation
  onClickCheckVehicleHistoryBtn: () => void // 차량이력보기 버튼 action
  onClickChangeBrnoBtn: () => void // 차주사업자변경 버튼 action
  onClickTransferLocalGovernmentBtn: () => void // 지자체이관 버튼 action
  onClickChangeKoiTonCountBtn: () => void // 유종/톤수 변경 버튼 action
  onClickCarRestBtn: () => void // 차량휴지 버튼 action
  onClickStopPaymentBtn: () => void // 지급정지 버튼 action
  onClickVehicleCancellationBtn: () => void // 지급정지 버튼 action
}

const CarDetailDataGrid: React.FC<DetailDataGridProps> = ({
  data,
  onClickManageMileageBtn,
  onClickCheckVehicleHistoryBtn,
  onClickChangeBrnoBtn,
  onClickTransferLocalGovernmentBtn,
  onClickChangeKoiTonCountBtn,
  onClickCarRestBtn,
  onClickStopPaymentBtn,
  onClickVehicleCancellationBtn,
}) => {
  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12} sm={12} md={12}>
        <BlankCard className="contents-card" title="차량정보 (할인)">
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
                    <td colSpan={3}>
                      {data?.vhclNo ?? sampleContentDetailData.vhclNo}
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickManageMileageBtn}
                      >
                        주행거리관리
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickCheckVehicleHistoryBtn}
                      >
                        차량이력보기
                      </Button>
                    </td>
                    <th className="td-head" scope="row">
                      관할관청
                    </th>
                    <td>{data?.locgov ?? sampleContentDetailData.locgov}</td>
                    <th className="td-head" scope="row">
                      면허업종
                    </th>
                    <td>
                      {data?.vhclSeCd ?? sampleContentDetailData.vhclSeCd}
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      차주사업자등록번호
                    </th>
                    <td colSpan={3}>
                      {data?.brno ?? sampleContentDetailData.brno}

                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickChangeBrnoBtn}
                      >
                        차주사업자변경
                      </Button>
                    </td>
                    <th className="td-head" scope="row">
                      차주주민등록번호
                    </th>
                    <td colSpan={3}>
                      {data?.rprsvRrno ?? sampleContentDetailData.rprsvRrno}
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      차주성명
                    </th>
                    <td>{data?.rprsvNm ?? sampleContentDetailData.rprsvNm}</td>
                    <th className="td-head" scope="row">
                      유종
                    </th>
                    <td>{data?.koiCd ?? sampleContentDetailData.koiCd}</td>
                    <th className="td-head" scope="row">
                      톤수
                    </th>
                    <td>{data?.tons ?? sampleContentDetailData.tons}</td>
                    <th className="td-head" scope="row">
                      소유구분
                    </th>
                    <td>{data?.rfidYn ?? sampleContentDetailData.rfidYn}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      바로가기
                    </th>
                    <td colSpan={3}>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickTransferLocalGovernmentBtn}
                      >
                        지자체이관
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickChangeKoiTonCountBtn}
                      >
                        유종/톤수변경
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickCarRestBtn}
                      >
                        차량휴지
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickStopPaymentBtn}
                      >
                        지급정지
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginLeft: '8px' }}
                        onClick={onClickVehicleCancellationBtn}
                      >
                        차량말소
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      등록자아이디
                    </th>
                    <td>{data?.rgtrId ?? sampleContentDetailData.rgtrId}</td>
                    <th className="td-head" scope="row">
                      등록일자
                    </th>
                    <td>{data?.regDt ?? sampleContentDetailData.regDt}</td>
                    <th className="td-head" scope="row">
                      수정자아이디
                    </th>
                    <td>{data?.mdfrId ?? sampleContentDetailData.mdfrId}</td>
                    <th className="td-head" scope="row">
                      수정일자
                    </th>
                    <td>{data?.mdfcnDt ?? sampleContentDetailData.mdfcnDt}</td>
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

export default CarDetailDataGrid
