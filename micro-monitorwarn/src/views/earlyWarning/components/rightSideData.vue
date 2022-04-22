<!--
 * @Author: 任继民
 * @Date: 2020-12-09 16:52:17
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 18:41:09
 * @Description:
-->
<template>
  <div class="right-side">
    <section class="top-col">
      <div class="top-title">
        <span class="text">{{listData.name || '生态红线'}}</span>
        <div v-if="listData.status ==1" class="warnText">预警</div>
        <div v-else class="heatText">健康</div>
      </div>
      <div class="num">
        <div>
          <img src="" alt="">
          <span>监测值</span>
          <span><i>{{(listData.mvalue || 0).toFixed(2)}}</i>{{listData.unit}} </span>
        </div>
        <div>
          <img src="" alt="">
          <span>规划值</span>
          <span><i>{{(listData.planlocalvalue || 0).toFixed(2)}}</i>{{listData.unit}}</span>
        </div>
      </div>
    </section>
    <section class="center-col">
      <section class="title">{{listData.name}}情况</section>
      <section class="query">
        <!-- <div class="left-act">
          <span class="goback">
            <img src="../../../assets/images/icon-less.png" alt="">
            <span class="back">返回</span>
          </span>
          <span class="name">团风镇问题图斑详情</span>
        </div> -->
        <!-- <div class="right-act">
          <a-button type="primary">
            导出疑似问题图斑
          </a-button>
        </div> -->
      </section>
      <section class="data-table">
        <a-table :pagination="false" :scroll="{y: 160 }" :columns="columns" :data-source="rightData" bordered>
          <template slot="name" slot-scope="text">
            <a>{{ text }}</a>
          </template>
        </a-table>
      </section>
    </section>
    <section class="bottom-col">
      <section class="title">
        {{listData.name || '生态红线'}}
      </section>
      <section class="chart">
        <Chart :echartData="rightData" :unit="listData.unit"/>
      </section>
    </section>
  </div>
</template>
<script>
const columns = [
  {
    title: '行政区名',
    dataIndex: 'arcname',
  },
  {
    title: '监测值',
    dataIndex: 'mvalue',
    ellipsis:true

  },
  {
    title: '目标值',
    dataIndex: 'planlocalvalue',
    ellipsis:true
  },
  {
    title: '突破值',
    dataIndex: 'breakValue',
    ellipsis:true
  },
];
import Chart from '../components/chart'
export default {
  components: {
    Chart
  },
  props: {
    rightData: {
      type: Array,
      default: () => []
    },
    listData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    columns,
  }),
}
</script>
<style lang="scss" scoped>
.right-side {
  width: 482px;
  height: 700px;
  .top-col {
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    .top-title {
      padding: 15px 0 5px 19px;
      display: flex;
      .text {
        color: #454954;
        margin-right: 13px;
        font-weight: bold;
      }
      .warnText {
        background: #eda169;
        height: 24px;
        min-width: 42px;
        line-height: 24px;
        padding: 0 7px;
        font-size: 14px;
        border-radius: 4px;
        text-align: center;
      }
      .heatText {
        background: #5ec26d;
        height: 24px;
        min-width: 42px;
        line-height: 24px;
        padding: 0 7px;
        font-size: 14px;
        border-radius: 4px;
        text-align: center;
      }
    }
    .num {
      padding: 5px 20px 15px;
      display: flex;
      justify-content: flex-start;
      div {
        width: 50%;
        text-align: center;
        i {
          font-family: DINNextW1G;
          font-size: 24px;
          color: #eda169;
          margin-left: 22px;
        }
      }
    }
  }
  .center-col {
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    margin-top: 16px;
    height: 320px;
    .title {
      margin: 0 20px;
      padding: 19px 0 14px;
      font-size: 16px;
      font-weight: bold;
      color: #454954;
    }
    .query {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      margin: 0 20px;
      .left-act {
        display: flex;
        align-items: center;
        .goback {
          cursor: pointer;
          img {
            margin-right: 8px;
          }
          .back {
            color: #1890ff;
            font-size: 14px;
            margin-right: 17px;
          }
        }
        .name {
          color: #454954;
        }
      }
    }
  }
  .bottom-col {
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    margin-top: 16px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 19px 0 10px 19px;
    }
    .chart {
      height: 230px;
    }
  }
}
</style>
