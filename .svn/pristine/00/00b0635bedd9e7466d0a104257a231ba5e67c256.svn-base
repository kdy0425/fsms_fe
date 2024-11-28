import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'
import { Row } from './FreightPage'
import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint
} from '@/utils/fsms/common/convert'
import { HeadCell, Pageable } from 'table'


/**
 *    locTotalRows: number
      locRows : Row[]
      locPageable : Pageable
 */


const headCells: HeadCell[] = [
  {
      id: 'No',
      numeric: false,
      disablePadding: false,
      label: '연번',
  },
  {
      id: 'exsLocgovNm',
      numeric: false,
      disablePadding: false,
      label: '적용일',
  },
  {
      id: 'chgLocgovNm',
      numeric: false,
      disablePadding: false,
      label: '주민등록번호',
  }
  ,
  {
      id: 'prcsSttsCdNm',
      numeric: false,
      disablePadding: false,
      label: '소유자명',
  }
  ,
  {
      id: 'vonrRrnoSecure',
      numeric: false,
      disablePadding: false,
      label: '사업자등록번호',
  }
  ,
  {
      id: 'vonrRrnoSecure',
      numeric: false,
      disablePadding: false,
      label: '이관전 관할관청',
  }
  ,
  {
      id: 'vonrRrnoSecure',
      numeric: false,
      disablePadding: false,
      label: '이관후 관할관청',
  }
  ,
]


export interface ButtonGroupActionProps {
  onClickApporveAllBtn: (rows : Row[]) => void // 일괄승인 버튼 action
  onClickDeclineAllBtn: (rows : Row[]) => void // 일괄거절 버튼 action
  onClickApproveBtn: (row : Row) => void // 승인 버튼 action
  onClickDeclineBtn: (row : Row) => void // 거절 버튼 action
  onClickCancelBtn: (row : Row) => void  // 취소 버튼 action
  onClickCheckMoveCenterHistoryBtn: (row: Row) => void // 관할관청 이관이력 버튼 action
}

// Detail Props 
interface DetailDataGridProps {
  data?: Row
  selectedRows : Row[]
  locTotalRows: number
  locRows : Row[]
  locPageable : Pageable
  btnActions?: ButtonGroupActionProps   // 일괄승인,일괄거절,승인,거절,취소 버튼
}


const DetailDataGrid: React.FC<DetailDataGridProps> = ({
  data,
  selectedRows,
  locTotalRows,
  locRows,
  locPageable,
  btnActions,
}) => {


  if(data  === undefined)
    return null;

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
              onClick={() => btnActions?.onClickApporveAllBtn(selectedRows)}
            >
              일괄승인
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={() => btnActions?.onClickDeclineAllBtn(selectedRows)}
            >
              일괄거절
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={() => btnActions?.onClickApproveBtn(data)}
            >
              승인
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={() => btnActions?.onClickDeclineBtn(data)}
            >
              거절
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={() => btnActions?.onClickCancelBtn(data)}
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="dark"
              style={{ marginLeft: '6px' }}
              onClick={() => btnActions?.onClickCheckMoveCenterHistoryBtn(data)}
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
                    <td>{data?.vhclNo ?? ''}</td>
                    <th className="td-head" scope="row">
                      관할관청
                    </th>
                    <td>
                      {data?.carLocgovNm?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      소유자명
                    </th>
                    <td>{data?.vonrNm ?? ''}</td>
                    <th className="td-head" scope="row">
                      주민등록번호
                    </th>
                    <td>{data?.vonrRrno ?? ''}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      사업자등록번호
                    </th>
                    <td>{formBrno(data?.vonrBrno) ?? ''}</td>
                    <th className="td-head" scope="row">
                      차량소유구분
                    </th>
                    <td>{data?.vhclPsnCd ?? ''}</td>
                    <th className="td-head" scope="row">
                      유종
                    </th>
                    <td>{data?.koiNm ?? ''}</td>
                    <th className="td-head" scope="row">
                      톤수
                    </th>
                    <td>{data?.vhclTonNm ?? ''}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      면허업종
                    </th>
                    <td>
                      {data?.lcnsTpbizCd ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      차량최종상태
                    </th>
                    <td>
                      {data?.vhclSttsCd ?? ''}
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
                      {formatDate(data?.prcsYmd) ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      전출관청
                    </th>
                    <td>
                      {data?.exsLocgovNm ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      전입관청
                    </th>
                    <td>
                      {data?.chgLocgovNm ?? ''}
                    </td>
                    <th className="td-head" scope="row"></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      처리상태
                    </th>
                    <td>
                      {data?.prcsSttsCdNm ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      처리일자
                    </th>
                    <td>
                      {formatDate(data?.handleDt) ?? '' }
                    </td>
                    <th className="td-head" scope="row">
                      거절사유
                    </th>
                    <td>
                      {data?.rfslRsnCn ?? ''}
                    </td>
                    <th className="td-head" scope="row"></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row">
                      등록자아이디
                    </th>
                    <td>
                      {data?.rgtrId ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      등록일자
                    </th>
                    <td>
                      {formatDate(data?.reqDt) ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      수정자아이디
                    </th>
                    <td>
                      {data?.mdfrId ?? ''}
                    </td>
                    <th className="td-head" scope="row">
                      수정일자
                    </th>
                    <td>
                      {formatDate(data?.mdfcnDt) ?? ''}
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
