export default {
  totalAnalysisOptions: {
    tooltip: {
      trigger: 'item',
      padding: [10, 10, 10, 10],
      formatter: "{b} :<br/> {d}%"
    },
    legend: {
      show: true,
      orient: 'vertical',
      itemGap: 24,
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 12,
      right: '5%',
      top: '42%',
    },
    series: [{
      name: '',
      type: 'pie',
      radius: ['40%', '65%'],
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
      data: [{
        name: "重要",
        value: "150",
        itemStyle: {
          normal: {
            color: '#4b84f4'
          }
        }
      }, {
        name: "一般重要",
        value: "116",
        itemStyle: {
          normal: {
            color: '#17aee0'
          }
        }
      }, {
        name: "极重要",
        value: "220",
        itemStyle: {
          normal: {
            color: '#18469f'
          }
        }
      }]
    }, {
      type: 'pie',
      radius: ['40%', '46%'],
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
  indicatorAnalysisOptions: {
    backgroundColor: '#fff',
    legend: {
      show: true,
      itemGap: 24,
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 12,
      right: '10%',
    },
    color: '#4b84f4',
    grid: {
      left: '2%',
      right: '5%',
      top: '18%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      show: "true",
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: 'value',
      name:'百分比',
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
        formatter: '{value}%'
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
        rotate: "45"
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
      data: ['团风镇', '淋山河镇', '方高坪镇', '回龙山镇', '马曹庙镇', '上巴河镇', '总路咀镇', '但店镇', '贾庙乡', '杜皮乡'],
    }],
    series: [{
      name: '重要',
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
      data: [50, 60, 70, 80, 10, 40, 40, 50, 30, 100, 30, 55, 70, 89, 23, 69]
    }]
  }
}
