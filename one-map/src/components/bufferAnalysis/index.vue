<!--  -->
<template>
  <div class="hcqfx" v-show="showHcqfx">
    <Dialog
      title="缓冲区分析"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
    >
      <template v-slot:content>
        <div class="item-wrapper">
          <a-dropdown :trigger="['hover']">
            <a-menu slot="overlay">
              <a-menu-item @click="draw('Point')">
                <div class="icon-hzd"></div>
                <span>绘制点</span>
              </a-menu-item>
              <a-menu-item @click="draw('LineString')">
                <div class="icon-hzx"></div>
                <span>绘制线</span>
              </a-menu-item>
              <a-menu-item @click="draw('Polygon')">
                <div class="icon-hzm"></div>
                <span>绘制面</span>
              </a-menu-item>
            </a-menu>
            <div class="item">
              <div class="hz item-icon"></div>
              <span>绘制</span>
              <a-divider type="vertical" class="divider" />
            </div>
          </a-dropdown>

          <div class="item" @click="visible = !visible">
            <div class="dr item-icon">
              <a-icon type="plus-circle" />
            </div>
            <span>导入</span><a-divider type="vertical" class="divider" />
          </div>

          <div class="item" @click="clickFeature">
            <div class="xz item-icon"></div>
            <span>选择</span>
          </div>
        </div>
        <div class="input-wrapper">
          <span style="line-height: 30px; padding-right: 8px">半径:</span>
          <a-input v-model="radius" style="width: 200px">
            <a-select
              slot="addonAfter"
              style="width: 70px"
              v-model="unit"
              @change="changeUnit"
            >
              <a-select-option value="metres"> 米 </a-select-option>
              <a-select-option value="kilometers"> 千米 </a-select-option>
              <a-select-option value="degrees"> 度 </a-select-option>
            </a-select>
          </a-input>
        </div>
      </template>
    </Dialog>
    <a-modal
      title="导入数据"
      :visible="visible"
      cancelText="取消"
      okText="确定"
      @ok="handleOk1"
      @cancel="handleCancel1"
    >
      <span style="line-height: 30px; padding-right: 8px">要素数据:</span>
      <a-textarea
        v-model="geoJsonData"
        placeholder="请输入GeoJson数据"
        :auto-size="{ minRows: 2, maxRows: 6 }"
      />
    </a-modal>
  </div>
</template>

<script>
import Dialog from "../dialog";
import { drawEvent, removeDrawInteraction } from "@/mapjs/interaction/draw.js";
import { createVectorLayer } from "@/mapjs/layer.js";
import { getBufferFeature, test } from "@/mapjs/tool/buffer.js";
import { exeBufferGP } from "@/mapjs/GPService/buffer.js";
import { changeInteraction } from "@/pages/oneMap/featureEvents";
import GeoJSON from "ol/format/GeoJSON";
import { removeLayerByAttr } from "../../pages/oneMap/function";
export default {
  name: "",
  data() {
    return {
      showHcqfx: false,
      radius: "",
      unit: "kilometers",
      drawFe: null, //绘制的要素
      drawLayer: null, // 绘制时的图层
      visible: false,
      geoJsonData: "",
      locationInfo: {
        code: "421121",
        extent: [
          114.78720317068985,
          30.560132840658184,
          115.23212317114746,
          30.899057131381596
        ],
        name: "团风县"
      }
    };
  },

  props: ["map"],
  watch: {
    map(val) {
      if (val) {
        this.map = val;
      }
    },
    showHcqfx(val) {
      if (!val && this.drawLayer) {
        this.drawLayer.getSource().clear();
      }
    }
  },
  components: { Dialog },

  created() {},

  computed: {},

  mounted() {},

  methods: {
    async handleOk(e) {
      changeInteraction(this.map, 0);
      // const GPService = window.globalUrl.API_GPService

      // let url =
      //   "http://192.168.250.200/arcgis/rest/services/GPTools/BufferAnalysis/GPServer/BufferAnalysis/execute";
      if (this.drawFe) {
        let features = this.drawFe;
        let res = getBufferFeature(features[0], this.radius, this.unit);
        // let res = await exeBufferGP(url, features, this.radius, this.unit);
        // console.log(res);
        this.drawLayer.getSource().addFeature(res);
      } else {
        this.$message.warn("请先选择绘制按钮绘制图形！");
      }
    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0
      };
      this.drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawLayer.set("layerType", "bufferLayer");
      this.map.addLayer(this.drawLayer);
    },
    handleOk1() {
      // // console.log(this.geoJsonData)
      this.createEmptyLayer();

      try {
        let feature = new GeoJSON().readFeatures(this.geoJsonData);
      } catch (error) {
        this.$message.warn("GeoJSON格式错误，请检查格式！");
      }
      // console.log(feature);
      this.drawFe = feature;
      this.drawLayer.getSource().addFeatures(feature);
      this.visible = false;
    },
    handleCancel(e) {
      this.drawFe = null;
      this.radius = "";
      this.showHcqfx = false;
      this.$emit("changeXzLayer", false, this.locationInfo);
      // 关闭窗口删除地图上绘制的图形
      removeLayerByAttr(this.map, "layerType", "drawLayer");
      removeLayerByAttr(this.map, "layerType", "bufferLayer");
    },
    handleCancel1() {
      this.geoJsonData = "";
      this.visible = false;
    },
    // 获取单位
    changeUnit(e) {
      // console.log(this.radius, e);
    },
    // 绘制事件
    draw(drawType) {
      // 开始绘制
      this.createEmptyLayer();
      drawEvent({
        map: this.map,
        layer: this.drawLayer,
        drawType: drawType,
        startCallback: () => {
          // this.limitEvent();
        },
        endCallback: feature => {
          this.drawFe = [feature];
          removeDrawInteraction(this.map);
          // 设置样式
          //feature.setStyle(style);
        }
      });
    },
    clickFeature() {
      this.$emit("changeXzLayer", true, this.locationInfo);
      this.createEmptyLayer();
      let that = this;
      changeInteraction(this.map, 1, function(e) {
        that.drawFe = [e];
      });
      
    }
  }
};
</script>
<style lang="less" scoped>
.hcqfx {
  position: absolute;
  top: 100px;
  left: 20px;
}
.item-wrapper {
  cursor: pointer;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
  //margin-bottom: 10px;
  .item {
    width: calc(100% / 3);
    position: relative;
    text-align: center;
    .divider {
      position: absolute;
      top: 5px;
      right: 0;
    }
  }
  .item-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 8px;
    font-size: 16px;
  }
  .hz {
    background: url("../../assets/imgs/icon-hz.png") no-repeat center;
  }
  .dr {
    top: -1px;
    // background: url("../../assets/imgs/icon-dr.png") no-repeat center;
  }
  .xz {
    background: url("../../assets/imgs/icon-xz.png") no-repeat center;
    background-size: 68% 68%;
  }
}
.input-wrapper {
  margin-top: 20px;
}
.ant-dropdown-menu-item {
  position: relative;
  height: 36px;
  padding-left: 20px;
  div {
    width: 20px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 10px;
  }
  span {
    position: absolute;
    top: 0;
    left: 35px;
    line-height: 40px;
  }
}
.icon-hzx {
  background: url("../../assets/imgs/icon-hzx.png") no-repeat center;
}
.icon-hzd {
  background: url("../../assets/imgs/icon-hzd.png") no-repeat center;
}
.icon-hzm {
  background: url("../../assets/imgs/icon-hzm.png") no-repeat center;
}
</style>
