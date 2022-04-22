/*
 * @Author: 任继民
 * @Date: 2020-11-18 11:08:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-06 15:32:35
 * @Description:
 */
export default {
  trendOptions: {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          opacity: 0,
        },
      },
      // formatter: function (prams) {
      //   if (prams[0].data === min) {
      //     return "城镇规模：0%";
      //   } else {
      //     return "城镇规模：" + prams[0].data;
      //   }
      // },
    },
    legend: {
      data: ["总数量", "上报数量"],
      top: "5%",
      right: "10",
      textStyle: {
        color: "#575757",
        fontSize: 12,
      },
    },
    grid: {
      top: "15%",
      right: "10%",
      left: "18%",
      bottom: "12%",
    },
    xAxis: [{
      type: "category",
      color: "#59588D",
      data: ["2019Q1", "2019Q2", "2019Q3", "2019Q4"],
      axisLabel: {
        margin: 10,
        color: "#6f7583",
        textStyle: {
          fontSize: 12,
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(107,107,107,0.37)",
        },
      },
      axisTick: {
        show: false,
      },
    }],
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: "{value}",
        color: "#454954",
        textStyle: {
          fontSize: 12,
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(107,107,107,0.37)",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(131,101,101,0.2)",
          type: "dashed",
        },
      },
    }],
    series: [{
      type: "bar",
      name: "合格率",
      data: [40, 80, 20, 6],
      barWidth: "20px",
      itemStyle: {
        normal: {
          color: "#6aadff",
          // color: function (params) { //展示正值的柱子，负数设为透明
          //   let colorArr = params.value > 0
          //     ? ["#FF9A22", "#FFD56E"]
          //     : ["rgba(0,0,0,0)", "rgba(0,0,0,0)"];
          //   return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //     offset: 0,
          //     color: colorArr[0], // 0% 处的颜色
          //   }, {
          //     offset: 1,
          //     color: colorArr[1], // 100% 处的颜色
          //   }], false);
          // },
          // barBorderRadius: [30, 30, 0, 0],
        },
      },
      label: {
        normal: {
          show: false,
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          position: "top",
        },
      },
    }// {
      //   data: [48, 40, 10, 6],
      //   type: "line",
      //   smooth: false,
      //   name: "折线图",
      //   symbol: "none",
      //   lineStyle: {
      //     color: "#3275FB",
      //     width: 2,
      //     shadowColor: "rgba(0, 0, 0, 0.3)", //设置折线阴影
      //     shadowBlur: 15,
      //     shadowOffsetY: 20,
      //   },
      // }
    ],
  },
  writeOptions: {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          opacity: 0,
        },
      },
      // formatter: function (prams) {
      //   if (prams[0].data === min) {
      //     return "城镇规模：0%";
      //   } else {
      //     return "城镇规模：" + prams[0].data;
      //   }
      // },
    },
    legend: {
      show: true,
      orient: "vertical",
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "5%",
      top: "0%",
    },
    grid: {
      left: "13%",
      right: "5%",
      bottom: "10%",
      top: "7%",
      z: 22,
    },
    xAxis: [{
      axisLabel: {
        margin: 10,
        color: "#454954",
        textStyle: {
          fontSize: 12,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#e8e8e8",
        },
      },
      axisTick: {
        show: false,
      },
    }],
    yAxis: [{
      type: "value",
      // gridIndex: 0,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      // min: min,
      // max: 100,
      axisLine: {
        lineStyle: {
          color: "#e8e8e8",
        },
      },
      axisLabel: {
        color: "#454954",
        formatter: "{value}",
      },
    }],
    series: [{
      name: "合格率",
      type: "bar",
      barWidth: "24",
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          // barBorderRadius: [30, 30, 0, 0],
          color: "#30a5ff",
        },
      },
      data: [],
      zlevel: 11,
    }],
  },
  lineOptions: {
    backgroundColor: "#fff",
    grid: {
      top: "15%",
      right: "10%",
      left: "10%",
      bottom: "12%",
    },
    xAxis: [{
      type: "category",
      color: "#565656",
      data: ["2019Q1", "2019Q2", "2019Q3", "2019Q4"],
      axisLabel: {
        interval: 0, //解决X轴数据显示不全问题
        color: "#929292",
        rich: {
          a: {
            color: "#333",
            align: "center",
            fontSize: 18,
            fontWeight: "bold",
          },
        },
        // formatter: function (params, index) {
        //   return "{a|" + barDataList[index] + "}\n\n" + params;
        // },
        textStyle: {
          fontSize: 12,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#eee",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#eee",
          type: "dashed",
        },
      },
    }],
    yAxis: [{
      axisLabel: {
        // formatter: "{value}%",
        color: "#929292",
        textStyle: {
          fontSize: 10,
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(107,107,107,0)",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#eee",
        },
      },
    }],
    series: [{
      data: [48, 40, 10, 6],
      id: "a",
      type: "line",
      name: "折线图",
      symbolSize: 4,
      itemStyle: {
        normal: {
          lineStyle: { //折线
            color: "#BF3232",
            width: 1,
          },
          borderColor: "#BF3232", //圆点边框
        },
      },
    }],
  },
  trendlineOptions: {
    backgroundColor: "#fff",
    grid: {
      top: "15%",
      right: "10%",
      left: "10%",
      bottom: "12%",
    },
    xAxis: [{
      type: "category",
      color: "#565656",
      data: ["2019Q1", "2019Q2", "2019Q3", "2019Q4"],
      axisLabel: {
        interval: 0, //解决X轴数据显示不全问题
        color: "#929292",
        rich: {
          a: {
            color: "#333",
            align: "center",
            fontSize: 18,
            fontWeight: "bold",
          },
        },
        // formatter: function (params, index) {
        //   return "{a|" + barDataList[index] + "}\n\n" + params;
        // },
        textStyle: {
          fontSize: 12,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#eee",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#eee",
          type: "dashed",
        },
      },
    }],
    yAxis: [{
      axisLabel: {
        // formatter: "{value}%",
        color: "#929292",
        textStyle: {
          fontSize: 10,
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(107,107,107,0)",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#eee",
        },
      },
    }],
    series: [{
      data: [48, 40, 10, 6],
      id: "a",
      type: "line",
      name: "折线图",
      symbolSize: 4,
      itemStyle: {
        normal: {
          lineStyle: { //折线
            color: "#BF3232",
            width: 1,
          },
          borderColor: "#BF3232", //圆点边框
        },
      },
    }],
  },
};
