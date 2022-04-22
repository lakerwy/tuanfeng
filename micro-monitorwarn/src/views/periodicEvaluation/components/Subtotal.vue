<!--
 * @Author: 任继民
 * @Date: 2020-12-15 10:17:20
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-19 13:36:54
 * @Description: 分类汇总
-->
<template>
  <div class="subtotal">
    <section class="condition">
      <section class="query-list">
        <div class="label">行政区：</div>
        <div>
          <template v-for="(item,index) in citylist" >
            <a-checkable-tag :key="index" :checked="selectedCityTags.indexOf(item) > -1" @change="checked => handleCityChange(item, checked)">{{item.name}}
            </a-checkable-tag>
          </template>
        </div>
      </section>
      <section class="query-list">
        <div class="label">年份：</div>
        <div>
          <template v-for="(item,index) in yearlist" >
            <a-checkable-tag :key="index" :checked="selectedYearTags.indexOf(item) > -1" @change="checked => handleYearChange(item, checked)">{{item}}
            </a-checkable-tag>
          </template>
        </div>
      </section>
      <section class="query-list">
       <div class="label">指标项：</div>
       <div class="operate">
        <a-select
          mode="multiple"
          placeholder="请选择指标项"
          :value="selectedItems"
          style="width: 100%;min-width: 400px;max-width:1000px"
          @change="handleChange"
        >
          <a-select-option v-for="(item,index) in dirlist" :key="index" :value="item.kpiid">
            {{ item.kpiname }}
          </a-select-option>
        </a-select>
        <a-button @click="startAnalysis" type="primary">开始分析</a-button>
        <a-button @click="resetAnalysis">重置</a-button>
       </div>
      </section>
    </section>
    <section class="chart">
      <div class="title">{{selectedYearTags[0]}}年指标对比分析结果</div>
      <div class="chart-list">
        <section v-for="(item,index) in selectedItems" :key="index">
          <div :id="'echartArea'+index"></div>
        </section>
        <!-- <section>
          <div id="urbanArea"></div>
          <div id="readlineArea"></div>
        </section>
        <section>
          <div id="farmlandArea"></div>
        </section> -->
      </div>
    </section>
  </div>
</template>
<script>
import qs from 'qs'
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
import { getRegularEvaluation, getSortSummary } from '@/api/periodicEvaluation';
export default {
  data: () => ({
    sourceData: [],
    dirlist: [],
    citylist: [],
    yearlist: [],
    selectedCityTags:[],
    selectedYearTags: [],
    selectedItems: [],
  }),
  async mounted() {
    await this.getDirclist();
    this.$nextTick(async () => {
      await this.startAnalysis();
    })
  },
  methods: {
    async getDirclist() {
      debugger
      // if (this.dirlist.length > 0) return;
      let res = await getRegularEvaluation();
      const { code, data } = res
      if (code ===200) {
        debugger
        this.dirlist = data.indexNames;
        this.citylist = data.areas;
        this.yearlist = data.years;
        this.selectedYearTags = [this.yearlist[0]];
        this.selectedCityTags = [this.citylist[0]];
        this.selectedItems = [this.dirlist[0].kpiid];
      }
    },
    async initData() {
      let citys = [],itemValue = [];
      this.selectedCityTags.forEach(item => {
        citys.push(item.adCode)
      })
      let params = {
        years: this.selectedYearTags,
        adCodes: citys,
        kpiids: this.selectedItems
      };
      let ss = qs.stringify(params,  { indices: false } )
      let res = await getSortSummary(ss);
      const { code, data } = res;
      if (code===200) {
        this.sourceData = data;
      }
    },
    handleCityChange(tag, checked) {
      const { selectedCityTags } = this;
      const nextSelectedTags = checked
        ? [...selectedCityTags, tag]
        : selectedCityTags.filter(t => t !== tag);
      this.selectedCityTags = nextSelectedTags;
    },
    handleYearChange(tag, checked) {
      if (!checked) return;
      const { selectedYearTags } = this;
      const nextSelectedTags = checked
        ? [tag]
        : selectedYearTags.filter(t => t !== tag);
      this.selectedYearTags = nextSelectedTags;
    },
    handleChange(selectedItems) {
      this.selectedItems = selectedItems;
    },
    async startAnalysis() {
      await this.initData();
      const objData = {};
      this.selectedItems.map((item,index) => {
        objData[`areaName${index}`] = [];
        objData[`areaValue${index}`] = [];
        objData[`areaUnit${index}`] = '';
        this.sourceData.map(itm => {
          if (item == itm.kpiid) {
            objData[`Name${index}`] = itm.kpiname
            objData[`areaName${index}`].push(itm.arcname)
            objData[`areaValue${index}`].push(itm.mvalue);
            objData[`areaUnit${index}`] = itm.unit
          }
        })
      })
      this.$nextTick(() => {
        this.selectedItems.forEach( (item,index)=> {
          console.log(objData[`areaUnit${index}`])
          this.$set(echartsOptions.urOptions.xAxis[0], 'data', objData[`areaName${index}`])
          this.$set(echartsOptions.urOptions.series[0], 'data', objData[`areaValue${index}`])
          this.$set(echartsOptions.urOptions.series[0], 'name', objData[`Name${index}`]);
          this.$set(echartsOptions.urOptions.yAxis, 'name', objData[`areaUnit${index}`]);
          initEcharts(`echartArea${index}`, echartsOptions.urOptions);
        });
      })

    },
    async resetAnalysis() {
      debugger
      await this.getDirclist();
      this.$nextTick(async () => {
        await this.startAnalysis();
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.subtotal {
  .condition {
    height: 228px;
    background-color: #ffffff;
    .query-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0;
      .label {
        width: 105px;
        text-align: right;
        margin-right: 15px;
        color: #6f7583;
        font-weight: bolder;
      }
      .operate {
        display: flex;
        justify-content: flex-start;
        button {
          margin-left: 20px;
        }
      }
    }
  }
  .chart {
    margin-top: 16px;
    height: calc(100vh - 372px);
    background-color: #ffffff;
    .title {
      font-size: 16px;
      color: #454954;
      padding: 24px 0 24px 20px;
    }
    .chart-list {
      height: calc(100% - 72px);
      padding: 0 50px;
      display: flex;
      justify-content: space-between;
      flex-flow: wrap;
      max-height: 450px;
      overflow-y: auto;
      section {
        height: 259px;
        width: 50%;
        div {
          height: 259px;
          width: 518px;
        }
      }
    }
  }
}
</style>
