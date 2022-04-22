export default {
  totalAnalysisOptions: {
    color: ['#eda169', '#26b99b', '#80c269', '#30a5ff', '#0fc9d0'],
    tooltip: {
      trigger: 'item',
      padding: [10, 10, 10, 10],
      formatter: "{b} :<br/> {c}",
      transitionDuration: 0,//echart防止tooltip的抖动
    },
    legend: {
      show: true,
      orient: 'vertical',
      itemGap: 24,
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 12,
      right: '5%',
      top: '14%',
    },
    series: [{
      name: '',
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['38%', '50%'],
      label: {
        fontSize: 18,
        padding: [0, -50, 25, -45],
        formatter: function (param) {
          return param.percent + '%';
        },
        rich: {
          per0: {
            padding: [0, 0, 0, 5],
            fontSize: 13,
            fontWeight: 'bold',
            color: '#ffc770'
          },
          per1: {
            padding: [0, 0, 0, 5],
            fontSize: 13,
            fontWeight: 'bold',
            color: '#47d6ff'
          },
          per2: {
            padding: [0, 0, 0, 5],
            fontSize: 13,
            fontWeight: 'bold',
            color: '#479eff'
          }
        }
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 50
      },
      // data: [{
      //   name: "高",
      //   value: "150",
      // }, {
      //   name: "较高",
      //   value: "116",
      // }, {
      //   name: "中等",
      //   value: "220",
      // }, {
      //   name: "低",
      //   value: "220",
      // }, {
      //   name: "较低",
      //   value: "220",
      // }]
      data: []
    }, {
      type: 'pie',
      radius: ['35%', '41%'],
      center: ['38%', '50%'],
      silent: true,
      data: [{
        name: '',
        value: 1,
        itemStyle: {
          normal: {
            color: 'rgba(255,255,255,0.5)',
            // opacity: 0.5
          }
        }
      }]
    }]
  },
  analysisOptions: {
    backgroundColor: '#fff',
    // legend: {
    //   show: true,
    //   itemGap: 24,
    //   icon: 'rect',
    //   itemWidth: 20,
    //   itemHeight: 12,
    //   right: '10%',
    // },
    color: '#3dc6e3',
    grid: {
      left: '2%',
      right: '5%',
      top: '12%',
      bottom: '10%',
      containLabel: true
    },
    tooltip: {
      show: "true",
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      transitionDuration: 0,//echart防止tooltip的抖动
    },
    yAxis: {
      type: 'value',
      name:'公顷',
      nameTextStyle: {
        fontSize: 12,
        align: 'left',
        padding: [0,0,0,-40],
        color: "#6f7583",
      },
      axisTick: {
        show: false
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
        show: false
      },

      type: 'category',
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        color: '#454954',
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
          type: 'dashed'
        }
      },
      // data: ['<2', '2-6', '6-15', '15-25', '>25'],
      data: [],
    }],
    series: [{
      name: '适宜性',
      type: 'bar',
      barWidth: 15,
      label: {
        normal: {
          show: false,
          position: 'right',
          textStyle: {
            color: "#ccc",
            fontSize: 14
          }
        }
      },
      itemStyle: {
        normal: {
          // barBorderRadius: [0, 0, 5, 0],
        }
      },
      // data: [500000000, 690000000, 700000000, 800000000, 1000000000, 4000000]
      data: []
    }]
  }
}
