<template>
  <div class="sidebar">
    <div
      class="item-wrapper"
      v-for="(i, index) in lis"
      :key="index"
      @click="handleEvents(i)"
    >
      <div :class="['item', i.active ? 'activeItem' : '']">
        <div class="front-icon" :class="i.icon"></div>
        <span class="desc">{{ i.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { drawEvent, removeDrawInteraction } from "@/mapjs/interaction/draw.js";
import { createVectorLayer } from "@/mapjs/layer.js";
import measureEvent,  { clearMeasure } from "@/mapjs/tool/measure.js";
export default {
  props: ["map", "fullscr"],
  data() {
    return {
      collapse: false,
      searchWord: "",
      lis: [
        {
          desc: "测距",
          icon: "icon-cj",
          active: false,
          event: "distance",
        },
        {
          desc: "测面",
          icon: "icon-cm",
          active: false,
          event: "area",
        },
        {
          desc: "全屏",
          icon: "icon-qp",
          active: false,
          event: "fullScreen",
        },
        {
          desc: "清除",
          icon: "icon-qc",
          active: false,
          event: "clear",
        },
      ],
      measureList: []
    };
  },
  watch: {
    map(val) {
      if (val) {
        this.map = val;
      }
    },
    fullscr(val) {
      // console.log(val)
      this.lis[2].active = !val
    }
  },
  mounted() {},
  methods: {
    handleEvents(e) {
      this.lis.forEach((i) => {
        i.active = false;
      });

      if (e.event == "distance") {
        e.active = true;
        // measureEvent(this.map, "LineString", (info) => (e.active = false));
        this.measureList.push(new measureEvent({map: this.map, type: "LineString"}));
      } else if (e.event == "area") {
        e.active = true;
        // measureEvent(this.map, "Polygon", (info) => (e.active = false));
        this.measureList.push(new measureEvent({map: this.map, type: "Polygon"}));
      } else if (e.event == "fullScreen") {
        this.$emit("fullScreen");
      } else if (e.event == "clear") {
        this.$emit("clearTreeCheckedLayers");
      }
    },
    clear() {
      this.measureList.forEach(x => {
        clearMeasure(x);
      });
      this.measureList = [];
    }
  },

  computed: {},
};
</script>

<style lang="less" scoped>
.sidebar {
  position: absolute;
  top: 21px;
  right: 20px;
  display: flex;
  justify-content: flex-start;
  background: #fff;
  height: 36px;
  padding: 0 7px;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  .item-wrapper {
    margin-top: 8px;
    padding-left: 35px;
    padding-right: 10px;
    height: 20px;
    font-size: 12px;
    border-right: 1px solid #eee;
    cursor: pointer;
    position: relative;
    .front-icon {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 0px;
      left: 9px;
    }
    .desc {
      font-size: 12px;
      line-height: 20px;
      margin-bottom: 5px;
    }
    .anticon-down {
      padding: 0 5px 0 5px;
    }
    /deep/.ant-popover {
      /deep/.ant-popover-inner-content {
        padding-left: 0px !important;
      }
    }
  }
  .activeItem {
    .icon-cj {
      background: url("../../assets/imgs/icon-cj-hover.png") no-repeat center;
    }
    .icon-cm {
      background: url("../../assets/imgs/icon-cm-hover.png") no-repeat center;
    }
    .icon-qp {
      background: url("../../assets/imgs/icon-qp-hover.png") no-repeat center;
    }
    .icon-qc {
      background: url("../../assets/imgs/icon-qc-hover.png") no-repeat center;
    }
    .desc {
      color: #1890ff;
    }
  }
  .item-wrapper:hover {
    .icon-cj {
      background: url("../../assets/imgs/icon-cj-hover.png") no-repeat center;
    }
    .icon-cm {
      background: url("../../assets/imgs/icon-cm-hover.png") no-repeat center;
    }
    .icon-qp {
      background: url("../../assets/imgs/icon-qp-hover.png") no-repeat center;
    }
    .icon-qc {
      background: url("../../assets/imgs/icon-qc-hover.png") no-repeat center;
    }
    .desc {
      color: #1890ff;
    }
  }
  /deep/.ant-dropdown {
    top: 80px;
  }
  .item-wrapper:last-child {
    border-right: 0px;
  }
  .icon-cj {
    background: url("../../assets/imgs/icon-cj.png") no-repeat center;
  }
  .icon-cm {
    background: url("../../assets/imgs/icon-cm.png") no-repeat center;
  }
  .icon-qp {
    background: url("../../assets/imgs/icon-qp.png") no-repeat center;
  }
  .icon-qc {
    background: url("../../assets/imgs/icon-qc.png") no-repeat center;
  }
}
.dropdown-item {
  position: relative;
  height: 30px;
  width: 70px;
  cursor: pointer;
  span {
    color: #454954;
  }
  .item-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 5px;
    left: -5px;
  }
  span {
    font-size: 12px;
    position: absolute;
    top: 6px;
    left: 20px;
  }
}
.dropdown-item:hover {
  span {
    color: #1890ff;
  }
}
</style>
