<template>
  <div class="my-map">
    <div :id="id" class="container"></div>
    <map-tools ref="toolsMap" :map="map" :vector="vector" @cahngeBaseLayers="changeBaseLayers" />
    <map-footer :map="map" :isAudit="isAudit" />
  </div>
</template>

<script>
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import mapTools from '../mapTools/index'
import mapFooter from '../mapFooter/index'
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
      type:Boolean,
      default: true,
    }
  },
  // inject: ['layerList'],
  components: {
    mapTools,
    mapFooter
  },
  mounted() {
    this.initMap();
  },
  watch: {
    vector: {
      handler: function(newV, oldV) {
        if(newV !== oldV) {
          if(oldV) {
            this.map.removeLayer(oldV);
          }
          this.addMapLayer()
          // console.log(this.map.getLayers().getArray(), 'maplayersvector')
        }
      },
      // immediate: true
    },
    image: {
      handler: function(newV, oldV) {
        // debugger
        if(newV !== oldV) {
          if(oldV) {
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
        zoom: window.globalUrl.viewConfig.zoom
      });
      this.changeBaseLayers(window.globalUrl.imageLayer);
      this.addMapLayer();
      this.addMapImageLayer();
      console.log(this.map.getLayers().getArray(), 'layers')
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
      console.log(layers)
      addBaseLayers(this.map, layers);
    },
    addMapLayer() {
      // debugger
      // 添加图层事件 矢量图层 审核进度分类图
      if(this.vector) {
        this.map.addLayer(this.vector);
        this.map.getView().fit(this.vector.getSource().getExtent());
      }
    },
    async addMapImageLayer() {
      // 添加影像图层
      console.log(this.image, 'image')
      if(this.image) {
        let layer = await createImageLayer(this.image);
        if (layer) {
            layer.set("layerName", this.image.layerName)
            this.map.addLayer(layer);
            this.map.getView().fit(layer.getExtent());
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
  }
}
</script>

<style lang="less" scoped>
.my-map {
  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
