import BlankCard from '@/app/components/shared/BlankCard'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { getExcelFile, getToday } from '@/utils/fsms/common/comm'
import { CustomTextField } from '@/utils/fsms/fsm/mui-imports'
import { Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SelectItem } from 'select'
import { brNoFormatter, getDateTimeString } from '../../../../../utils/fsms/common/util'
import { Row } from '../page'
import SearchModal, { SearchRow } from './SearchModal'
import { once } from 'events'

type DetailDataGridProps = {
  detail: Row
  rejectItems: SelectItem[]
}

type Pageable = {
  pageNumber: number
  pageSize: number
  sort: string
}

const DetailDataGrid = (props: DetailDataGridProps) => {
  const { detail, rejectItems } = props

  const [crtrYmd, setCrtrYmd] = useState<string>('') // 탱크용량변경일자
  const [tnkCpcty, setTnkCpcty] = useState<string>('') // 변경 후 탱크용량
  const [flCd, setFlCd] = useState<string>('') // 탈락유형
  const [flRsnCn, setFlRsnCn] = useState<string>('') // 탈락사유

  const [rows, setRows] = useState<SearchRow[]>([]);
  const [totalRows, setTotalRows] = useState(0) // 총 수
  const [pageable, setPageable] = useState<Pageable>({
    pageNumber: 1, // 페이지 번호는 1부터 시작
    pageSize: 5, // 기본 페이지 사이즈 설정
    sort: '', // 정렬 기준
  })

  const [didAlert, setDidAlert] = useState(false);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target

    if(name === 'crtrYmd') {
      setCrtrYmd(value);
    }

    if(name === 'tnkCpcty') {
      setTnkCpcty(value);
    }

    if(name === 'flCd') {
      setFlCd(value);
    }

    if(name === 'flRsnCn') {
      setFlRsnCn(value);
    }
  }

  useEffect(() => {
    setDidAlert(false);
    if(detail['crtrYmd']) {
      setCrtrYmd(String(getDateTimeString(detail['crtrYmd'], "date")?.dateString));
    }else {
      setCrtrYmd('');
    }
    setTnkCpcty(Number(detail['bfchgTnkCpcty']).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }))
    setFlCd('')
    setFlRsnCn('')
  }, [detail])

  const fetchData = async (params: any) => {
    try {
      let endpoint: string = `/fsm/stn/tcc/tr/bymoTnkCpcty?page=${params.page - 1}&size=${params.size}` +
      `${params.mnfctrNm ? '&mnfctrNm=' + params.mnfctrNm : ''}` +
      `${params.vhclNm ?  '&vhclNm=' + params.vhclNm : ''}` +
      `${params.frmNm ? '&frmNm=' + params.frmNm : ''}` +
      `${params.yridnw ? '&yridnw=' + params.yridnw : ''}` +
      `${params.vhclTonNm ? '&vhclTonNm=' + params.vhclTonNm : ''}`
      
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })
      
      if (response && response.resultType === 'success' && response.data) {
        // 데이터 조회 성공시
        setRows(response.data.content)
        setTotalRows(response.data.totalElements)
        setPageable({
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          sort: params.sort,
        })
      } else {
        // 데이터가 없거나 실패
        setRows([])
        setTotalRows(0)
        setPageable({
          pageNumber: 1,
          pageSize: 5,
          sort: params.sort,
        })
      }

    }catch(error) {
      console.error("ERROR ::: " , error);
    }
  }

  const excelDownload = async (params: any) => {
    let endpoint: string =
    `/fsm/stn/tcc/tr/bymoTnkCpctyExcel?` +
    `${params.mnfctrNm ? '&mnfctrNm=' + params.mnfctrNm : ''}` +
    `${params.vhclNm ?  '&vhclNm=' + params.vhclNm : ''}` +
    `${params.frmNm ? '&frmNm=' + params.frmNm : ''}` +
    `${params.yridnw ? '&yridnw=' + params.yridnw : ''}` +
    `${params.vhclTonNm ? '&vhclTonNm=' + params.vhclTonNm : ''}`

    getExcelFile(endpoint, '모델별 탱크용량 조회' + '_'+getToday()+'.xlsx')
  }

  const approveChange = async () => {
    try {
      let endpoint: string = `/fsm/stn/tcc/tr/updateApproveTnkCpcty`

      if(!crtrYmd) {
        return alert('탱크용량변경일자를 입력해주세요.')
      }

      if(!tnkCpcty) {
        return alert('변경후 탱크용량을 입력해주세요.')
      }

      let body = {
        vhclNo: detail.vhclNo,
        dmndYmd: detail.dmndYmd,
        // prcsSttsCd: detail.prcsSttsCd,
        prcsSttsCd: '01',
        crtrYmd: crtrYmd.replace("-",""),
        tnkCpcty: tnkCpcty
      }

      const response = await sendHttpRequest('PUT', endpoint, body, true, {
        cache: 'no-store'
      })

      if(response && response.data) {
        alert(response.data);
      }
    }catch(error) {
      console.error("Error :: ", error);
    }
  }

  const rejectChange = async () => {
    try {
      let endpoint: string = `/fsm/stn/tcc/tr/updateApproveTnkCpcty`

      if(!flCd) {
        return alert('탈락유형을 입력해주세요.')
      }

      if(!flRsnCn) {
        return alert('탈락사유를 입력해주세요.')
      }

      let body = {
        vhclNo: detail.vhclNo,
        prcsSttsCd: '02',
        dmndYmd: detail,
        flCd: flCd,
        flRsnCn: flRsnCn
      }

      const userConfirm = confirm("해당 요청건을 거절하시겠습니까?");

      if(userConfirm) {
        const response = await sendHttpRequest('PUT', endpoint, body, true, {
          cache: 'no-store'
        })

        if(response && response.data) {
          alert(response.data);
        }
      }

    }catch(error) {
      console.error("Error :: ", error);
    }
  }

  const onDateClick = (event: React.MouseEvent) => {
    if(!didAlert) {
      event.preventDefault();
      alert('탱크용량 변경일자부터 승인일자까지 지급거절된 주유내역에 대해 자동소급 지급됩니다');
      setDidAlert(true);
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
            }}
          >
            {detail['prcsSttsCd'] === '00' ?
            <>
              <SearchModal
                buttonLabel={'모델별 탱크용량 조회'}
                size={'xl'}
                title={'모델별 탱크용량 조회'}
                fetchData={fetchData}
                excelDownload={excelDownload}
                rows={rows}
                totalRows={totalRows}
                pageable={pageable}
                />
              <Button
                variant="contained"
                color="dark"
                style={{ marginLeft: '6px' }}
                onClick={() => approveChange()}
              >
                승인
              </Button>
              <Button
                variant="contained"
                color="dark"
                style={{ marginLeft: '6px' }}
                onClick={() => rejectChange()}
              >
                거절
              </Button>
            </>
            :
            ''
            }
              
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
                      처리상태
                    </th>
                    <td>{detail['tankStsNm']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      차량번호
                    </th>
                    <td>{detail['vhclNo']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      소유자명
                    </th>
                    <td>{detail['vonrNm']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      사업자등록번호
                    </th>
                    <td>{brNoFormatter(detail['vonrBrno'])}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      관할관청
                    </th>
                    <td>{detail['locgovNm']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      연락처
                    </th>
                    <td>{detail['mbtlnum']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      톤수
                    </th>
                    <td>{detail['carTonsNm']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      차량형태
                    </th>
                    <td>{detail['carSts']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      차명
                    </th>
                    <td colSpan={3}>{detail['vhclNm']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      요청일자
                    </th>
                    <td>{getDateTimeString(detail['dmndYmd'], "date")?.dateString}</td>
                    <th className="td-head" scope="row">
                      처리일자
                    </th>
                    <td>{getDateTimeString(detail['prcsYmd'], "date")?.dateString}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      3개월 최고주유량(ℓ)
                    </th>
                    <td style={{textAlign:"right"}}>{Number(detail['aprvLit']).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      3개월 두번째주유량(ℓ)
                    </th>
                    <td style={{textAlign:"right"}}>{Number(detail['secondLit']).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      3개월 평균주유량(ℓ)
                    </th>
                    <td style={{textAlign:"right"}}>{Number(detail['aprvAvg']).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      탱크용량변경일자
                    </th>
                    <td>
                      {detail['prcsSttsCd'] === '00' ? // '심사요청'인 경우
                        <CustomTextField type="date" onClick={ onDateClick } name="crtrYmd" value={crtrYmd} onChange={handleValueChange} fullWidth/>
                        : 
                        getDateTimeString(detail['crtrYmd'], "date")?.dateString
                      }
                    </td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      변경전 탱크용량(ℓ)
                    </th>
                    <td style={{textAlign:"right"}}>{Number(detail['bfchgTnkCpcty']).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      변경후 탱크용량(ℓ)
                    </th>
                    <td style={{textAlign:"right"}}>
                      { detail['prcsSttsCd'] === '00' ? // '심사요청'인 경우
                        <CustomTextField type="number" name="tnkCpcty" value={tnkCpcty} onChange={handleValueChange} fullWidth/>
                        :
                        Number(detail['tnkCpcty']).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}></th>
                    <td />
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      탱크용량변경사유
                    </th>
                    <td colSpan={3}>{detail['tankRsnNm']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      비고
                    </th>
                    <td colSpan={3}>{detail['rmrkCn']}</td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      탈락유형
                    </th>
                    <td colSpan={3}>
                      {detail['prcsSttsCd'] === '00' ? // '심사요청'인 경우
                        <select
                          id="ft-flCd-select-03"
                          className="custom-default-select"
                          name="flCd"
                          value={flCd}
                          onChange={handleValueChange}
                        >
                          {rejectItems.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        : 
                        detail['flCd'] ? rejectItems.find(item => item.value === detail['flCd'])?.label : ''
                      }
                    </td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      탈락사유
                    </th>
                    <td colSpan={4}>
                      {detail['prcsSttsCd'] === '00' ? // '심사요청'인 경우
                       <CustomTextField name="flRsnCn" value={flRsnCn} onChange={handleValueChange} fullWidth/>
                       : 
                       detail['flRsnCn']
                      }
                    </td>
                  </tr>
                  <tr>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      등록자아이디
                    </th>
                    <td>{detail['rgtrId']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      등록일자
                    </th>
                    <td>{getDateTimeString(detail['regDt'], "date")?.dateString}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      수정자아이디
                    </th>
                    <td>{detail['mdfrId']}</td>
                    <th className="td-head" scope="row" style={{whiteSpace:'nowrap'}}>
                      수정일자
                    </th>
                    <td>{getDateTimeString(detail['mdfcnDt'], "date")?.dateString}</td>
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
