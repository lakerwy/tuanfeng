<!--
 * @Author: 任继民
 * @Date: 2020-12-09 16:26:59
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-04 14:18:55
 * @Description: 及时预警
-->
<template>
  <div class="early-warn">
    <div class="vbreadcrumbs">
      <section class="content">
        <a-form layout="inline" :form="pageInfo">
          <a-form-item label="行政区">
            <a-select v-model="pageInfo.areaScope" :key="" style="width: 150px" placeholder="请选择行政区">
              <a-select-option value="" @change="areaScopeChange">
                请选择行政区
              </a-select-option>
              <a-select-option v-for="item in dislist" :key="item.adCode" :value="item.adCode">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="年份">
            <a-select v-model="pageInfo.year" style="width: 150px" placeholder="请选择年份" @change="yearChange">
              <a-select-option :value="yearlist - index" v-for="(item,index) in 20" :key="index" v-if="item <20">
                {{yearlist - index}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="action-btn">
            <a-button type="primary" @click="queryData">
              确定
            </a-button>
          </a-form-item>
        </a-form>
      </section>
    </div>
    <Map :id="'earlyspace'"/>
    <LeftColumn ref="leftCol" :pageInfos="pageInfo" class="left-colom" @detailData="detailData"/>
    <RightSide class="right-colom" :rightData="rightData" :listData="listData"/>
  </div>
</template>
<script>
import Map from '@/components/map/index.vue';
import LeftColumn from './components/leftColumn';
import RightSide from './components/rightSideData'
import GeoJSON from "ol/format/GeoJSON";
import { getTFGeoJSON } from "../../mapjs/getTFGeoJSON";
import { createVectorLayer, removeLayerByAttr } from "@/mapjs/layer.js";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
import { getDistrict }  from '@/api/dynamicSupervisory'
export default {
  components: {
    Map,
    LeftColumn,
    RightSide
  },
  data: () => ({
    rightData :[],
    listData: {},
    drawLayer: null,
    geolist: [],
    dislist: [],
    yearlist: (new Date).getFullYear(),
    pageInfo: {
      areaScope: '',
      year: (new Date).getFullYear()-1
    }

  }),
  mounted() {
    this.initGeoData();
    this.initDistrict();
    this.initData()
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
        }
      }
    },
    detailData(data,list) {
      data.forEach(item => {
        item.breakValue = item.breakValue? item.breakValue.toFixed(2): 0;
        item.mvalue = item.mvalue? item.mvalue.toFixed(2): 0;
        item.planlocalvalue = item.planlocalvalue? item.planlocalvalue.toFixed(2): 0;
      })
      this.rightData = data;
      this.listData = list;
      this.addFeatureByArea();
    },
    async initGeoData() {
      let res = await getTFGeoJSON();
      if (res) {
        res[0].features = (res[0].features).concat(res[1].features);
        this.geolist = res[0];
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
      if (!this.geolist.features) return;
      // 先移除之前点击的图层
      removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
      this.createEmptyLayer();
      this.rightData.forEach(item => {
        this.geolist.features.forEach(itm => {
          if (item.arcname == itm.properties.Name) {
            const addFe = new GeoJSON().readFeature(itm);
            let tempcoll = item.status == 1? '#eda169': '#5ec26d'
            let style = new Style({
              fill: new Fill({
                //矢量图层填充颜色，以及透明度
                color: tempcoll,
              }),
              stroke: new Stroke({
                color: '#fff', //面的边界线颜色
                width: 1         //边界线宽
              }),
              text: new Text({
                font: "14px 微软雅黑 ",
                text: itm.properties.Name +'  突破量' + item.breakValue,
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
    //   const addFe = new GeoJSON().readFeature(this.geoTwonlist.features[0]);
    //   console.log(addFe)
    //   let style = new Style({
    //     fill: new Fill({
    //       //矢量图层填充颜色，以及透明度
    //       color: 'rgba(243, 243, 243, 0)'
    //     }),
    //     stroke: new Stroke({
    //       color: '#000', //面的边界线颜色
    //       width: 1         //边界线宽
    //     }),
    //   });
    //   addFe.setStyle(style);
    //   this.drawLayer.getSource().addFeature(addFe);
    // },
    initData() {
      let params = {
        areaScope: this.pageInfo.areaScope,
        year: this.pageInfo.year
      }
      this.$refs.leftCol.initData(params);
    },
    queryData() {
      this.initData();
    },
    areaScopeChange() {

    },
    yearChange() {

    }
  }
}
</script>
<style lang="scss">
@import '../../assets/styles/common.scss';
.early-warn{
  position: relative;
  .my-map{
    height: calc(100vh - 174px);
    /* margin: 0 30px; */
    .map-tools {
      right: 10px;
    }
  }
  .left-colom{
    position: absolute;
    top: 50px;
    left: 30px;
  }
  .right-colom {
    position: absolute;
    top: 50px;
    right: 50px;
  }
}
</style>
