/*
 * @Author: 任继民
 * @Date: 2020-11-18 11:08:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 18:29:18
 * @Description:
 */
export default {
  totalAnalysisOptions: {
    grid: {
      left: "10",
      right: '18%',
      // bottom: '2%',
      // top: '2%',
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none",
      },
      formatter: function (params) {
        return params[0].name + " : " + params[0].value;
      },
    },
    xAxis: [{
        type: "value",
        name: "%",
        splitLine: {
            show: false
        },
        nameTextStyle: {
          fontSize: 14,
          align: 'center',
          verticalAlign: 'middle',
          color: "#6f7583",
        },
        max: function(value) {
            return value.max
        },
        axisLine: {
            lineStyle: {
                color: '#D9D9D9'
            }
        },
        axisLabel: {
            color: '#666'
        }
    }],
    yAxis: [{
      type: "category",
      inverse: true,
      name:'',
      nameTextStyle: {
        fontSize: 14,
        align: 'center',
        shadowOffsetX: '20',
        verticalAlign: 'middle',
        padding: [0,0,0,540],
        color: "#6f7583",
      },
      data: [],
    }],
    series: [{
      name: "值",
      type: "bar",
      zlevel: 1,
      itemStyle: {
        normal: {
          color: "#30a5ff",
        },
      },
      barWidth: 14,
      data: [],
    }],
  },
  areaChangeOptions: {
    legend: {
      show: true,
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "10%",
    },
    tooltip: {
      show: "true",
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      transitionDuration: 0, //echart防止tooltip的抖动
    },
    grid: {
      top: "15%",
      right: "10%",
      left: "10%",
      bottom: "40px",
    },
    xAxis: [{
      type: "category",
      color: "#59588D",
      data: [],
      axisLabel: {
        margin: 20,
        color: "#999",
        textStyle: {
          fontSize: 18,
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
      min: 0,
      max: 40,
      axisLabel: {
        formatter: "{value}",
        color: "#999",
        textStyle: {
          fontSize: 18,
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
      data: [],
      barWidth: "12px",
      itemStyle: {
        normal: {
          color: "#687ce5",
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
    },
    // {
    //   data: [10, 22, 8, 15],
    //   type: "line",
    //   smooth: false,
    //   name: "折线图",
    //   symbol: "none",
    //   lineStyle: {
    //     color: "#ffbb2a",
    //     width: 2,
    //     shadowColor: "rgba(0, 0, 0, 0.3)", //设置折线阴影
    //     shadowBlur: 15,
    //     shadowOffsetY: 20,
    //   },
    // }
  ],
  },
  urOptions: {
    legend: {
      show: true,
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "10%",
    },
    color: "#1890ff",
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
      type: 'value',
      name:'%',
      nameTextStyle: {
        fontSize: 12,
        align: 'left',
        // padding: [0,0,0,-40],
        color: "#6f7583",
      },
      axisTick: {
        show: true
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
        }
      },
      axisLabel: {
        show: true,
        color: "#6f7583",
        fontSize: 12,
        formatter: '{value}'
      },
      splitLine: {
        show: true,
        lineStyle: {
          // type: 'dashed'
        }
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
      data: [],
    }],
    series: [{
      name: "现状城镇建设用地面积",
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
  ecoOptions: {
    backgroundColor: "#fff",
    legend: {
      show: true,
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "10%",
    },
    color: "#26b99b",
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
      name: "平方千米",
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
      data: [],
    }],
    series: [{
      name: "生态保护红线范围内建设用地面积",
      type: "bar",
      barWidth: 15,
      label: {
        normal: {
          show: false,
          position: "right",
          textStyle: {
            color: "#26b99b",
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
  perOptions: {
    backgroundColor: "#fff",
    legend: {
      show: true,
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      right: "10%",
    },
    color: "#687ce5",
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
      name: "平方千米",
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
      data: [],
    }],
    series: [{
      name: "永久基本农田保护面积",
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
  bindIndexOptions: {
    backgroundColor: "#ffffff",
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
    barWidth: 15,
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.2)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: { //  改变x轴颜色
        lineStyle: {
          color: "#e8e8e8",
        },
      },
      axisLabel: { //  改变x轴字体颜色和大小
        textStyle: {
          color: "#6f7583",
          fontSize: 16,
        },
      },
    },
    yAxis: {
      type: "category",
      data: [],
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: { //  改变y轴颜色
        lineStyle: {
          color: "#e8e8e8",
        },
      },
      axisLabel: { //  改变y轴字体颜色和大小
        //formatter: '{value} m³ ', //  给y轴添加单位
        textStyle: {
          color: "#6f7583",
          fontSize: 16,
        },
      },
    },
    series: [{
      type: "bar",
      name: "总数量",
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: "right", //在上方显示
            textStyle: { //数值样式
              color: "rgba(250,250,250,0.6)",
              fontSize: 16,
              fontWeight: 600,
            },
          },
          color: '#30a5ff',
          // borderColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
          //   offset: 0,
          //   color: "rgba(160,196,225,1)",
          // }, {
          //   offset: 1,
          //   color: "rgba(61,126,235,1)",
          // }]),
          borderWidth: 2,
        },
      },
      data: [],
    }, {
      type: "bar",
      name: "上报数量",
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: "right", //在上方显示
            textStyle: { //数值样式
              color: "rgba(250,250,250,0.6)",
              fontSize: 16,
              fontWeight: 600,
            },
          },
          color: '#eda169',
          // borderColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
          //   offset: 0,
          //   color: "rgba(180,240,255,1)",
          // }, {
          //   offset: 1,
          //   color: "rgba(15,197,243,1)",
          // }]),
          borderWidth: 2,
        },
      },
      data: [],
    }],
  },
};
