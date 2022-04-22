<!--
 * @Author: 任继民
 * @Date: 2020-11-12 15:36:30
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-04 10:56:59
 * @Description:
-->
<template>
  <div>
    <!-- <breadcrumbs :headHeight='"54px"'/> -->
    <div class="synthManage">
      <section class="synthManage-left">
        <Map :id="'space'"/>
        <my-legend :lists="lists" :maxHeight="180" :type="'box'"  class="myLegend" />
      </section>
      <section class="synthManage-right">
        <section class="top">
          <div class="panl">
            <explain />
          </div>
          <div class="panl-right">
            <!-- <Procedure /> -->
            <div class="title">
              <div class="name">综合监管流程</div>
              <img src="../../assets/imgs/icon-展开.png" alt="展开" @click="upLoadImg">
            </div>
            <img class="flowChart" src="../../assets/imgs/flowChart.png" alt="" srcset="">
          </div>
        </section>
        <section class="vtable">
          <div class="text-title">监测预警概况</div>
          <div class="content">
            <DataTables :tableData="tableData"/>
            <QuotaChart :chartData="tableData"/>
          </div>
        </section>
      </section>
      <a-modal class="access-model" width="40%" v-model="modelVisable" :cancel-button-props="{ style: { display: 'none' } }" title="综合监管流程" @ok="upLoadImg">
        <img src="../../assets/imgs/flowChart.png" alt="" srcset="">
      </a-modal>
    </div>
  </div>
</template>
<script>
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import Map from '@/components/map/index.vue';
import myLegend from '../../components/legend/index'
import explain from './components/explain';
import DataTables from './components/table';
import Procedure from './components/procedure';
import QuotaChart from './components/quotachart';
import { getCapacOverview } from '@/api/compreSupervision';
import GeoJSON from "ol/format/GeoJSON";
import { getTFGeoJSON } from "../../mapjs/getTFGeoJSON";
import { createVectorLayer } from "@/mapjs/layer.js";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
export default {
  components: {
    breadcrumbs,
    Map,
    myLegend,
    explain,
    DataTables,
    Procedure,
    QuotaChart
  },
  data: () => ({
    tableData: [],
    geolist: [],
    lists: [
      {color: '#5ec26d', desc: '健康', value: 0},
      {color: '#f6d641', desc: '轻警', value: 1},
      {color: '#d19159', desc: '重警', value: 2},
    ],
    modelVisable: false
  }),
  created() {
    this.initData();
  },
  mounted() {
    this.createEmptyLayer();
    this.initGeoData();
  },
  methods: {
    async initData() {
      let params = {
        adCode:42,
        year:2019
      };
      let res = await getCapacOverview(params);
      const { code, data } = res;
      if (code===200) {
        this.tableData = data;
      }
    },
    upLoadImg() {
      this.modelVisable =! this.modelVisable;
    },
    handleOk() {

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
      window.bearingMap.addLayer(this.drawLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea() {
      if (!this.geolist.features) return;
      this.tableData.forEach(item => {
        this.geolist.features.forEach(itm => {
          if (item.qhname == itm.properties.Name) {
            const addFe = new GeoJSON().readFeature(itm);
            let tempcoll = '';
            switch(item.warningStatus) {
              case 0:
                tempcoll = '#5ec26d';
                break;
              case 1:
                tempcoll = '#f6d641';
                break;
              case 2:
                tempcoll = '#eda169';
                break;
              default:
                tempcoll = '#5ec26d';
                break;
            }
            let style = new Style({
              fill: new Fill({
                //矢量图层填充颜色，以及透明度
                color: tempcoll,
              }),
              stroke: new Stroke({
                color: '#fff', //面的边界线颜色
                width: 2         //边界线宽
              }),
              text: new Text({
                font: "14px 微软雅黑 ",
                text: itm.properties.Name,
                offsetX: 0,
                offsetY: 0,
                fill: new Fill({
                  color: "#fff",
                }),
              }),
            });
            addFe.setStyle(style);
            this.drawLayer.getSource().addFeature(addFe);
          }
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::-webkit-scrollbar
{
  width: 8px;
  height: 10px;
  background-color: #ffffff;
}
::-webkit-scrollbar-track
{
  // -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
  border-radius: 10px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb
{
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: rgb(228, 225, 225);
}

.synthManage {
  display: flex;
  justify-content: flex-start;
  &-left {
    background-color: #ffffff;
    height: calc(100vh - 128px);
    position: relative;
    .my-map{
      width: calc(100% - 1100px);
      min-width: 650px;
      height: calc(100vh - 145px);
      padding: 10px;
    }
    .myLegend {
      position: absolute;
      bottom: 35px;
      left: 40px;
    }
  }
  &-right {
    margin-left: 16px;
    width: calc(100% - 650px);
    .top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .panl {
        height: 309px;
        background-color: #ffffff;
      }
      .panl-right {
        height: 309px;
        background-color: #ffffff;
        overflow-y: hidden;
        width: calc(100% - 410px);
        margin-left: 10px;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .name{
            padding-top: 20px;
            padding-left: 20px;
            color: #454954;
            font-size: 18px;
            font-weight: bold;
            height: 60px;
            line-height: 60px;
            position: fixed;

          }
          img {
            margin-right: 20px;
            padding-top: 30px;
            cursor: pointer;
            position: fixed;
            right: 15px;
          }
     }
        .flowChart {
          padding: 50px 12px;
          width: 652px;
          overflow-x: auto;

        }
      }
    }
    .vtable {
      margin-top: 16px;
      height: calc(100vh - 452px);
      background-color: #ffffff;
      .text-title {
        padding-left: 20px;
        color: #454954;
        font-size: 18px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
      }
      .content {
        display: flex;
        padding: 0 20px;
      }
    }
  }
}
</style>
