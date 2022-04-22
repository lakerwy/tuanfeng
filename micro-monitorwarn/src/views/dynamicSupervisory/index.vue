<!--
 * @Author: 任继民
 * @Date: 2020-12-09 14:21:02
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-22 16:18:27
 * @Description: 动态监测
-->
<template>
  <div class="dynamic-superv">
    <div class="vbreadcrumbs">
      <!-- <ul class="vbreadcrumbs-ul">
        <li>监测评估预警 </li>
        <li class="vbreadcrumbs__divider">/</li>
        <li class="active">动态监测</li>
      </ul> -->
      <section class="content">
        <a-form layout="inline" :form="pageInfo">
          <a-form-item label="行政区">
            <a-select v-model="pageInfo.areaScope" style="width: 150px" placeholder="请选择行政区" @change="areaScopeChange">
              <a-select-option v-for="item in dislist" :key="item.adCode" :value="item.adCode">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-model="pageInfo.type" style="width: 150px"  placeholder="请选择类型" @change="typeChange">
              <a-select-option value="1">
                指标监测
              </a-select-option>
              <a-select-option value="0">
                指标预警
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="年份">
            <a-select v-model="pageInfo.year" style="width: 150px" placeholder="请选择年份" @change="yearChange">
              <a-select-option :value="yearlist - index" v-for="(item,index) in 19" :key="index">
                {{yearlist - index}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="action-btn">
            <a-button type="primary" @click="searchData()">
              搜索
            </a-button>
            <!-- <a-button>
              重置
            </a-button> -->
          </a-form-item>
        </a-form>
      </section>
    </div>
    <a-spin :spinning="spinning">
    <section class="superv-content">
      <section class="left-data">
        <div class="superv-data">
          <div class="databox" v-for="item in datalist" :key="item.id" :style="{background: item.color}" @click="changeIndex(item)">
            <section class="title" :style="{'border-bottom': `1px solid ${item.bordercolor}`}">{{item.name}}</section>
            <section class="content">
              <div class="ico">
                <img :src="item.ico" alt="" srcset="">
              </div>
              <div class="right-num">
                <div class="num">{{item.num}}<span class="unit">{{item.unit}}</span></div>
              </div>
            </section>
          </div>
        </div>
        <div class="superv-map">
          <section class="title">{{pageInfo.type==0?'指标预警':'指标监测'}}情况</section>
          <div class="map">
            <Map :id="'dynamMap'"/>
          </div>
        </div>
      </section>
      <section class="right-data">
        <section class="data-table">
          <DataTable :tableData="tableData" @onSearch="onSearch"/>
        </section>
        <section class="data-chart">
          <Chart :chartData="chartData" @chartClick="chartClick" @goBack="goBack" :type="pageInfo.type"/>
        </section>
      </section>
    </section>
    </a-spin>
  </div>
</template>
<script>
import DataTable from './componetnts/dataTable';
import Chart from './componetnts/chart';
import Map from '@/components/map/index.vue';
import { getDistrict, getDynamicMonOverview }  from '@/api/dynamicSupervisory';
import GeoJSON from "ol/format/GeoJSON";
import { getTFGeoJSON } from "../../mapjs/getTFGeoJSON";
import { createVectorLayer,removeLayerByAttr } from "@/mapjs/layer.js";
// import { Circle as CircleStyle, Icon, Fill, Text, Stroke, Style } from "ol/style";
import { Icon, Fill, Text, Stroke, Style } from 'ol/style';
import {getMonitTree} from "../../api/dynamicSupervisory";
import {valueTofixed} from "../../utils/utils";
export default {
  components: {
    Map,
    DataTable,
    Chart
  },
  data: () => ({
    datalist: [
      {name: '指标总数',ico: require('../../assets/images/indexdata.png'), color: '#30a5ff', bordercolor: '#2C98EB', num: '0', unit: '项',id: '1', type: 'total'},
      {name: '预警数',ico: require('../../assets/images/warnnum.png'),  color: '#eda169', bordercolor: '#DA9461', num: '0', unit: '项', id: '2', type: 'warning'},
      {name: '预警占比',ico: require('../../assets/images/warnduty.png'),  color: '#26b99b', bordercolor: '#23AA8F', num: '0', unit: '%', id: '3', type: 'health'},
    ],
    defaultadCode: '',
    pageInfo: {
      areaScope: '',
      type: '',
      year: '',
    },
    drawLayer: null,
    tableData: [],
    chartData:[],
    mapData: null,
    dislist: [],
    yearlist: (new Date).getFullYear(),
    form: {},
    spinning: false,
    chartId: '',
  }),
  async mounted() {
    await this.initGeoData();
    await this.initDistrict();
    await this.initData();
    await this.getChartData();
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
          this.pageInfo.type = '0';
          this.pageInfo.year = (new Date).getFullYear() - 1 ;
        }
      }
    },
    async initData(name='',id='0') {
      this.spinning = true;
      let params = {
        adCode: this.pageInfo.areaScope || 421121,
        type: this.pageInfo.type,
        grantParentName: name,
        parentName: id,
        year: this.pageInfo.year
      };
      let res = await getDynamicMonOverview(params);
      const { code, data } = res;
      if (code===200) {
        this.datalist[0].num = data.indexTotal || 0;
        this.datalist[1].num = data.warningTotal || 0;
        if(this.datalist[0].num != 0){
          this.datalist[2].num = valueTofixed((data.warningTotal/data.indexTotal)*100)
        } else {
          this.datalist[2].num = 0;
        }

        data.indexOverviews.forEach(item => {
          switch(parseInt(item.itemtype)) {
            case 0:
              item.itemtype = '约束性';
              break;
            case 1:
              item.itemtype = '预期性';
              break;
            default:
              item.itemtype = '建议性';
              break;
          }
        })
        this.tableData = data.indexOverviews;
        this.mapData = data.mapSituation;
        this.addFeatureByArea();
      }else {
        this.datalist[0].num = 0;
        this.datalist[1].num = 0;
        this.datalist[2].num = 0;
        this.tableData = [];
        // 清除图层
        this.mapData = {};
        removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
        this.$message.error('查询失败，请稍后再查！')
      }
      this.spinning = false;
    },
    //搜索按钮事件
    searchData() {
      this.initData();
      this.getChartData();
    },
    //指标预警数量统计
    async getChartData(code="-1"){
      let params = {
        code: code,
      }
      let res = await getMonitTree(params);
      if (res.code===200) {
        this.chartData = res.data;
      }
    },
    handleSubmit() {
      this.initData();
    },
    chartClick(name) {
      console.log(name)
      let id;
      this.chartData.forEach(item=>{
        if(item.name == name){
          id = item.id;
        }
      })
      this.getChartData(id);
      // this.pageInfo.grantParentName = name;
      this.initData(name='',id);
    },
    goBack(){
      this.initData();
      this.getChartData();
    },
    areaScopeChange(value) {
      console.log(value)
    },
    onSearch(value) {
      if (value =='') this.initData()
      else this.tableData = this.getItembyName(this.tableData,value)
    },
    getItembyName(data,name) {
      let items = [];
      if (name == '') return data;
      for(let i = 0; i < data.length; i++)
      {
        if(data[i].kpiname.includes(name)) {
          items.push(data[i]);
        }
      }
      return items;
    },
    typeChange() {

    },
    yearChange() {

    },
    async initGeoData() {
      let res = await getTFGeoJSON();
      if (res) {
        // window.TF_XIAN = res[0];
        this.geolist = res[1];
        // this.addFeatureByArea()
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
    addFeatureByArea(type='total') {
      // removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
      let imgUrl = require("../../assets/images/mark.png")
      // 先移除之前点击的图层
      removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
      this.createEmptyLayer();

      if (!this.geolist.features) return;
        this.geolist.features.forEach((item,index) => {
          const features = new GeoJSON().readFeature(item);
          let that = this;
          let num = that.mapData[item.properties.ad_code] || 0;
          const colorArr = ['#45819a','#67aab7','#d1eeea','#afe1dd','#45739a','#45819a','#67aab7','#d1eeea','#afe1dd','#45739a'];
          let styleFunction = function(feature){
            let styles = null;
            styles = [
              new Style({
                stroke: new Stroke({
                  color: '#000',    // 面的边界线颜色
                  width: 1         // 边界线宽
                }),
                text: new Text({
                  font: "12px 微软雅黑 ",
                  text: `${item.properties.Name}`,
                  fill: new Fill({
                    color: "#000000",
                  }),
                }),
                fill: new Fill({
                  //矢量图层填充颜色，以及透明度
                  color: colorArr[index]
                }),
              })
            ];
            // 当前选中的取现
            if (that.pageInfo.areaScope == item.properties.ad_code) {
              styles = [
                new Style({
                  stroke: new Stroke({
                    color: '#e2270d',    // 面的边界线颜色
                    width: 3         // 边界线宽
                  }),
                  text: new Text({
                    font: "12px 微软雅黑 ",
                    text: `${item.properties.Name}`,
                    fill: new Fill({
                      color: "#000000",
                    }),
                  }),
                  fill: new Fill({
                    //矢量图层填充颜色，以及透明度
                    color: '#ffc53d'
                  }),
                })
              ];
            }

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
                text: `${num}`,
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

        })
    },
    changeIndex(item) {
      this.addFeatureByArea(item.type)
    }
  },
}
</script>
<style lang="scss" scope>
@import '../../assets/styles/common.scss';
.dynamic-superv {
  height: calc(100vh - 128px);
  .vbreadcrumbs {
    .action-btn {
      button:last-child {
        margin-left: 20px;
      }
    }
  }

  .superv-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 30px;
    margin-top: 16px;
    .left-data{
      margin-right: 16px;
      .superv-data {
        display: flex;
        justify-content: space-between;
        padding: 20px 14px;
        background-color: #ffffff;
        .databox {
          border-radius: 4px;
          width: 224px;
          height: 116px;
          margin: 0 10px;
          .title {
            border-bottom: 1px solid #2C98EB;
            font-size: 12px;
            padding: 12px 0 11px  20px;
          }
          .content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 80px;
            cursor: pointer;
            .ico {
              width: 50%;
              text-align: center;
            }
            .right-num {
              width: 50%;
              text-align: center;
              display: flex;
              color: #ffffff;
              .num {
                font-family: DINNextW1G;
                font-size: 38px;
                .unit {
                  font-family: MicrosoftYaHei;
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
      .superv-map {
        margin-top: 16px;
        height: 520px;
        background-color: #ffffff;
        .title {
          margin-left: 19px;
          padding: 10px 0;
          color: #454954;
          font-size: 18px;
        }
        .map {
          height: calc(100% - 48px);
          .my-map{
            height: 100%;
          }
        }
      }
    }
    .right-data {
      .data-table {
        height: 420px;
      }
      .data-chart {

        margin-top: 16px;
        background-color: #ffffff;
      }
    }
  }
}
</style>
