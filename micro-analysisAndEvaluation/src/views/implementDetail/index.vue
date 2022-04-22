<template>
<!-- 实施评估-->
  <div class="detail">
    <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><span class="old-path">分析评价</span></el-breadcrumb-item>
        <el-breadcrumb-item><span class="old-path">国土空间规划实施评估</span></el-breadcrumb-item>
        <el-breadcrumb-item><span class="current-path">{{evaluate.kpiname}}</span></el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-button style="width:66px;height:28px;padding:0 12px;" type="primary" plain @click="goback">返回</el-button>
    </div>
    <div class="p-bottom">
      <div class="left">
        <div class="inventory-ana">
          <div class="title">
            <h1>{{evaluate.kpiname}}</h1>
          </div>
          <div class="years">
            <el-form :model="form" :inline="true" label-width="85px" label-position="right">
              <el-form-item label="年份">
                <el-date-picker
                  v-model="currentYear"
                  value-format="yyyy"
                  @change="chooseYear"
                  type="year"
                  placeholder="选择年">
                </el-date-picker>
                <!-- <el-select style="width: 200px;" v-model="form.type" @change="changeType">
                  <el-option v-for="item in typeOptions" :key="item.name" :label="item.name" :value="item.value"></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="行政区">
                <el-select style="width: 200px;" v-model="form.regions" @change="changeTown">
                  <el-option v-for="item in regionOptions" :key="item.name" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-button class="button" type="primary" style="margin-left: 74px;" @click="query">确定</el-button>
            </el-form>
            <!-- <span
              v-for="(item, index) in years"
              :key="item"
              @click="chooseYear(item, index)">
              <span :class="{'active': currentYearIndex === index}">{{item}}</span>
              <span v-if="index < years.length - 1"> / </span>
            </span> -->
          </div>
          <div class="cards">
            <div class="card-item" style="backgroundColor: #405fe4">
              <p class="card-title">当前值</p>
              <p class="card-data">
                <img src="../../assets/imgs/farm-area.png" alt="">
                <span><span class="num" >{{ comparision.mvalue? parseFloat(comparision.mvalue).toFixed(2):'-'}}</span>{{ comparision.tagunit}}</span>
              </p>
            </div>
            <div class="card-item" style="backgroundColor: #338ae0">
              <p class="card-title">规划目标值</p>
              <p class="card-data">
                <img src="../../assets/imgs/farm-invention.png" alt="">
                <span><span class="num" >{{comparision.planlocalvalue? parseFloat(comparision.planlocalvalue).toFixed(2):'-'}}</span>{{comparision.tagunit}}</span>
              </p>
            </div>
            <div class="card-item" style="backgroundColor: #eda169">
              <p class="card-title">现状与目标差值</p>
              <p class="card-data">
                <img src="../../assets/imgs/farm-difference.png" alt="">
                <span><span class="num" >{{comparision.differ || '-'}}</span>{{comparision.tagunit}}</span>
              </p>
            </div>
            <div class="card-item" style="backgroundColor: #26b99b">
              <p class="card-title">目标完成百分比</p>
              <p class="card-data">
                <img src="../../assets/imgs/farm-percent.png" alt="">
                <span><span class="num">{{comparision.rate? parseFloat(comparision.rate).toFixed(2):'-'}}</span>%</span>
              </p>
            </div>
          </div>
        </div>
        <div class="invention-compare">
          <div class="title">
            <h1>{{currentArea}}执行情况数值对比图</h1>
          </div>
          <!-- <p class="change" @click="showData"><span>切换</span></p> -->
          <div id="invention" style="height: calc(100% - 118px)"></div>
        </div>
        <div style="text-align:right;padding-right: 20px;">
          <el-button type="primary" @click="showData">查看数据列表</el-button>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <h1>{{currentArea}}执行情况百分比对比图</h1>
        </div>
        <div class="myMap">
          <my-map :id="'mfarm'" :vector="vector" :isAudit="isAudit" />
          <my-legend class="legend" :lists="lists" />
        </div>
      </div>
    </div>

    <!-- 查看数据列表 -->
    <el-dialog class="data-dialog" :visible.sync="dialogTableVisible" width="46%" top="10%" :show-close="false">
      <div slot="title" class="dialog-title s-title">
        <span class="type">{{currentArea}}执行情况数值列表</span>
        <span class="goback" @click="dialogTableVisible = false">
          <img src="../../assets/imgs/icon-less.png" alt="">
          <span>返回</span>
        </span>
      </div>
      <el-table :data="kpiLists" width="100%" height="526px" border>
        <el-table-column property="arcname" label="行政区" width="120"></el-table-column>
        <el-table-column property="mvalue" label="当前值（万公顷）"></el-table-column>
        <el-table-column property="planlocalvalue" label="规划目标值（万公顷）"></el-table-column>
        <el-table-column property="differ" label="现状规划目标差值（万公顷）"></el-table-column>
        <el-table-column property="rate" label="目标执行（百分比）"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportData">导出数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMap from '../../components/map/index'
import { initEcharts } from '../../js/chart/util'
import echartsOptions from './components/echartsOptions'
import myLegend from '../../components/legend/index'
import { queryArcGISProperties } from '../../js/map/arcgis'
import { getTownVectorLayer } from '../../js/map/util'
import { getRegions } from '../../js/map/region'
import { getComparision } from '../../api/implement'
import Csv from '../../js/utils/csv';
import ExportCsv from '../../js/utils/export-csv';
import GeoJSON from "ol/format/GeoJSON";
import { getTFGeoJSON } from "../../mapjs/getTFGeoJSON";
import { createVectorLayer, removeLayerByAttr } from "@/mapjs/layer.js";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
export default {
  components: {
    myMap,
    myLegend
  },
  data() {
    return {
      evaluate: JSON.parse(sessionStorage.getItem('evaluate')) || {},
      keyword:"",
      mapId: 'map',
      imgId: 'image',
      image: null,
      isAudit: false,
      years: ['2005-2009', '2009-2014', '2014-2018', '2018-2019'],
      currentYear: new Date().getFullYear().toString(),
      currentYearIndex: 0,
      kpiLists: [], // 所有镇的对比数据
      comparision: {recentlocalvalue: '1', planlocalvalue: '1'}, // 当前的对比的数据
      lists: [
        {color: '#d1eeea', label: '＜50%', value: 0, min: 0, max: 50},
        {color: '#afe1dd', label: '50%-60%', value: 1, min: 50, max: 60},
        {color: '#67aab7', label: '60%-80%', value: 2, min: 70, max: 80},
        {color: '#45819a', label: '80%-100%', value: 3, min: 80, max: 100},
        {color: '#45739a', label: '100%-110%', value: 4, min: 100, max: 110},
        {color: '#30bf78', label: '110%-120%', value: 5, min: 110, max: 120},
        {color: '#93b41e', label: '120%-130%', value: 6, min: 120, max: 130},
        {color: '#26b99b', label: '130%-140%', value: 7, min: 130, max: 140},
        {color: '#e1a921', label: '≥140%', value: 8, min: 140, max: 100000},
      ],
      dialogTableVisible: false,
      geolist: null,
      countyGeo: null,
      geoJson: null,
      vector: null,
      currentArea: '团风县',
      tableColum:[
        {
          "name": "行政区",
          "value": "arcname",
        },
        {
          "name": "当前值（万公顷）",
          "value": "mvalue",
        },
        {
          "name": "规划目标值（万公顷）",
          "value": "planlocalvalue",
        },
        {
          "name": "现状规划目标差值（万公顷）",
          "value": "differ",
        },
        {
          "name": "目标执行（百分比）",
          "value": "rate",
        },
      ],
      townData: [
        {code: '421121100', type: 0}, {code: '421121104', type: 1}, {code: '421121102', type: 2},
        {code: '421121106', type: 3}, {code: '421121200', type: 4}, {code: '421121107', type: 5},
        {code: '421121101', type: 6}, {code: '421121105', type: 7}, {code: '421121201', type: 8},
        {code: '421121103', type: 5},
      ],
      form: {type: '1',regions:"421121100"
      },
      typeOptions: [
        { name: '年', value: '1' }, { name: '月', value: '2' }, { name: '日', value: '3' },
      ],
      regionOptions: [],
      drawLayer: null,
    }
  },
  computed: {
  },
  created() {
    this.initRegion();
  },
  mounted() {
    this.changeType(1);
    this.initData();
    this.initGeoData();
    // this.initFarmEcharts()
    // this.initXiangGeoJson()
  },
  methods: {
    async initRegion() {
      // 加载行政区划列表
      let districts = window.globalUrl.districts;
      let town = await getRegions(districts.town.url, districts.town.id);
      let country = await getRegions(districts.county.url, districts.county.id);
      this.regionOptions = country.concat(town);
      // this.form.regions = this.regionOptions[0].code;
    },
    async initData() {
      // 请求数据
      let params = {
        // kpiid: this.evaluate.kpiid,
        kpiid: sessionStorage.analyKipid,
        adcode: this.form.regions,
        type: this.form.type,
        time: this.currentYear
      }
      let res = await getComparision(params);
      let { code, data } = res;
      if(code === 200) {
        this.kpiLists = data;
        data.forEach(item => {
          item.mvalue = item.mvalue?parseFloat(item.mvalue).toFixed(2): 0;
          item.rate = item.rate?parseFloat(item.rate).toFixed(2): 0;
          item.planlocalvalue = item.planlocalvalue?parseFloat(item.planlocalvalue).toFixed(2): 0;
          item.differ = item.differ?parseFloat(item.differ).toFixed(2): 0;
        })
        this.handleComparision();
        this.initFarmEcharts();
        this.initXiangGeoJson(data);
      }
    },
    handleComparision() {
      // 处理数据
      // 筛选行政区，默认展示团风县
      this.comparision = this.kpiLists.filter(item => {
        return item.arcode === this.form.regions
      })[0] || {recentlocalvalue: '1', planlocalvalue: '1'};
      this.kpiLists = this.kpiLists.filter(item => {
        return item.arcode == this.form.regions
      });
      this.initGeoData();
    },
    changeType(val) {
      // 切换类型 年月日
      if(val == '1') {
        this.years = ['2017','2018','2019','2020','2021','2022','2023','2024','2025']
      } else if(val == '2') {
        this.years = ['2020-9','2020-10','2020-11','2020-12']
      } else {
        this.years = ['2020-12-1','2020-12-2','2020-12-3','2020-12-4']
      }
      this.chooseYear(this.years[0], 0);
      // this.initData();
    },
    changeTown(val) {
      console.log(val)
      // 切换镇查询分析总数
      // this.handleComparision();
    },
    initFarmEcharts() {
      // if (this.kpiLists.length === 0) return;
      let nameList = [];
      let nowData = [];
      let planData = [];
      this.kpiLists.forEach(item => {
        nameList.push(item.arcname);
        nowData.push(item.mvalue? (parseFloat(item.mvalue).toFixed(2)): '');
        planData.push(item.planlocalvalue? (parseFloat(item.planlocalvalue).toFixed(2)): '');
      })
      this.$set(echartsOptions.analysisOptions.xAxis[0], 'data', nameList);
      this.$set(echartsOptions.analysisOptions.series[0], 'data', nowData);
      this.$set(echartsOptions.analysisOptions.series[1], 'data', planData);
      this.$set(echartsOptions.analysisOptions.yAxis, 'name', '公顷');
      initEcharts('invention', echartsOptions.analysisOptions)
    },
    goback() {
      // 返回
      let current = JSON.parse(sessionStorage.getItem('evaluate')).item;
      this.$router.push({name: 'implement', params: {current: current}});
      sessionStorage.evaluate = null;
    },
    query() {
      this.initData();
    },
    chooseYear(year, index) {
      // 选择年份
      // this.currentYearIndex = index;
      // this.currentYear = year;
      // this.initData();
    },
    showData() {
      // 查看数据列表
      this.dialogTableVisible = true;
    },
    async initXiangGeoJson(data) {
      // 加载乡镇GeoJSON数据
      let res = await queryArcGISProperties(window.districts.town.url, window.districts.town.id, {format: 'geojson'});
      this.geoJson = res;
      if(res) {
        // data.shift();
        this.townData = data;
        this.initTownData(this.townData);
      }
    },
    async initTownData(data) {
      // 处理数据 将图层数据与GeoJSON数据匹配
      let arr = []
      this.lists.map(item => {
        data.forEach(item2 => {
          if(item2.rate > item.min && item2.rate <= item.max) {
            arr.push({
              code: item2.arcode,
              type: item.value,
              color: item.color
            })
          }
        })
      })
      console.log(arr, 'arr');
      this.geoJson.features.forEach(feature => {
        arr.forEach(item => {
          if(feature.properties.ad_code == item.code) {
            feature.properties.type = item.type;
            feature.properties.color = item.color;
          }
        })
      })
      this.vector = await getTownVectorLayer(this.geoJson);
    },
    exportData() {
      const params = {
        filename: `${this.currentArea}执行情况数值列表`
      }
      // 导出数据
      if (params.filename) {
        if (params.filename.indexOf('.csv') === -1) {
          params.filename += '.csv';
        }
      } else {
        params.filename = 'table.csv';
      }

      let columns = [];
      let datas = [];
      if (params.columns && params.data) {
        columns = params.columns;
        datas = params.data;
      } else {
        columns = this.allColumns;
        if (!('original' in params)) params.original = true;
        datas = params.original ? this.data : this.rebuildData;
      }

      let noHeader = false;
      if ('noHeader' in params) noHeader = params.noHeader;

      const data = Csv(this.tableColum, this.kpiLists, params, noHeader);
      if (params.callback) params.callback(data);
      else ExportCsv.download(params.filename, data);
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
      window.anayEvalMap.addLayer(this.drawLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea() {
      // 先移除之前点击的图层
      removeLayerByAttr(window.anayEvalMap, "layerType", "geoLayer");
      this.createEmptyLayer();
      if (!this.geolist.features) return;
      this.kpiLists.forEach(item => {
        this.geolist.features.forEach(itm => {
          if (item.arcode == itm.properties.ad_code) {
            this.currentArea = item.arcname;
            const addFe = new GeoJSON().readFeature(itm);
            let tempcoll = this.getColorValue(item)
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
    getColorValue(item) {
      let tempcoll = '';
      let value = parseFloat(item.rate)
      switch(true) {
        case value < 50:
          tempcoll = '#d1eeea';
          break;
        case value >=50 && value < 60:
          tempcoll = '#afe1dd';
          break;
        case value >= 60&& value < 80:
          tempcoll = '#67aab7';
          break;
        case value >= 80&& value <  100:
          tempcoll = '#45819a';
          break;
        case value >= 100&& value <  110:
          tempcoll = '#45739a';
          break;
        case value >= 110&& value <  120:
          tempcoll = '#30bf78';
          break;
        case value >= 120&& value <  130:
          tempcoll = '#93b41e';
          break;
        case value >= 130&& value <  140:
          tempcoll = '#26b99b';
          break;
        case value>= 140:
          tempcoll = '#e1a921';
          break;
        default:
          tempcoll = '#5ec26d';
          break;
      }
      return tempcoll;
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0;
  }
  .select-icon {
    margin: 10px;
  }

  .p-bottom {
    display: flex;
    background: #f5f5f5;
    padding: 0;
    height: calc(100% - 71px);
    .left {
      width: 877px;
      // height: 812px;
      height: 100%;
      background-color: #ffffff;
      margin-right: 15px;
      .years {
        font-family: DINNextW1G-Italic;
        font-size: 16px;
        padding-left: 21px;
        color: #6f7583;
        position: relative;
        .active {
          font-size: 20px;
          color: #1890ff;
        }
        span {
          cursor: pointer;
        }
        .town {
          position: absolute;
          right: 10px;
          top: 0;
        }
      }
      .cards {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 30px;
        .card-item {
          width: 189px;
          height: 116px;
          background-color: #405fe4;
          border-radius: 4px;
          color: #fff;
          .num {
            font-size: 26px;
            font-family: DINNextW1G-Italic;
            max-width: 115px;
            display: inline-block;
          }
          .card-title {
            margin: 0;
            line-height: 42px;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            padding-left: 10px;
          }
          img {
            vertical-align: baseline;
            margin-left: 10px;
            margin-right: 14px;
          }
          .card-data {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }

      .invention-compare {
        margin-top: 38px;
        height: calc(100% - 378px);
        .change {
          text-align: right;
          padding-right: 23px;
          span {
            color: #1890ff;
            cursor: pointer;
          }
        }
      }
    }

    .title {
      line-height: 64px;
      height: 64px;
      margin:  0 9px 0 31px;
      // border-bottom: 1px dashed #e8e8e8;
      h1 {
        font-family: MicrosoftYaHei;
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        color: #454954;
        margin: 0;
      }
    }

    .right {
      width: calc(100% - 877px);
      height: 100%;
      background: #fff;
      .myMap {
        height: calc(100% - 64px);
        position: relative;
      }
      .legend {
        position: absolute;
        bottom: 25px;
        left: 20px;
      }
    }
  }

  .s-title {
    height: 30px;
  }
}
</style>

<style lang="less">
.data-dialog {
  .el-dialog__body {
    padding: 12px 20px;
  }
}
</style>

