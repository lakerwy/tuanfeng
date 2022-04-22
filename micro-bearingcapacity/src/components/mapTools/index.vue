<template>
  <div class="map-tools">
    <div>
      <div class="tool" v-for="i in toolLists" :key="i.title" @click="handleToolClick(i.type)">
        <a-tooltip class="item" effect="dark" placement="left">
          <template slot="title">
            <span>{{i.title}}</span>
          </template>
          <img :src="i.img" :alt="i.title">
        </a-tooltip>
      </div>
      <!-- <div class="tool" @click="handleToolClick('layer')">
        <a-tooltip class="item" effect="dark" content="图层" placement="left">
          <template slot="title">
            <span>图层</span>
          </template>
          <img src="../../assets/imgs/layer.png" alt="图层">
        </a-tooltip>
      </div> -->

      <div class="tool image"  @click="handleToolClick('imageLayer')">
        <a-tooltip class="item" effect="dark" content="切换影像图层" placement="left" v-if="showXyLayer">
          <template slot="title">
            <span>切换影像图层</span>
          </template>
          <img src="../../assets/imgs/icon-yx.png" alt="影像图层">
        </a-tooltip>
        <a-tooltip class="item" effect="dark" content="切换矢量图层" placement="left" v-else>
          <template slot="title">
            <span>切换矢量图层</span>
          </template>
          <img src="../../assets/imgs/icon-sl-big.png" alt="矢量图层">
        </a-tooltip>
      </div>
    </div>
   <div class="layers" v-if="showLayerBox">
      <el-checkbox-group v-model="checkLayer">
        <el-checkbox v-for="i in layerList" :key="i.name" :label="i.value" @change="changeLayer">{{i.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import {zoomIn, zoomOut, toggleFullScreen, gotoCoordinate,} from "../../mapjs/tool/baseTool.js";
import measureEvent,  { clearMeasure } from "../../mapjs/tool/measure.js";
export default {
  data() {
    return {
      toolLists: [
        // {title: '抓手', img: require('../../assets/imgs/hand.png'), type: 'drag'},
        {title: '放大', img: require('../../assets/imgs/zoom-in.png'), type: 'zoomIn'},
        {title: '縮小', img: require('../../assets/imgs/zoom-out.png'), type: 'zoomOut'},
        {title: '全屏', img: require('../../assets/imgs/full-screen.png'), type: 'fullScreen'},
        {title: '测距', img: require('../../assets/imgs/measure.png'), type: 'measure'},
        {title: '测面', img: require('../../assets/imgs/icon-cm.png'), type: 'area'},
        {title: '清除', img: require('../../assets/imgs/clear.png'), type: 'clear'},
        // {title: '图层', img: require('../../assets/imgs/layer.png'), type: 'layer'},
        // {title: '切换影像图层', img: require('../../assets/imgs/icon-yx.png'), type: 'change'},
        // {title: '切换矢量图层', img: require('../../assets/imgs/icon-sl-big.png'), type: 'change'},
      ],
      type: '',
      checkLayer: ['0'],
      showLayerBox: false,
      showXyLayer: true,
      layerList: [],
      measureList: []
    }
  },
  props: {
    map: {
      type: Object,
      default: null
    },
    vector: {
      type: Object,
      default: null
    }
  },
  // inject: ['layerList'],
  mounted() {
    this.handleToolClick('imageLayer')
  },
  methods: {
    handleToolClick(type) {
      // 工具条点击事件
      this.type = type;
      switch(type) {
        case 'zoomIn':
          zoomIn(this.map);
          break;
        case 'zoomOut':
          zoomOut(this.map);
          break;
        case 'fullScreen':
          toggleFullScreen(this.map)
          break;
        case 'measure':
          // measureEvent(this.map, "LineString")
          this.measureList.push(new measureEvent({map: this.map, type: "LineString"}));
          break;
        case 'area':
          // measureEvent(this.map, "Polygon");
          this.measureList.push(new measureEvent({map: this.map, type: "Polygon"}));
          break;
        case 'clear':
          this.$emit("clearTreeCheckedLayers")
          break;
        case 'layer':
          // 切换图层事件
          this.showLayerBox = !this.showLayerBox;
          break;
        case 'imageLayer':
          // 切换底图事件
          this.showXyLayer = !this.showXyLayer;
          // showXyLayer展示影像
          let current = !this.showXyLayer ? window.globalUrl.vectorLayer : window.globalUrl.imageLayer
          this.$emit('changeBaseLayers', current);
          break;
        default:
          break;
      }
    },
    changeLayer(val) {
      // 切换图层事件
      if(val) {
        this.map.addLayer(this.vector);
        // console.log(this.vector,"1");
        this.map.getView().fit(window.globalUrl.extent);
      } else {
        this.map.removeLayer(this.vector);
      }
    },
    clear() {
      this.measureList.forEach(x => {
        clearMeasure(x);
      });
      this.measureList = [];
    }
  }
}
</script>

<style lang="scss" scoped>
.map-tools {
  position: absolute;
  right: 29px;
  bottom: 36px;
  .tool {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    background: #fff;
    border: 1px solid #fff;
    cursor: pointer;

  }
  .layers {
    width: 130px;
    // padding-top: 10px;
    min-height: 150px;
    padding: 10px;
    position: absolute;
    left: -140px;
    bottom: 40px;
    background: #fff;
  }
  .image {
    padding: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
