<!-- 树 -->
<template>
  <div class="left">
    <div
      class="left-content"
      v-show="showContent"
    >
      <div class="content-title">
        <div>{{ title }}</div>
      </div>
      <div class="btns-wrapper">
        <div
          :class="['btn', activeBtn1 ? 'activeBtn1' : '']"
          @click="draw('Polygon')"
        >
          <div class="btn-icon"></div>
          <div class="btn-txt">绘制范围</div>
        </div>
        <div
          :class="['btn', activeBtn2 ? 'activeBtn2' : '']"
          @click="importCoordinate"
          style="width: 120px;"
        >
          <div class="btn-icon"></div>
          <div class="btn-txt">导入项目红线</div>
        </div>
        <div
          :class="['btn', activeBtn3 ? 'activeBtn3' : '']"
          @click="inputCoordinate"
        >
          <div class="btn-icon"></div>
          <div class="btn-txt">输入坐标</div>
        </div>
      </div>
      <div class="form-wrapper">
        <slot name="formContent"></slot>
      </div>
      <div class="bottom-btn">
        <div
          class="btn"
          @click="startAnalysis"
        >开始分析</div>
        <div
          class="btn"
          @click="resetForm"
        >重置</div>
      </div>
    </div>
    <!-- <div class="content-btn" @click="handleBtnClick">
      <div class="tree-icon" :class="{ treeIcon: !showContent }"></div>
    </div> -->
    <a-modal
      title="输入坐标"
      :visible="visible"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!-- <span>坐标范围：</span> -->
      <a-textarea
        v-model="value"
        placeholder="请输入GeoJSON面数据"
        :auto-size="{ minRows: 3, maxRows: 8 }"
      />
    </a-modal>
    <a-modal
      title="导入项目红线"
      :visible="exportVisible"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        :file-list="fileList"
      >
        <a-button>
          <a-icon type="upload" />请选择文件
        </a-button>
      </a-upload>
    </a-modal>
  </div>
</template>

<script>
import { drawEvent, removeDrawInteraction } from "@/mapjs/interaction/draw.js";
import { createVectorLayer } from "@/mapjs/layer.js";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { removeLayerByAttr } from "../../pages/thematicApplication/js/function.js";
export default {
  data() {
    return {
      activeBtn1: false,
      activeBtn2: false,
      activeBtn3: false,
      visible: false,
      value: "",
      exportVisible: false,
      drawGeoLayer: null,
      geoData: null,
      fileList: []
      //geomData: {"type":"Polygon","coordinates":[[[114.78186795703127,30.642304449707034],[114.93361661425783,30.67663672509766],[114.95215604296877,30.57569983544922],[114.85877225390627,30.52351477685547],[114.78186795703127,30.642304449707034]]]}, // geom示例数据
    };
  },

  props: ["title", "showContent", "map"],

  components: {},

  created() { },

  computed: {},
  watch: {
    map(val) {
      if (val) {
        // console.log(val);
        this.map = val;

      }
    },
  },
  mounted() { },

  methods: {
    // 是否展示树
    handleBtnClick() {
      this.$emit("fullScreen");
    },
    // 开始分析
    startAnalysis() {
      this.$emit("startAnalysis");
    },
    // 重置
    resetForm() {
      // this.form={}
      removeLayerByAttr(this.map, "layerName", "draw");
      removeLayerByAttr(this.map, "layerName", "inputLayer");
      removeLayerByAttr(this.map, "layerType", "geoLayer");
      this.$emit("resetForm");

    },
    // 创建空的矢量图层
    creaEmptyLayer(layerName) {
      let params = {
        type: 0,
      };
      let layer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      layer.set("layerName", layerName);
      return layer;
    },
    // 绘制事件
    draw(drawType) {
      this.activeBtn1 = true;
      this.activeBtn2 = false;
      this.activeBtn3 = false;
      let drawLayer = this.creaEmptyLayer("draw"); // 开始绘制时创建空的矢量图层
      this.map.addLayer(drawLayer);
      drawEvent({
        map: this.map,
        layer: drawLayer,
        drawType: drawType,
        startCallback: () => {
          // this.limitEvent();
        },
        endCallback: (feature) => {
          // console.log(feature);
          this.geoData = feature;
          this.$emit("drawFeature", feature, drawLayer);
          // 设置样式
          //feature.setStyle(style);
          removeDrawInteraction(this.map);
          this.activeBtn1 = false;
        },
      });
    },
    // 导入坐标
    importCoordinate() {
      this.activeBtn2 = true;
      this.activeBtn1 = false;
      this.activeBtn3 = false;
      this.exportVisible = true;
    },
    // 输入坐标
    inputCoordinate() {
      this.activeBtn3 = true;
      this.activeBtn2 = false;
      this.activeBtn1 = false;
      this.visible = true;
      this.value=""
    },
    handleOk() {
      // 创建空图层
      let inputLayer = this.creaEmptyLayer("inputLayer");
      // console.log(inputLayer.getSource());
      this.$emit("inputGeom", 1, 2);

      // console.log(this.value);
      // 面要素

      try {
        let geom = new GeoJSON().readGeometry(this.value);
        let type = geom.getType();
      // console.log(type);
      if (type === "Polygon") {
        let feature = new Feature({
          geometry: geom,
        });
        inputLayer.getSource().addFeature(feature);
        this.map.addLayer(inputLayer);
        this.$emit("inputGemo", feature);
        this.visible = false;
        this.activeBtn3 = false;
      } else {
        this.$message.error("数据转换失败,请检查数据格式");
      }
      } catch (error) {
        this.$message.warn('GeoJSON格式不正确，请检测格式！')
      }
      
    },
    handleCancel() {
      this.visible = false;
      this.activeBtn3 = false;
      this.exportVisible = false;
      this.value = '';
      this.fileList = []
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'text/plain' || file.type === 'application/json';
      debugger
      if (!isJpgOrPng) {
        this.$message.error('请选择Json文件或者txt文件!');
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('文件大于2MB!');
        return;
      }
      let reader = new FileReader();
      reader.readAsText(file, 'utf8');

      // 文件读完的操作
      reader.onload = (e) => {

        this.$emit('uploadData', e.target.result)
        this.addFeatureGeoJson(e.target.result)
      }
      // 文件读取失败的操作
      reader.onerror = () => {
        this.$message.error('读取文件失败！')
      }
    },
    addFeatureGeoJson(item) {
      removeLayerByAttr(this.map, "layerType", "geoLayer");
      this.creaEmptyLayer('geoLayer');
      try {
        const addFe = new GeoJSON().readFeature(item);
        let style = new Style({
          stroke: new Stroke({
            color: '#1890ff', //面的边界线颜色
            width: 2         //边界线宽
          }),
          text: new Text({
            font: "14px 微软雅黑 ",
            text: item.properties.Name,
            offsetX: 0,
            offsetY: 0,
            fill: new Fill({
              color: "#fff",
            }),
          }),
        });
        addFe.setStyle(style);
        this.drawGeoLayer.getSource().addFeature(addFe);
      } catch (error) {
        this.$message.error('不是GeoJson文件格式！')
      }

    }
  },
};
</script>
<style lang="less" scoped>
.left {
  height: calc(100vh - 118px);
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.left-content {
  // height: 100%;
  height: calc(100% - 12px);
  width: calc(100% - 12px);
  background: #fff;
}
.content-btn {
  background: #cccccc;
  width: 12px;
  height: 34px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  margin: auto 0;
  cursor: pointer;
  .tree-icon {
    background: url("../../assets/imgs/tree-icon.png") no-repeat center;
    width: 12px;
    height: 10px;
    margin-top: 12px;
  }
  .treeIcon {
    transform: rotate(180deg);
  }
}
.content-title {
  height: 67px;
  padding: 0 20px;
  font-size: 16px;
  line-height: 50px;
  background: #fff;
  border-bottom: 1px solid #eee;
  div {
    text-align: left;
    line-height: 67px;
    font-size: 18px;
    color: #454954;
    font-family: "Microsoft YaHei";
    font-weight: 500;
  }
  .active {
    color: rgb(19, 141, 223);
  }
}
.btns-wrapper {
  width: 100%;
  height: 86px;
  padding: 26px 22px;
  display: flex;
  justify-content: space-between;
  .btn {
    cursor: pointer;
    width: 98px;
    height: 34px;
    border: 1px solid #1890ff;
    display: flex;
    justify-content: flex-start;
    border-radius: 4px;
    .btn-icon {
      width: 30px;
      height: 34px;
    }
    .btn-txt {
      color: #1890ff;
      font-size: 14px;
      line-height: 34px;
    }
  }
  .btn:hover {
    background: #397DC9;
    .btn-txt {
      color: #fff;
    }
  }
  .btn:first-child {
    .btn-icon {
      background: url("../../assets/imgs/icon-hz.png") no-repeat center;
    }
  }
  .btn:first-child:hover {
    .btn-icon {
      background: url("../../assets/imgs/icon-hz-hover.png") no-repeat center;
    }
  }
  .activeBtn1 {
    background: #1890ff;
    .btn-txt {
      color: #fff;
    }
    .btn-icon {
      background: url("../../assets/imgs/icon-hz-hover.png") no-repeat center !important;
    }
  }
  .btn:nth-child(2) {
    .btn-icon {
      background: url("../../assets/imgs/icon-dr.png") no-repeat center;
    }
  }
  .btn:nth-child(2):hover {
    .btn-icon {
      background: url("../../assets/imgs/icon-dr-hover.png") no-repeat center;
    }
  }
  .activeBtn2 {
    background: #1890ff;
    .btn-txt {
      color: #fff;
    }
    .btn-icon {
      background: url("../../assets/imgs/icon-dr-hover.png") no-repeat center !important;
    }
  }
  .btn:last-child {
    .btn-icon {
      background: url("../../assets/imgs/icon-sr.png") no-repeat center;
    }
  }
  .btn:last-child:hover {
    .btn-icon {
      background: url("../../assets/imgs/icon-sr-hover.png") no-repeat center;
    }
  }
  .activeBtn3 {
    background: #1890ff;
    .btn-txt {
      color: #fff;
    }
    .btn-icon {
      background: url("../../assets/imgs/icon-sr-hover.png") no-repeat center !important;
    }
  }
}
.form-wrapper {
  height: auto;
  width: 100%;
  padding-bottom: 45px;
  text-align: left;
}
.bottom-btn {
  width: 100%;
  height: 34px;
  display: flex;
  justify-content: space-between;
  padding: 0 22px;
  .btn {
    cursor: pointer;
    width: 156px;
    height: 34px;
    line-height: 34px;
    border: 1px solid #397DC9;
    color: #1890ff;
  }
  .btn:first-child {
    color: #fff;
    background: #397DC9;
  }
}
</style>
