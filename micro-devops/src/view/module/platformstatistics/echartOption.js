/*
 * @Author: 任继民
 * @Date: 2020-11-18 11:08:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-09 13:33:29
 * @Description:
 */
export default {
  indicatorAnalysisOptions: {
    backgroundColor: "#fff",
    legend: {
      show: true,
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "10%",
      data: [
        { name: "重要" },
      ],
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
      formatter: function(params) {
        return  params[0].name + ': ' + params[0].value + '个'
      }
    },
    yAxis: [{
      type: "value",
      name: "日访问量",
      nameTextStyle: {
        fontSize: 12,
        align: "left",
        padding: [0, 0, 0, -40],
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
    }, {
      type: "value",
      gridIndex: 0,
      min: 50,
      max: 100,
      splitNumber: 12,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"],
        },
      },
    }],
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
        // rotate: "45"
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
      zlevel: 11,
      data: [50, 60, 70, 80, 10, 40, 40, 50, 30, 90, 30, 55, 70, 89, 23, 69],
    }, {
      name: "背景",
      type: "bar",
      barWidth: 15,
      xAxisIndex: 0,
      yAxisIndex: 1,
      barGap: "-100%",
      data: [
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
      ],
      itemStyle: {
        normal: {
          color: "#EEF5FC",
        },
      },
      zlevel: 9,
    }],
  },
  activityOptions: {
    tooltip: {
      trigger: "axis",
    },
    xAxis: [{
      type: "category",
      data: ["2019-01", "2019-02", "2019-03", "2019-04", "2019-05", "2019-06"],
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
    }],
    yAxis: [{
      type: "value",
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          // type: "dashed",
          color: "#DDD",
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#E8E8E8",
        },
      },
      axisLabel: {
        textStyle: {
          color: '#6f7583'
        }
      },
      nameTextStyle: {
        color: "#E8E8E8",
      },
      splitArea: {
        show: false,
      },
    }],
    series: [{
      name: "课时",
      type: "line",
      symbol: 'circle',
      symbolSize: 10,
      data: [23, 60, 20, 36, 23, 85],
      lineStyle: {
        normal: {
          width: 2,
          color: {
            type: "linear",
            // color: "#48D8BF",
            colorStops: [{
              offset: 0,
              color: "#EFA976", // 0% 处的颜色
            }, {
              offset: 1,
              color: "#EFA976",
            } // 100% 处的颜色
            ],
            globalCoord: false, // 缺省为 false
          },
          // shadowColor: "rgba(72,216,191, 0.3)",
          // shadowBlur: 10,
          // shadowOffsetY: 20,
        },
      },
      itemStyle: {
        normal: {
          color: "#fff",
          borderWidth: 2,
          /*shadowColor: 'rgba(72,216,191, 0.3)',
              shadowBlur: 100,*/
          borderColor: "#EFA976",
        },
      },
      smooth: true,
    }],
  },
};
