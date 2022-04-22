<!--
 * @Author: 任继民
 * @Date: 2020-12-09 15:50:42
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-11 14:33:58
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
    data: {
      type: Array,
      default: () => []
    },
    fieldValue: {
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
    initChart(val,str='rjczjsyd',unit='平方千米') {
      if (!val) return;
      let dataname = [], data = [];
      val.map(item => {
        dataname.push(item.qhname);
        data.push(item[str])
      })

      this.$set(echartsOptions.indicatorAnalysisOptions.yAxis, 'name', unit)
      this.$set(echartsOptions.indicatorAnalysisOptions.xAxis[0], 'data', dataname)
      this.$set(echartsOptions.indicatorAnalysisOptions.series[0], 'data', data)
      this.$set(echartsOptions.indicatorAnalysisOptions.series[0], 'name', this.fieldValue)
      initEcharts('ecoloChart', echartsOptions.indicatorAnalysisOptions)
    },
  },
  watch: {
    data: {
      handler: function(newV) {
        if(newV.length > 0) {
          this.tableData = newV;
          this.$nextTick(() => {
            this.initChart(newV);
          })
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
    height: 240px;
  }
}
</style>
