<template>
  <div class="mapContent">
    <div>
      <el-container>
        <el-header>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1">矢量图</el-menu-item>
          </el-menu>
        </el-header>
        <el-main>
          <div class="right-content">
            <div id="map" ref="rootmap"></div>
            <div class="right-content-box">
              <div
                class="box"
                :class="{ boxActive: showTc }"
                @click="handleIconClick"
                style="text-align:left"
              >
                <el-tooltip content="切换图层" placement="right">
                  <div class="icon-tc"></div>
                </el-tooltip>
                <div class="wrapper" v-show="showTc">
                  <div v-for="(item, index) in optionList" :key="index">
                    <el-checkbox
                      v-model="item.checked"
                      @change="changeBoxVal(item.checked, item)"
                      >{{ item.name }}</el-checkbox
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getGdbList } from "@/api/auditTaskOthers";
import { removeLayerByAttr, getBaseLayers } from "@/mapjs/function";
import "ol/ol.css";
import { initMap, addBaseLayers } from "@/mapjs/map.js";
import { registerProj } from "@/mapjs/projections.js";
import { createImageLayer } from "@/mapjs/layer.js";
export default {
  props: ["mdbUrl"],
  data() {
    return {
      activeIndex: "1",
      rowData: JSON.parse(sessionStorage.getItem("rowData")),
      optionList: [],
      showTc: false,
      checked: false,
      map: null
    };
  },
  components: {},
  mounted() {
    this.getDataList();
    this.loadMap();
  },
  methods: {
    // 加载地图
    loadMap() {
      // 初始化地图
      this.map = initMap("map", {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom
      });
      registerProj();
      // 获取底图
      this.changeLayer(1);
    },
    async changeLayer(e) {
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map, layers);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleIconClick() {
      this.showTc = true;
    },
    changeBoxVal(val, e) {
      // console.log(e);
      if (val) {
        this.getTcList(e);
      } else {
        removeLayerByAttr(this.map, "treeLayerId", e.id);
      }
    },
    async getTcList(e) {
      const MAPDOC_API = window.globalUrl.API_ONEMAP_STATISTICS;
      let contWidth = this.$refs.rootmap.offsetWidth;
      let contHeight = this.$refs.rootmap.offsetHeight;
      let params = {
        type: "geoserver",
        layers: e.name || "layerType",
        url: `${MAPDOC_API}/TFGTKJGH/WMS/GetMapOutImg?layerid=${e.id}&imgHeight=${contHeight}&imgWidth=${contWidth}&catologName=4矢量数据&vector=1`
      };
      let layer = await createImageLayer(params);
      if (layer) {
        layer.set("treeLayerId", e.id);
        this.map.addLayer(layer);
      }
    },
    // 获取图层id和图层名称数据
    async getDataList() {
      let params = this.rowData.id;
      let res = await getGdbList(params);
      let arrList = res.data.data;
      if (arrList.length > 0) {
        arrList.forEach(item => {
          this.optionList.push({
            id: item.id,
            name: item.layername,
            checked: false
          });
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mapContent{
  width: 100%;
}
.right-content {
  width: 100%;
  height: calc(100vh - 530px);
  position: relative;
  #map {
    width: 100%;
    height: 100%;
    outline: none !important;
    background: #eee;
  }
  &-box {
    position: absolute;
    top: 20px;
    left: 30px;
  }
}
.box {
  position: relative;
  width: 32px;
  height: 32px;
  margin-top: 8px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  cursor: pointer;
  .icon-tc {
    background: url("../../../assets/imgs/icon-tc.png") no-repeat center;
    height: 32px;
    width: 32px;
    outline: none;
  }
  .wrapper {
    position: absolute;
    left: 40px;
    top: 0px;
    padding: 5px 10px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
    div {
      margin: 5px;
      width: 120px;
    }
  }
}
.boxActive {
  .icon-tc {
    background: url("../../../assets/imgs/icon-tc-hover.png") no-repeat center;
  }
}
</style>
