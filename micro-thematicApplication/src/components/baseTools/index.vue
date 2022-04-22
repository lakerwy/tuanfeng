<template>
  <div class="base-tools">
    <div class="box1">
      <a-tooltip class="item" effect="dark" title="放大" placement="left">
        <div class="icon-plus" @click="zoomIn"></div
      ></a-tooltip>
      <a-tooltip class="item" effect="dark" title="缩小" placement="left">
        <div class="icon-minus" @click="zoomOut"></div
      ></a-tooltip>
    </div>
    <div
      class="box3"
      :class="{ box3Active: showTc }"
      @click="handleIconClick('showTc')"
    >
      <a-tooltip
        class="item"
        effect="dark"
        title="切换图层"
        placement="top"
      >
        <div class="icon-tc"></div
      ></a-tooltip>
      <div class="wrapper" v-show="showTc">
        <div>
          <a-checkbox
            v-model="checked1"
            @change="changeBoxVal('checked1', checked1)"
            >永久基本农田</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked2"
            @change="changeBoxVal('checked2', checked2)"
            >生态保护红线</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked3"
            @change="changeBoxVal('checked3', checked3)"
            >城镇扩展边界</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked4"
            @change="changeBoxVal('checked4', checked4)"
            >县级矢量地图</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked5"
            @change="changeBoxVal('checked5', checked5)"
            >乡镇矢量地图</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked5"
            @change="changeBoxVal('checked5', checked5)"
            >土地用途区</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked5"
            @change="changeBoxVal('checked5', checked5)"
            >土地规划地类</a-checkbox
          >
        </div>
        <div>
          <a-checkbox
            v-model="checked5"
            @change="changeBoxVal('checked5', checked5)"
            >建设用地管制</a-checkbox
          >
        </div>
      </div>
    </div>
    <div class="box4" @click="handleIconClick('showDt')">
      <a-tooltip
        class="item"
        effect="dark"
        title="切换底图"
        placement="top"
      >
        <div class="img-wrapper" :class="{ activeImg: isActive }"></div
      ></a-tooltip>
      <div class="wrapper" v-show="showDt">
        <div
          class="sl"
          @click="handleDtChange(1)"
          :class="{ activeLayer: !isActive }"
        >
          <div></div>
          <p>矢量地图</p>
        </div>
        <div
          class="yx"
          @click="handleDtChange(0)"
          :class="{ activeLayer: isActive }"
        >
          <div></div>
          <p>影像地图</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  zoomIn,
  zoomOut,
  toggleFullScreen,
  gotoCoordinate,
} from "@/mapjs/tool/baseTool.js";
export default {
  props: ["map"],
  data() {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      showGjx: false, // 展示工具箱icon-group
      showTc: false, // 展示图层多选框
      showDt: false, // 展示地图选择
      isActive: false, // 底图切换的样式
    };
  },
  components: {
  },
  mounted() {},
  methods: {
    zoomIn() {
      zoomIn(this.map);
    },
    zoomOut() {
      zoomOut(this.map);
    },
    changeBoxVal(e, f) {
      this.$emit("changeBoxVal", e, f);
    },
    handleIconClick(e) {
      let arr = ["showGjx", "showTc", "showDt"];
      arr.forEach((item) => {
        if (item == e) {
          this[item] = !this[item];
        } else {
          this[item] = false;
        }
      });
    },
    // 底图切换事件
    handleDtChange(e) {
      this.isActive = !this.isActive;
      this.$emit("handleDtChange", e);
    },
  },

  computed: {},
};
</script>

<style lang="less" scoped>
.base-tools {
  position: absolute;
  bottom: 80px;
  right: 20px;
  .box1 {
    width: 32px;
    height: 63px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
    cursor: pointer;
    .icon-plus {
      background: url("../../assets/imgs/icon-plus.png") no-repeat center;
      height: 32px;
      width: 20px;
      margin-left: 6px;
      border-bottom: 1px solid #eee;
      outline: none;
    }
    .icon-plus:hover {
      background: url("../../assets/imgs/icon-plus-hover.png") no-repeat center;
    }
    .icon-minus {
      background: url("../../assets/imgs/icon-minus.png") no-repeat center;
      height: 32px;
      width: 32px;
      outline: none;
    }
    .icon-minus:hover {
      background: url("../../assets/imgs/icon-minus-hover.png") no-repeat center;
    }
  }
  .box3 {
    position: relative;
    width: 32px;
    height: 32px;
    margin-top: 8px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
    cursor: pointer;
    .icon-tc {
      background: url("../../assets/imgs/icon-tc.png") no-repeat center;
      height: 32px;
      width: 32px;
      outline: none;
    }
    .wrapper {
      position: absolute;
      right: 40px;
      bottom: 0px;
      padding: 5px 10px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
      div {
        margin: 5px;
        width: 120px;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
  .box3Active {
    .icon-tc {
      background: url("../../assets/imgs/icon-tc-hover.png") no-repeat center;
    }
  }
  .box4 {
    margin-top: 8px;
    box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
    cursor: pointer;
    .img-wrapper {
      background: url("../../assets/imgs/icon-sl.png") no-repeat center;
      width: 32px;
      height: 32px;
      border-radius: 3px;
      outline: none;
    }
    .activeImg {
      background: url("../../assets/imgs/icon-yx.png") no-repeat center;
    }
    .wrapper {
      display: flex;
      justify-content: flex-start;
      position: absolute;
      right: 40px;
      bottom: 0px;
      width: 152px;
      height: 98px;
      padding: 18px 19px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
      .sl {
        margin-right: 15px;
        div {
          background: url("../../assets/imgs/icon-sl-big.png") no-repeat center;
          width: 50px;
          height: 50px;
        }
        p {
          font-size: 12px;
        }
      }
      .yx {
        div {
          background: url("../../assets/imgs/icon-yx.png") no-repeat center;
          width: 50px;
          height: 50px;
        }
        p {
          font-size: 12px;
        }
      }
      .activeLayer {
        div {
          border: #1890ff 1px solid;
        }
        p {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
