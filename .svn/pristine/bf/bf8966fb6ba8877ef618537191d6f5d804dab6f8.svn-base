import React from 'react'
import { Grid, Button } from '@mui/material'
import BlankCard from '@/components/shared/BlankCard'

interface DetailDataType {
  cardNm?: string // 카드사명,
  cardNumber?: string //카드번호
  transactionStatus?: string //거래구분
  transactionDate?: string //거래일자
  transactionTime?: string //거래시각
  transactionQueue?: string //거래순번
  vhclNo?: string //차량번호
  brno?: string //사업자번호
  koiCd?: string //유종
  companyNm?: string //업체명
  fcNm?: string //가맹점명
  fcBrno?: string //가맹점사업자등록번호
  fcProvince?: string // 가맹점 지역
  pricePerUsageType?: string //사용량단가구분
  pricePerUsage?: string //사용량당단가
  fcUseAmount?: string //가맹점사용량
}

const sampleContentDetailData: DetailDataType = {
  cardNm: '롯데카드',
  cardNumber: '9409-0000-0000-6196',
  transactionStatus: '정상',
  transactionDate: '2024년 08월 20일',
  transactionTime: '01:12:44',
  transactionQueue: '1',
  vhclNo: '서울23사5601',
  brno: '212-01-22345',
  koiCd: 'LPG',
  companyNm: '미동운수(주)',
  fcNm: '대양가스충전소',
  fcBrno: '102-23-12345',
  fcProvince: '서울',
  pricePerUsageType: '가맹점',
  pricePerUsage: '1,080',
  fcUseAmount: '23.01',
}

interface DetailDataGridProps {
  data?: DetailDataType
}

const DetailDataList: React.FC<DetailDataGridProps> = ({ data }) => {
  return (
    <Grid container spacing={2} className="card-container">
      <Grid item xs={12} sm={12} md={12}>
        <BlankCard className="contents-card" title="상세 거래내역">
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
                      카드사명
                    </th>
                    <td>{data?.cardNm ?? sampleContentDetailData.cardNm}</td>
                    <th className="td-head" scope="row">
                      카드번호
                    </th>
                    <td>
                      {data?.cardNumber ?? sampleContentDetailData.cardNumber}
                    </td>
                    <th className="td-head" scope="row">
                      거래구분
                    </th>
                    <td>
                      {data?.transactionStatus ??
                        sampleContentDetailData.transactionStatus}
                    </td>
                    <th className="td-head" scope="row">
                      거래일자
                    </th>
                    <td>
                      {data?.transactionDate ??
                        sampleContentDetailData.transactionDate}
                    </td>
                    <th className="td-head" scope="row">
                      거래시각
                    </th>
                    <td>
                      {data?.transactionTime ??
                        sampleContentDetailData.transactionTime}
                    </td>
                    <th className="td-head" scope="row">
                      거래순번
                    </th>
                    <td>
                      {data?.transactionQueue ??
                        sampleContentDetailData.transactionQueue}
                    </td>
                    <th className="td-head" scope="row">
                      차량번호
                    </th>
                    <td>{data?.vhclNo ?? sampleContentDetailData.vhclNo}</td>
                    <th className="td-head" scope="row">
                      차량번호
                    </th>
                    <td>{data?.vhclNo ?? sampleContentDetailData.vhclNo}</td>
                    <th className="td-head" scope="row">
                      사업자번호
                    </th>
                    <td>{data?.brno ?? sampleContentDetailData.brno}</td>
                    <th className="td-head" scope="row">
                      유종
                    </th>
                    <td>{data?.koiCd ?? sampleContentDetailData.koiCd}</td>
                    <th className="td-head" scope="row">
                      업체명
                    </th>
                    <td>
                      {data?.companyNm ?? sampleContentDetailData.companyNm}
                    </td>
                    <th className="td-head" scope="row">
                      가맹점명
                    </th>
                    <td>{data?.fcNm ?? sampleContentDetailData.fcNm}</td>
                    <th className="td-head" scope="row">
                      가맹점사업자등록번호
                    </th>
                    <td>{data?.fcBrno ?? sampleContentDetailData.fcBrno}</td>
                    <th className="td-head" scope="row">
                      가맹점 지역
                    </th>
                    <td>
                      {data?.fcProvince ?? sampleContentDetailData.fcProvince}
                    </td>
                    <th className="td-head" scope="row">
                      사용량단가구분
                    </th>
                    <td>
                      {data?.pricePerUsageType ??
                        sampleContentDetailData.pricePerUsageType}
                    </td>
                    <th className="td-head" scope="row">
                      사용량당단가
                    </th>
                    <td>
                      {data?.pricePerUsage ??
                        sampleContentDetailData.pricePerUsage}
                    </td>
                    <th className="td-head" scope="row">
                      가맹점사용량
                    </th>
                    <td>
                      {data?.fcUseAmount ?? sampleContentDetailData.fcUseAmount}
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

export default DetailDataList
