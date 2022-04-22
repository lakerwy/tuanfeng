import echarts from 'echarts'

export default {
  analysisOptions: {
    backgroundColor: '#fff',
    legend: {
      show: true,
      itemGap: 24,
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 12,
      right: '10%',
    },
    // color: '#3dc6e3',
    grid: {
      left: '5%',
      right: '5%',
      top: '18%',
      bottom: '10%',
      containLabel: true
    },
    tooltip: {
      show: "true",
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      position: function (point, params, dom, rect, size) {
        // 固定在顶部
        // console.log(params, 'params')
        // console.log(rect, 'rect')
        return [point[0], '10%'];
      },
      transitionDuration: 0,//echart防止tooltip的抖动
    },
    yAxis: {
      type: 'value',
      name:'',
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
          color: '#e8e8e8',
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
          color: '#e8e8e8',
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
      // data: ['团风镇', '淋山河镇', '方高坪镇', '回龙山镇', '马曹庙镇', '上巴河镇', '总路咀镇', '但店镇', '贾庙乡', '杜皮乡'],
      data: [],
    }],
    series: [{
      name: '当前值',
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#80a6f4'
            },
            {
                offset: 1,
                color: '#5b8ff9'
            }
          ], false),
        }
      },
      // data: [500000000, 690000000, 700000000, 800000000, 100000000, 4000000, 690000000, 700000000, 800000000, 100000000]
      data: []
    }, {
      name: '规划目标值',
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#64edb7'
            },
            {
                offset: 1,
                color: '#5ad8a6'
            }
          ], false),
        }
      },
      // data: [200000000, 610000000, 500000000, 300000000, 20000000, 4000000,  690000000, 700000000, 800000000, 100000000]
      data: []
    }]
  }
}
