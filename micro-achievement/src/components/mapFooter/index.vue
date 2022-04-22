<!--  -->
<template>
  <div class="footer">
    <div class="container">
      <span>当前比例尺：<span class="str1"></span></span>
      <span class="str2"></span>
      <span class="str4">当前数据：{{ str4 }}</span>
      <span v-if="isAudit">
        <span class="remark">审查任务标注说明：</span>
        <div class="box green"></div><span class="type">通过</span>
        <div class="box gray"></div><span class="type">未通过</span>
        <div class="box yellow"></div><span class="type">审核中</span>
      </span>
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
      str4: "矢量数据",
      map1: "",
    };
  },
  props: {
    map: {
      type: Object,
      default: null
    },
    isAudit: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    map(val) {
      if (val) {
        // console.log(val);
        this.map = val;
        this.getScaleStr();
      }
    },
  },
  methods: {
    // 获取比例尺
    getScaleStr() {
      let scale = new ScaleLine({
        className: "scale",
        bar: true,
        text: true,
        steps: 1,
        target: document.querySelector(".str1"),
      });
      this.map.addControl(scale);
      //鼠标获取坐标控件
      const mousePositionControl = new MousePosition({
        coordinateFormat: function (coordinate) {
          return format(coordinate, `X：{x} &nbsp;&nbsp;&nbsp; Y：{y}`, 6);
        },
        projection: "EPSG:4326",
        className: "custom-mouse-position",
        target: document.querySelector(".str2"),
        undefinedHTML: "",
      });
      //添加控件到地图
      this.map.addControl(mousePositionControl);
    },
  },
};
</script>
<style lang='less' scoped>
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
    .remark {
      color: rgba(69, 73, 84, 1);
      font-size: 12px;
    }
    .type {
      color: rgba(111, 117, 131, 1);
    }
    .box {
      width: 22px;
      height: 13px;
      display: inline-block;
      margin-right: 5px;
    }
    .green {
      background-color: rgba(0, 153, 68, 1);
    }
    .gray {
      background-color: rgba(149, 149, 149, 1);
    }
    .yellow {
      background-color: rgba(243, 152, 1, 1);
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
