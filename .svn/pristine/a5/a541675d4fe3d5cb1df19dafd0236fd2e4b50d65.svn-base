import { Grid, Button, Select } from '@mui/material'
import { Row } from '../page'
import BlankCard from '@/app/components/shared/BlankCard'
import FormDialog from '@/app/components/popup/FormDialog'
import ModalContent from './ModalContent'

type DetailDataGridProps = {
  detail: Row
}

const DetailDataGrid = (props: DetailDataGridProps) => {
  const { detail } = props

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
              buttonLabel={'특별관리 해제'}
              size={'lg'}
              title={'특별관리 해제'}
              children={<ModalContent />}
            />
            <FormDialog
              buttonLabel={'이용자 조회'}
              size={'lg'}
              title={'이용자 조회'}
              children={<ModalContent />}
            />
          </div>
          <>
            {/* 테이블영역 시작 */}
            <div className="table-scrollable">
              <table className="table table-bordered">
                <caption>상세 내용 시작</caption>
                <colgroup>
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th className="td-head" scope="row">
                      특별관리 발효(시작)일자
                    </th>
                    <td colSpan={1}>{detail['bgngAplcnYmd']}</td>
                    <th className="td-head" scope="row">
                      특별관리 종료일자
                    </th>
                    <td colSpan={1}>{detail['endAplcnYmd']}</td>
                    <th className="td-head" scope="row">
                      상태
                    </th>
                    <td>{detail['status']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      특별관리 사유
                    </th>
                    <td colSpan={6}>{detail['reason']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      신한 가맹점번호
                    </th>
                    <td colSpan={1}>{detail['shinhanNm']}</td>
                    <th className="td-head" scope="row">
                      kb 가맹점번호
                    </th>
                    <td colSpan={1}>{detail['kbNm']}</td>
                    <th className="td-head" scope="row">
                      우리 가맹점번호
                    </th>
                    <td colSpan={1}>{detail['wooriNm']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      삼성 가맹점번호
                    </th>
                    <td>{detail['samsungNm']}</td>
                    <th className="td-head" scope="row">
                      현대 가맹점번호
                    </th>
                    <td>{detail['hyundaiNm']}</td>
                    <th className="td-head" scope="row"></th>
                    <td />
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
