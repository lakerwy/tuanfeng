<!--  -->
<template>
  <div class="footer">
    <div class="container">
      <span>当前比例尺：<span class="str1"></span></span>
      <span class="str2"></span>
      <!-- <span class="str3">Y：{{ str3 }}</span> -->
      <span class="str4">当前数据：{{ str4 }}</span>
      <span class="str5" v-if="false"
        >Copyright©2020-2021 湖北地信科技集团股份有限公司 All Right Reserved</span
      >
    </div>
  </div>
</template>

<script>
import ScaleLine from "ol/control/ScaleLine";
import { format } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition.js";
export default {
  name: "",
  data() {
    return {
      str1: "1:50000",
      str2: "15122222",
      str3: "45855555",
      str4: "",
      map1: ""
    };
  },

  props: ["map", "dtType"],

  components: {},

  created() {},

  computed: {},
  watch: {
    map(val) {
      if (val) {
        this.map = val;
        this.getScaleStr();
      }
    },
    dtType(val) {
      this.str4 = val == 1 ? "矢量数据" : "影像数据";
    }
  },
  mounted() {},

  methods: {
    // 获取比例尺
    getScaleStr() {
      let scale = new ScaleLine({
        className: "scale",
        bar: true,
        text: true,
        steps: 1,
        target: document.querySelector(".str1")
      });
      this.map.addControl(scale);
      //鼠标获取坐标控件
      const mousePositionControl = new MousePosition({
        coordinateFormat: function(coordinate) {
          return format(coordinate, `X：{x} &nbsp;&nbsp;&nbsp; Y：{y}`, 6);
        },
        className: "custom-mouse-position",
        target: document.querySelector(".str2"),
        undefinedHTML: ""
      });
      //添加控件到地图
      this.map.addControl(mousePositionControl);
    }
  }
};
</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  .container {
    background: rgba(255, 255, 255, 0.6);
    height: 22px;
    line-height: 22px;
    padding-left: 20px;
    span {
      font-size: 12px;
      color: #454954;
      padding-right: 20px;
    }
    span:first-child {
      padding-right: 5px;
    }
    .str1 {
      width: 80px !important;
    }
    .str2 {
      display: inline-block;
    }
  }
}
/deep/.scale {
  display: inline-block;
  width: 80px !important;
}
/deep/.ol-scale-text {
  font-size: 12px;
  position: static;
  text-align: left;
  width: 80px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.ol-scale-singlebar {
  display: none;
}
/deep/.ol-scale-step-text,
.ol-scale-step-marker {
  display: none;
}
/deep/.ol-scale-step-marker {
  display: none;
}
</style>
