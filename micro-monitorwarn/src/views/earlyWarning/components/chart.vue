<!--
 * @Author: 任继民
 * @Date: 2020-12-09 15:50:42
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 18:55:02
 * @Description:
-->
<template>
  <div class="quote-chart">
    <div id="ecoloChart" class="quotachart"></div>
  </div>
</template>
<script>
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
export default {
  props: {
    echartData: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    form: {
      region: '',
    },
  }),
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      initEcharts('ecoloChart',echartsOptions.indicatorAnalysisOptions);
    }
  },
  watch: {
    echartData: {
      handler: function(newV) {
        console.log(newV)
        if(newV) {
          let eName = [], eValue = []
          newV.forEach(item => {
            eName.push(item.arcname);
            eValue.push(item.mvalue)
          });
          this.$set(echartsOptions.indicatorAnalysisOptions.xAxis[0], 'data', eName);
          this.$set(echartsOptions.indicatorAnalysisOptions.yAxis, 'name', this.unit);
          this.$set(echartsOptions.indicatorAnalysisOptions.series[0], 'data', eValue);
          initEcharts('ecoloChart',echartsOptions.indicatorAnalysisOptions);
        }else {

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
  width: 424px;
  .chart-title{
    text-align: center;
  }
  .quotachart{
    height: 230px;
  }
}
</style>
