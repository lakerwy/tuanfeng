<!--  -->
<template>
  <div class="lstbzscx" v-show="showZscx">
    <!-- <div class="steps">
      <a-steps
        progress-dot
        v-model="current"
        direction="vertical"
        @change="addFeatureByYear"
      >
        <a-step :title="2010 + item + '年'" v-for="item in 10" :key="item" />
      </a-steps>
      <div class="bf" @click="playLayer">
        <a-icon type="play-circle" v-show="play" />
        <a-icon type="pause-circle" v-show="!play" />
      </div>
      <div class="close" @click="close"></div>
    </div> -->
    <div class="timeLine">
      <div class="time-wrapper" v-for="item in items" :key="item.id">
        <div
          @click="addFeatureByYear(item)"
          :class="[item.active ? 'active-time' : '', 'time']"
        >
          <div class="title">{{ 2010 + item.id + "年" }}</div>
          <div class="circle"></div>
        </div>
        <div class="time-line" v-show="item.id < 5"></div>
      </div>
      <div class="close" @click="close"></div>
    </div>
  </div>
</template>

<script>
import { createVectorLayer } from "@/mapjs/layer.js";
import GeoJSON from "ol/format/GeoJSON";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
import { removeLayerByAttr } from "../../pages/oneMap/function";
export default {
  name: "reviewSearch",
  data() {
    return {
      showZscx: false,
      current: null,
      yearFes: [],
      drawLayer: null,
      addFe: null,
      play: true,
      int: null,
      activeTime: false,
      items: [
        {
          id: 1,
          active: false,
        },
        {
          id: 2,
          active: false,
        },
        {
          id: 3,
          active: false,
        },
        {
          id: 4,
          active: false,
        },
        {
          id: 5,
          active: false,
        },
      ],
    };
  },
  watch: {
    map(val) {
      this.map = val;
    },
    showZscx(val) {
      if (val) {
        this.getYearFeature();
        this.createEmptyLayer();
      }
    },
  },
  props: ["map"],

  components: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    // 关闭
    // close() {
    //   this.showZscx = false;
    //   this.drawLayer.getSource().removeFeature(this.addFe);
    //   this.addFe = null;
    //   this.map.removeLayer(this.drawLayer);
    // },
    // 获取每一年的要素
    getYearFeature() {
      let allFeatures = window.TF_XZ.features;
      let arr = [];
      allFeatures.forEach((i, j) => {
        arr.push({
          feature: new GeoJSON().readFeature(i),
          year: 2010 + j + "年",
          id: j,
        });
      });
      this.yearFes = arr;
    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0,
      };
      this.drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawLayer.set("layerType", "reviewSearchLayer");
      this.map.addLayer(this.drawLayer);
    },
    // 根据年份将feature添加到地图上
    addFeatureByYear(e) {
      this.items.forEach((i) => {
        i.active = false;
      });
      e.active = true;
      //   if (this.int && !this.play) {
      //     this.play = true;
      //     window.clearInterval(this.int);
      //   }
      if (this.addFe) {
        this.drawLayer.getSource().removeFeature(this.addFe);
      }
      let item = this.yearFes.filter((item) => item.id == e.id)[0];
      this.addFe = item.feature;
      let style = new Style({
        fill: new Fill({
          //矢量图层填充颜色，以及透明度
          color: "rgba(38,113,254,0.8)",
        }),
        text: new Text({
          font: "14px 微软雅黑 ",
          text: item.year,
          offsetX: 0,
          offsetY: 0,
          fill: new Fill({
            color: "#fff",
          }),
        }),
      });
      this.addFe.setStyle(style);
      this.drawLayer.getSource().addFeature(this.addFe);
    },
    // 播放
    playLayer() {
      this.play = !this.play;
      if (!this.play) {
        if (this.current == 9) {
          this.play = true;
          return;
        }
        if (!this.current) {
          this.current = 0;
          this.addFeatureByYear(this.current);
        }
        this.int = setInterval(() => {
          this.current++;
          this.addFeatureByYear(this.current);
          if (this.current == 9) {
            this.play = true;
            window.clearInterval(this.int);
          }
        }, 1000);
      } else {
        window.clearInterval(this.int);
      }
    },
    close() {
      this.showZscx = false;
      this.addFe = null;
      this.items.forEach((i) => {
        i.active = false;
      });      
      removeLayerByAttr(this.map, "layerType", "reviewSearchLayer");
    },

  },
};
</script>
<style lang='less' scoped>
.lstbzscx {
  position: absolute;
  bottom: 50px;
  right: 20%;
}
.steps {
  background: #fff;
  padding: 20px 10px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  position: relative;
  /deep/.ant-steps-item-content {
    width: 80px;
    text-align: left;
  }
  .bf {
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    right: 10px;
    /deep/.anticon-play-circle {
      font-size: 18px;
      color: #999;
    }
  }
  .close {
    cursor: pointer;
    background: url("../../assets/imgs/icon-clear.png") no-repeat center;
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
}
.timeLine {
  width: 700px;
  height: 66px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  padding-left: 36px;
  .time-wrapper {
    position: relative;
  }
  .time {
    cursor: pointer;
    margin-top: 12px;
    width: 138px;
    .title {
      width: 58px;
      height: 28px;
      font-size: 12px;
      color: #6f7583;
      padding-top: 2px;
    }
    .circle {
      margin-top: 2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #dedede;
      margin-left: 24px;
    }
  }
  .active-time {
    .title {
      background: url("../../assets/imgs/qpk.png") no-repeat center;
      color: #fff;
    }
    .circle {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1890ff;
      margin-left: 24px;
    }
  }
  .time-line {
    position: absolute;
    left: 38px;
    bottom: 18px;
    width: 120px;
    height: 2px;
    background: #dedede;
  }
  .close {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url("../../assets/imgs/icon-clear.png") no-repeat center;
    position: absolute;
    top: 5px;
    right: 10px;
  }
}
</style>
