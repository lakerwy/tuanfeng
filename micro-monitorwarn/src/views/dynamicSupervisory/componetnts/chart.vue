<!--
 * @Author: 任继民
 * @Date: 2020-12-09 15:50:42
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-21 16:56:27
 * @Description:
-->
<template>
  <div class="quote-chart">
    <div class="back-btn">
      <div class="back" @click="goBack">
        回退
      </div>
    </div>
    <div class="chart-title">
    </div>
    <div id="dynamSupChart" class="quotachart"></div>
  </div>
</template>
<script>
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
export default {
  props: ["chartData","type"],
  data: () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    currentType: 0,
    form: {
      region: '',
    },
    chartobj: null,
  }),
  mounted() {
    console.log(echartsOptions)
    this.initChart();
  },
  methods: {
    initChart(val = []) {
      let that = this;
      let dataname = [], totaldata = [], indexData = [];
      val.map(item => {
        dataname.push(item.name)
        totaldata.push(item.count);
        indexData.push(item.type)
      })
      this.$set(echartsOptions.totalAnalysisOptions.xAxis[0], 'data', dataname)
      this.$set(echartsOptions.totalAnalysisOptions.series[0], 'data', totaldata)
      this.$set(echartsOptions.totalAnalysisOptions.series[1], 'data', indexData)
      this.$set(echartsOptions.totalAnalysisOptions.title, 'text', `${this.currentType ==0? '指标预警': '指标监测'}数量统计`)
      this.chartobj = initEcharts('dynamSupChart', echartsOptions.totalAnalysisOptions);
      this.chartobj.off('click');
      this.chartobj.on('click', function(param) {
        that.$emit('chartClick',param.name);
      })
    },
    goBack(){
      this.$emit('goBack','')
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
        }
      },
      immediate: true
    },
    type: {
      handler: function(newV) {
        console.log(newV)
        if(newV) {
          this.currentType = newV;
        }
      },
      immediate: true
    }
  },
}
</script>
<style lang="scss" scoped>
.quote-chart{
  position: relative;
  margin-left: 24px;
  width: 740px;
  background-color: #ffffff;
  .chart-title{
    text-align: center;
  }
  .quotachart{
    height: 260px;
  }
}
.back-btn {
  position: absolute;
  right: 45px;
  top: 8px;
  z-index: 1000;

  .back {
    background-color: #e5f2ff;
    border-radius: 4px;
    border: solid 1px #91caff;
    text-align: center;
    font-size: 14px;
    color: #1890ff;
    padding: 4px 19px;
    cursor: pointer;
  }
}
</style>
