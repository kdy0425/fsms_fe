'use client'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Box, Divider, Button } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import PageContainer from '@/components/container/PageContainer'
// 탭 모듈
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Breadcrumb from '@/app/(admin)/layout/shared/breadcrumb/BreadcrumbFsmMain'
// 주석 : amcharts nextjs  SyntaxError: Unexpected token 'export'
import dynamic from 'next/dynamic'
const XYChart01 = dynamic(() => import('@/app/components/amcharts/XYChart01'), {
  ssr: false,
})
const XYChart02 = dynamic(() => import('@/app/components/amcharts/XYChart02'), {
  ssr: false,
})
const XYChart03 = dynamic(() => import('@/app/components/amcharts/XYChart03'), {
  ssr: false,
})
// 도움말 모듈
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import {
  Notice,
  CardIssueRequest,
  RfidIssueRequest,
  WrittenApplication,
  ClaimConfirmation,
  SuspiciousTransaction,
  TankCapacity,
  FuelSubsidyRate,
  FreightDailyApplicationStatus,
  BusCardDailyApplicationStatus,
  BusRfidDailyApplicationStatus,
  TaxiCardDailyApplicationStatus,
  FreightFuelSubsidyClaimStatus,
  BusFuelSubsidyClaimStatus,
  TaxiFuelSubsidyClaimStatus,
  FreightMonthlySubsidyPaymentStatus,
  BusMonthlySubsidyPaymentStatus,
  TaxiMonthlySubsidyPaymentStatus,
  FreightSuspiciousTransactionDetection,
  TaxiSuspiciousTransactionDetection,
} from '@/types/main/main'

import {
  getLabelFromCode,
  getNumtoWon,
  formatDate,
  formatKorYearMonth,
  formBrno,
  getNumtoWonAndDecimalPoint,
  formatDateDecimal,
} from '@/utils/fsms/common/convert'
import UserAuthContext, {
  UserAuthInfo,
} from '../../components/context/UserAuthContext'
import ModifyDialog from '../_components/NoticeDetailDialog'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} placement="top" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#2A3547',
    color: '#fff',
    maxWidth: 220,
    fontSize: 14,
    border: '1px solid #dadde9',
  },
}))
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/',
    title: '관리시스템 메인',
  },
]

const selectData = [
  {
    value: '2024',
    label: '2024년',
  },
  {
    value: '2023',
    label: '2023년',
  },
  {
    value: '2022',
    label: '2022년',
  },
]
export default function Main() {
  // 탭
  const [valueTab1, setValueTab1] = React.useState('1')
  const handleChangeTab1 = (
    event: React.SyntheticEvent,
    newValueTab1: string,
  ) => {
    setValueTab1(newValueTab1)
  }
  const [valueTab2, setValueTab2] = React.useState('1')
  const handleChangeTab2 = (
    event: React.SyntheticEvent,
    newValueTab2: string,
  ) => {
    setValueTab2(newValueTab2)
  }
  const [valueTab3, setValueTab3] = React.useState('1')
  const handleChangeTab3 = (
    event: React.SyntheticEvent,
    newValueTab3: string,
  ) => {
    setValueTab3(newValueTab3)
  }
  const [valueTab4, setValueTab4] = React.useState('1')
  const handleChangeTab4 = (
    event: React.SyntheticEvent,
    newValueTab4: string,
  ) => {
    setValueTab4(newValueTab4)
  }
  // Select
  const [select, setSelect] = React.useState('2024')

  const handleChangeSelect = (event: any) => {
    setSelect(event.target.value)
  }

  // 현재 년 월 일을 반환하는 함수 yyyy.mm.dd
  const getFormattedDate = (): string => {
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const day = today.getDate().toString().padStart(2, '0')
    return `${year}.${month}.${day}`
  }
  const router = useRouter()

  const [detailMoalFlag, setDetailModalFlag] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<Notice>()
  const handleDetailCloseModal = () => {
    setDetailModalFlag((prev) => false)
  }
  const handleSelectedNotice = (notice: Notice) => {
    setSelectedNotice(notice)
    setDetailModalFlag(true)
  }

  // 원하는 경로로 이동!
  const handleCartPubClick = (url: string) => {
    // useEffect 안에서 라우팅 기능을 실행
    router.push(url)
  }
  const [loading, setLoading] = React.useState(false) // 로딩여부
  // 상태 변수들 정의
  const [notices, setNotices] = useState<Notice[]>([]) // 1.메인화면 게시판을 조회
  const [cardIssueRequests, setCardIssueRequests] = useState<CardIssueRequest>() // 2.나의 할일 - 카드발급요청을 조회
  const [rfidIssueRequests, setRfidIssueRequests] = useState<RfidIssueRequest>() // 3.나의 할일 - RFID발급요청을 조회
  const [writtenApplications, setWrittenApplications] =
    useState<WrittenApplication>() // 4.나의 할일 - 서면신청을 조회
  const [claimConfirmations, setClaimConfirmations] =
    useState<ClaimConfirmation>() // 5.나의 할일 - 청구확정을 조회
  const [suspiciousTransactions, setSuspiciousTransactions] =
    useState<SuspiciousTransaction>() // 6.나의 할일 - 의심거래를 조회
  const [tankCapacities, setTankCapacities] = useState<TankCapacity>() // 7.나의 할일 - 탱크용량을 조회
  const [fuelSubsidyRates, setFuelSubsidyRates] = useState<FuelSubsidyRate>() // 유가보조금 단가를 조회
  const [freightDailyApplications, setFreightDailyApplications] = useState<
    FreightDailyApplicationStatus[]
  >([]) // 8.화물 일별 신청현황을 조회
  const [busCardDailyApplications, setBusCardDailyApplications] = useState<
    BusCardDailyApplicationStatus[]
  >([]) // 9.버스 카드 일별 신청현황을 조회
  const [busRfidDailyApplications, setBusRfidDailyApplications] = useState<
    BusRfidDailyApplicationStatus[]
  >([]) // 10.버스 RFID 일별 신청현황을 조회
  const [taxiCardDailyApplications, setTaxiCardDailyApplications] = useState<
    TaxiCardDailyApplicationStatus[]
  >([]) // 11.택시 카드 일별 신청현황을 조회

  const [freightFuelSubsidyClaims, setFreightFuelSubsidyClaims] = useState<
    FreightFuelSubsidyClaimStatus[]
  >([]) // 12.화물 유가보조금 청구현황을 조회
  const [busFuelSubsidyClaims, setBusFuelSubsidyClaims] = useState<
    BusFuelSubsidyClaimStatus[]
  >([]) // 13.버스 유가보조금 청구현황을 조회
  const [taxiFuelSubsidyClaims, setTaxiFuelSubsidyClaims] = useState<
    TaxiFuelSubsidyClaimStatus[]
  >([]) // 14.택시 유가보조금 청구현황을 조회            파리미터

  const [freightMonthlySubsidies, setFreightMonthlySubsidies] = useState<
    FreightMonthlySubsidyPaymentStatus[]
  >([]) // 15.화물 월별 보조금 지급현황을 조회           파리미터
  const [busMonthlySubsidies, setBusMonthlySubsidies] = useState<
    BusMonthlySubsidyPaymentStatus[]
  >([]) // 16.페이징, 버스 월별 보조금 지급현황을 조회   페이징      파리미터
  const [taxiMonthlySubsidies, setTaxiMonthlySubsidies] = useState<
    TaxiMonthlySubsidyPaymentStatus[]
  >([]) //17.페이징, 택시 월별 보조금 지급현황을 조회   페이징      파리미터

  const [freightSuspiciousDetections, setFreightSuspiciousDetections] =
    useState<FreightSuspiciousTransactionDetection[]>([]) // 18.화물 의심거래 적발현황을 조회   페이징      파리미터
  const [taxiSuspiciousDetections, setTaxiSuspiciousDetections] = useState<
    TaxiSuspiciousTransactionDetection[]
  >([]) // 19.택시 의심거래 적발현황을 조회    페이징    파리미터

  const [year, setYear] = useState<string>()

  const { authInfo } = useContext(UserAuthContext)
  const [isLocgovCdSet, setIsLocgovCdSet] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          sendHttpRequest(
            'GET',
            `/fsm/mai/main/getMyJobCrdIssuDmnd`,
            null,
            true,
          ),
          sendHttpRequest(
            'GET',
            `/fsm/mai/main/getMyJobRfidIssuDmnd`,
            null,
            true,
          ),
          sendHttpRequest(
            'GET',
            `/fsm/mai/main/getMyJobDocmntAply`,
            null,
            true,
          ),
          sendHttpRequest('GET', `/fsm/mai/main/getMyJobClnCfmtn`, null, true),
          sendHttpRequest(
            'GET',
            `/fsm/mai/main/getMyJobDoubtDelng`,
            null,
            true,
          ),
          sendHttpRequest('GET', `/fsm/mai/main/getMyJobTnkCpcty`, null, true),
          sendHttpRequest('GET', `/fsm/mai/main/getUnitPrc`, null, true),
          sendHttpRequest('GET', `/fsm/mai/main/getNtcMttr`, null, true),

          //일별신청현황
          sendHttpRequest('GET', `/fsm/mai/main/tr/getCardCnt`, null, true),
          sendHttpRequest('GET', `/fsm/mai/main/bs/getCardRqstDt`, null, true),
          sendHttpRequest('GET', `/fsm/mai/main/bs/getRfidRqstDt`, null, true),
          sendHttpRequest('GET', `/fsm/mai/main/tx/getCardCnt`, null, true),

          sendHttpRequest(
            'GET',
            `/fsm/mai/main/tr/getInstcDoubt?gubun=TR`,
            null,
            true,
          ),
          sendHttpRequest(
            'GET',
            `/fsm/mai/main/tr/getInstcDoubt?gubun=TX`,
            null,
            true,
          ),
        ]

        const results = await Promise.allSettled(endpoints)

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const data = result.value
            switch (index) {
              case 0:
                if (data?.resultType === 'success')
                  setCardIssueRequests(data.data)
                break
              case 1:
                if (data?.resultType === 'success')
                  setRfidIssueRequests(data.data)
                break
              case 2:
                if (data?.resultType === 'success')
                  setWrittenApplications(data.data)
                break
              case 3:
                if (data?.resultType === 'success')
                  setClaimConfirmations(data.data)
                break
              case 4:
                if (data?.resultType === 'success')
                  setSuspiciousTransactions(data.data)
                break
              case 5:
                if (data?.resultType === 'success') setTankCapacities(data.data)
                break
              case 6:
                if (data?.resultType === 'success')
                  setFuelSubsidyRates(data.data)
                break
              case 7:
                if (data?.resultType === 'success') setNotices(data.data)
                break

              //일별신청현황 매핑
              case 8:
                if (data?.resultType === 'success')
                  setFreightDailyApplications(data.data)
                break
              case 9:
                if (data?.resultType === 'success')
                  setBusCardDailyApplications(data.data)
                break
              case 10:
                if (data?.resultType === 'success')
                  setBusRfidDailyApplications(data.data)
                break
              case 11:
                if (data?.resultType === 'success')
                  setTaxiCardDailyApplications(data.data)
                break

              case 12:
                if (data?.resultType === 'success')
                  setFreightSuspiciousDetections(data.data)
                break
              case 13:
                if (data?.resultType === 'success')
                  setTaxiSuspiciousDetections(data.data)
                break
              default:
                break
            }
            console.log('공지사항 출력함.', result.value)
          } else {
            console.error(`Error in request ${index}:`, result.reason)
          }
        })
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    fetchData()
  }, [])

  //유가보조금 청구현황 (OK)
  const fetchDataBasedOnLocgovCd = async (locgovCd: string) => {
    try {
      const endpoints = [
        // 경로 잘못된거고 현재 계정의  locgovCd=11110 가져와서 조회해야함.
        sendHttpRequest(
          'GET',
          `/fsm/mai/main/tr/getFtxAsst?locgovCd=` + locgovCd,
          null,
          true,
        ), // 화물 유가보조금 청구현황을 조회
        sendHttpRequest(
          'GET',
          `/fsm/mai/main/bs/getFtxAsst?locgovCd=` + locgovCd,
          null,
          true,
        ), // 버스 유가보조금 청구현황을 조회
        sendHttpRequest(
          'GET',
          `/fsm/mai/main/tx/getFtxAsst?locgovCd=` + locgovCd,
          null,
          true,
        ), //택시 유가보조금 청구현황을 조회
      ]
      const [
        //유가 보조금 청구현황
        trftxAsst,
        bsftxAsst,
        txftxAsst,
      ] = await Promise.all(endpoints)
      try {
        if (trftxAsst?.resultType === 'success')
          setFreightFuelSubsidyClaims(trftxAsst.data)
      } catch (error) {
        console.log('error fail setBusCardDailyApplications')
      }
      try {
        if (bsftxAsst?.resultType === 'success')
          setBusFuelSubsidyClaims(bsftxAsst.data)
      } catch (error) {
        console.log('error fail setBusRfidDailyApplications')
      }
      try {
        if (txftxAsst?.resultType === 'success')
          setTaxiFuelSubsidyClaims(txftxAsst.data)
      } catch (error) {
        console.log('error fail setTaxiCardDailyApplications')
      }
      console.log(trftxAsst)
      console.log(bsftxAsst)
      console.log(txftxAsst)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchFreightData()
    fetchBusData()
    fetchTaxiData()
  }, [select])

  // 화물 월별 보조금 지급 현황 호출
  const fetchFreightData = async () => {
    setLoading(true)
    try {
      const endpoint = `/fsm/mai/main/tr/monAsstGiveCusTr?${select ? '&year=' + select : '2024'}`
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        console.log('Freight Data:', response.data)
        setFreightMonthlySubsidies([...response.data]) //
      }
    } catch (error) {
      console.log('화물 월별 보조금 데이터를 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 버스 월별 보조금 지급 현황 호출
  const fetchBusData = async () => {
    setLoading(true)
    try {
      const endpoint = `/fsm/mai/main/bs/getOpsMth?${select ? '&year=' + select : '2024'}`
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        console.log('Bus Data:', response.data.content)
        setBusMonthlySubsidies([...response.data.content])
      }
    } catch (error) {
      console.log('버스 월별 보조금 데이터를 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 택시 월별 보조금 지급 현황 호출
  const fetchTaxiData = async () => {
    setLoading(true)
    try {
      const endpoint = `/fsm/mai/main/tx/getOpsMthTx?${select ? '&year=' + select : '2024'}`
      const response = await sendHttpRequest('GET', endpoint, null, true, {
        cache: 'no-store',
      })

      if (response && response.resultType === 'success' && response.data) {
        console.log('Taxi Data:', response.data)
        setTaxiMonthlySubsidies([...response.data])
      }
    } catch (error) {
      console.log('택시 월별 보조금 데이터를 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authInfo && 'locgovCd' in authInfo && authInfo.locgovCd) {
      // locgovCd가 설정된 후 실행할 메서드
      handleLocgovCdUpdate(authInfo.locgovCd)
      setIsLocgovCdSet(true)
    }
  }, [authInfo])

  const handleLocgovCdUpdate = (locgovCd: string) => {
    console.log('locgovCd updated:', locgovCd)
    // 여기에 실행할 메서드를 작성하세요.
    fetchDataBasedOnLocgovCd(locgovCd)
  }

  return (
    <PageContainer title="Main" description="메인페이지">
      <div className="main-container">
        <div className="main-container-inner">
          {/* 카테고리 시작 */}
          <Breadcrumb title="유가보조금 관리시스템" items={BCrumb} />
          {/* 카테고리 끝 */}
        </div>
      </div>
      <div className="main-container">
        <div className="main-container-inner">
          <div className="main-contents-group">
            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">나의 할일</h1>

                <div className="contents-box-con">
                  <p className="oilps-info-date">
                    ({getFormattedDate() + '  기준 최근 한달'})
                  </p>
                  <div className="oilps-info-labels">
                    <div className="oilps-label color-blue">화물</div>
                    <div className="oilps-label color-orange">택시</div>
                    <div className="oilps-label color-gray">버스</div>
                  </div>
                  <div className="oilps-map-info-box-col-group">
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cad/cijm')} //화물탭으로 이동
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">카드발급요청</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-gray">
                                    3<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cad/rtrm')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">RFID발급요청</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-gray">
                                    3<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./par/pr')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">서면신청</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-gray">
                                    3<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cal/sr')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">청구확정</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-gray">
                                    3<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./lig/dmal')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">의심거래</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-gray">
                                    3<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./mng/tcjc')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">탱크용량</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-gray">
                                    3<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">나의 할일</h1>

                <div className="contents-box-con">
                  <p className="oilps-info-date">
                    ({getFormattedDate() + '  기준 최근 한달'})
                  </p>
                  <div className="oilps-info-labels">
                    <div className="oilps-label color-blue">화물</div>
                    <div className="oilps-label color-orange">택시</div>
                    <div className="oilps-label color-gray">버스</div>
                  </div>
                  <div className="oilps-map-info-box-col-group">
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cad/cijm')} //화물탭으로 이동
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">카드발급요청</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cad/rtrm')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">RFID발급요청</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./par/pr')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">서면신청</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cal/sr')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">청구확정</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./lig/dmal')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">의심거래</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-blue">
                                    12
                                    <span className="info-value-small">건</span>
                                </p>
                            </div>
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-value color-orange">
                                    8<span className="info-value-small">건</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./mng/tcjc')}
                      style={{ cursor: 'pointer' }}
                    >
                        <div className="oilps-info-title">탱크용량</div>
                        <div className="oilps-info-con-flex">
                            <div className="oilps-info-con-item">
                                <p className="oilps-info-con-empty">
                                해당없음
                                </p>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">나의 할일</h1>

                <div className="contents-box-con">
                  <p className="oilps-info-date">
                    ({getFormattedDate() + '  기준 최근 한달'})
                  </p>
                  <div className="oilps-map-info-box-col-group">
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cad/cijm')} //화물탭으로 이동
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="oilps-info-title">카드발급요청</div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-value textB">
                          {cardIssueRequests !== undefined
                            ? Number(
                                (cardIssueRequests.cardDmndTrCnt ?? 0) +
                                  (cardIssueRequests.cardDmndBsCnt ?? 0) +
                                  (cardIssueRequests.cardDmndTxCnt ?? 0),
                              ).toLocaleString('ko-KR')
                            : '0'}
                          <span className="info-value-small">건</span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cad/rtrm')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="oilps-info-title">RFID발급요청</div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-value textB">
                          {rfidIssueRequests !== undefined
                            ? Number(
                                (rfidIssueRequests.rfidDmndTrCnt ?? 0) +
                                  (rfidIssueRequests.rfidDmndTxCnt ?? 0) +
                                  (rfidIssueRequests.rfidDmndBsCnt ?? 0),
                              ).toLocaleString('ko-KR')
                            : '0'}
                          <span className="info-value-small">건</span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./par/pr')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="oilps-info-title">서면신청</div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-value textB">
                          {writtenApplications !== undefined
                            ? Number(
                                (writtenApplications.docmntAplyTrCnt ?? 0) +
                                  (writtenApplications.docmntAplyTxCnt ?? 0) +
                                  (writtenApplications.docmntAplyBsCnt ?? 0),
                              ).toLocaleString('ko-KR')
                            : '0'}
                          <span className="info-value-small">건</span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./cal/sr')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="oilps-info-title">청구확정</div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-value textB">
                          {claimConfirmations !== undefined
                            ? Number(
                                (claimConfirmations.clnCfmtnTrCnt ?? 0) +
                                  (claimConfirmations.clnCfmtnTxCnt ?? 0) +
                                  (claimConfirmations.clnCfmtnBsCnt ?? 0),
                              ).toLocaleString('ko-KR')
                            : '0'}
                          <span className="info-value-small">건</span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./lig/dmal')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="oilps-info-title">의심거래</div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-value textB">
                          {suspiciousTransactions !== undefined
                            ? Number(
                                (suspiciousTransactions.doubtDelngTrCnt ?? 0) +
                                  (suspiciousTransactions.doubtDelngTrUrl ??
                                    0) +
                                  (suspiciousTransactions.doubtDelngTxCnt ??
                                    0) +
                                  (suspiciousTransactions.doubtDelngBsCnt ?? 0),
                              ).toLocaleString('ko-KR')
                            : '0'}
                          <span className="info-value-small">건</span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="oilps-map-info-box"
                      onClick={() => handleCartPubClick('./mng/tcjc')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="oilps-info-title">탱크용량</div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-value textB">
                          {tankCapacities !== undefined
                            ? Number(
                                (tankCapacities.tnkCpctyTrCnt ?? 0) +
                                  (tankCapacities.tnkCpctyTxCnt ?? 0) +
                                  (tankCapacities.tnkCpctyTrCnt ?? 0),
                              ).toLocaleString('ko-KR')
                            : '0'}
                          <span className="info-value-small">건</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">
                  공지사항
                  <div className="main-title-option">
                    <button
                      className="main-info-board-more-btn"
                      onClick={() => handleCartPubClick('./sup/notice')}
                      title="더보기 버튼"
                    ></button>
                  </div>
                </h1>
                <div className="contents-box-con">
                  <ul className="main-info-board-list">
                    {notices && notices.length > 0 ? (
                      notices.map((notice, index) => {
                        if (notice) {
                          return (
                            <li key={index}>
                              <div
                                className="main-info-board-inner"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectedNotice(notice)} // 수정된 부분
                              >
                                <span className="main-notice-link-title">
                                  {notice.ttl}
                                </span>
                                <p className="main-notice-link-date">
                                  <span className="info-month-date">
                                    {formatDateDecimal(notice.regDt)}
                                  </span>
                                </p>
                              </div>
                            </li>
                          )
                        }
                        return null // notice가 null 또는 undefined인 경우
                      })
                    ) : (
                      <>
                        <li>
                          <div className="main-info-board-inner">
                            <a href="#" className="main-info-link">
                              <span className="main-notice-link-title">
                                게시된 공지사항이 없습니다.{' '}
                              </span>
                            </a>
                            <p className="main-notice-link-date">
                              <span className="info-month-date"></span>
                            </p>
                          </div>
                        </li>
                        {/* <li>
                        <div className="main-info-board-inner">
                          <a href="#" className="main-info-link">
                            <span className="main-notice-link-title">[데이터 없음] 데이터 없음 데이터 없음  데이터 없음  데이터 없음  데이터 없음 </span>
                          </a>
                          <p className="main-notice-link-date">
                            <span className="info-month-date">
                            데이터 없음
                            </span>
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="main-info-board-inner">
                          <a href="#" className="main-info-link">
                            <span className="main-notice-link-title">[데이터 없음] 데이터 없음 데이터 없음  데이터 없음  데이터 없음  데이터 없음 </span>
                          </a>
                          <p className="main-notice-link-date">
                            <span className="info-month-date">
                            데이터 없음
                            </span>
                          </p>
                        </div>
                      </li> */}
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="main-container-inner">
          <div className="main-contents-group row-full">
            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">유가보조금 단가 정보</h1>
                <div className="contents-box-con box-con-col-group">
                  <div className="oilps-map-info-box-col-group box-con-col">
                    <div className="oilps-map-info-box">
                      <div className="oilps-info-title info-title-type1">
                        경유
                        <HtmlTooltip
                          className="help-tooltip"
                          title={
                            <React.Fragment>
                              <div className="tooltip-title">도움말 제목</div>
                              <div className="tooltip-content">도움말 내용</div>
                            </React.Fragment>
                          }
                        >
                          <Button className="icon icon-help tooltips">
                            도움말
                          </Button>
                        </HtmlTooltip>
                      </div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-title info-value-small">
                          단가 (ℓ)
                        </p>
                        <p className="oilps-info-con-value textB">
                          {fuelSubsidyRates !== undefined
                            ? fuelSubsidyRates.koiD
                            : '데이터 없음'}
                          <span className="info-value-small">원</span>
                        </p>
                        <p className="oilps-info-con-value info-value-small">
                          {fuelSubsidyRates !== undefined &&
                          fuelSubsidyRates.koiD10
                            ? `(${fuelSubsidyRates.koiD10})원`
                            : '(데이터 없음)'}
                        </p>
                      </div>
                    </div>

                    <div className="oilps-map-info-box">
                      <div className="oilps-info-title info-title-type3">
                        CNG
                        <HtmlTooltip
                          className="help-tooltip"
                          title={
                            <React.Fragment>
                              <div className="tooltip-title">도움말 제목</div>
                              <div className="tooltip-content">도움말 내용</div>
                            </React.Fragment>
                          }
                        >
                          <Button className="icon icon-help tooltips">
                            도움말
                          </Button>
                        </HtmlTooltip>
                      </div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-title info-value-small">
                          단가 (㎥)
                        </p>
                        <p className="oilps-info-con-value textB">
                          {fuelSubsidyRates !== undefined
                            ? fuelSubsidyRates.koiC
                            : '데이터 없음'}
                          <span className="info-value-small">원</span>
                        </p>
                        <p className="oilps-info-con-value info-value-small">
                          {fuelSubsidyRates !== undefined &&
                          fuelSubsidyRates.koiC13
                            ? `(${fuelSubsidyRates.koiC13})원`
                            : '데이터 없음'}
                        </p>
                      </div>
                    </div>
                    <div className="oilps-map-info-box">
                      <div className="oilps-info-title info-title-type4">
                        수소
                        <HtmlTooltip
                          className="help-tooltip"
                          title={
                            <React.Fragment>
                              <div className="tooltip-title">도움말 제목</div>
                              <div className="tooltip-content">도움말 내용</div>
                            </React.Fragment>
                          }
                        >
                          <Button className="icon icon-help tooltips">
                            도움말
                          </Button>
                        </HtmlTooltip>
                      </div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-title info-value-small">
                          단가 (㎏)
                        </p>
                        <div className="oilps-info-sub-value">
                          <div className="color-blue">
                          {fuelSubsidyRates !== undefined
                            ? fuelSubsidyRates.koiH
                            : '데이터 없음'}
                          <span className="info-value-small">원</span></div>
                        </div>
                        <div className="oilps-info-sub-value">
                          <div className="color-orange">3,700<span className="info-value-small">원</span></div>
                          <div className="color-gray">3,600<span className="info-value-small">원</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="oilps-map-info-box">
                      <div className="oilps-info-title info-title-type2">
                        LPG
                        <HtmlTooltip
                          className="help-tooltip"
                          title={
                            <React.Fragment>
                              <div className="tooltip-title">도움말 제목</div>
                              <div className="tooltip-content">도움말 내용</div>
                            </React.Fragment>
                          }
                        >
                          <Button className="icon icon-help tooltips">
                            도움말
                          </Button>
                        </HtmlTooltip>
                      </div>
                      <div className="oilps-info-con">
                        <p className="oilps-info-con-title info-value-small">
                          단가 (ℓ)
                        </p>
                        <p className="oilps-info-con-value textB">
                          {fuelSubsidyRates !== undefined
                            ? fuelSubsidyRates.koiL
                            : '데이터 없음'}
                          <span className="info-value-small">원</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="box-con-col box-auto">
                    <div className="contents-explanation">
                      <div className="contents-explanation-inner">
                        <div className="contents-explanation-text">
                          경유의 경우 고속우등버스인 경우 괄호안의 단가를 적용
                          받습니다.
                        </div>
                      </div>
                    </div>
                    <div className="contents-explanation">
                      <div className="contents-explanation-inner">
                        <div className="contents-explanation-text">
                          CNG의 경우 전세버스인 경우 괄호 안의 단가를 적용
                          받습니다.
                        </div>
                      </div>
                    </div>
                    <div className="contents-explanation">
                      <div className="contents-explanation-inner">
                        <div className="contents-explanation-text">
                          수소의 경우 <strong className='color-blue'>화물</strong> / <strong className='color-orange'>택시</strong> / <strong className='color-gray'>버스</strong>의 단가를 적용 받습니다.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="main-container-inner">
          <div className="main-contents-group">
            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">
                  <span>일별신청현황</span>
                  <div className="main-title-option">
                    {/* <button className="main-info-board-more-btn" onClick={() => handleCartPubClick('./sta/ci')} title="더보기 버튼"></button> */}
                  </div>
                </h1>
                <div className="contents-box-con">
                  <TabContext value={valueTab3}>
                    <div className="tabs-round-type">
                      <TabList
                        className="tab-list"
                        onChange={handleChangeTab3}
                        aria-label="유가보조금 청구현황 탭 그룹"
                      >
                        <Tab key={1} label={'화물'} value={String(1)} />
                        <Tab key={2} label={'택시'} value={String(2)} />
                        <Tab key={3} label={'버스'} value={String(3)} />
                      </TabList>
                      <p
                        className="oilps-info-date"
                        style={{ margin: '10px 0 0 0' }}
                      >
                        ({getFormattedDate() + ''})
                      </p>
                      <div className="tab-content">
                        <TabPanel key={1} value={String(1)}>
                          <div className="chart-group marT20">
                            {/* 화물  */}
                            <div className="chart-col">
                              <h4>카드발급 현황</h4>
                              {/* 차트 시작 */}
                              <XYChart01
                                cardPulist={freightDailyApplications}
                              />
                              {/* 차트 끝 */}
                            </div>
                            <div className="chart-col">
                              <h4>RFID발급 현황</h4>
                              {/* 차트 시작 */}
                              <XYChart02
                                rfidPulist={freightDailyApplications}
                              />
                              {/* 차트 끝 */}
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel key={2} value={String(2)}>
                          <div className="chart-group marT20">
                            {/* 택시  */}
                            <div className="chart-col">
                              <h4>카드발급 현황</h4>
                              {/* 차트 시작 */}
                              <XYChart01
                                cardPulist={taxiCardDailyApplications}
                              />
                              {/* 차트 끝 */}
                            </div>
                            <div className="chart-col">
                              <h4>RFID발급 현황</h4>
                              {/* 차트 시작 */}
                              <XYChart02 rfidPulist={[]} />
                              {/* 차트 끝 */}
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel key={3} value={String(3)}>
                          <div className="chart-group marT20">
                            {/* 버스  */}
                            <div className="chart-col">
                              <h4>카드발급 현황</h4>
                              {/* 차트 시작 */}
                              <XYChart01
                                cardPulist={busCardDailyApplications}
                              />
                              {/* 차트 끝 */}
                            </div>
                            <div className="chart-col">
                              <h4>RFID발급 현황</h4>
                              {/* 차트 시작 */}
                              <XYChart02
                                rfidPulist={busRfidDailyApplications}
                              />
                              {/* 차트 끝 */}
                            </div>
                          </div>
                        </TabPanel>
                      </div>
                    </div>
                  </TabContext>
                </div>
              </div>
            </div>
            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">
                  <span>유가보조금 청구현황</span>
                  <div className="main-title-option">
                    {/* <button className="main-info-board-more-btn" onClick={() => handleCartPubClick('./cal/lsr')} title="더보기 버튼"></button> */}
                  </div>
                </h1>
                <div className="contents-box-con">
                  {/* 라운드형 탭 시작 */}
                  <TabContext value={valueTab1}>
                    <div className="tabs-round-type">
                      <TabList
                        className="tab-list"
                        onChange={handleChangeTab1}
                        aria-label="유가보조금 청구현황 탭 그룹"
                      >
                        <Tab key={1} label={'화물'} value={String(1)} />
                        <Tab key={2} label={'택시'} value={String(2)} />
                        <Tab key={3} label={'버스'} value={String(3)} />
                      </TabList>
                      <div className="tab-content">
                        <Link href="./cal/sr" className="main-info-link">
                          <TabPanel key={1} value={String(1)}>
                            <div className="table-scrollable">
                              <table className="table table-bordered">
                                <caption>가이드 타이틀 테이블 요약</caption>
                                <colgroup>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th scope="col">청구월</th>
                                    <th scope="col">거래건수</th>
                                    <th scope="col">주유량(ℓ)</th>
                                    <th scope="col">총거래금액</th>
                                    <th scope="col">유가보조금</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {freightFuelSubsidyClaims &&
                                  freightFuelSubsidyClaims.length > 0 ? (
                                    freightFuelSubsidyClaims.map(
                                      (freightFuelSubsidyClaim, index) => {
                                        return (
                                          <tr>
                                            <td className="t-center">
                                              {formatDate(
                                                freightFuelSubsidyClaim.clclnYm,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                freightFuelSubsidyClaim.cnt1,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {freightFuelSubsidyClaim.cnt2}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                freightFuelSubsidyClaim.cnt3,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                freightFuelSubsidyClaim.cnt4,
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      },
                                    )
                                  ) : (
                                    <>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </TabPanel>
                        </Link>
                        <Link href="./cal/sr" className="main-info-link">
                          <TabPanel key={2} value={String(2)}>
                            <div className="table-scrollable">
                              <table className="table table-bordered">
                                <caption>가이드 타이틀 테이블 요약</caption>
                                <colgroup>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th scope="col">청구월</th>
                                    <th scope="col">거래건수</th>
                                    <th scope="col">주유량(ℓ)</th>
                                    <th scope="col">총거래금액</th>
                                    <th scope="col">유가보조금</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {taxiFuelSubsidyClaims &&
                                  taxiFuelSubsidyClaims.length > 0 ? (
                                    taxiFuelSubsidyClaims.map(
                                      (taxiFuelSubsidyClaim, index) => {
                                        return (
                                          <tr>
                                            <td className="t-center">
                                              {formatDate(
                                                taxiFuelSubsidyClaim.clclnYm,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                taxiFuelSubsidyClaim.cnt1,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                taxiFuelSubsidyClaim.cnt2,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                taxiFuelSubsidyClaim.cnt3,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                taxiFuelSubsidyClaim.cnt4,
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      },
                                    )
                                  ) : (
                                    <>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </TabPanel>
                        </Link>
                        <Link href="./cal/lpd" className="main-info-link">
                          <TabPanel key={3} value={String(3)}>
                            <div className="table-scrollable">
                              <table className="table table-bordered">
                                <caption>가이드 타이틀 테이블 요약</caption>
                                <colgroup>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                  <col style={{ width: 'auto' }}></col>
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th scope="col">청구월</th>
                                    <th scope="col">거래건수</th>
                                    <th scope="col">주유량(ℓ)</th>
                                    <th scope="col">총거래금액</th>
                                    <th scope="col">유가보조금</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {busFuelSubsidyClaims &&
                                  busFuelSubsidyClaims.length > 0 ? (
                                    busFuelSubsidyClaims.map(
                                      (busFuelSubsidyClaim, index) => {
                                        return (
                                          <tr>
                                            <td className="t-center">
                                              {formatDate(
                                                busFuelSubsidyClaim.clclnYm,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                busFuelSubsidyClaim.cnt1,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {busFuelSubsidyClaim.cnt2}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                busFuelSubsidyClaim.cnt3,
                                              )}
                                            </td>
                                            <td className="t-right">
                                              {getNumtoWon(
                                                busFuelSubsidyClaim.cnt4,
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      },
                                    )
                                  ) : (
                                    <>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                      <tr>
                                        <td className="t-center">
                                          데이터 없음
                                        </td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                        <td className="t-right">00,000</td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </TabPanel>
                        </Link>
                      </div>
                    </div>
                  </TabContext>
                  {/* 라운드형 탭 끝 */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="main-container-inner">
          <div className="main-contents-group">
            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">
                  <span>월별보조금지급현황</span>
                  <div className="main-title-option">
                    <select
                      id="ft-fname-select-01"
                      className="custom-default-select"
                      value={select}
                      onChange={handleChangeSelect}
                    >
                      {selectData.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </h1>
                <div className="contents-box-con">
                  <TabContext value={valueTab4}>
                    <div className="tabs-round-type">
                      <TabList
                        className="tab-list"
                        onChange={handleChangeTab4}
                        aria-label="유가보조금 청구현황 탭 그룹"
                      >
                        <Tab key={1} label={'화물'} value={String(1)} />
                        <Tab key={2} label={'택시'} value={String(2)} />
                        <Tab key={3} label={'버스'} value={String(3)} />
                      </TabList>
                      <p
                        className="oilps-info-date"
                        style={{ margin: '10px 0 0 0' }}
                      >
                        ({getFormattedDate() + ''})
                      </p>

                      <div className="tab-content">
                        <TabPanel key={1} value={String(1)}>
                          <div className="chart-con marT20">
                            {/* 차트 시작 */}
                            {freightMonthlySubsidies &&
                            freightMonthlySubsidies.length > 0 ? (
                              <XYChart03 monthly={freightMonthlySubsidies} />
                            ) : null}
                            {/* 차트 끝 */}
                          </div>
                        </TabPanel>
                        <TabPanel key={2} value={String(2)}>
                          <div className="chart-con marT20">
                            {/* 차트 시작 */}
                            {taxiMonthlySubsidies &&
                            taxiMonthlySubsidies.length > 0 ? (
                              <XYChart03 monthly={taxiMonthlySubsidies} />
                            ) : null}

                            {/* 차트 끝 */}
                          </div>
                        </TabPanel>
                        <TabPanel key={3} value={String(3)}>
                          <div className="chart-con marT20">
                            {/* 차트 시작 */}
                            {busMonthlySubsidies &&
                            busMonthlySubsidies.length > 0 ? (
                              <XYChart03 monthly={busMonthlySubsidies} />
                            ) : null}
                            {/* 차트 끝 */}
                          </div>
                        </TabPanel>
                      </div>
                    </div>
                  </TabContext>
                </div>
              </div>
            </div>
            <div className="main-contents">
              <div className="main-contents-box">
                <h1 className="contents-box-title">
                  <span>의심거래 적발현황</span>
                  <div className="main-title-option">
                    {/* <button className="main-info-board-more-btn" onClick={() => handleCartPubClick('./ilg/lpad')} title="더보기 버튼"></button> */}
                  </div>
                </h1>
                <div className="contents-box-con">
                  {/* 라운드형 탭 시작 */}
                  <TabContext value={valueTab2}>
                    <div className="tabs-round-type">
                      <TabList
                        className="tab-list"
                        onChange={handleChangeTab2}
                        aria-label="의심거래 적발현황 탭 그룹"
                      >
                        <Tab key={1} label={'화물'} value={String(1)} />
                        <Tab key={2} label={'택시'} value={String(2)} />
                      </TabList>
                      <div className="tab-content">
                        <TabPanel key={1} value={String(1)}>
                          <div className="table-scrollable">
                            <table className="table table-bordered">
                              <caption>의심거래 적발현황 테이블 요약</caption>
                              <colgroup>
                                <col style={{ width: '70%' }}></col>
                                <col style={{ width: '30%' }}></col>
                              </colgroup>
                              <thead>
                                <tr>
                                  <th scope="col">구분</th>
                                  <th scope="col">건수</th>
                                </tr>
                              </thead>
                              <tbody>
                                {freightSuspiciousDetections &&
                                freightSuspiciousDetections.length > 0 ? (
                                  freightSuspiciousDetections.map(
                                    (freightSuspiciousDetection, index) => {
                                      return (
                                        <tr>
                                          <td className="t-left">
                                            {
                                              freightSuspiciousDetection.patternNm
                                            }
                                          </td>
                                          <td className="t-right">
                                            {freightSuspiciousDetection.cnt}
                                          </td>
                                        </tr>
                                      )
                                    },
                                  )
                                ) : (
                                  <>
                                    <tr>
                                      <td className="t-left">주유 패턴이상</td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        단시간 반복주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">1일 4회이상</td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        탱크용량 초과주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        톤급별 평균대비 초과주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        거리대비 주유시간이상
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        유효하지 않은 사업자 의심 주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        주행거리 기반 주유량 의심 주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </TabPanel>
                        <TabPanel key={2} value={String(2)}>
                          <div className="table-scrollable">
                            <table className="table table-bordered">
                              <caption>의심거래 적발현황 테이블 요약</caption>
                              <colgroup>
                                <col style={{ width: '70%' }}></col>
                                <col style={{ width: '30%' }}></col>
                              </colgroup>
                              <thead>
                                <tr>
                                  <th scope="col">구분</th>
                                  <th scope="col">건수</th>
                                </tr>
                              </thead>
                              <tbody>
                                {taxiSuspiciousDetections &&
                                taxiSuspiciousDetections.length > 0 ? (
                                  taxiSuspiciousDetections.map(
                                    (taxiSuspiciousDetections, index) => {
                                      return (
                                        <tr>
                                          <td className="t-left">
                                            {taxiSuspiciousDetections.patternNm}
                                          </td>
                                          <td className="t-right">
                                            {taxiSuspiciousDetections.cnt}
                                          </td>
                                        </tr>
                                      )
                                    },
                                  )
                                ) : (
                                  <>
                                    <tr>
                                      <td className="t-left">주유 패턴이상</td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        단시간 반복주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">1일 4회이상</td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        탱크용량 초과주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        톤급별 평균대비 초과주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        거리대비 주유시간이상
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        유효하지 않은 사업자 의심 주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                    <tr>
                                      <td className="t-left">
                                        주행거리 기반 주유량 의심 주유
                                      </td>
                                      <td className="t-right">00,00</td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </TabPanel>
                      </div>
                    </div>
                  </TabContext>
                  {/* 라운드형 탭 끝 */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {detailMoalFlag && selectedNotice && (
          <ModifyDialog
            size="lg"
            title="공지사항"
            handleDetailCloseModal={handleDetailCloseModal}
            selectedRow={selectedNotice}
            open={detailMoalFlag}
          ></ModifyDialog>
        )}{' '}
      </div>
    </PageContainer>
  )
}
