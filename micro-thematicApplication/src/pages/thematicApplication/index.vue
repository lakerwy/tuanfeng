<template>
  <div class="applic">
    <div class="left-wrapper">
      <Conformity
        v-if="routeName === 'conformity'"
        :map="map"
        :showContent="showContent"
        @fullScreen="fullScreen"
        @startAnalysis="startAnalysis"
      ></Conformity>
      <two-rules
        v-if="routeName === 'twoRules'"
        :map="map"
        :showContent="showContent"
        @fullScreen="fullScreen"
      ></two-rules>
      <idle-land
        ref="idleLand"
        v-if="routeName === 'idleLand'"
        :map="map"
        :XZQH="XZQH"
        :showContent="showContent"
        @fullScreen="fullScreen"
      ></idle-land>
      <land-use
        ref="landUse"
        v-if="routeName === 'landUse'"
        :map="map"
        :showContent="showContent"
        @fullScreen="fullScreen"
      ></land-use>
    </div>
    <div class="right-wrapper">
      <div id="map"></div>
      <base-tools
        ref="baseTools"
        :map="map"
        @handleDtChange="changeLayer"
        @changeBoxVal="changeBoxVal"
      ></base-tools>
      <top-tools
        ref="toolmap"
        :map="map"
        @fullScreen="fullScreen"
        :fullscr="showContent"
        @clearLayers="clearLayers"
      ></top-tools>
      <Footer :map="map" :dtType="dtType" />
    </div>
  </div>
</template>

<script>
import Conformity from "./components/useControl/conformity";
import TwoRules from "./components/useControl/twoRules";
import IdleLand from "./components/developUse/idleLand";
import LandUse from "./components/developUse/landUse";
import BaseTools from "@/components/baseTools/index";
import TopTools from "@/components/topTools/index";
import Footer from "@/components/footer/index";
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { registerProj } from "@/mapjs/projections.js";
import {
  getBaseLayers,
  getCountyVectorLayer,
  getTownVectorLayer,
  removeLayerByClass,
  removeLayerByAttr,
  addBasicLayerOnMap,
  getTreeLayerKeys
} from "./js/function";
import { getTFGeoJSON } from "./js/getTFGeoJSON";
import GeoJSON from "ol/format/GeoJSON";
import { toggleFullScreen } from "@/mapjs/tool/baseTool.js";
export default {
  name: "thematicApplication",
  data() {
    return {
      routeName: "",
      dtType: "", // 底图类型
      map: null,
      showContent: true,
      showDialog: false,
      XZQH: []
    };
  },
  watch: {
    $route: {
      handler: function(newVal, oldVal) {
        this.routeName = newVal.name;
        if (this.map) {
          this.clearLayers();
        }
      },
      // 深度观察监听
      deep: true,
      // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  props: {},

  components: {
    Conformity,
    TwoRules,
    IdleLand,
    LandUse,
    BaseTools,
    TopTools,
    Footer
  },

  created() {},

  mounted() {
    registerProj();
    this.loadMap();
  },

  methods: {
    // 加载地图
    async loadMap() {
      // 初始化地图
      this.map = initMap("map", {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom
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
      this.buildXZQHData();
    },
    // 生成行政区划数据
    buildXZQHData() {
      // 生成城市数据
      let arr = [];
      window.TF_XIAN.features.forEach(i => {
        arr.push({
          name: i.properties.Name,
          code: i.properties.ad_code
        });
      });
      window.TF_XZ.features.forEach(i => {
        arr.push({
          name: i.properties.Name,
          code: i.properties.ad_code
        });
      });
      this.XZQH = arr;
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
    changeBoxVal(e, f) {
      if (e == "checked1") {
        // console.log(window.globalUrl.redLines.farmland)
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
      } else if (e == "checked2") {
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
      } else if (e == "checked3") {
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
      } else if (e == "checked4") {
        if (f) {
          // 获取县
          let layer = getCountyVectorLayer();
          this.map.addLayer(layer);
          this.map.getView().fit(window.extent);
        } else {
          // 移除县
          removeLayerByAttr(this.map, "layerName", "xianLayer");
        }
      } else if (e == "checked5") {
        // 获取乡镇
        if (f) {
          let layer = getTownVectorLayer();
          this.map.addLayer(layer);
          this.map.getView().fit(window.extent);
        } else {
          // 移除乡镇
          removeLayerByAttr(this.map, "layerName", "townLayer");
        }
      } else {
        return;
      }
    },
    // 树隐藏时更新地图大小
    updateMapSize(e) {
      this.$nextTick(() => {
        this.map.updateSize();
      });
    },
    // 全屏
    fullScreen() {
      // this.showContent = !this.showContent;
      // let mapEl = document.querySelector(".right-wrapper");
      // let leftEl = document.querySelector(".left-wrapper");
      // mapEl.style.width = this.showContent
      //   ? `calc(100% - 390px)`
      //   : `calc(100% - 12px)`;
      // leftEl.style.width = this.showContent ? `386px` : `12px`;
      toggleFullScreen(this.map)
      this.updateMapSize();
    },
    // 开始分析
    startAnalysis() {
      this.showDialog = true;
    },
    // 关闭弹框
    closeDialog() {
      this.showDialog = false;
    },
    // 清除图层
    clearLayers() {
      removeLayerByAttr(this.map, "layerName", "draw");
      removeLayerByAttr(this.map, "layerName", "XZYD");
      removeLayerByAttr(this.map, "layerName", "inputLayer");
      this.$refs.toolmap.clear();  // 清除测量
      this.$refs.idleLand.drawGemo = null;
      this.$refs.landUse.geeoJson = null;
    }
  }
};
</script>
<style lang="less" scoped>
@import "./css/dialog.less";
.applic {
  width: 100%;
  // height: 100%;;
  height: calc(100vh - 118px);
  background: #F0F2F6;
  // padding: 16px 30px;
  display: flex;
  justify-content: flex-start;
}
.left-wrapper {
  width: 386px;
  height: 100%;
  // height: 80vh;
}
.right-wrapper {
  width: calc(100% - 390px);
  height: calc(100% - 16px);
  margin-left: 4px;
  //height: 87vh;
  position: relative;
  #map {
    width: 100%;
    height: 100%;
    outline: none !important;
    background: #eee;
  }
}
</style>
