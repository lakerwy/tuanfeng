<!--
 * @Author: 任继民
 * @Date: 2020-11-17 19:03:15
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-04 17:10:35
 * @Description:
-->
<template>
  <div class="total-stat">
    <Card>
      <div class="tstatic-num">
        <section v-for="(item,index) in titlelist" :key="index" :style="{'border-top': `3px solid ${item.color}` }">
          <div class="left">
            <div class="title-text">{{item.title}}</div>
            <div class="num-text" :style="{color: item.color}">{{item.num}}</div>
          </div>
          <div class="right">
            <img :src="item.img" alt="" srcset="">
          </div>
        </section>
      </div>
      <div class="tstatic-chart">
        <section>
          <div class="chart-title">热门资源统计</div>
          <div style="height:calc(100% - 50px);" id="indicator"></div>
        </section>
        <!-- <section>
          <div class="chart-title"></div>
          <div style="height:calc(100% - 50px);" id="activity"></div>
        </section> -->
      </div>
    </Card>
  </div>

</template>
<script>
import  HeaderContent from '@/components/header-content/index';
import { getserviceRequestLogStatistics } from '@/api/statistic'
import echartsOptions from './echartOption';
import { initEcharts } from '@/libs/chart'
export default {
  components: {
    HeaderContent
  },
  data: ()=>({
    titlelist:[
      {title: '平台访问总数', num: '13',  img: require('../../../assets/images/img-1.png'),color:'#40a5e5'},
      {title: '平台访问成功次数', num: '6854',  img: require('../../../assets/images/img-2.png'),color:'#3797f8'},
      {title: '平台访问失败次数', num: '542',  img: require('../../../assets/images/img-3.png'),color:'#eda068'},
      {title: '平台对接用户数', num: '555',  img: require('../../../assets/images/img-4.png'),color:'#26ba9c'},
    ]
  }),
  created() {
    this.initData();
  },
  mounted() {
    this.initChart();
  },
  methods: {
    async initData() {
      let total = 0,suTotal = 0,failTotal = 0, useTotal = [],indicName = [],indicValue = []
      let params = {
        page: 1,
        rows: 100
      }
      let res = await getserviceRequestLogStatistics(params);
      const { status, rows } = res;
      // console.log(rows)
      rows.forEach(item => {
        if(item.service_id=="总计"){
          total=item.total_count
          suTotal=item.success_count
          failTotal=item.fail_count
        }
        useTotal.push(item.user_id);
        if (item.service_name === '小计') {
          indicName.push(item.user_id);
          indicValue.push(item.success_count);
        }
      })
      // rows.forEach(item => {
      //   total += parseInt(item.total_count);
      //   suTotal += parseInt(item.success_count)
      //   failTotal += parseInt(item.fail_count)
      //   useTotal.push(item.user_id);
      //   if (item.service_name === '小计') {
      //     indicName.push(item.user_id);
      //     indicValue.push(item.success_count);
      //   }

      // });
      this.titlelist[0].num = total;
      this.titlelist[1].num = suTotal;
      this.titlelist[2].num = failTotal;
      this.titlelist[3].num = Array.from(new Set(useTotal)).length-1;
      this.$set(echartsOptions.indicatorAnalysisOptions.xAxis[0], 'data', indicName);
      this.$set(echartsOptions.indicatorAnalysisOptions.yAxis[0], 'name', '成功次数');
      this.$set(echartsOptions.indicatorAnalysisOptions.series[0], 'data', indicValue);
      initEcharts('indicator', echartsOptions.indicatorAnalysisOptions);
    },
    initChart() {
      initEcharts('indicator', echartsOptions.indicatorAnalysisOptions);
      initEcharts('activity',echartsOptions.activityOptions);
    }
  },
}
</script>
<style lang="less">
.total-stat {
  .ivu-card {
    background-color: #f5f5f5;
    .ivu-card-body {
      padding: 0;
      .tstatic-num {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        section {
          width: 25%;
          height: 180px;
          background-color: #ffffff;
          margin-right: 20px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .left {
            width: 50%;
            height: 100%;
            padding-left: 9%;
            .title-text{
              margin-top: 36px;
              font-size: 18px;
              color: #454954;
            }
            .num-text {
              margin-top: 21px;
              font-size: 48px;
            }
          }
          .right {
            width: 50%;
            text-align: center;
            // height: 100%;
          }
        }
        section:last-child {
          margin-right: 0;
        }
      }
      .tstatic-chart {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;
        section {
          height: 386px;
          width:100%;
          background-color: #ffffff;
          .chart-title {
            padding: 18px 0 0 22px;
            color: #454954;
            font-size: 16px;
          }
        }
        // section:last-child {
        //   margin-left: 21px;
        // }
      }
    }
  }
}
</style>
