<!--
 * @Author: 任继民
 * @Date: 2020-11-12 17:02:14
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-27 14:46:31
 * @Description:
-->
<template>
  <div class="my-map">
    <div :id="id" class="containerMap"></div>
    <map-tools ref="toolsMap" :map="map" :vector="vector" @cahngeBaseLayers="changeBaseLayers" @clearTreeCheckedLayers="clearTreeCheckedLayers"/>
    <!-- <map-footer :map="map" :isAudit="isAudit" /> -->
  </div>
</template>

<script>
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import mapTools from '../mapTools/index'
// import mapFooter from '../mapFooter/index'
export default {
  data() {
    return {
      map: null,
      baselayer: false,
    }
  },
  props: {
    id: {
      type: String,
      default: 'map'
    },
    vector: { // 要加载的矢量图层
      type: Object,
      default: null
    },
    image: { // 要加载的影像图层，红线、农田等
      type: Object,
      default: null
    },
    isAudit: { // 是否显示审查结果类型，审查进度需要
      type:Boolean,
      default: true,
    }
  },
  // inject: ['layerList'],
  components: {
    mapTools,
    // mapFooter
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = initMap(this.id, {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom,
      });
      window.monitirMap = this.map;
    },
    async changeBaseLayers() {
      this.baselayer = !this.baselayer;
      let layerUrl = this.baselayer? window.globalUrl.vectorLayer:window.globalUrl.imageLayer;
      console.log(layerUrl)
      // 切换底图事件
      removeBaseLayers(this.map);
      let layers = [];
      for (let i = 0; i < layerUrl.length; i++) {
        let layer = await createImageLayer(layerUrl[i]);
        if (layer) {
          layers.push(layer);
        }
      }
      addBaseLayers(this.map, layers);
    },
    clearTreeCheckedLayers() {
      this.$refs.toolsMap.clear();
    }
  }
}
</script>

<style lang="scss" scoped>
.my-map {
  position: relative;
  .containerMap {
    /* padding: 20px; */
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
