<!--
 * @Author: 任继民
 * @Date: 2020-11-27 08:40:08
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-06 15:18:06
 * @Description:
-->
<template>
  <section class="trend-chart">
    <section class="title">
      <div class="left-text">{{chartTitle}}</div>
      <div class="right-text">
        <span class="text">单位: 平方千米</span>
        <img src="" alt="" srcset="">
      </div>
    </section>
    <section class="chart">
      <div :id="mapid"></div>
    </section>
  </section>
</template>
<script>
export default {
  props: {
    chartTitle: {
      type: String,
      default: '现状城镇建设用地面积历年变化趋势'
    },
    mapid: {
      type: String,
      default: 'id'
    }
  },
  data: () => ({

  }),
  mounted() {
    // this.initChart();
  },
  methods: {
    // initChart() {
    //   initEcharts('trendChart',echartsOptions.trendOptions);
    // }
  }
}
</script>
<style lang="scss" scoped>
.trend-chart {
  margin-top: 16px;
  background-color: #ffffff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .left-text{
      font-size: 16px;
      color: #454954;
      padding-left: 20px;
    }
    .right-text {
      padding-right: 20px;
      .text {
        color: #6f7583;
      }
    }
  }
  .chart {
    height: 100%;
    div {
      height: calc(100% - 50px);
      width: 518px;
    }
  }
}
</style>
