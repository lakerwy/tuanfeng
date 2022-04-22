<!--
 * @Author: 任继民
 * @Date: 2020-11-14 11:36:17
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-14 13:01:54
 * @Description:
-->
<template>
  <div class="bar-chart">
    <div style="height:calc(100% - 50px);" id="indicator"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import echartsOptions from './echartsOptions'
export default {
  data:() =>({
    indicatorEchart: null
  }),
  mounted() {
    this.initIndicatorEcharts()
  },
  methods: {
    initIndicatorEcharts() {
      this.initEcharts('indicator', echartsOptions.indicatorAnalysisOptions)
    },
    initEcharts(id, options) {
      let echart = echarts.init(document.getElementById(id));
      echart.setOption(options,true);
      window.addEventListener('resize', () => {
        echart.resize();
      })
      return echart
    }
  },
}
</script>
<style lang="scss" scoped>
.bar-chart {
  height: calc(100% - 58px);
}
</style>
