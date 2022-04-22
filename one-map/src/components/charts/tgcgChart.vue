<!--  -->
<template>
  <div class="tgcgcontent" v-show="show">
    <div class="tgcgchart-bar"></div>
    <div class="tgcgchart-pie"></div>
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
      // 引入 ECharts 主模块
      var echarts = require("echarts/lib/echarts");
      // 引入柱状图
      require("echarts/lib/chart/bar");
      require("echarts/lib/chart/pie");
      // 引入提示框和标题组件
      require("echarts/lib/component/tooltip");
      require("echarts/lib/component/title");
      require("echarts/lib/component/dataset");
      require("echarts/lib/component/legend");
      let colorArr = [
        "rgba(238,241,181,1)",
        "rgba(36,149,195,1)",
        "rgba(74,185,198,1)",
        "rgba(70,184,199,1)",
        "rgba(77,127,203,1)",
        "rgba(44,134,193,1)",
        "rgba(141,210,177,1)",
        "rgba(40,149,194,1)",
        "rgba(201,233,182,1)",
        "rgba(201,233,182,1)",
      ];
      let Data = this.dealData(chartOptions.data)
      
      if(chartOptions.data.length>0){
        chartOptions.data.forEach(item=>{
          item.tgjscgfjsArea=item.tgjscgfjsArea.toFixed(2)
        })
      }
      let echartsEle1 = document.querySelector(".tgcgchart-bar");
      var myChart1 = echarts.init(echartsEle1);
      let echartsEle2 = document.querySelector(".tgcgchart-pie");
      var myChart2 = echarts.init(echartsEle2);
      // console.log(chartOptions)
      // 绘制图表
      myChart1.setOption({
        title: {
          text: `土规城规差异图斑统计`,
          textStyle: {
            width: "600px",
          },
          left: "200px",
        },
        legend: {
          right: "8%",
          top: "13%",
          data: ["土规非建设城规建设图斑数量", "土规建设城规非建设图斑数量"],
        },
        dataset: {
          source: chartOptions.data,
        },
        grid: [
          {
            right: "5%",
            width: '90%',
            height: '168px',
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
            rotate: 30
          },
          axisLine: {
            lineStyle: {
              color: "#ccc",
            },
          },
          axisTick: {
            length: 2,
          },
        },
        series: [
          {
            name: "土规非建设城规建设图斑数量",
            type: "bar",
            itemStyle: {
              color: "#37a2da",
            },
            encode: {
              x: "region",
              y: "tgfjscgjsnum",
            },
            barWidth: 10,
          },
          {
            name: "土规建设城规非建设图斑数量",
            type: "bar",
            encode: {
              x: "region",
              y: "tgjscgfjsnum",
            },
            itemStyle: {
              color: "#9fe6b8",
            },
            barWidth: 10,
          },
        ],
      });
      myChart2.setOption({
        legend: {
          data: Data[1],
        },
        dataset: {
          source: chartOptions.data,
        },
        grid: [
          {
            top: 10,
            left: 25,
            width: '95%',
            height: '90%',
            containLabel: true,
          },
        ],
        tooltip: {},
        series: [
          {
            name: "土规非建设城规建设图斑面积",
            type: "pie",
            selectedMode: "single",
            radius: [0, "65%"],
            center: ["30%", "58%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            encode: {
              itemName: "region",
              value: "tgfjscgjsArea",
              tooltip: "difArea",
            },
            // data: Data[2],
            tooltip: {
              formatter: function (e) {
                return `${e.seriesName}<br/>${e.name} : ${e.data.tgfjscgjsArea} km<sup>2</sup> (${e.percent}%)`;
              },
            },
          },
          {
            name: "土规建设城规非建设图斑面积",
            type: "pie",
            selectedMode: "single",
            radius: [0, "65%"],
            center: ["70%", "58%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            encode: {
              itemName: "region",
              value: "tgjscgfjsArea",
              tooltip: "difArea",
            },
            // data: Data[0],
            tooltip: {
              formatter: function (e) {
                return `${e.seriesName}<br/>${e.name} : ${e.data.tgjscgfjsArea} km<sup>2</sup> (${e.percent}%)`;
              },
            },
          },
        ],
      });
    },
    dealData(data) {
      let arr = [];
      let arr1 = [];
      data.forEach((i) => {
        arr1.push(i.region);
        arr.push({
          region: i.region,
          value: i.tgfjscgjsArea,
          name: "土规非建设城规建设图斑",
          itemStyle: {
            color: "#37a2da",
          },
        });
        arr.push({
          region: i.region,
          value: i.tgjscgfjsArea,
          name: "土规建设城规非建设图斑",
          itemStyle: {
            color: "#9fe6b8",
          },
        });
      });
      // console.log(arr);
      return [arr, arr1];
    },
  },
};
</script>
<style lang='less' scoped>
.tgcgcontent {
  background: #fff;
  padding: 2px 8px;
  font-size: 12px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  position: absolute;
  top: 100px;
  right: 20px;
  border-radius: 4px;
}
.tgcgchart-bar {
  width: 600px;
  height: 250px;
  padding: 10px 0 10px 0;
}
.tgcgchart-pie {
  width: 600px;
  height: 250px;
  //padding: 24px 0 18px 0;
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
