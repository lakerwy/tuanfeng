<!--  -->
<template>
  <div class="content" v-show="show">
    <div class="chart"></div>
    <div class="close" @click="show = false"></div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      show: false,
    };
  },

  props: {
    chartOptions: {
      type: Object,
    },
  },
  watch: {
    chartOptions(val) {
      if (Object.keys(val).length > 0) {
        this.show = true;
        this.createEchartsOverly(val);
      }else {
        this.show = false;
      }
    },
  },
  components: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    createEchartsOverly(chartOptions) {
      console.log(chartOptions)

      // 引入 ECharts 主模块
      var echarts = require("echarts/lib/echarts");
      // 引入柱状图
      require("echarts/lib/chart/bar");
      require("echarts/lib/chart/pie");
      // 引入提示框和标题组件
      require("echarts/lib/component/tooltip");
      require("echarts/lib/component/title");
      require("echarts/lib/component/dataset");
      require("echarts/lib/component/dataZoom");
      let echartsEle = document.querySelector(".chart");
      var myChart = echarts.init(echartsEle);
      const xAxisData = [],yAxisData = [],colorArr = [],pieData = []
      chartOptions.data.forEach(item => {
        xAxisData.push(item.type);
        yAxisData.push(item.count);
        colorArr.push(`#${Math.floor(Math.random()*0xffffff).toString(16)}`);
        pieData.push ({
          name: item.type,
          value: item.area? item.area.toFixed(2): 0
        })
      });
      // 绘制图表
      myChart.setOption({
        title: {
          text: `${chartOptions.title || '所有类'}个数和面积统计`,
          // textStyle: {
          //   width: "600px",
          // },
          left: "150px",
        },
        // dataset: {
        //   source: chartOptions.data,
        // },
        grid: [
          {
            top: 70,
            width: "38%",
            bottom: 0,
            left: 25,
            containLabel: true,
          },
        ],
        tooltip: {},
        yAxis: {
          type: "value",
          name: "个数",
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#424e67",
              fontSize: 12,
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#ccc",
            },
          },
          nameTextStyle: {
            color: "#424e67",
          },
          axisTick: {
            length: 2,
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            textStyle: {
              color: "#424e67",
              fontSize: 12,
              lineHeight: 16,
            },
            interval: 0,
            rotate: 50,
          },
          axisLine: {
            lineStyle: {
              color: "#ccc",
            },
          },
          data: xAxisData
          // axisTick: {
          //   length: 2,
          // },
        },
        calculable: true,
        dataZoom: [{
          show: true,
          height: 10,
          xAxisIndex: [0],
          bottom: 0,
          "start": 0,
          "end": 35,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '50%',
          handleStyle: {
            color: "#5B3AAE",
          },
          textStyle:{
              color:"rgba(204,187,225,0.5)",
          },
          fillerColor:"rgba(67,55,160,0.4)",
          borderColor: "rgba(204,187,225,0.5)",

          }, {
          type: "inside",
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            type: "bar",
            itemStyle: {
              color: function (params) {
                return colorArr[params.dataIndex];
              },
            },
            barWidth: 20,
            data: yAxisData,
          },
          {
            type: "pie",
            id: "pie",
            radius: "40%",
            center: ["75%", "50%"],
            label: {
              align: "center",
              verticalAlign: "middle",
              lineHeight: 14,
              formatter: function (e) {
                var newStr = " ";
                var start, end;
                var name_len = e.name.length; //每个内容名称的长度
                var max_name = 4; //每行最多显示的字数
                var new_row = Math.ceil(name_len / max_name); // 最多能显示几行，向上取整比如2.1就是3行
                if (name_len > max_name) {
                  //如果长度大于每行最多显示的字数
                  for (var i = 0; i < new_row; i++) {
                    //循环次数就是行数
                    var old = ""; //每次截取的字符
                    start = i * max_name; //截取的起点
                    end = start + max_name; //截取的终点
                    if (i == new_row - 1) {
                      //最后一行就不换行了
                      old = e.name.substring(start);
                    } else {
                      old = e.name.substring(start, end) + "\n";
                    }
                    newStr += old; //拼接字符串
                  }
                } else {
                  //如果小于每行最多显示的字数就返回原来的字符串
                  newStr = e.name;
                }
                return newStr;
              },
            },
            encode: {
              itemName: "type",
              value: "area",
              tooltip: "area",
            },
            tooltip: {
              formatter: function (e) {
                return `${e.name} : ${e.data.value} km<sup>2</sup> (${e.percent}%)`;
              },
            },
            itemStyle: {
              color: function (params) {
                return colorArr[params.dataIndex];
              },
            },
            data: pieData
          },
        ],
      });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  background: #fff;
  padding: 2px 8px;
  font-size: 12px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  position: absolute;
  top: 100px;
  right: 20px;
  border-radius: 4px;
}
.chart {
  width: 600px;
  height: 500px;
  padding: 24px 0 18px 0;
}
.close {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  background: url("../../assets/imgs/icon-clear.png") no-repeat center;
  z-index: 2;
}
</style>
