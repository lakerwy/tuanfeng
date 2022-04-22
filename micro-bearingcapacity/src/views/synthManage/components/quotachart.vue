<!--
 * @Author: 任继民
 * @Date: 2020-12-01 10:46:50
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-17 09:34:37
 * @Description:
-->
<template>
  <div class="quote-chart">
    <div class="chart-title">
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="指标：">
          <a-select default-value="warningStatus"  @change="handleChange">
            <a-select-option value="warningStatus">
              总体预警状态
            </a-select-option>
            <a-select-option value="farmingStatus">
              农业生产承载预警状态
            </a-select-option>
            <a-select-option value="constructionStatus">
              城镇建设承载预警状态
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div id="quotaChart" class="quotachart"></div>
  </div>
</template>
<script>
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
export default {
  props: {
    chartData: {
      type: Array,
      defalut: () => []
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
    initChart(val, str='warningStatus') {
      if (!val) return;
      let hetval = 0, lightval = 0,heaval = 0;
      val.map(item => {
        switch(item[str]) {
          case 0:
            hetval += 1;
            break;
          case 1:
            lightval += 1;
            break;
          case 2:
            heaval += 1;
            break;
          default:
            break;
        }
      })
      console.log(hetval)
      this.$set(echartsOptions.quotaOptions.series[0].data[0], 'value', hetval)
      this.$set(echartsOptions.quotaOptions.series[0].data[1], 'value', lightval)
      this.$set(echartsOptions.quotaOptions.series[0].data[2], 'value', heaval)
      initEcharts('quotaChart',echartsOptions.quotaOptions);
    },
    handleChange(value) {
      this.initChart(this.chartData,value);
    }
  },
  watch: {
    chartData: {
      handler: function(newV) {
        console.log(newV)
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
  width: 304px;
  .chart-title{
    text-align: center;
  }
  .quotachart{
    width: 304px;
    height: calc(100% - 60px);
  }
}
</style>
