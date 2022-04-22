<template>
<a-locale-provider :locale="locale">
  <div class="one-map">
    <div class="left">
      <Left
        ref="left"
        :showTree="showTree"
        :removeTreeCheckedKeys="removeTreeCheckedKeys"
        @treeNodeClick="treeNodeClick"
        @treeNodeCheck="treeNodeCheck"
        @updateMapSize="fullScreen"
      />
    </div>
    <div class="right">
      <div class="right-content">
        <div id="map" ref="rootmap"></div>
        <search-box
          ref="searchBox"
          :cities="cities"
          @mapPosition="mapPosition"
          @pois="pois"
          @hoverDesc="hoverDesc"
          @outHover="outHover"
          @clickDesc="clickDesc"
          @clearPoint="clearPoint"
          @handleCityClick="handleCityClick"
          @closeCityBox="closeCityBox"
          @currentLocation="currentLocation"
          @locationAddress="locationAddress"
          @changeXzLayer="changeXzLayer"
        ></search-box>
        <top-tools :map="map" ></top-tools>
        <base-tools
          ref="baseTools"
          :map="map"
          :fullScr="showTree"
          @handleDtChange="changeLayer"
          @changeBoxVal="changeBoxVal"
          @fullScreen="fullScreen"
          @clearTreeCheckedLayers="clearTreeCheckedLayers"
        ></base-tools>
        <advanced-tools
          :map="map"
          ref="advancedTools"

          @spaceSift="spaceSift"
          @rollerShutter="rollerShutter"
          @multiWindow="multiWindow"
          @superposition="superposition"
          @bufferAnalysis="bufferAnalysis"
          @ecologyStatistics="ecologyStatistics"
          @reviewSearch="reviewSearch"
          @spotStatistics="spotStatistics"
          @farmlandStatistics="farmlandStatistics"
          @detailedPlan="detailedPlan"
        ></advanced-tools>
        <Footer :map="map" :dtType="dtType" />
        <superposition-analysis
          ref="superposition"
          :options="layersOnMap"
          :map="map"
        ></superposition-analysis>
        <buffer-analysis @changeXzLayer="changeXzLayer" ref="buffer" :map="map"></buffer-analysis>
        <space-sift
          ref="spaceSift"
          :map="map"
          :options="layersOnMap"
          @showTableWrapper="showTableWrapper"
          @closeCard="closeCard"
        ></space-sift>
        <ecology-statistics
          ref="ecologyStatistics"
          :map="map"
        ></ecology-statistics>
        <review-search :map="map" ref="reviewSearch"></review-search>
        <variance-pattern :map="map" ref="variancePattern"></variance-pattern>
        <basic-land :map="map" ref="basicLand"></basic-land>
        <Legend v-if="legendlists.length >0" :lists="legendlists" :maxHeight="180" :type="'box'" class="myLegend" />
      </div>

      <div class="table-wrapper" v-show="showTable">
        <span class="table-icon">
          <a-icon
            type="vertical-align-bottom"
            :class="[!showContent ? 'btn-trans' : '', 'btn1']"
            :title="showContent ? '收缩' : '展开'"
            @click="clickContract"
          />
          <a-icon type="close" class="btn1" @click="closeTable" />
        </span>
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          :customRow="rowClick"
          bordered
        >
        </a-table>
      </div>
    </div>
    <a-modal
      title="选择政务数据年份"
      :visible="govYearvisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="content">
        <div class="select-wrapper">
          <span style="line-height: 30px; padding-right: 8px">年份:</span>
          <a-select
            v-model="searchYear"
            placeholder="请选择年份"
            style="width: 200px"
            ><a-select-option :value="currentyear - index" v-for="(item,index) in 10" :key="index" v-if="item < 10">
              {{ currentyear - index }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </div>
</a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { Circle as CircleStyle,Icon, Fill, Text, Stroke, Style } from "ol/style";
import Left from "@/components/left/index";
import SearchBox from "@/components/searchBox/index";
import BaseTools from "@/components/baseTools/index";
import TopTools from "@/components/topTools/index";
import AdvancedTools from "@/components/advancedTools/index";
import Footer from "@/components/footer/index";
import SuperpositionAnalysis from "@/components/superpositionAnalysis/index";
import BufferAnalysis from "@/components/bufferAnalysis/index";
import SpaceSift from "@/components/spaceSift/index";
import EcologyStatistics from "@/components/ecologyStatistics/index";
import ReviewSearch from "@/components/reviewSearch/index";
import VariancePattern from "@/components/variancePattern/index";
import BasicLand from "@/components/basicLand/index";
import Legend from "@/components/legend/index";
import "ol/ol.css";
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import { registerProj } from "@/mapjs/projections.js";
import {
  zoomIn,
  zoomOut,
  toggleFullScreen,
  gotoCoordinate,
} from "@/mapjs/tool/baseTool.js";
import { measureEvent, createPointTooltip } from "@/mapjs/tool/measure.js";
import {
  getBaseLayers,
  getCountyVectorLayer,
  getTownVectorLayer,
  setTownLayer,
  removeLayerByClass,
  removeLayerByAttr,
  removeLayersByKVP,
  addBasicLayerOnMap,
  getTreeLayerKeys,
  getCityByCoordinate
} from "./function";
import { bluePoint, redPoint, redPoint1 } from "./pointStyle";
import { changeInteraction, getFeatureByCode } from "./featureEvents";
import { getBufferFeature, test } from "@/mapjs/tool/buffer.js";
import EsriJSON from "ol/format/EsriJSON";
import { getTFGeoJSON } from "./getTFGeoJSON";
import GeoJSON from "ol/format/GeoJSON";
import { superpositionAnalysis } from "@/mapjs/GPService/superposition";
import { getGovDataNumber } from "@/api/statistics";
export default {
  data() {
    return {
      locale: zhCN,
      map: null,
      data1: [],
      showLayer: false,
      removeTreeCheckedKeys: [],
      value2: 50,
      columns: [],
      data: [],
      pagination: {
        size: "small",
        total: 0,
        showTotal: (total) => `共 ${total} 条数据`,
        hideOnSinglePage: true,
      },
      showTable: false,
      showContent: true,
      layersOnMap: [], //地图上已经加载的图层
      cities: [],
      dtType: "", // 底图类型
      showTree: true,
      govLayer: null,
      currnetResourceId: '',
      currentyear: (new Date).getFullYear(),
      searchYear: (new Date).getFullYear(),
      govYearvisible: false,
      legendlists: [],
      colors: ['#ffff00','#ffe100','#ffc300','#ffa600', '#ff8800','#ff7500','#ff6600','#ff5500','#ff4400']
    };
  },

  props: {},
  watch: {

  },
  components: {
    Left,
    BaseTools,
    TopTools,
    SearchBox,
    AdvancedTools,
    Footer,
    SuperpositionAnalysis,
    BufferAnalysis,
    SpaceSift,
    EcologyStatistics,
    ReviewSearch,
    VariancePattern,
    BasicLand,
    Legend
  },
  created() {},

  computed: {},

  mounted() {
    registerProj();
    this.loadMap();
    // console.log("window.globalUrl", window.globalUrl);
  },

  methods: {
    // 加载地图
    async loadMap() {
      // 初始化地图
      this.map = initMap("map", {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom,
      });
      // 获取底图
      this.changeLayer(1);
      let res = await getTFGeoJSON();
      if (res) {
        window.TF_XIAN = res[0];
        window.TF_XZ = res[1];
      }
      // 获取县范围
      let fe = new GeoJSON().readFeatures(window.TF_XIAN);
      // // console.log(fe[0].getGeometry().getExtent())
      if (fe.length > 0) {
        window.extent = fe[0].getGeometry().getExtent();
      }
      // 生成城市数据
      let arr = [];
      window.TF_XIAN.features.forEach((i) => {
        arr.push({
          name: i.properties.Name,
          code: i.properties.ad_code,
        });
      });
      window.TF_XZ.features.forEach((i) => {
        arr.push({
          name: i.properties.Name,
          code: i.properties.ad_code,
        });
      });
      this.toCityData(arr);
      this.map.getView().on("change", this.getNameByMap);
    },
    // 格式化搜索框城市数据
    toCityData(data) {
      let FristPin = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "W",
        "X",
        "Y",
        "Z",
      ];
      let pinyin = require("js-pinyin");
      pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
      data.forEach((item) => {
        //取全部城市的首字母
        let fristName = pinyin.getCamelChars(item.name).substring(0, 1); //这里截取首字母的第一位
        item.fristLetter = fristName;
      });
      // 构造城市数据格式
      let newArr = [
        {
          title: "热门",
          lists: data,
        },
      ];
      //根据首字母键值对给原数据按首字母分类
      for (let i = 0; i < FristPin.length; i++) {
        //这里的FirstPin是一个写入了所有字母的数组,见data中
        let arr = data.filter((value) => {
          return value.fristLetter === FristPin[i];
        });
        if (arr.length > 0) {
          newArr.push({
            title: FristPin[i],
            lists: arr,
          });
        }
      }
      this.cities = newArr;
    },
    // 树点击事件,异步加载图层并定位
    async treeNodeClick(a, b) {
      // 先移除之前点击的图层
      removeLayerByAttr(this.map, "layerType", "TreeClickLayer");
      if (a) {
        let { type, url, layers, extent } = b;
        let params = {
          type,
          url, //必参
          layers, // "show:0,1,2,3",
          extent,
        };
        let layer = await createImageLayer(params);
        if (layer) {
          // 给点击的图层设置统一的标识字段
          layer.set("layerType", "TreeClickLayer");
          this.map.addLayer(layer);
          if (Array.isArray(params.extent)) {
            this.map.getView().fit(params.extent);
          }
        }
      } else {
        removeLayerByAttr(this.map, "layerType", "TreeClickLayer");
      }
    },
    // 树节点复选框事件
    async treeNodeCheck(a, b, nodes) {

      // 分情况处理地图
      if (b.resourcetype =='attable') {
        if (a) this.govYearvisible = true;
        else removeLayerByAttr(this.map, "layerType", "govLayer");this.legendlists = []
        this.currnetResourceId = b.resourceid;
      }else {
        this.layersOnMap.push(b);
        // console.log(this.layersOnMap)
        const  MAPDOC_API = window.globalUrl.API_ONEMAP_STATISTICS
        let contWidth = this.$refs.rootmap.offsetWidth;
        let contHeight = this.$refs.rootmap.offsetHeight;
        if (a) {
          let tempType = b.resourcetype==='vector'?1:0;
          let params = {
            type: 'geoserver',
            layers: b.layerName || 'layerType',
            url: `${MAPDOC_API}/TFGTKJGH/WMS/GetMapOutImg?layerid=${b.resourceid}&imgHeight=${contHeight}&imgWidth=${contWidth}&vector=${tempType}`
          }
          // let { type, url, layers, extent } = b;
          // let params = {
          //   type,
          //   url, //必参
          //   layers, // "show:0,1,2,3",
          //   extent,
          // };
          let layer = await createImageLayer(params);
          if (layer) {
            // 给点击的图层设置统一的标识字段
            layer.set("treeLayerId", b.id);
            layer.set("layerType", "TreeCheckedLayer");
            this.map.addLayer(layer);
            if (Array.isArray(params.extent)) {
              this.map.getView().fit(params.extent);
            }
          }
        } else {
          let arr = [];
          this.layersOnMap.forEach((i, j) => {
            if (i.id != b.id) {
              arr.push(i);
            }
          });
          this.layersOnMap = arr;
          removeLayerByAttr(this.map, "treeLayerId", b.id);
        }
      }
      // 获取已选节点
      const selectNodes = []
      nodes.checkedNodes.forEach(item => {
        selectNodes.push(item.data.props)
      })
      sessionStorage.selectNodes = JSON.stringify(selectNodes);
    },
    handleCancel() {
      this.govYearvisible = false;
    },
    async handleOk() {
      let params = {
        layerId: this.currnetResourceId,
        year: this.searchYear
      }
      let res = await getGovDataNumber(params);
      const { code, data } = res;
      if (code ==200) {
        this.govYearvisible = false;
        this.addFeatureByArea(data.gradingResult);
        this.legendlists = [];
        data.gradingValue.forEach(item => {
          let obj = {};
          obj.color = this.colors[parseInt(item.index) - 1];
          obj.label = item.label;
          this.legendlists.push(obj);
        })
      }else {
        this.$message.info('当前年份暂无政务数据！');
      }
    },
    // 树隐藏时更新地图大小
    updateMapSize(e) {
      this.$nextTick(() => {
        this.map.updateSize();
      });
    },
    // 切换底图
    async changeLayer(e) {
      this.dtType = e;
      // remove
      removeBaseLayers(this.map);
      // add
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map, layers);
    },
    // 图层的显示与隐藏
    changeBoxVal(e, f, location) {
      // console.log(location)
      switch(e) {
        case 'checked1':
          if (f) {
            // 获取永久基本农田
            addBasicLayerOnMap(
              this.map,
              "farmlandLayer",
              window.globalUrl.redLines.farmland
            );
          } else {
            // 移除永久基本农田
            removeLayerByAttr(this.map, "layerName", "farmlandLayer");
          }
          break;
        case 'checked2':
          if (f) {
            // 获取生态保护红线
            addBasicLayerOnMap(
              this.map,
              "ecologyLayer",
              window.globalUrl.redLines.ecologicalProtection
            );
          } else {
            // 移除生态保护红线
            removeLayerByAttr(this.map, "layerName", "ecologyLayer");
          }
          break;
        case 'checked3':
          if (f) {
            // 获取城镇扩展边界
            addBasicLayerOnMap(
              this.map,
              "borderLayer",
              window.globalUrl.redLines.borderTown
            );
          } else {
            // 移除城镇扩展边界
            removeLayerByAttr(this.map, "layerName", "borderLayer");
          }
          break;
        case 'checked4':
          if (f) {
            // 获取县
            let layer = getCountyVectorLayer();
            this.map.addLayer(layer);
            this.map.getView().fit(window.extent);
          } else {
            // 移除县
            removeLayerByAttr(this.map, "layerName", "xianLayer");
          }
          break;
        case 'checked5':
          if (f) {
            let layer = null;
            this.$refs.searchBox.showLayer = true;
            removeLayerByAttr(this.map, "layerName", "setTownLayer");
            removeLayerByAttr(this.map, "layerName", "townLayer");
            if (location.code !='421121') layer= setTownLayer(location);
            else layer = getTownVectorLayer();
            let layerArr = this.map.getLayers();
            layerArr.insertAt(1, layer); // 插入到第二个
            this.map.getView().fit(window.extent);
          } else {
            this.$refs.searchBox.showLayer = false;
            // 移除乡镇
            removeLayerByAttr(this.map, "layerName", "setTownLayer");
            removeLayerByAttr(this.map, "layerName", "townLayer");
          }
          break;
        default:
          break;
      }
    },
    // 搜索框点的定位
    mapPosition(e) {
      if (this.map) {
        //changeInteraction(this.map, 2);
      }
      // 将红色的点图层移除
      removeLayerByClass(this.map, "redPoint1");
      let pointTip = this.map.getOverlayById("pointTip1");
      this.map.removeOverlay(pointTip);
      // 给地图标点叠加新的红色点
      this.map.addLayer(redPoint1(e.location, ""));
      createPointTooltip(this.map, e.name, e.location, "pointTip1");
      this.map.getView().setCenter(e.location);
      this.map.getView().setZoom(15);
    },
    // 详细信息地图标点
    pois(e) {
      if (this.map) {
        //changeInteraction(this.map, 2);
      }
      // console.log(158888, e);
      // 先清除之前的点
      removeLayerByClass(this.map, "bluePoint");
      // 循环添加列表中的点
      e.forEach((item) => {
        this.map.addLayer(
          bluePoint(item.location, item.id + "", item.name, item.location)
        );
      });
      this.map.getView().fit(this.$refs.searchBox.locationInfo.extent);
    },
    // 详细信息鼠标点击
    clickDesc(e) {
      if (this.map) {
        //changeInteraction(this.map, 2);
      }
      // 将红色的点图层移除
      removeLayerByClass(this.map, "redPoint1");
      let pointTip = this.map.getOverlayById("pointTip1");
      this.map.removeOverlay(pointTip);
      // 给地图标点叠加新的红色点
      this.map.addLayer(redPoint1(e.location, e.id + ""));
      createPointTooltip(this.map, e.name, e.location, "pointTip1");
      this.map.getView().setCenter(e.location);
      this.map.getView().setZoom(15);
    },
    // 详细信息鼠标移入
    hoverDesc(e) {
      // 给地图标点叠加新的红色点
      this.map.addLayer(redPoint(e.location, e.id + ""));
      createPointTooltip(this.map, e.name, e.location, "pointTip");
    },
    // 详细信息鼠标移出
    outHover(e) {
      // 将红色的点图层移除
      removeLayerByClass(this.map, "redPoint");
      let pointTip = this.map.getOverlayById("pointTip");
      this.map.removeOverlay(pointTip);
    },
    // 清空矢量图层
    clearPoint() {
      // 将蓝色的点图层移除
      removeLayerByClass(this.map, "bluePoint");
      // 将红色的点图层移除
      removeLayerByClass(this.map, "redPoint1");
      let pointTip = this.map.getOverlayById("pointTip1");
      this.map.removeOverlay(pointTip);
      if (this.map) {
        changeInteraction(this.map, 0);
      }
    },
    // 当前城市点击
    currentLocation(e) {
      this.map.getView().fit(e.extent);
    },
    // 城市点击
    locationAddress(e) {},
    // 城市数据的点击
    handleCityClick(i, j) {
      console.log(i,j)
      // 获取范围
      let extent = getFeatureByCode(i.code);
      // 重置当前位置信息定位数据
      (this.$refs.searchBox.locationInfo = {
        name: i.name,
        extent: extent,
      }),
        this.changeBoxVal("checked5", j, i);
      this.$refs.baseTools.checked5 = j;
      if (this.map) {
        this.map.getView().fit(extent);
      }
    },
    // 乡镇图层是否显示
    changeXzLayer(e,location) {
      this.changeBoxVal("checked5", e, location);
      this.map.getView().fit(this.$refs.searchBox.locationInfo.extent);
      this.$refs.baseTools.checked5 = e;
    },
    // 关闭城市框
    closeCityBox() {},
    // 全屏
    fullScreen(e) {
      this.showTree = !this.showTree;
      let mapEl = document.querySelector(".right");
      let leftEl = document.querySelector(".left");
      mapEl.style.width = this.showTree
        ? `calc(100% - 450px)`
        : `calc(100% - 42px)`;
      leftEl.style.width = this.showTree ? `416px` : `42px`;
      this.updateMapSize();
    },
    // 清除左侧树已选择的图层、缓冲区图层
    clearTreeCheckedLayers() {
      let arr = getTreeLayerKeys(this.map, "treeLayerId");
      // console.log(arr);
      this.removeTreeCheckedKeys = arr;
      removeLayerByAttr(this.map, "layerType", "TreeClickLayer");
      removeLayerByAttr(this.map, "layerType", "TreeCheckedLayer");
      removeLayerByAttr(this.map, "layerType", "bufferLayer");
      removeLayerByAttr(this.map, "layerType", "superLayer");
      removeLayerByAttr(this.map, "layerType", "reviewSearchLayer");
      removeLayerByAttr(this.map, "layerType", "spaceSiftLayer");
      removeLayerByAttr(this.map, "layerType", "kgxgdjfxLayer");
      removeLayerByAttr(this.map, "layerType", "drawLayer");
      this.$refs.baseTools.clear();  // 清除测量

    },
    // 滑块拖动的值
    sliderValue(val) {
      // 在每次用户改变swipe控件时触发
      // console.log(val, this.value2);
      // 渲染地图
      this.map.render();
    },
    // 卷帘效果
    rollerShutter() {
      this.closeAllComp();
      this.$router.push("/oneMap/rollerShutter");
    },
    // 多窗口对比
    multiWindow() {
      this.closeAllComp();
      this.$router.push("/oneMap/multiWindow");
    },
    // 叠加分析
    superposition() {
      this.closeAllComp();
      this.$refs.superposition.showDjfx = true;
    },
    // 缓冲区分析
    bufferAnalysis() {
      this.closeAllComp();
      this.$refs.buffer.showHcqfx = true;
    },
    // 缓冲区分析图层
    async bufferAnalysisLayer() {
      // 创建空的矢量图层
      let param = {
        type: 0,
      };
      let layer = await createVectorLayer(param);
      let layerSource = layer.getSource();
      let feature = test();
      layerSource.addFeature(feature);
      this.map.addLayer(layer);
    },
    // 表格行的点击事件
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            // console.log(record, index);
            let geom = new EsriJSON().readGeometry(record.geometry);
            let extent = geom.getExtent();
            this.map.getView().fit(extent);
          },
        },
      };
    },
    // 展示表格数据
    showTableWrapper(a, b, c) {
      this.showTable = true;
      this.data = a;
      this.columns = b;
      this.pagination.total = c;
      let mapEle = document.querySelector(".right-content");
      mapEle.style.height = "80%";
      let tableEle = document.querySelector(".table-wrapper");
      tableEle.style.height = "20%";
      this.updateMapSize();
    },
    // 下方div的收缩与展开
    clickContract() {
      let mapWrapper = document.querySelector(".right-content");
      let bottomWrapper = document.querySelector(".table-wrapper");
      if (this.showContent) {
        this.showContent = false;
        mapWrapper.style.height = "calc(100% - 40px)";
        bottomWrapper.style.height = "40px";
        this.updateMapSize();
      } else {
        this.showContent = true;
        mapWrapper.style.height = "80%";
        bottomWrapper.style.height = "20%";
        this.updateMapSize();
      }
    },
    // 关闭表格
    closeTable() {
      this.showTable = false;
      removeLayerByAttr(this.map, "layerType", "spaceSiftLayer");
      let mapEle = document.querySelector(".right-content");
      mapEle.style.height = "100%";
      this.updateMapSize();
    },
    // 关闭所有组件
    closeAllComp() {
      this.closeTable();
      (this.$refs.spaceSift.showKjsx = false),
        (this.$refs.ecologyStatistics.showSthx = false);
      this.$refs.reviewSearch.showZscx = false;
      this.$refs.basicLand.showJbnt = false;
      this.$refs.variancePattern.showCytb = false;
      this.$refs.superposition.showDjfx = false;
      this.$refs.buffer.showHcqfx = false;
    },
    // 空间筛选组件
    spaceSift(e) {
      this.closeAllComp();
      this.$refs.spaceSift.showKjsx = e;
    },
    //空间筛选组件关闭
    closeCard() {
      this.closeTable();
      this.$refs.advancedTools.show1 = false;
    },
    // 生态红线分析组件
    async ecologyStatistics() {
      this.closeAllComp();
      this.$refs.ecologyStatistics.showSthx = true;
      // 展示生态红线图层
      let layer = await addBasicLayerOnMap(
        this.map,
        "ecologyLayer",
        window.globalUrl.redLines.ecologicalProtection
      );
      // console.log(layer);
      this.$refs.baseTools.checked2 = true;
      // 获取图层面的中心点坐标
    },
    // 历史图斑追溯查询组件
    reviewSearch() {
      this.closeAllComp();
      this.$refs.reviewSearch.showZscx = true;
    },
    // 土规、城规差异图斑统计
    spotStatistics() {
      this.closeAllComp();
      this.$refs.variancePattern.showCytb = true;
    },
    // 永久基本农田统计
    farmlandStatistics() {
      this.closeAllComp();
      this.$refs.basicLand.showJbnt = true;
    },
    // 控规详规叠加分析
    async detailedPlan() {
      this.$message.info('任务开始，请稍等！')
      this.closeAllComp();
      let url =
        window.globalUrl.API_ONEMAP_STATISTICS +
        "/TFGTKJGH/GPService/IntersectAnalysis_KGXG";
      // let id1 = window.globalUrl.cityPlan.regulatoryPlan.id; // 控规
      // let id2 = window.globalUrl.cityPlan.sitePlan.id; // 详规
      let res = await superpositionAnalysis(url);

      if (res.layer) {
        res.layer.set("layerType", "kgxgdjfxLayer");
        this.map.addLayer(res.layer);
        this.map.getView().fit(res.extent);
      }
    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0,
      };
      this.govLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.govLayer.set("layerType", "govLayer");
      this.map.addLayer(this.govLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea(data) {
      removeLayerByAttr(this.map, "layerType", "govLayer");
      // 开始绘制
      this.createEmptyLayer();
      if (!window.TF_XZ.features) return;
      // let imgUrl = require("../../assets/imgs/mark.png")
      data.forEach(item => {
        window.TF_XZ.features.forEach(itm => {
          if (item.regionCode.replace(/[ ]|[\r\n]/g,"") == itm.properties.ad_code) {
            const features = new GeoJSON().readFeature(itm);
            let that = this;
            let styleFunction = function(feature){
              let styles = [
                new Style({
                  stroke: new Stroke({
                    color: '#000',    // 面的边界线颜色
                    width: 1         // 边界线宽
                  }),
                  fill: new Fill({
                    //矢量图层填充颜色，以及透明度
                    color: that.colors[parseInt(item.level) - 1],
                  }),
                  text: new Text({
                    font: "12px 微软雅黑 ",
                    offsetY: 5,
                    text: `${itm.properties.Name}`,
                    fill: new Fill({
                      color: "#000000",
                    }),
                  }),
                })
              ];
              // 点样式
              let point = feature.getGeometry().getInteriorPoint();
              styles.push(new Style({
                geometry:point,
                // image: new Icon({
                //   anchor: [0.5, 0.96],
                //   crossOrigin: 'anonymous',
                //   src: imgUrl,
                // }),
                text: new Text({
                  font: "14px 微软雅黑 ",
                  text: `${item.count}`,
                  offsetX: 0,
                  offsetY: 20,
                  fill: new Fill({
                    color: "#000000",
                  }),
                }),
              }))
              return styles;
            }
            this.govLayer.getSource().addFeature(features);
            features.setStyle(styleFunction);
          }
        })
      })
    },
     async getNameByMap() {
      let map = this.map;
      let center = map.getView().getCenter();
      let res=await getCityByCoordinate(center);
      this.$refs.searchBox.locationInfo.name=res.info.Name
    },
  },
};
</script>
<style lang="less" scoped>
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(60px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.one-map {
  display: flex;
  justify-content: flex-start;
  // height: 100%;
  height: calc(100vh - 140px);
  background: #f5f5f5;
  width: 100%;
  //   padding-top: 20px;
}
.left {
  //   background: #fff;
  width: 416px;
  // padding: 16px 0 0px 30px;
}
.right {
  width: calc(100% - 415px);
  height: calc(100% - 16px);
  // margin: 16px 30px 0px 4px;
  // box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);

  .right-content {
    width: 100%;
    height: 100%;
    position: relative;
    .myLegend {
      position: absolute;
      bottom: 45px;
      left: 150px;
    }
  }
  #map {
    width: 100%;
    height: 100%;
    outline: none !important;
    background: #eee;
  }
  .table-wrapper {
    width: 100%;
    overflow: auto;
    background: #fff;
    padding-top: 20px;
    position: relative;
    .table-icon {
      .btn1:first-child {
        position: absolute;
        top: 2px;
        right: 32px;
      }
      .btn1:last-child {
        position: absolute;
        top: 2px;
        right: 2px;
      }
      .btn1:hover {
        cursor: pointer;
        color: #1890ff;
      }
      .btn-trans {
        transform: rotate(180deg);
      }
    }
  }
}
.change-layer {
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 70px;
  background: rgb(183, 217, 255);
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  .box {
    height: 50px;
    width: 50px;
    margin: 10px;
    color: #fff;
    background: darkblue;
  }
  .box1 {
    margin-right: 0;
    animation: fadeInLeft 0.6s;
  }
}
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
  display: none;
}
</style>
