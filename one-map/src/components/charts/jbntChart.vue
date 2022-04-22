<!--  -->
<template>
  <div class="content" v-show="jbntShow">
    <div class="jbntChart"></div>
    <div class="close" @click="jbntShow = false"></div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      jbntShow: false,
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
        this.jbntShow = true;
        this.createEchartsOverly(val);
      }else {
        this.jbntShow = false;
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
      // echarts 主题
      let theme = require("echarts/theme/dark-blue");
      // 引入柱状图
      require("echarts/lib/chart/bar");
      require("echarts/lib/chart/pie");
      // 引入提示框和标题组件
      require("echarts/lib/component/tooltip");
      require("echarts/lib/component/title");
      require("echarts/lib/component/legend");
      let colorArr = ["#37a2da", "#32c5e9", "#9fe6b8"];
      let echartsEle = document.querySelector(".jbntChart");
      let seriesData = [],legendData = []
      chartOptions.data.forEach(item => {
        let seriesobj = {};
        legendData.push(item.type);
        seriesobj.value = item.area ?(item.area).toFixed(2):0;
        seriesobj.name = item.type;
        seriesobj.areaUnit = item.areaUnit;
        seriesData.push(seriesobj)
      })
      // var myChart = echarts.init(echartsEle,'light');
      var myChart = echarts.init(echartsEle);
      // 绘制图表
      myChart.setOption({
        title: {
          text: `永久基本农田面积统计`,
          left: "200px",
        },
        tooltip: {
          trigger: 'item',
          borderColor: 'rgba(255,255,255,.3)',
          backgroundColor: 'rgba(13,5,30,.6)',
          borderWidth: 1,
          padding: 5,
          textStyle:{
            align:'left'
          },
          formatter: function(parms) {
            var str = parms.data.name + "  " + parms.marker + "</br>" +
                "面积：" + parms.data.value + parms.data.areaUnit + "</br>" +
                "占比：" + parms.percent + "%";
            return str;
          }
        },
        legend: {
          right: "8%",
          top: "13%",
          orient: 'vertical',
          data: legendData,
        },
        grid: [
          {
            top: 70,
            width: "38%",
            bottom: 0,
            left: 25,
            containLabel: true,
          },
        ],
        yAxis: {
          show: false,
        },
        xAxis: {
          show: false,
        },
        series: [
          {
            label: {
              normal: {
                position: 'inner',
                show: false
              }
            },
            name: "永久基本农田统计",
            type: "pie",
            radius: [50, 80],
            center: ["30%", "58%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorArr[params.dataIndex]
                }
              }
            },
            data: seriesData
          },
        ],
      });
    },
    dealData(data) {
      let arr = [];
      data.forEach((i) => {
        arr.push(i.area);
      });
      return arr
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
.jbntChart {
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
