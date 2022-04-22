<template>
<!-- 国土空间开发适宜性评价 -->
  <div class="resources container">
    <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><span class="old-path">分析评价</span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/resources' }"><span class="old-path">国土空间开发适宜性评价</span></el-breadcrumb-item>
        <el-breadcrumb-item><span  class="current-path">{{currentContent.Name}}</span></el-breadcrumb-item>
      </el-breadcrumb> -->
      <div class="query">
        <el-form :model="form" :inline="true" label-width="120px" label-position="right">
          <!-- <el-form-item label="行政区">
            <el-select v-model="form.region">
              <el-option
                v-for="item in regionOptions"
                :key="item.name"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="评价类型">
            <el-select v-model="form.evaType" @change="changeEvaType">
              <el-option v-for="item in levels" :key="item.Name" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="button" type="primary" style="margin-left: 74px;" @click="query">确定</el-button>
          <!-- <el-button class="button" style="margin-left: 20px;">重置</el-button> -->
        </el-form>
      </div>
    </div>
    <div class="p-bottom">
      <div class="map-container">
        <my-map :id="'earth'" :image="image" :isAudit="false" />
        <div class="r-label">
          <span>{{currentContent.Name}}</span>
          <img src="../../assets/imgs/narrow-right.png" alt="">
        </div>
        <analysis v-if="isHasAnaData" class="analysis" :data="analysisData" @closeResA="closeResA"/>
        <other-analysis v-if="isHasAnaData" class="analysis2" :data="analysisData" @closeOther="closeOther"/>
        <layers class="layers" :layers="layers" @changeLayer="changeLayer" />
        <my-legend :lists="lists" :maxHeight="180" :type="'img'" :regions="regionOptions" class="myLegend" />
      </div>
    </div>
  </div>
</template>

<script>
import myMap from '../../components/map/index'
import analysis from './components/resourcesAnalysis'
import otherAnalysis from './components/other'
import layers from './components/layer'
import myLegend from '../../components/legend/index'
import { getRegions } from '../../js/map/region'
import { queryArcGISProperties } from '../../js/map/arcgis'
import { getTownVectorLayer } from '../../js/map/util'
import { getGeoUrl, getChartData, getAnalysisLayerData } from '../../api/capacity'
import actions from '../../shared/actions'
import service from '../../request/index'
export default {
  components: {
    myMap,
    analysis,
    otherAnalysis,
    layers,
    myLegend
  },
  data() {
    return  {
      currentContent: '',
      regionOptions: [],
      levels: [
        {name: '水资源评价', value: 0},
        {name: '环境评价', value: 1},
        {name: '土地资源评价', value: 2},
        {name: '生态评价', value: 3},
        {name: '灾害评价', value: 4},
        {name: '集成评价', value: 5},
      ],
      layers: [],
      form: {},
      lists: [
        {color: '#e56f07', desc: '高', value: 0},
        {color: '#dd873b', desc: '较高', value: 1},
        {color: '#d19159', desc: '中等', value: 2},
        {color: '#eac7a8', desc: '较低', value: 3},
        {color: '#f9dfc8', desc: '低', value: 4},
      ],
      geoJson: null,
      vector: null,
      image: null,
      townData: [
        {code: '421121100', type: 0}, {code: '421121104', type: 1}, {code: '421121102', type: 2},
        {code: '421121106', type: 3}, {code: '421121200', type: 4}, {code: '421121107', type: 0},
        {code: '421121101', type: 1}, {code: '421121105', type: 2}, {code: '421121201', type: 3},
        {code: '421121103', type: 4},
      ],
      userId: '',
      allLegend: [],
      reclassObj: [], // 获取所有的重分类数组
      reclass: [], // 重分类的区间
      analysisData: [], // 统计数据
      isHasAnaData: true, // 图层是否可分析，有分析数据
    }
  },
  created() {
    this.initAnaLevel();
    this.initRegion();
    this.getUserInfo();
  },
  mounted() {
    // this.initXiangGeoJson()
    console.log(window.globalUrl, 'global')
  },
  methods: {
    async initRegion() {
      // 加载行政区划列表
      let districts = window.globalUrl.districts;
      let town = await getRegions(districts.town.url, districts.town.id);
      let country = await getRegions(districts.county.url, districts.county.id);
      this.regionOptions = country.concat(town);
    },
    async initXiangGeoJson() {
      // 加载乡镇GeoJSON数据
      let districts = window.globalUrl.districts;
      let res = await queryArcGISProperties(districts.town.url, districts.town.id, {format: 'geojson'});
      this.geoJson = res;
    },
    getUserInfo() {
        // onGlobalStateChange 第二个入参为 true，代表立即执行一次观察者函数
      actions.onGlobalStateChange(state => {
        const { useInfoData } = state;
        if (useInfoData) {
          this.userId = useInfoData.userid;
        }
      }, true);
    },
    async initAnaLevel() {
      // 初始化评价类型
      this.layers = [];
      let params = {
        year: '2019',
        maptype: 'spj1'
      }
      let res = await getGeoUrl(params);
      let {code, data} = res;
      if(code === 200) {
        this.levels = data;
        this.form.evaType = this.levels[0].Id;
        this.changeEvaType(this.levels[0].Id);
        this.query();
      }
    },
    changeEvaType(val) {
      // 选择评价级别事件
      this.currentContent = (this.levels.filter(item => {return item.Id === val}))[0];
    },
    query() {
      // 查询
      this.initLegend();
      this.getReclass();
      // this.initLayers();
    },
     async initLegend() {
      // 加载所有的图例
      let url = this.currentContent.MapServerPath + '/legend?f=pjson';
      let res = await service.get(url);
      this.allLegend = res.layers;
    },
    async initLayers() {
      // 根据评价类型初始化图层
      this.layers = [];
      let url = this.currentContent.MapServerPath + '?f=pjson';
      let res = await service.get(url);
      res.layers.map(item => {
        if(!item.subLayerIds) {
          this.layers.push(item)
        }
      })
    },
    async getReclass() {
      // 获取重分类的区间
      let params = {
        mapid: this.currentContent.Id
      }
      let res = await getAnalysisLayerData(params);
      let { code, data } = res;
      if(code === 200) {
        console.log(data, 'anadata');
        this.reclassObj = data;
        this.initLayers();
      }
    },
    changeLayer(val) {
      console.log(val)
      // 切换图层
      this.lists = [];
      this.initTownData(val);
      let legendObj = this.allLegend.filter(item => {
        return item.layerId === val
      })
      console.log(legendObj)
      this.lists = legendObj.length > 0 ? legendObj[0].legend : [];
      // 切换图层获取表格和图表的数据
      this.getTableAndChartData(val);
    },
    async initTownData(id) {
      // 处理数据 将图层数据与GeoJSON数据匹配
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
      if(this.reclassObj[id]) {
        // 当前图层的重分类数据
        this.isHasAnaData = true;
        // debugger
        this.reclass = this.reclassObj[id];
        let types = [];
        this.reclass.map(item => {
          types.push(item.definevalue)
        })
        let params = {
          userId: this.userId,
          rasterId: id,
          reclassStr: types.join('#'),
        }
        let res = await getChartData(params);
        let { code, data } = res;
        if(code === 200) {
          // 整合数据
          this.reclass.map(item => {
            item.value = data[item.definevalue]
          })
          console.log(this.reclass, 'reclass')
          this.analysisData = this.reclass;
        }
      } else {
        this.isHasAnaData = false;
        // this.$message.info('该图层不可分析！');
      }
    },
    closeResA() {
      this.isHasAnaData = !this.isHasAnaData;
    },
    closeOther() {
      this.isHasAnaData = !this.isHasAnaData;
    }
  }
}
</script>

<style lang="less" scoped>
.resources {
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
      top: 20px;
      right: 87px;
    }
    .analysis2 {
      position: absolute;
      top: 20px;
      right: 605px;
    }
    .layers {
      position: absolute;
      top: 20px;
      left: 58px;
    }
    .r-label {
      position: absolute;
      top: 20px;
      left: 0;
      background-color: rgba(0, 21, 41, 0.4);
      color: #fff;
      width: 36px;
      // height: 160px;
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

