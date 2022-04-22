<!--
 * @Author: 任继民
 * @Date: 2020-12-14 10:18:29
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-08 13:42:08
 * @Description:地区评估
-->
<template>
  <div class="area-ass">
    <section class="time">
      <a-form layout="inline" :form="pageInfo">
        <a-form-item label="年份">
          <a-select v-model="pageInfo.year" style="width: 150px" placeholder="请选择年份" @change="changeYear">
            <a-select-option :value="yearlist - index" v-for="(item,index) in 20" :key="index" v-if="item <20" >
              {{yearlist - index}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </section>
    <div class="area-content">
      <section class="area-name">
        <div class="title">{{currentArea}}</div>
        <div
          v-infinite-scroll="handleInfiniteOnLoad"
          class="area-infinite-container"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
        >
          <a-list :data-source="listdata" :split="false">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <div class="arealist" @click="changeRegion(item)">
                <img src="../../../assets/images/area-ico.png" alt="" srcset="">
                <span slot="title">{{ item.name }}</span>
              </div>
            </a-list-item>
            <div v-if="loading && !busy" class="demo-loading-container">
              <a-spin />
            </div>
          </a-list>
        </div>
      </section>
      <section class="index-list">
        <section class="list-top">
          <div class="indexitem" v-for="item in indexlist" :key="item.id" :style="{color: item.color}">
            <div class="data">{{ item.data || 0 }}</div>
            <div class="name">{{ item.name }}</div>
          </div>
        </section>
        <section class="list-chart">
          <div class="title">
            <div class="title-name">{{currentArea}}规划指标完成度</div>
            <div class="query">
              <a-radio-group name="radioGroup" v-model="currentFinValue" :default-value="1" @change="finishRadioChange">
                <a-radio :value="1">
                  全部
                </a-radio>
                <a-radio :value="2">
                  未完成
                </a-radio>
                <a-radio :value="3">
                  已完成
                </a-radio>
              </a-radio-group>
              <!-- <div class="select-query">
                <label>指标分类:</label>
                <a-select default-value="lucy" style="width: 120px">
                  <a-select-option value="lucy">
                    全部
                  </a-select-option>
                </a-select>
              </div> -->
            </div>
          </div>
          <Chart :chartData="chartData" />
        </section>
      </section>
      <section class="area-table">
        <div class="title">
          <div class="title-name">指标实施评估预警情况</div>
          <div class="query">
            <a-radio-group name="radioGroup" :default-value="1" v-model="currEvalValue" @change="evalRadioChange">
              <a-radio :value="1">
                全部
              </a-radio>
              <a-radio :value="2">
                预警
              </a-radio>
              <a-radio :value="3">
                健康
              </a-radio>
            </a-radio-group>
            <!-- <div class="select-query">
              <label>指标分类:</label>
              <a-select default-value="lucy" style="width: 120px">
                <a-select-option value="lucy">
                  城镇指标
                </a-select-option>
              </a-select>
            </div> -->
          </div>
        </div>
        <a-table
          :columns="columns"
          :data-source="tableData"
          :scroll="{ y: 560 }"
          :pagination="false"
          :loading="loading"
          @change="handleTableChange"
          bordered
        >
          <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
        </a-table>
      </section>
    </div>
  </div>
</template>
<script>
import { getDistrict } from '@/api/dynamicSupervisory';
import { getareaEvaluation } from '@/api/periodicEvaluation';
import infiniteScroll from 'vue-infinite-scroll';
import Chart from './chart'
const columns = [
  {
    title: '指标名称',
    dataIndex: 'kpiname',
    width: '200px',

  },
  {
    title: '评估值',
    dataIndex: 'mvalue',
  },
  {
    title: '规划目标值',
    dataIndex: 'targetValue',
  },
  {
    title: '预警等级',
    dataIndex: 'level',
  },
  {
    title: '实施情况',
    dataIndex: 'email',
  },
];
export default {
  directives: { infiniteScroll },
  components: {
    Chart
  },
  data: ()=>({
    listdata: [],
    indexlist: [
      { id: '1', name: '指标总数', data: '56', color: '#eda169' },
      { id: '2', name: '约束性指标', data: '21', color: '#736af5' },
      { id: '3', name: '预警指标', data: '6', color: '#1890ff' },
      { id: '4', name: '指标完整度', data: '98.88%', color: '#26b99b' }
    ],
    yearlist: (new Date).getFullYear(),
    pageInfo: {
      adCode: '',
      year: (new Date).getFullYear(),
    },
    currentArea: '团风县',
    allData: null,
    busy: false,
    tableData: [],
    chartData: [],
    pagination: {},
    loading: false,
    currentFinValue: 1,
    currEvalValue: 1,
    columns,
  }),
  async created() {
    await this.initDist();
    await this.initData();
  },
  methods: {
    async initDist() {
      const params = {
        name: '团风县'
      }
      let res = await getDistrict(params);
      const { code, data } = res;
      if (code===200) {
        this.listdata = data;
        this.pageInfo.adCode = data[0].adCode
      }
    },
    async initData() {
      let params = {
        adCode: this.pageInfo.adCode,
        type: '0',
        year: this.pageInfo.year
      };
      let res = await getareaEvaluation(params);
      const { code, data } = res;
      if (code===200) {
        this.indexlist[0].data = data.indexTotal;
        this.indexlist[1].data = data.bindingTotal;
        this.indexlist[2].data = data.warningTotal;
        this.indexlist[3].data = data.integrity;
        this.allData = data;
        this.tableData = data.evaluationMap.list;
      }
      this.finishRadioChange();
      this.evalRadioChange();
    },
    changeRegion(item) {
      this.pageInfo.adCode = item.adCode;
      this.currentArea = item.name;
      this.initData()
    },
    handleInfiniteOnLoad() {
      const data = this.listdata;
      this.loading = true;
      if (data.length > 14) {
        this.$message.warning('已全部加载！');
        this.busy = true;
        this.loading = false;
        return;
      }
      setTimeout(()=>{
        this.data = this.listdata.concat(this.listdata);
        this.loading = false;
      },200)
    },
    finishRadioChange() {
      switch(this.currentFinValue) {
        case 1:
          this.chartData = this.allData.finishMap.list;
          break;
        case 2:
          this.chartData = this.allData.finishMap.nonFinishList;
          break;
        case 3:
          this.chartData = this.allData.finishMap.finishList;
          break;
        default:
          break;
      }
    },
    evalRadioChange() {
      switch(this.currEvalValue) {
        case 1:
          this.tableData = this.allData.evaluationMap.list;
          break;
        case 2:
          this.tableData = this.allData.evaluationMap.warningList;
          break;
        case 3:
          this.tableData = this.allData.evaluationMap.nonWarningList;
          break;
        default:
          break;
      }
    },
    handleTableChange() {

    },
    changeYear(val) {
      this.initData();
    }
  },
}
</script>
<style lang="scss" scoped>
.area-ass {
  .time {
    background: #ffffff;
    padding: 10px 0 10px 30px;
  }
  .area-content {
    display: flex;
    .area-name {
      width: 204px;
      height: calc(100vh - 188px);
      background-color: #ffffff;
      .title {
        border-bottom: solid 1px #e8e8e8;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        font-weight: bold;
        color: #454954;
        padding-left: 20px;

      }
      .area-infinite-container {
        .ant-list {
          cursor: pointer;
          width: 204px;
          .arealist {
            display: flex;
            align-items: center;
            img {
              padding: 0 13px 0 22px;
            }
            span {
              color: #454954;
              font-size: 14px;
            }
          }
        }
      }
    }
    .index-list {
      margin-left: 16px;
      .list-top {
        display: flex;
        align-items: center;
        width: 690px;
        height: 132px;
        background-color: #ffffff;
        .indexitem {
          width: 162px;
          text-align: center;
          border-right: 1px solid #e8e8e8;
          .data {
            font-family: DINNextW1G-Bold;
            font-size: 44px;
            height: 44px;
            line-height: 44px;
          }
          .name {
            font-size: 16px;
            font-weight: bold;
          }
        }
        .indexitem:last-child {
          width: 192px;
          border-right: none;
        }
      }
      .list-chart {
        height: calc(100vh - 336px);
        background-color: #ffffff;
        margin-top: 16px;
        .title {
          .title-name {
            font-size: 16px;
            font-weight: bold;
            color: #454954;
            padding: 19px 0 12px 19px;
          }
        }
        .query {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: 68px;
          padding-bottom: 10px;
          .select-query {
            margin-left: 70px;
            label {
              margin-right: 12px;
            }
          }
        }
      }
    }
    .area-table {
      background-color: #ffffff;
      margin-left: 16px;
      height: calc(100vh - 188px);
      .title {
        .title-name {
          font-size: 18px;
          font-weight: bold;
          color: #454954;
          padding: 19px 0 12px 19px;
        }
        .query {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: 68px;
          padding-bottom: 10px;
          .select-query {
            margin-left: 70px;
            label {
              margin-right: 12px;
            }
          }
        }
      }
    }
  }

}
</style>
