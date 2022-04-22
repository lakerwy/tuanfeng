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
          <div
            :class="{
              rightContent: isShowDetails,
              rightContents: !isShowDetails
            }"
          >
            <div id="map" ref="rootmap"></div>
            <div class="contentBox">
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
import {
  removeLayerByAttr,
  getBaseLayers,
  addBasicLayerOnMap
} from "./function";
import "ol/ol.css";
import { initMap, addBaseLayers } from "@/mapjs/map.js";
import { registerProj } from "@/mapjs/projections.js";
import { createImageLayer } from "@/mapjs/layer.js";
export default {
  props: ["isShowDetails"],
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
  components: {},
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
}
.rightContent {
  width: 100%;
  height: calc(100vh - 530px);
  position: relative;
}
.rightContents {
  width: 100%;
  height: calc(100vh - 310px);
  position: relative;
}
#map {
  width: 100%;
  height: 100%;
  outline: none !important;
  background: #eee;
}
.contentBox {
  position: absolute;
  top: 20px;
  left: 30px;
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
