<template>
  <div class="mapContent">
    <div>
      <el-container>
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
            <div class="right-content-mapTools">
              <map-tools
                :map="map"
                @cahngeBaseLayers="changeBaseLayers"
              ></map-tools>
            </div>
            <div class="right-content-table">
              <table-kj></table-kj>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import tableKj from "./tablekjbjfhx.vue";
import mapTools from "./mapTools.vue";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";

import {
  removeLayerByAttr,
  getBaseLayers,
  addBasicLayerOnMap
} from "./function";
import "ol/ol.css";
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { registerProj } from "@/mapjs/projections.js";
export default {
  data() {
    return {
      activeIndex: "1",
      rowData: JSON.parse(sessionStorage.getItem("rowData")),
      optionList: [
        {
          checked: false,
          name: "永久基本农田",
          id: 1
        },
        {
          checked: false,
          name: "生态保护红线",
          id: 2
        }
      ],
      showTc: false,
      checked: false,
      map: null
    };
  },
  components: {
    tableKj,
    mapTools
  },
  mounted() {
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
      // registerProj();
      // 获取底图
      this.changeLayer(1);
    },
    async changeLayer(e) {
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map, layers);
    },
    async changeBaseLayers(myLayers) {
      // 切换底图事件
      removeBaseLayers(this.map);
      let layers = [];
      for (let i = 0; i < myLayers.length; i++) {
        let layer = await createImageLayer(myLayers[i]);
        if (layer) {
          layers.push(layer);
        }
      }
      addBaseLayers(this.map, layers);
    },
    handleIconClick() {
      this.showTc = !this.showTc;
    },
    changeBoxVal(val, e) {
      // debugger
      // console.log(val, e);
      if (e.id === 1) {
        if (val) {
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
      } else if (e.id === 2) {
        if (val) {
          // 获取生态保护红线
          addBasicLayerOnMap(
            this.map,
            "ecologyLayer",
            window.globalUrl.redLines.ecologicalProtection
          );
        } else {
          //       // 移除生态保护红线
          removeLayerByAttr(this.map, "layerName", "ecologyLayer");
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mapContent {
  width: 100%;
  background: #fff;
}
.right-content {
  width: 100%;
  height: calc(100vh - 480px);
  position: relative;
  #map {
    width: 100%;
    height: 100%;
    outline: none !important;
    background: #eee;
  }
  &-box {
    position: absolute;
    top: 120px;
    left: 30px;
  }
  &-table {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30%;
    height: calc(100vh - 500px);
    background: #fff;
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
