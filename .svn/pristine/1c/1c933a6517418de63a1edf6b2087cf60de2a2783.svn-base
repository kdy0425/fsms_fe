import React, { useRef, useLayoutEffect } from 'react';

// mcharts import
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BusCardDailyApplicationStatus, FreightDailyApplicationStatus, TaxiCardDailyApplicationStatus } from '@/types/main/main';

am4core.useTheme(am4themes_animated);

interface cardProps {
  cardPulist:  
      FreightDailyApplicationStatus[]
    | BusCardDailyApplicationStatus[] 
    | TaxiCardDailyApplicationStatus[]
}


// 타입 가드: FreightDailyApplicationStatus
function isFreightDailyApplicationStatus(
  cardPulist: any[]
): cardPulist is FreightDailyApplicationStatus[] {
  return Array.isArray(cardPulist); // 단순 배열 여부 확인
}

// 타입 가드: BusCardDailyApplicationStatus
function isBusCardDailyApplicationStatus(
  cardPulist: any[]
): cardPulist is BusCardDailyApplicationStatus[] {
  return Array.isArray(cardPulist); // 단순 배열 여부 확인
}

// 타입 가드: TaxiCardDailyApplicationStatus
function isTaxiCardDailyApplicationStatus(
  cardPulist: any[]
): cardPulist is TaxiCardDailyApplicationStatus[] {
  return Array.isArray(cardPulist); // 단순 배열 여부 확인
}

// 변환 함수
function transformCardPulist(
  cardPulist:
    | FreightDailyApplicationStatus[]
    | BusCardDailyApplicationStatus[]
    | TaxiCardDailyApplicationStatus[]
): any[] {
  if (isFreightDailyApplicationStatus(cardPulist)) {
    return cardPulist.map((item) => ({
      country: item.today ? item.today.slice(6, 8) : '00', // today -> country
      research: parseFloat(item.cardRCnt), //카드신청건수
      marketing: parseFloat(item.cardYCnt), // 카드 승인 
      sales: parseFloat(item.cardNCnt), // 카드거절건수
    }));
  }

  if (isBusCardDailyApplicationStatus(cardPulist)) {
    return cardPulist.map((item) => ({
      country: item.rcptYmd ? item.rcptYmd.slice(6, 8) : '00', // today -> country
      research: parseFloat(item.cardReqCnt), //카드신청건수
      marketing: parseFloat(item.cardApvlCnt), // 카드 승인 
      sales: parseFloat(item.cardRejectCnt), // 카드거절건수
    }));
  }

  if (isTaxiCardDailyApplicationStatus(cardPulist)) {
    return cardPulist.map((item) => ({
      country: item.rcptYmd ? item.rcptYmd.slice(6, 8) : '00', // today -> country
      research: parseFloat(item.reqCnt), //카드신청건수
      marketing: parseFloat(item.apvlCnt), // 카드 승인 
      sales: parseFloat(item.rejectCnt), // 카드거절건수
    }));
  }

  // Default case for unknown type
  throw new Error("Unknown cardPulist type check return value  \n :",cardPulist);
}




const XYChartTest: React.FC<cardProps> = ({cardPulist}) => {

  const chart = useRef(null);

  useLayoutEffect(( ) => {

    // Create chart instance
    var chart = am4core.create("chartdiv1", am4charts.XYChart);

    // amcharts 워터 마크 삭제 (라이센스 필히 확인해볼 것)
    if (chart.logo) {
      chart.logo.disabled = true;
    }

    chart.marginRight = 400;


  
    // "country": 날짜
    // "research": 
    // "marketing": 
    // "sales": 
    // Add data
    chart.data = cardPulist &&  cardPulist.length > 0?  transformCardPulist(cardPulist) : [
      {
        "country": "데이터X",
        "research": 11.1,  // 신청
        "marketing": 11,   // 승인 
        "sales": 11        // 거절 
      }, {
        "country": "데이터X",
        "research": 11.1,
        "marketing": 11,
        "sales": 11
      }, {
        "country": "데이터X",
        "research": 11.1,
        "marketing": 11,
        "sales": 11
      }, {
        "country": "데이터X",
        "research": 11.1,
        "marketing": 11,
        "sales": 11
      }, {
        "country": "데이터X",
        "research": 11.1,
        "marketing": 11,
        "sales": 11
      }, {
        "country": "데이터X",
        "research": 11.1,
        "marketing": 11,
        "sales": 11
      }
    ];

    //console.log('chart', chart);

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    // Value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.title.text = "왼쪽 타이틀";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "research";
    series.dataFields.categoryX = "country";
    series.name = "신청";
    series.tooltipText = "{name}: [bold]{valueY}[/]";
    series.stacked = true;

    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "marketing";
    series2.dataFields.categoryX = "country";
    series2.name = "승인";
    series2.tooltipText = "{name}: [bold]{valueY}[/]";
    series2.stacked = true;

    var series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "sales";
    series3.dataFields.categoryX = "country";
    series3.name = "거절";
    series3.tooltipText = "{name}: [bold]{valueY}[/]";
    series3.stacked = true;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
  }, []);

  return (
    <div id="chartdiv1" style={{ width: "100%", height: "220px" }}></div>
  );
};

export default XYChartTest;