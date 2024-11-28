import { Grid, Button, Select } from '@mui/material'
import { Row } from '../page'
import BlankCard from '@/app/components/shared/BlankCard'
import FormDialog from '@/app/components/popup/FormDialog'
import ModalContent from './ModalContent'

type DetailDataGridProps = {
  detail: Row
  onClickApproveBtn: () => void // 승인 버튼 action
  onClickDeclineBtn: () => void // 거절 버튼 action
}

const DetailDataGrid = (props: DetailDataGridProps) => {
  const { detail, onClickApproveBtn, onClickDeclineBtn } = props

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
            <FormDialog
              buttonLabel={'모델별 탱크용량 조회'}
              size={'lg'}
              title={'모델별 탱크용량 조회'}
              children={<ModalContent />}
            />
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={onClickApproveBtn}
            >
              승인
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={onClickDeclineBtn}
            >
              거절
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
                    {/* <th className="td-head" scope="row">
                      처리상태
                    </th>
                    <td>{detail['tankStsNm']}</td>
                    <th className="td-head" scope="row">
                      차량번호
                    </th>
                    <td>{detail['vhclNo']}</td>
                    <th className="td-head" scope="row">
                      소유자명
                    </th>
                    <td>{detail['vonrNm']}</td>
                    <th className="td-head" scope="row">
                      사업자등록번호
                    </th>
                    <td>{detail['vonrBrno']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      관할관청
                    </th>
                    <td>{detail['locgovNm']}</td>
                    <th className="td-head" scope="row">
                      연락처
                    </th>
                    <td>{detail['mbtlnum']}</td>
                    <th className="td-head" scope="row">
                      톤수
                    </th>
                    <td>{detail['carTonsNm']}</td>
                    <th className="td-head" scope="row">
                      차량형태
                    </th>
                    <td>{detail['carSts']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      차명
                    </th>
                    <td colSpan={3}>{detail['vhclNm']}</td>
                    <th className="td-head" scope="row">
                      요청일자
                    </th>
                    <td>{detail['reqDt']}</td>
                    <th className="td-head" scope="row">
                      처리일자
                    </th>
                    <td>{detail['mdfcnDt']}</td> */}
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      3개월 최고주유량(ℓ)
                    </th>
                    <td>데이터 바인딩 필요</td>
                    <th className="td-head" scope="row">
                      3개월 두번째주유량(ℓ)
                    </th>
                    <td>데이터 바인딩 필요</td>
                    <th className="td-head" scope="row">
                      3개월 평균주유량(ℓ)
                    </th>
                    <td>데이터 바인딩 필요</td>
                    <th className="td-head" scope="row"></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      탱크용량변경일자
                    </th>
                    {/* <td>{detail['trsmDt']}</td>
                    <th className="td-head" scope="row">
                      변경전 탱크용량(L)
                    </th>
                    <td>{detail['bfchgTnkCpcty']}</td>
                    <th className="td-head" scope="row">
                      변경후 탱크용량(L)
                    </th>
                    <td>{detail['tnkCpcty']}</td>
                    <th className="td-head" scope="row">
                      변경후 탱크용량(L)
                    </th>
                    <td>{detail['tnkCpcty']}</td> */}
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      탱크용량변경사유
                    </th>
                    {/* <td colSpan={3}>{detail['reason']}</td>
                    <th className="td-head" scope="row">
                      비고
                    </th>
                    <td colSpan={3}>{detail['rmrkCn']}</td> */}
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      탈락유형
                    </th>
                    {/* <td colSpan={3}>{detail['rejectNm']}</td>
                    <th className="td-head" scope="row">
                      탈락사유
                    </th>
                    <td colSpan={4}>{detail['rejectNm']}</td> */}
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      등록자아이디
                    </th>
                    {/* <td>{detail['mdfrId']}</td>
                    <th className="td-head" scope="row">
                      등록일자
                    </th>
                    <td>{detail['mdfcnDt']}</td>
                    <th className="td-head" scope="row">
                      수정자아이디
                    </th>
                    <td>{detail['mdfrId']}</td>
                    <th className="td-head" scope="row">
                      수정일자
                    </th>
                    <td>{detail['mdfcnDt']}</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        </BlankCard>
      </Grid>
    </Grid>
  )
}

export default DetailDataGrid
