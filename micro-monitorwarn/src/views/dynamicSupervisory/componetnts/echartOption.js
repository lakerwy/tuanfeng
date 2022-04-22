/*
 * @Author: 任继民
 * @Date: 2020-11-18 11:08:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-08 14:56:53
 * @Description:
 */
import echarts from 'echarts'

export default {
  totalAnalysisOptions: {
    title: {
      text: "监测指标数量统计",
      textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
        fontFamily: "MicrosoftYaHei",
        fontSize: 18,
        fontWeight: "bold",
        color: "#454954",
      },
      y: "12px",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        // console.log("params====", params);
        return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#30a5ff;"></span>` +
          params[0].seriesName + "：" + params[0].data + "</br>" +
          `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#26b99b;"></span>` +
          params[1].seriesName + "：" + params[1].data;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    legend: {
      show: true,
      padding: [12, 0, 0, 0],
    },
    xAxis: [{
      type: "category",
      data: [],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    }],
    yAxis: [{
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    }],
    series: [{
      name: "指标总数",
      type: "bar",
      data: [40, 55, 70, 50],
      itemStyle: {
        normal: {
          show: true,
          color: "#30a5ff",
        },
      },
      barWidth: 18,
    }, {
      name: "约束性指标数量",
      type: "bar",
      data: [40, 65, 85, 45],
      itemStyle: {
        normal: {
          show: true,
          color: "#26b99b",
        },
      },
      barWidth: 18,
    }],
  },
  indicatorAnalysisOptions: {
    backgroundColor: "#fff",
    legend: {
      show: true,
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "10%",
    },
    color: "#4b84f4",
    grid: {
      left: "2%",
      right: "5%",
      top: "18%",
      bottom: "5%",
      containLabel: true,
    },
    tooltip: {
      show: "true",
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      transitionDuration: 0, //echart防止tooltip的抖动
    },
    yAxis: {
      type: "value",
      name: "百分比",
      nameTextStyle: {
        fontSize: 12,
        align: "left",
        // padding: [0,0,0,-40],
        color: "#6f7583",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#ccc",
        },
      },
      axisLabel: {
        show: true,
        color: "#6f7583",
        fontSize: 12,
        formatter: "{value}",
      },
      splitLine: {
        show: true,
        lineStyle: {
          // type: 'dashed'
        },
      },
    },
    xAxis: [{
      axisTick: {
        show: false,
      },

      type: "category",
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#454954",
        interval: 0,
        rotate: "45",
        //   formatter:function(value)
        //   {
        //       return value.split("").join("\n");
        //   }
      },
      splitLine: {
        show: false,
        lineStyle: {
          type: "dashed",
        },
      },
      data: [
        "团风镇",
        "淋山河镇",
        "方高坪镇",
        "回龙山镇",
        "马曹庙镇",
        "上巴河镇",
        "总路咀镇",
        "但店镇",
        "贾庙乡",
        "杜皮乡",
      ],
    }],
    series: [{
      name: "重要",
      type: "bar",
      barWidth: 15,
      label: {
        normal: {
          show: false,
          position: "right",
          textStyle: {
            color: "#ccc",
            fontSize: 14,
          },
        },
      },
      itemStyle: {
        normal: {
          // barBorderRadius: [0, 0, 5, 0],
        },
      },
      data: [50, 60, 70, 80, 10, 40, 40, 50, 30, 100, 30, 55, 70, 89, 23, 69],
    }],
  },
  trendOption: {
    "color": [
      "#1890ff",
      "#1f9",
    ],
    grid: {
      right: "10%",
      bottom: "15%",
      left: "15%"
    },
    "legend": {
      "data": ["监测值", "增长率"],
      "selected": {},
      "itemGap": 20,
      "right": "10%",
    },
    "tooltip": {
      "trigger": "axis",
      "axisPointer": {
        "type": "cross",
      },
    },
    xAxis: {
      "type": "category",
      "boundaryGap": true,
      "axisTick": {
        "alignWithLabel": true,
      },
      "axisPointer": {
        "show": true,
      },
      "axisLabel": {
        color: "black",
      },
      data: ["20202.01", "20202.02", "20202.03", "20202.04","20202.05",],
    },
    yAxis: [{
      type: "value",
      name: "平方千米",
      "position": "left",
      "min": 0,
      "axisLabel": {
        "formatter": "{value}",
        color: "#6f7583",
      },
      "axisPointer": {
        "show": true,
      },
      "axisTick": {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#6f7583",
        },
      },
      "splitLine": {
        "show": true,

        lineStyle: {
          // color: '#27719F',
          colr: "#6f7583",
        },
      },
    }, {
      "type": "value",
      "name": "%",
      "position": "right",
      "axisLabel": {
        "formatter": "{value}",
        color: "#6f7583",
      },
      // "max": 200,
      "splitLine": {
        "show": false,
      },
      "axisPointer": {
        "show": true,
      },
      "axisTick": {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#6f7583",
        },
      },
    }],
    series: [{
      "type": "bar",
      "name": "监测值",
      "barWidth": "12%",
      data: [6, 9, 10, 5, 7],
      itemStyle: {
        normal: {
          color: "#687ce5",
        },
      },
    }, {
      "type": "line",
      "name": "增长率",
      "yAxisIndex": 1,
      itemStyle: {
        color: "#ffbb2a",
      },
      symbolSize: 10,
      symbol: "circle",
      data: [89, 93, 95, 88, 90],
    }],
  },
  chainOption: {
    grid: [{
      top: 20,
    }, {
      top: 20,
    }],
    legend: {
      show: false,
    },
    tooltip: {
      trigger: "axis",
      formatter: (comp, value) => {
        const [serie] = comp;

        return `${serie.seriesName} ${serie.name}: ${
          Math.round(serie.value )
        } %`;
      },
      axisPointer: {
        show: true,
        status: "shadow",
        z: -1,
        shadowStyle: {
          color: "#E6F7FF",
        },
        type: "shadow",
      },
    },
    xAxis: [{
      position: "bottom",
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#ECF1F6",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        rotate: 0,
        fontSize: 12,
        color: "#3A3A3C",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ECF1F6", "#ECF1F6"],
          width: 0,
          type: "dashed",
        },
      },
      gridIndex: 0,
      data: [
        "0-3岁",
        "4-15岁",
        "16-30岁",
        "31-45岁",
        "46-60岁",
        "61-75岁",
        "76-90岁",
        "91-115岁",
      ],
    }, {
      type: "category",
      gridIndex: 1,
      show: false,
    }],
    yAxis: [{
      type: "value",
      position: "left",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        rotate: 0,
        fontSize: 10,
        color: "#6E7D9C",
        formatter: (value, index) => `${value}`,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ECF1F6", "#ECF1F6"],
          width: 1,
          type: "solid",
        },
      },
      min: 0,
      gridIndex: 0,
    }, {
      gridIndex: 1,
      min: 0,
      max: 1,
      show: false,
    }],
    series: [{
      name: "底部backdrop",
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: "bar",
      data: [1, 1, 1, 1, 1, 1, 1, 1].map((value) => {
        return {
          value,
          itemStyle: {
            color: "transparent",
          },
        };
      }),
      barMaxWidth: "100%",
      silent: true,
      z: 2,
    }, {
      name: "环比增长率",
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: "#43A7FF",
      },
      type: "bar",
      data: [0.3, 0.4, 0.5, 0.8, 0.7, 0.7, 0.5, 0.8],
      barMaxWidth: "20%",
      z: 3,
    }],
  },
  targetComOption: {
    backgroundColor: "#fff",
    grid: {
      top: "10%",
      right: "15%",
      left: "15%",
      bottom: "12%",
    },
    xAxis: [{
      type: "category",
      color: "#59588D",
      data: ["2019Q1", "2019Q2", "2019Q3", "2019Q4"],
      axisLabel: {
        margin: 20,
        color: "#999",
        textStyle: {
          fontSize: 14,
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
      type: "value",
      name: "",
      position: "left",
      axisLabel: {
        formatter: "{value}",
        color: "#999",
        textStyle: {
          fontSize: 16,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#999",
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
      data: [40, 80, 20, 32],
      barWidth: "20px",
      itemStyle: {
        normal: {
          color: function (params) { //展示正值的柱子，负数设为透明
            let colorArr = params.value > 0
              ? ["#FF9A22", "#FFD56E"]
              : ["rgba(0,0,0,0)", "rgba(0,0,0,0)"];
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: colorArr[0], // 0% 处的颜色
            }, {
              offset: 1,
              color: colorArr[1],
            } // 100% 处的颜色
            ], false);
          },
          barBorderRadius: [30, 30, 0, 0],
        },
      },
      label: {
        normal: {
          show: true,
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          position: "top",
        },
      },
    }, {
      type: "bar",
      data: [40, 80, 20, 12],
      barWidth: "20px",
      barGap: "-100%",
      itemStyle: {
        normal: {
          color: function (params) { //展示负值的柱子，正数设为透明
            let colorArr = params.value > 0
              ? ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]
              : ["#FFD56E", "#FF9A22"];
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: colorArr[0], // 0% 处的颜色
            }, {
              offset: 1,
              color: colorArr[1],
            } // 100% 处的颜色
            ], false);
          },
          barBorderRadius: [0, 0, 30, 30],
        },
      },
    }],
  },
  targetRadioOption: {
    grid: {
      left: "50",
      // right: "75",
      bottom: "30",
      top: "30",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none",
      },
      formatter: function (params) {
        return "站目标比例<br>" + params[0].name + ": " + params[0].value + "%";
      },
    },
    xAxis: [{
      type: "value",
      axisLabel: {
        margin: 5,
        color: "#999",
        textStyle: {
          fontSize: "13",
        },
      },
      min: 0,
      // max: 110, // 计算最大值
      // interval: 110 / 5, //  平均分为5份
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          color: "#D8D8D8",
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    }, {
      type: "value",
      axisLabel: {
        show: false,
      },
      min: 0,
      // max: 110, // 计算最大值
      // interval: 110 / 10, //  平均分为5份
      splitNumber: 10,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#D8D8D8",
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    }],
    yAxis: [{
      type: "category",
      inverse: true,
      axisLabel: {
        textStyle: {
          color: "#999",
          fontSize: "13",
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#8E8E8E",
        },
      },
      data: ['2015','2016','2017','2018','2019','2020'],
    }],
    series: [{
      name: "值",
      type: "bar",
      zlevel: 1,
      xAxisIndex: 0,
      itemStyle: {
        normal: {
          barBorderRadius: [0, 5, 5, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color: "#1890FF", // 0% 处的颜色
          }, {
            offset: 1,
            color: "#63B4FF", // 100% 处的颜色
          }], false),
        },
      },
      barWidth: 15,
      data: [86, 90, 77, 63, 55, 25, 98, 65, 55, 66],
    }, {
      name: "背景",
      type: "bar",
      barWidth: 15,
      barGap: "-100%",
      xAxisIndex: 1,
      data: [100,100,100,100,100,100,100,100,100,100],
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color: "rgba(24,144,255,0.3)", // 0% 处的颜色
          }, {
            offset: 1,
            color: "rgba(99,180,255,0.3)", // 100% 处的颜色
          }], false),
          barBorderRadius: [0, 5, 5, 0],
        },
      },
    }],
  },
};
