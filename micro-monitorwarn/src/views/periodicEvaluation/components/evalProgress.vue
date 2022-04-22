<!--
 * @Author: 任继民
 * @Date: 2020-12-14 16:06:55
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 11:30:09
 * @Description:评估进度
-->
<template>
  <div class="evalprocess">
    <div class="title">
      <div class="tab">
        <div v-for="(item,index) in tablist" :key="item.id" :class="{tabactive: currenetIndex===index}" @click="changeTab(item,index)">{{item.name}}</div>
      </div>
      <section class="time">
        <a-form layout="inline" :form="pageInfo">
          <a-form-item label="行政区" v-if="currenetIndex ===1">
            <a-select v-model="pageInfo.areaScope" :key="" style="width: 150px" placeholder="请选择行政区" @change="areaChange">
              <a-select-option value="">
                请选择行政区
              </a-select-option>
              <a-select-option v-for="item in dislist" :key="item.adCode" :value="item.adCode">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="年份">
            <a-select v-model="pageInfo.year" style="width: 150px" placeholder="请选择年份" >
              <a-select-option :value="yearlist - index" v-for="(item,index) in 20" :key="index" v-if="item <20">
                {{yearlist - index}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="action-btn">
            <a-button type="primary" @click="queryData">
              确定
            </a-button>
            <!-- <a-button>
              重置
            </a-button> -->
          </a-form-item>
        </a-form>
      </section>
    </div>
    <div v-if="currenetIndex ===0">
      <Map :id="'space'"/>
      <div class="right-content">
        <div class="right-title">
          <div class="name">区县指标数量情况</div>
          <div class="num">
            <div>
              <span class="spot"></span><span class="text">指标总数</span>
              <i>{{totalNum}}</i><span>个</span>
            </div>
            <div>
              <span class="spot"></span><span class="text">上报总数</span>
              <i>{{reportNum}}</i><span>个</span>
            </div>
          </div>
        </div>
        <div class="right-chart">
          <div class="bindTitle">约束性指标总数和上报情况</div>
          <div class="bindcChart" id="bindChart"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <section class="table-content">
        <div class="ttitle">{{pageInfo.year}}年{{pageInfo.areaName}}预警数量情况表</div>
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
          :scroll="{ y: 620 }"
          bordered
        >
        <span slot="itemtype" slot-scope="text, record">
          <span v-if="record.itemtype ==1">预期性</span>
          <span v-else-if="record.itemtype ==2">建议性</span>
          <span v-else>约束性</span>
        </span>
        <span slot="overtype" slot-scope="text, record">
          <span v-if="record.overtype ==1">下值突破</span>
          <span v-else>上值突破</span>
        </span>
        </a-table>
      </section>
    </div>
  </div>
</template>
<script>
import Map from '@/components/map/index.vue';
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
import { getProgressReport, getProgressWarning } from '@/api/periodicEvaluation'
import GeoJSON from "ol/format/GeoJSON";
import { getTFGeoJSON } from "../../../mapjs/getTFGeoJSON";
import { createVectorLayer, removeLayerByAttr } from "@/mapjs/layer.js";
import { Circle as CircleStyle,Icon, Fill, Text, Stroke, Style } from "ol/style";
import { getDistrict }  from '@/api/dynamicSupervisory';
const columns = [
  {
    title: '名称',
    dataIndex: 'kpiname',
    width: 500,
    align: 'center'
  },
  {
    title: '年份',
    dataIndex: 'year',
    align: 'center'
  },
  {
    title: '监测值',
    dataIndex: 'mvalue',
    align: 'center'
  },
  {
    title: '目标值',
    dataIndex: 'targetValue',
    align: 'center'
  },
  {
    title: '完成率',
    dataIndex: 'completeRate',
    align: 'center'
  },
  {
    title: '指标属性',
    dataIndex: 'itemtype',
    scopedSlots: { customRender: 'itemtype' },
    align: 'center'
  },
  {
    title: '突破方式',
    dataIndex: 'overtype',
    scopedSlots: { customRender: 'overtype' },
    align: 'center'
  }
];
export default {
  components: {
    Map
  },
  data: () => ({
    columns,
    tablist: [
      {id: '1', name: '上报数量情况'},
      {id: '2', name: '预警数量情况'}
    ],
    drawLayer: null,
    currenetIndex: 0,
    totalNum: 0,
    reportNum:0,
    geolist: [],
    dislist:[],
    reportData: [],
    yearlist: (new Date).getFullYear(),
    pageInfo: {
      areaName: '团风县',
      areaScope: '',
      year: (new Date).getFullYear()
    },
    tableData: []
  }),
  mounted() {
    this.initChart();
    this.initDistrict();
    this.initReportData();
  },
  methods: {
    async initDistrict() {
      if (this.dislist.length===0) {
        const params = {
          name: '团风县'
        }
        let res = await getDistrict(params);
        const { code,data } = res;
        if (code===200) {
          this.dislist = data;
          this.pageInfo.areaScope = data[0].adCode;
          this.pageInfo.areaName = data[0].name;
          this.pageInfo.year = (new Date).getFullYear();
        }
      }
    },
    initChart() {
      initEcharts('bindChart',echartsOptions.bindIndexOptions);
    },
    async initReportData() {
      let params = {
        year: this.pageInfo.year
      };
      let res = await getProgressReport(params);
      const { code, data } = res;
      if (code ===200) {
        this.reportData = data;
        let yName = [], seriesData1 = [],seriesData2 = []
        this.totalNum = 0;
        this.reportNum = 0;
        data.forEach(item => {
          this.totalNum += item.total;
          this.reportNum += item.report;
          yName.push(item.arcname);
          seriesData1.push(item.total)
          seriesData2.push(item.report)
        });
        this.$set(echartsOptions.bindIndexOptions.yAxis, 'data', yName)
        this.$set(echartsOptions.bindIndexOptions.series[0], 'data', seriesData1)
        this.$set(echartsOptions.bindIndexOptions.series[1], 'data', seriesData2)
        this.$nextTick(() => {
          this.initChart();
          this.createEmptyLayer();
          this.initGeoData();
        })
      }
    },
    async initTableData() {
      let params = {
        adcode: this.pageInfo.areaScope,
        year: this.pageInfo.year
      };
      let res = await getProgressWarning(params);
      const { code, data } = res;
      if (code ===200) {
        this.tableData = data;
      }
    },
    changeTab(item,index) {
      this.currenetIndex = index;
      if (this.currenetIndex ===0) this.initReportData();
      else this.initTableData()
    },
    queryData() {
      if (this.currenetIndex ===0) this.initReportData();
      else this.initTableData()
    },
    areaChange(val,option) {
      this.pageInfo.areaName = this.dislist.filter(item => item.adCode == val)[0].name
      console.log(this.pageInfo.areaName)
    },
    async initGeoData() {
      let res = await getTFGeoJSON();
      if (res) {
        // window.TF_XIAN = res[0];
        this.geolist = res[1];
        this.addFeatureByArea()
      }
    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0,
      };
      this.drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawLayer.set("layerType", "geoLayer");
      window.monitirMap.addLayer(this.drawLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea() {
      removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
      // 开始绘制
      this.createEmptyLayer();
      if (!this.geolist.features) return;
      let imgUrl = require("../../../assets/images/mark.png")
      this.reportData.forEach(item => {
        this.geolist.features.forEach(itm => {
          if (item.arcode == itm.properties.ad_code) {
            // const addFe = new GeoJSON().readFeature(itm);
            // let tempcoll = 'rgba(38,113,254,0.6)';
            // let style = new Style({
            //   fill: new Fill({
            //     //矢量图层填充颜色，以及透明度
            //     color: tempcoll,
            //   }),
            //   text: new Text({
            //     font: "14px 微软雅黑 ",
            //     text: itm.properties.Name + '上报数' +item.report,
            //     offsetX: 0,
            //     offsetY: 0,
            //     fill: new Fill({
            //       color: "#fff",
            //     }),
            //   }),
            // });
            // addFe.setStyle(style);
            // this.drawLayer.getSource().addFeature(addFe);
            const features = new GeoJSON().readFeature(itm);
            let that = this;
            let styleFunction = function(feature){
              let styles = [
                new Style({
                  stroke: new Stroke({
                    color: '#000',    // 面的边界线颜色
                    width: 1         // 边界线宽
                  }),
                })
              ];
              // 点样式
              let point = feature.getGeometry().getInteriorPoint();
              styles.push(new Style({
                geometry:point,
                image: new Icon({
                  anchor: [0.5, 0.96],
                  crossOrigin: 'anonymous',
                  src: imgUrl,
                }),
                text: new Text({
                  font: "12px 微软雅黑 ",
                  text: `${item.report}`,
                  offsetX: 0,
                  offsetY: -25,
                  fill: new Fill({
                    color: "#ffffff",
                  }),
                }),
              }))
              return styles;
            }
            this.drawLayer.getSource().addFeature(features);
            // this.drawLayer.setStyle(styleFunction);
            features.setStyle(styleFunction);
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
.evalprocess {
  position: relative;
  width: calc(100%);
  .my-map{
    height: calc(100vh - 174px);
    .containerMap {
      padding: 0;
    }
    .map-tools {
      right: 14px;
      bottom: 80px;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fdfdfd;
    .tab {
      color: #454954;
      font-size: 16px;
      display: flex;
      align-items: center;
      height: 45px;
      div {
        line-height: 15px;
        border-bottom: 2px solid rgba(0, 0, 0, 0);
        padding: 14px 0;
        margin: 0 22px;
      }
      div:hover, .tabactive {
        border-bottom: 2px solid #1890ff;
        color: #1890ff;
      }
    }
    .time {
      font-size: 14px;
      font-weight: bold;
      color: #454954;
      margin-right: 20px;
    }
  }
  .right-content {
    position: absolute;
    top: 52px;
    right: 65px;
    width: 482px;
    .right-title {
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px
        rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      padding-left: 21px;
      .name {
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        color: #454954;
        padding: 21px 0;
      }
      .num {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding-bottom: 24px;
        padding-right: 10px;
        .spot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #eda169;
          margin-right: 9px;
        }
        .text {
          color: #6f7583;
          font-size: 14px;
          margin-right: 21px;
        }
        i {
          font-family: DINNextW1G;
          font-size: 24px;
          color: #eda169;
        }
      }
    }
    .right-chart {
      margin-top: 16px;
      width: 481px;
      height: 620px;
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px
        rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      .bindTitle {
        font-size: 16px;
        font-weight: bold;
        color: #454954;
        padding: 10px 0 10px 19px;
      }
      .bindcChart {
        height: calc(100% - 44px);
      }
    }
  }
  .table-content {
    height: 770px;
    background: #ffffff;
    .ttitle {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 15px 0 15px 21px;
      background: #ffffff;
    }
  }
}

</style>
