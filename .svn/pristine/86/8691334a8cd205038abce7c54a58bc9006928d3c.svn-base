import BlankCard from '@/app/components/shared/BlankCard'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { getExcelFile, getToday } from '@/utils/fsms/common/comm'
import { Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SelectItem } from 'select'
import { Row } from '../page'
import FormModal from './FormModal'
import DetailModalContent from './DetailModalContent'
import ConfirmModalContent from './ConfrimModalContent'


type DetailDataGridProps = {
  detail: Row | undefined
  koiCdItems: SelectItem[]
  bankCdItems: SelectItem[]
  vhclTonCdItems: SelectItem[]
  dataSeCd: string
}

const DetailDataGrid = (props: DetailDataGridProps) => {
  const { detail, koiCdItems, bankCdItems, vhclTonCdItems, dataSeCd } = props

  const cancelData = async () => {
    try {
      let endpoint: string = dataSeCd == 'RFID' ? `/fsm/par/pr/tr/cancelPapersReqstRfid` : `/fsm/par/pr/tr/cancelPapersReqstDealCnfirm`
      let body = dataSeCd == 'RFID' ? 
      {
        locgovCd:detail?.locgovCd ?? '',
        vhclNo: detail?.vhclNo ?? '',
        lbrctYm: detail?.lbrctYm ?? ''
       }
       :
       {
        //  locgovCd:detail?.locgovCd ?? '',
         vhclNo: detail?.vhclNo ?? '',
         clclnYm: detail?.clclnYm ?? ''
        }

      const response = await sendHttpRequest('PUT', endpoint, body, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success') {
        // 데이터 조회 성공시
        alert(response.message)
      } else {
        // 데이터가 없거나 실패
        alert("실패 :: " + response.message);
      }  
    }catch (error) {
    // 에러시
    console.error('Error fetching data:', error)
    }
  }

  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12}>
        <BlankCard className="contents-card" title="상세 정보">
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '12px',
              gap:'4px'
            }}
          >
            <>
              <FormModal
                buttonLabel={dataSeCd == 'RFID' ? '자가주유 상세내역' : '카드거래 상세내역'}
                size={'xl'}
                title={dataSeCd == 'RFID' ? '자가주유 상세내역' : '카드거래 상세내역'}
                formId='detail-modal'
                formLabel='엑셀'
                pringBtn
                children={<DetailModalContent 
                  locgovCd={detail?.locgovCd ?? ''}
                  crno={detail?.crno ?? ''}
                  clclnYm={detail?.clclnYm ?? ''}
                  lbrctYm={detail?.lbrctYm ?? ''}
                  vhclNo={detail?.vhclNo ?? ''}
                  vonrBrno={detail?.vonrBrno ?? ''}
                  giveCfmtnYn={detail?.giveCfmtnYn ?? ''} 
                  dataSeCd={dataSeCd}                
                />}                
              />
                <FormModal
                  buttonLabel={'지급확정'}
                  size={'xl'}
                  title={dataSeCd == 'RFID' ? '자가주유 지급확정' : '거래확인카드 지급확정'}
                  formId='confirm-modal'
                  formLabel='저장'
                  children={<ConfirmModalContent 
                    locgovCd={detail?.locgovCd ?? ''}
                    bzentyNm={detail?.bzentyNm ?? ''}
                    vonrNm={detail?.vonrNm ?? ''}
                    crno={detail?.crno ?? ''}
                    clclnYm={detail?.clclnYm ?? ''}
                    vhclNo={detail?.vhclNo ?? ''}
                    lbrctYm={detail?.lbrctYm ?? ''}
                    dpstrNm={detail?.dpstrNm ?? ''}
                    vonrBrno={detail?.vonrBrno ?? ''}
                    bankCdItems={bankCdItems}
                    dataSeCd={dataSeCd} 
                    giveCfmtnYn={detail?.giveCfmtnYn ?? ''}                  
                  />}
                />
              {detail?.giveCfmtnYn == 'N' ? 
                <FormModal
                  buttonLabel={'지급확정'}
                  size={'xl'}
                  title={dataSeCd == 'RFID' ? '자가주유 지급확정' : '거래확인 지급확정'}
                  formId='confirm-modal'
                  formLabel='저장'
                  children={<ConfirmModalContent 
                    locgovCd={detail?.locgovCd ?? ''}
                    bzentyNm={detail?.bzentyNm ?? ''}
                    vonrNm={detail?.vonrNm ?? ''}
                    crno={detail?.crno ?? ''}
                    clclnYm={detail?.clclnYm ?? ''}
                    vhclNo={detail?.vhclNo ?? ''}
                    lbrctYm={detail?.lbrctYm ?? ''}
                    dpstrNm={detail?.dpstrNm ?? ''}
                    vonrBrno={detail?.vonrBrno ?? ''}
                    bankCdItems={bankCdItems}
                    dataSeCd={dataSeCd} 
                    giveCfmtnYn={detail?.giveCfmtnYn ?? ''}                  
                  />}
                />
              : detail?.giveCfmtnYn == 'Y' ?
              <Button
                variant="contained"
                color="dark"
                style={{ marginLeft: '6px' }}
                onClick={() => cancelData()}
              >
                확정취소
              </Button>
               : 
               ''
              } 
            </>
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
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      차량번호
                    </th>
                    <td>{detail ? detail['vhclNo'] : ''}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      법인등록번호
                    </th>
                    <td>{detail ? detail['crno'] : ''}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      소유자명
                    </th>
                    <td>{detail ? detail['bzentyNm'] : ''}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      유종
                    </th>
                    <td>{detail ? koiCdItems.find(item => detail['koiCd']==item.value)?.label : ''}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      톤수
                    </th>
                    <td>{detail ? vhclTonCdItems.find(item => detail['vhclTonCd']==item.value)?.label: ''}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      
                    </th>
                    <td></td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      예금주명
                    </th>
                    <td>{detail ? detail['dpstrNm'] : ''}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      금융기관
                    </th>
                    <td>{detail ? bankCdItems.find(item => detail['bankNm']==item.value )?.label : ''}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      
                    </th>
                    <td></td>
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
