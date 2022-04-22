<!--
 * @Author: 任继民
 * @Date: 2020-12-09 15:50:42
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-06 15:46:08
 * @Description:
-->
<template>
  <div class="quote-chart">
    <div class="chart-title">
    </div>
    <div id="quotaChart" class="quotachart" :style="{height: ChartHeight}"></div>
  </div>
</template>
<script>
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    ChartHeight: ''
  }),
  mounted() {
    this.initChart();
  },
  methods: {
    initChart(val) {
      let dataname = [], data = [];
      if (!val) return;
      val.map(item => {
        dataname.push(item.kpiname)
        data.push(item.mvalue);
      })
      this.ChartHeight = dataname.length > 24? dataname.length *20 + 30 + 'px': '510px';
      this.$set(echartsOptions.totalAnalysisOptions.yAxis[0], 'data', dataname);
      this.$set(echartsOptions.totalAnalysisOptions.series[0], 'data', data);
      let charts = initEcharts('quotaChart',echartsOptions.totalAnalysisOptions);
      charts.resize({height:this.ChartHeight});
      // charts.resize();
    }
  },
  watch: {
    chartData: {
      handler: function(newV) {
        if(newV) {
          this.tableData = newV;
          this.$nextTick(() => {
            this.initChart(newV);
          })
        }else {
          this.initChart(newV);
        }
      },
      immediate: true
    }
  },
}
</script>
<style lang="scss" scoped>
.quote-chart{
  margin-left: 24px;
  width: 622px;
  overflow-y: auto;
  //max-height: 500px;
  overflow-x: hidden;
  .chart-title{
    text-align: center;
  }
}
</style>
