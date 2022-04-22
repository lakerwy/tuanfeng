<!--  -->
<template>
  <div class="roller">
    <div id="map1" class="map1"></div>
    <input id="swipe" type="range" />
    <div class="line"></div>
    <div class="select-wrapper">
      <header class="tab">
        <div
          :class="['tab-item', showLayer ? 'tab-active' : '']"
          @click="handleLayer"
        >
          图层对比
        </div>
        <div
          :class="['tab-item', showTime ? 'tab-active' : '']"
          @click="handleTime"
        >
          时间对比
        </div>
      </header>
      <div class="layer-contrast" v-show="showLayer">
        <div class="left-select">
          <span class="select-label">左侧图层:</span>
          <a-select
            show-search
            placeholder="请选择图层"
            option-filter-prop="children"
            style="width: 200px"
            v-model="one"
            :filter-option="filterOption"
            @change="change1"
            ><a-select-option
              v-for="item in options"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="right-select">
          <span class="select-label">右侧图层:</span>
          <a-select
            show-search
            placeholder="请选择图层"
            option-filter-prop="children"
            v-model="two"
            style="width: 200px"
            :filter-option="filterOption"
            @change="change2"
            ><a-select-option
              v-for="item in options"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="time-contrast" v-show="showTime">
        <div class="left-select">
          <span class="select-label">选择图层:</span>
          <a-select
            show-search
            placeholder="请选择图层"
            option-filter-prop="children"
            style="width: 200px"
            v-model="layer"
            :filter-option="filterOption"
            @change="change1"
            ><a-select-option
              v-for="item in options"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="left-select">
          <span class="select-label">左侧时间:</span>
          <a-select
            show-search
            placeholder="请选择时间"
            option-filter-prop="children"
            style="width: 200px"
            v-model="leftTime"
            :filter-option="filterOption"
            @change="change1"
            ><a-select-option
              v-for="item in years"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="right-select">
          <span class="select-label">右侧时间:</span>
          <a-select
            show-search
            placeholder="请选择时间"
            option-filter-prop="children"
            v-model="rightTime"
            style="width: 200px"
            :filter-option="filterOption"
            @change="change2"
            ><a-select-option
              v-for="item in years"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <div class="exit" @click="exit">返回</div>
    <base-tools
      ref="baseTools"
      :map="map1"
      @handleDtChange="changeLayer"
    ></base-tools>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { getRenderPixel } from "ol/render";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import { registerProj } from "@/mapjs/projections.js";
import {
  getCountyVectorLayer,
  getTownVectorLayer,
  getBaseLayers
} from "../function";
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import BaseTools from "@/components/baseTools/index";

export default {
  name: "",
  data() {
    return {
      value: 50,
      one: "",
      two: "",
      options: [
        {
          id: 1,
          label: "团风县县级图层",
          value: 1
        },
        {
          id: 2,
          label: "团风县乡镇图层",
          value: 2
        }
      ],
      layerOne: null,
      layerTwo: null,
      map1: null,
      show: false,
      showLayer: true,
      showTime: false,
      layer: undefined,
      leftTime: undefined,
      rightTime: undefined,
      years: []
    };
  },

  props: {},

  components: { BaseTools },

  created() {},

  computed: {},

  mounted() {
    registerProj();
    this.init(null, null);
    this.makeYears();
  },

  methods: {
    async init(one, two) {
      // let layer = await getTownVectorLayer();
      if (!this.map1) {
        this.map1 = initMap("map1", {
          center: window.globalUrl.viewConfig.center,
          zoom: window.globalUrl.viewConfig.zoom
        });
        this.map1.getView().fit(window.extent);
        // 获取底图
        this.changeLayer(1);
        this.layerOne = await getCountyVectorLayer();
        this.layerTwo = await getTownVectorLayer();
        if (this.layerOne) {
          this.map1.addLayer(this.layerOne);
        }
        if (this.layerTwo) {
          this.map1.addLayer(this.layerTwo);
        }
        this.one = 1;
        this.two = 2;
      } else {
        if (one) {
          this.layerOne = one;
          this.map1.addLayer(this.layerOne);
        } else {
        }
        if (two) {
          this.layerTwo = two;
          this.map1.addLayer(this.layerTwo);
        } else {
        }
      }
      let swipe = document.getElementById("swipe");
      let that = this;
      that.layerTwo.on("prerender", function(event) {
        let ctx = event.context;
        let mapSize = that.map1.getSize();
        let width = mapSize[0] * (swipe.value / 100);
        let tl = getRenderPixel(event, [width, 0]);
        let tr = getRenderPixel(event, [mapSize[0], 0]);
        let bl = getRenderPixel(event, [width, mapSize[1]]);
        let br = getRenderPixel(event, mapSize);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tl[0], tl[1]);
        ctx.lineTo(bl[0], bl[1]);
        ctx.lineTo(br[0], br[1]);
        ctx.lineTo(tr[0], tr[1]);
        ctx.closePath();
        ctx.clip();
      });

      that.layerTwo.on("postrender", function(event) {
        let ctx = event.context;
        ctx.restore();
      });

      swipe.addEventListener(
        "input",
        function() {
          let dom = document.querySelector('input[type="range"]');
          let dom1 = document.querySelector(".line");
          let num = (50 - swipe.value) * 0.23;
          let num1 = (50 - swipe.value) * 0.44;
          dom.style.marginLeft = num + "px";
          //dom1.style.left = swipe.value + "%";
          dom1.style.left = `calc(${swipe.value}% + ${num1}px)`;
          if (swipe.value > 90) {
            swipe.disabled = true;
            swipe.value = 89;
            dom1.style.left = `calc(89% + ${num1}px)`;
            swipe.disabled = false;
          } else if (swipe.value < 10) {
            swipe.disabled = true;
            swipe.value = 11;
            dom1.style.left = `calc(11% + ${num1}px)`;
            swipe.disabled = false;
          }
          that.map1.render();
        },
        false
      );
    },
    filter1(a, b) {
      // console.log(a, b);
    },
    async change1(e) {
      this.one = e;
      let layer;
      switch (e) {
        case 1:
          layer = await getCountyVectorLayer();
          this.map1.getView().fit(window.extent);
          break;
        case 2:
          layer = await getTownVectorLayer();
          this.map1.getView().fit(window.extent);
          break;
      }
      // // console.log(this.map1.getLayers())
      this.map1.removeLayer(this.layerOne);
      this.init(layer, null);
    },
    async change2(e) {
      this.two = e;
      let layer;
      switch (e) {
        case 1:
          layer = await getCountyVectorLayer();
          this.map1.getView().fit(window.extent);
          break;
        case 2:
          layer = await getTownVectorLayer();
          this.map1.getView().fit(window.extent);
          break;
      }
      this.map1.removeLayer(this.layerTwo);
      this.init(null, layer);
    },
    exit() {
      this.$router.push("/oneMap");
    },
    // 切换底图
    async changeLayer(e) {
      // remove
      removeBaseLayers(this.map1);
      // add
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map1, layers);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // tab 图层对比点击
    handleLayer() {
      this.showLayer = true;
      this.showTime = false;
      this.one=""
      this.two=""
    },
    // tab 时间对比点击
    handleTime() {
      this.showLayer = false;
      this.showTime = true;
    },
    // 生成年份
    makeYears() {
      let date = new Date();
      let nowYear = date.getFullYear();
      this.searchYear = nowYear;
      let oldYear = nowYear - 10;
      let arr = [];
      for (let i = nowYear; i <= nowYear && i >= oldYear; i--) {
        arr.push({
          id: i,
          value: i,
          label: i + ""
        });
      }
      this.years = arr;
    }
  }
};
</script>
<style lang="less" scoped>
.roller {
  width: 100%;
  height: calc(100vh - 88px);
  padding: 16px 30px 0 30px;
  position: relative;
}
#map1 {
  width: 100%;
  height: 100%;
  outline: none !important;
  background: #eee;
}
#swipe {
  width: 100%;
  position: absolute;
  top: 40%;
  left: 0;
  z-index: 2;
}
input[type="range"] {
  -webkit-appearance: none; /*去除默认样式*/
  margin-top: 42px;
  background-color: #ebeff4;
  width: 100% !important;
  -webkit-appearance: none;
  height: 0px;
  padding: 0;
  border: none;
  outline: none;
  /*input的长度为80%，margin-left的长度为10%*/
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /*去除默认样式*/
  cursor: col-resize;
  height: 22px;
  width: 22px;
  background: url("../../../assets/imgs/thumb.png") no-repeat center;
}
.select-wrapper {
  position: absolute;
  top: 40px;
  left: 50px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  padding: 0 20px 20px 20px;
  border-radius: 5px;
  .select-label {
    padding-right: 8px;
  }
  .left-select {
    margin-bottom: 15px;
  }
}

.exit {
  cursor: pointer;
  position: absolute;
  top: 40px;
  right: 50px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  font-size: 14px;
  padding: 0 10px;
}
/deep/.box2,
/deep/.box3 {
  display: none;
}
/deep/.base-tools {
  right: 50px;
}
.line {
  height: calc(100% - 16px);
  width: 2px;
  position: absolute;
  top: 0;
  left: 50%;
  background: #1890ff;
  margin-top: 16px;
}
.tab {
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.tab-item {
  width: 100px;
  margin: 0 20px;
  line-height: 40px;
  cursor: pointer;
}
.tab-active {
  border-bottom: 2px solid #1890ff;
}
</style>
