<!--
 * @Author: 任继民
 * @Date: 2020-11-12 17:02:14
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-28 09:46:03
 * @Description:
-->
<template>
  <div class="my-map">
    <div
      :id="id"
      class="containerMap"
    ></div>
    <map-tools ref="toolsMap" :map="map" :vector="vector" @changeBaseLayers="changeBaseLayers" @clearTreeCheckedLayers="clearTreeCheckedLayers"/>
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
      map: null
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
      type: Boolean,
      default: false,
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
  watch: {
    vector: {
      handler: function (newV, oldV) {
        console.log('newV',newV)
        if (newV !== oldV) {
          if (oldV) {
            this.map.removeLayer(oldV);
          }
          this.addMapLayer()
          // console.log(this.map.getLayers().getArray(), 'maplayersvector')
        }
      },
      immediate: true
    },
    image: {
      handler: function (newV, oldV) {
        // debugger
        if (newV !== oldV) {
          if (oldV) {
            // this.map.removeLayer(oldV);
            this.removeLayerByAttr(this.map, 'layerName', oldV.layerName)
          }
          this.addMapImageLayer()
          // console.log(this.map.getLayers().getArray(), 'maplayers')
        }
      },
      // immediate: true
    }
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
    addMapLayer() {
      // debugger
      // 添加图层事件 矢量图层 审核进度分类图
      if (this.vector) {
        this.map.addLayer(this.vector);
        this.map.getView().fit(this.vector.getSource().getExtent());
      }
    },
    async addMapImageLayer() {
      // 添加影像图层
      console.log(this.image, 'image')
      if (this.image) {
        let layer = await createImageLayer(this.image);
        if (layer) {
          layer.set("layerName", this.image.layerName)
          this.map.addLayer(layer);
          this.map.getView().fit(this.image.extent);
        }
      }
    },
    removeLayerByAttr(map, attr, val) {
      // 根据自己自定义属性对图层进行删除操作
      let layers = map.getLayers().getArray();
      let layer = layers.filter((item) => item.values_[attr] == val);
      if (layer.length > 0) {
        layer.forEach((item) => {
          map.removeLayer(item);
        })
      }
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
    padding: 20px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
