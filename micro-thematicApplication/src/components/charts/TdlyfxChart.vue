<!--  -->
<template>
  <div class="tdlyfxcontent" v-show="show">
    <div class="tdlyfxchart"></div>
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
    chartOptions: {
      handler: function (val) {
        // console.log(val);
        if (val) {
          this.show = true;
          this.createEchartsOverly(val);
        } else {
          this.show = false;
        }
      },
      // immediate: true,
      // deep: true
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
      // let pieData = this.dealData(chartOptions.data)[0];
      let legendData = ["林地", "草地", "公共管理与公共服务设施用地"];

      let echartsEle = document.querySelector(".tdlyfxchart");
      let myChart = echarts.init(echartsEle);
      // 绘制图表
      myChart.setOption({
        //color: colorArr,
        title: {
          text: `土地利用现状统计分析`,
          textStyle: {
            width: "600px",
          },
          left: "220px",
        },
        legend: {
          // right: 0,
          top: 30,
          // orient: "vertical",
          data: legendData,
        },
        dataset: {
          //,
          source: chartOptions.data,
        },
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     type: "shadow",
        //   },
        // },
        grid: [
          {
            top: 90,
            // width: "90%",
            height: "130px",
            // left: 25,
            // containLabel: true,
          },
        ],
        tooltip: {},
        yAxis: {
          type: "value",
          name: "平方千米",
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
            rotate: 30,
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
            name: "草地",
            type: "bar",
            itemStyle: {
              color: "#37a2da",
            },
            encode: {
              // 将 "amount" 列映射到 X 轴。
              x: "region",
              // 将 "product" 列映射到 Y 轴。
              y: "cdArea",
            },
            barWidth: 10,
          },
          {
            name: "林地",
            type: "bar",
            //data: [5, 20, 36, 10, 10, 20]
            encode: {
              x: "region",
              y: "ldArea",
            },
            itemStyle: {
              color: "#9fe6b8",
            },
            barWidth: 10,
          },
          {
            name: "公共管理与公共服务设施用地",
            type: "bar",
            //data: [5, 20, 36, 10, 10, 20]
            encode: {
              x: "region",
              y: "ggArea",
            },
            itemStyle: {
              color: "rgba(74,185,198,1)",
            },
            barWidth: 10,
          },
        ],
      });
    },
  },
};
</script>
<style lang='less' scoped>
.tdlyfxcontent {
  background: #fff;
  padding: 2px 8px;
  font-size: 12px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  position: absolute;
  top: 100px;
  right: 50px;
  border-radius: 4px;
  z-index: 9;
}
.tdlyfxchart {
  width: 600px;
  height: 300px;
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
