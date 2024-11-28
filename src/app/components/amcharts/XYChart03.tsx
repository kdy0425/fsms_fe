import React, { useRef, useLayoutEffect } from 'react';

// mcharts import
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BusMonthlySubsidyPaymentStatus, FreightMonthlySubsidyPaymentStatus, TaxiMonthlySubsidyPaymentStatus } from '@/types/main/main';

am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true

interface monthlyprops {
  monthly:  
      FreightMonthlySubsidyPaymentStatus[]
    | TaxiMonthlySubsidyPaymentStatus[] 
    | BusMonthlySubsidyPaymentStatus[]
    // | 택시 rfid 신청 현황[]
}

function isFreight(
  monthly: any[]
): monthly is FreightMonthlySubsidyPaymentStatus[] {
  return (
    Array.isArray(monthly));
}

function isBus(
  monthly: any[]
): monthly is BusMonthlySubsidyPaymentStatus[] {
  return (
    Array.isArray(monthly) 
  );
}

function isTexi(
  monthly: any[]
): monthly is TaxiMonthlySubsidyPaymentStatus[] {
  return (
    Array.isArray(monthly) 
  );
}


function transformRfidPulist(
  monthly:
  | FreightMonthlySubsidyPaymentStatus[]
  | TaxiMonthlySubsidyPaymentStatus[]
  | BusMonthlySubsidyPaymentStatus[]
  ): any[] {

    if (isBus(monthly)) {
      console.log('isBus',monthly)
      return monthly.map((item) => {
        const busItem = item as BusMonthlySubsidyPaymentStatus; // 타입 단언
        return {
          country: busItem.crtrYm ? parseInt(busItem.crtrYm.slice(4, 6),10) +'월' : '00월',
          research: parseFloat(busItem.opsAmt as string),
        };
      });
    }
    if (isTexi(monthly)) {
      console.log('isTexi',monthly)
      const mon = monthly as TaxiMonthlySubsidyPaymentStatus[]
      return mon.map((item) => {
        const taxiItem = item as TaxiMonthlySubsidyPaymentStatus; // 타입 단언
        return {
          country: taxiItem.crtrYm ? parseInt((taxiItem.crtrYm.slice(4, 6)),10)  +'월' : '00월',
          research: parseFloat(taxiItem.opsAmt as string),
        };
      });
    }

    
    if (isFreight(monthly)) {
      console.log('isFreight',monthly)
      const mon = monthly as FreightMonthlySubsidyPaymentStatus[]
      return mon.map((item) => {
        const freightItem = item as FreightMonthlySubsidyPaymentStatus; // 타입 단언
        return {
          country: freightItem.crtrYm ?  parseInt((freightItem.crtrYm.slice(4, 6)),10) +'월' : '00월',
          research: parseFloat(freightItem.opsAmt as string),
        };
      });
    }
  
    console.log('아무것도 해당 안 됨 !')
    return []
}

const XYChartTest: React.FC<monthlyprops>  = ({monthly}) => {


  if(!monthly ){
    return null;
  }

  const chart = useRef(null);

  useLayoutEffect(() => {

    // Create chart instance
    var chart = am4core.create("chartdiv3", am4charts.XYChart);

    // amcharts 워터 마크 삭제 (라이센스 필히 확인해볼 것)
    if (chart.logo) {
      chart.logo.disabled = true;
    }

    chart.marginRight = 400;

    console.log('monthly 데이터 ! :',monthly) 

    // Add data
    chart.data = monthly &&  monthly.length > 0?  
    transformRfidPulist(monthly) : [
      {
        "country": "1월",
        "research": 501.9,
      }, {
        "country": "2월",
        "research": 301.9,
      }, {
        "country": "3월",
        "research": 201.1,
      }, {
        "country": "4월",
        "research": 165.8,
        "marketing": 122,
        "sales": 90
      }, {
        "country": "5월",
        "research": 139.9,
      }, {
        "country": "6월",
        "research": 128.3,
      }, {
        "country": "7월",
        "research": 501.9,
      }, {
        "country": "8월",
        "research": 301.9,
      }, {
        "country": "9월",
        "research": 201.1,
      }, {
        "country": "10월",
        "research": 165.8,
        "marketing": 122,
        "sales": 90
      }, {
        "country": "11월",
        "research": 139.9,
      }, {
        "country": "12월",
        "research": 128.3,
      },
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

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    // chart.legend = new am4charts.Legend();
  }, []);

  return (
    <div id="chartdiv3" style={{ width: "100%", height: "360px" }}></div>
  );
};

export default XYChartTest;