<template>
<!-- 资源环境承载能力评价 -->
  <div class="developing-suitable container">
    <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><span class="old-path">分析评价</span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/developinglabel' }"><span class="old-path">资源环境承载能力评价</span></el-breadcrumb-item>
        <el-breadcrumb-item><span  class="current-path">{{currentContent.Name}}</span></el-breadcrumb-item>
      </el-breadcrumb> -->
      <div class="query my-select">
        <el-form :model="form" :inline="true" label-width="120px" label-position="right">
          
          <el-form-item label="年份">
             <el-date-picker
      v-model="form.year"
      type="year"
      format="yyyy"
      value-format="yyyy"
      placeholder="选择年">
    </el-date-picker>
            
          </el-form-item>
          <el-form-item label="行政区">
            <el-select v-model="form.region" @change="selectRegion">
              <el-option
                v-for="item in regionOptions"
                :key="item.name"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价级别">
            <el-select v-model="form.evaluation" @change="changeEvaLevel">
              <el-option v-for="item in analysisLevels" :key="item.Name" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="button" type="primary" style="margin-left: 74px;" @click="query">确定</el-button>
          <!-- <el-button class="button" style="margin-left: 20px;" @click="resetQuery">重置</el-button> -->
        </el-form>
      </div>
    </div>
    <div class="p-bottom">
      <div class="map-container">
        <my-map :id="'earth'" :image="image" :isAudit="false" />
        <div class="r-label">
          <span>{{currentContent.Name}}</span>
          <!-- <img src="../../assets/imgs/narrow-right.png" alt=""> -->
        </div>
        <analysis class="analysis" :data="analysisData" :analysName="analysName" :regionName="regionName"/>
        <my-legend :lists="lists" :maxHeight="200" :type="'img'" class="myLegend" />
      </div>
    </div>
  </div>
</template>

<script>
import myMap from '../../components/map/index'
import analysis from './components/situationAnalysis'
import myLegend from '../../components/legend/index'
import { getRegions } from '../../js/map/region'
import { queryArcGISProperties } from '../../js/map/arcgis'
import { getTownVectorLayer } from '../../js/map/util'
import { getGeoUrl, getCapacityAnaData } from '../../api/capacity'
import service from '../../request/index'
export default {
  components: {
    myMap,
    analysis,
    myLegend
  },
  data() {
    return  {
      currentContent: '',
      regionOptions: [],
      analysisLevels: [],
      form: {
        evaluation: 'czkysl',
        year:"2019"
      },
      lists: [
        // {color: '#234ea3', label: '极重要', value: 0},
        // {color: '#4c85ea', label: '重要', value: 1},
        // {color: '#23b2e1', label: '一般重要', value: 2},
      ],
      townData: [
        {code: '421121100', type: 2}, {code: '421121104', type: 1}, {code: '421121102', type: 0},
        {code: '421121106', type: 2}, {code: '421121200', type: 1}, {code: '421121107', type: 0},
        {code: '421121101', type: 2}, {code: '421121105', type: 0}, {code: '421121201', type: 0},
        {code: '421121103', type: 2},
      ],
      image: null,
      geoJson: null,
      analysisData: [],
      regionName: '团风县',
      analysName:''
    }
  },
  created() {
    this.initRegion();
    this.initAnaLevel();
  },
  mounted() {
    this.initXiangGeoJson()
  },
  methods: {
    async initRegion() {
      // 加载行政区划列表
      let districts = window.globalUrl.districts;
      let town = await getRegions(districts.town.url, districts.town.id);
      let country = await getRegions(districts.county.url,districts.county.id);
      this.regionOptions = country.concat(town);
      this.form.region = this.regionOptions[0].code;
    },
    async initXiangGeoJson() {
      // 加载乡镇GeoJSON数据
      let districts = window.globalUrl.districts;
      let res = await queryArcGISProperties(districts.town.url, districts.town.id, {format: 'geojson'});
      this.geoJson = res;
    },
    async initAnaLevel() {
      // 初始化评价类型
      let params = {
        year: '2019',
        maptype: 'spj4'
      }
      let res = await getGeoUrl(params);
      let {code, data} = res;
      if(code === 200) {
        this.analysisLevels = data;
        if (data) {
          this.form.evaluation = this.analysisLevels[0].Id;
          this.analysName = this.analysisLevels[0].Name;
          this.changeEvaLevel(this.analysisLevels[0].Id);
        }
        this.query();
      }
    },
    changeEvaLevel(val) {
      // 选择评价级别事件
      this.currentContent = (this.analysisLevels.filter(item => {return item.Id === val}))[0];
      this.analysName = this.currentContent.Name;
    },
    query() {
      // 查询
      this.initLegend();
      // this.initLayers();
    },
    selectRegion(val) {
      this.form.region = val;
      this.regionName = this.regionOptions.filter(item => item.code == val)[0].name
    },
    // resetQuery() {

    //   this.initLegend();
    // },
    async initLayers() {
      // 根据评价类型初始化图层
      this.layers = [];
      let url = this.currentContent.MapServerPath + '?f=pjson';
      let res = await service.get(url);
      if(res) {
        res.layers.map(item => {
          if(!item.subLayerIds) {
            this.layers.push(item)
          }
        })
        let lastIndex = this.layers.length - 1;
        this.changeLayer(this.layers[lastIndex].id);
      }
    },
    async initLegend() {
      // 加载所有的图例
      let url = this.currentContent.MapServerPath + '/legend?f=pjson';
      let res = await service.get(url);
      if(res) {
        this.allLegend = res.layers;
        this.initLayers();
      }
    },
    changeLayer(val) {
      // 切换图层
      this.lists = [];
      this.initTownData(val);
      // console.log(this.allLegend, 'alllenged')
      let legendObj = this.allLegend.filter(item => {
        return item.layerId === val
      })
      this.lists = legendObj[0].legend;
      // console.log(this.lists)
      // 切换图层获取表格和图表的数据
      this.getTableAndChartData(val);
    },
    async initTownData(id) {
      // 处理数据 将图层数据与GeoJSON数据匹配\
      let params = {
        type:"arcgis",
        url: this.currentContent.MapServerPath,
        layers: "show:" + id,
        layerName: id
      }
      this.image = params;
    },
    async getTableAndChartData(id) {
      // 获取表格和图表数据
      let params = {
        name: this.analysName,
        adcode: this.form.region || '421121',
        year: this.form.year
      }
      let res = await getCapacityAnaData(params);
      let {code, data} = res;
      if(code === 200 && data) {
        this.analysisData = data;
      }else {
        this.analysisData = [];
      }
      this.regionName = this.regionOptions.filter(item => item.code == this.form.region)[0].name;
    }
  }
}
</script>

<style lang="less" scoped>
.developing-suitable {
  .p-top {
    .button {
      width: 90px;
      height: 36px;
      line-height: 10px;
      border-radius: 0;
    }
  }
  .p-bottom {
    padding: 20px 20px 0;
    .map-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .analysis {
      position: absolute;
      top: 14px;
      right: 87px;
    }
    .r-label {
      position: absolute;
      top: 20px;
      left: 0;
      background-color: rgba(0, 21, 41, 0.4);
      color: #fff;
      width: 36px;
      // height: 220px;
      padding-top: 12px;
      padding-bottom: 10px;
      text-align: center;
      z-index: 2;
      span {
        width: 36px;
        letter-spacing: 5px;
        display: inline-block;
      }
    }
    .myLegend {
      position: absolute;
      bottom: 84px;
      left: 58px;
    }
  }
}
</style>
