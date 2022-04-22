<template>
  <div class="sidebar">
    <div class="item-wrapper" v-for="(item, index) in items" :key="index">
      <a-popover trigger="hover" placement="bottom">
        <div
          v-for="(label, i) in item.children"
          :key="i"
          class="dropdown-item"
          @click="handleClickEvents(label.event)"
          slot="content"
        >
          <i :class="label.class" class="item-icon"></i
          ><span>{{ label.label }}</span>
        </div>
        <div class="item">
          <div :class="item.url" class="front-icon"></div>
          <span class="desc">{{ item.desc }}</span>
          <a-icon type="down" /></div
      ></a-popover>
    </div>
    <div class="item-wrapper" @click="themeMapping">
      <div class="item">
        <div class="front-icon icon-ztzz"></div>
        <span class="desc">专题制图</span>
      </div>
    </div>
  </div>
</template>

<script>
import { drawEvent, removeDrawInteraction } from "@/mapjs/interaction/draw.js";
import { createVectorLayer } from "@/mapjs/layer.js";
export default {
  props: ["map"],
  data() {
    return {
      collapse: false,
      searchWord: "",
      items: [
        // {
        //   desc: "坐标管理",
        //   url: "icon-zbgl",
        //   defaultVisible: false,
        //   children: [
        //     {
        //       class: "icon-dr",
        //       label: "导入坐标",
        //     },
        //     {
        //       class: "icon-dc",
        //       label: "导出坐标",
        //     },
        //     {
        //       class: "icon-drgl",
        //       label: "导入管理",
        //     },
        //     {
        //       class: "icon-zbdw",
        //       label: "坐标定位",
        //     },
        //   ],
        // },
        // {
        //   desc: "专题制图",
        //   url: "icon-ztzz",
        //   visible: false,
        // children: [
        //   {
        //     class: "icon-zxzt",
        //     label: "在线制图",
        //   },
        //   {
        //     class: "icon-zttc",
        //     label: "专题图库",
        //   },
        // ],
        // },
        {
          desc: "绘制",
          url: "icon-hz",
          defaultVisible: false,
          children: [
            {
              class: "icon-hzd",
              label: "绘制点",
              event: "drawPoint",
            },
            {
              class: "icon-hzx",
              label: "绘制线",
              event: "drawLine",
            },
            {
              class: "icon-hzm",
              label: "绘制面",
              event: "drawPolygon",
            },
            {
              class: "icon-hzjx",
              label: "绘制矩形",
              event: "drawBox",
            },
            {
              class: "icon-hzcx",
              label: "取消绘制",
              event: "cancleDraw",
            },
          ],
        },
      ],
    };
  },
  watch: {
    map(val) {
      if (val) {
        // console.log(val);
        this.map = val;
      }
    },
  },
  mounted() {},
  methods: {
    handleClickEvents(e) {
      switch (e) {
        case "drawPoint":
          // console.log("绘制点");
          this.draw("Point");
          break;
        case "drawLine":
          // console.log("绘制线");
          this.draw("LineString");
          break;
        case "drawPolygon":
          // console.log("绘制面");
          this.draw("Polygon");
          break;
        case "drawBox":
          // console.log("绘制矩形");
          this.draw("Box");
          break;
        case "cancleDraw":
          // console.log("取消绘制");
          removeDrawInteraction(this.map);
          break;
        default:
          this.$message.info("暂未开放此功能");
          break;
      }
    },
    // 绘制事件
    draw(drawType) {
      // 开始绘制
      let params = {
        type: 0,
      };
      let drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      drawLayer.set("layerType", "drawLayer");
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
          // 设置样式
          //feature.setStyle(style);
        },
      });
    },
    themeMapping() {
      if (sessionStorage.selectNodes) {
        this.$router.push("/oneMap/themeMapping");
      }else {
        this.$message.info("请选择相关的地图");
      }
    },
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
    padding-left: 29px;
    padding-right: 8px;
    height: 20px;
    font-size: 12px;
    border-right: 1px solid #eee;
    cursor: pointer;
    position: relative;
    .front-icon {
      position: absolute;
      top: 2px;
      left: 9px;
    }
    .desc {
      font-size: 12px;
      line-height: 20px;
      margin-bottom: 5px;
    }
    .anticon-down {
      padding: 0 3px 0 3px;
    }
    /deep/.ant-popover {
      /deep/.ant-popover-inner-content {
        padding-left: 0px !important;
      }
    }
  }

  /deep/.ant-dropdown {
    top: 80px;
  }
  .item-wrapper:last-child {
    border-right: 0px;
  }
  .item-wrapper:first-child:hover {
    .icon-zbgl {
      background: url("../../assets/imgs/icon-zbgl-hover.png") no-repeat center;
    }
    .desc {
      color: #4479c9;
    }
  }
  .item-wrapper:nth-child(2):hover {
    .icon-ztzz {
      background: url("../../assets/imgs/icon-ztzz-hover.png") no-repeat center;
    }
    .desc {
      color: #4479c9;
    }
  }
  .item-wrapper:last-child:hover {
    .icon-hz {
      background: url("../../assets/imgs/icon-hz-hover.png") no-repeat center;
    }
    .desc {
      color: #1d91c0;
    }
  }
}
.icon-zbgl {
  margin: 0 0 0 0 !important;
  background: url("../../assets/imgs/icon-zbgl-hover.png") no-repeat center;
  width: 17px;
  height: 17px;
  position: absolute;
  top: 3px;
  left: -22px;
}
.icon-ztzz {
  display: inline-block;
  margin: 0 0 0 0 !important;
  background: url("../../assets/imgs/icon-ztzz-hover.png") no-repeat center;
  width: 17px;
  height: 17px;
  position: absolute;
  top: 2px;
  left: -22px;
}
.icon-hz {
  display: inline-block;
  margin: 0 0 0 0 !important;
  background: url("../../assets/imgs/icon-hz-hover.png") no-repeat center;
  width: 17px;
  height: 17px;
  position: absolute;
  top: 2px;
  left: -22px;
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
  .icon-dr {
    background: url("../../assets/imgs/icon-dr.png") no-repeat center;
  }
  .icon-dc {
    background: url("../../assets/imgs/icon-dc.png") no-repeat center;
  }
  .icon-drgl {
    background: url("../../assets/imgs/icon-drgl.png") no-repeat center;
  }
  .icon-zbdw {
    background: url("../../assets/imgs/icon-zbdw.png") no-repeat center;
  }
  .icon-zxzt {
    background: url("../../assets/imgs/icon-zxzt.png") no-repeat center;
  }
  .icon-zttc {
    background: url("../../assets/imgs/icon-zttc.png") no-repeat center;
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
  .icon-hzjx {
    background: url("../../assets/imgs/icon-hzjx.png") no-repeat center;
  }
  .icon-hzcx{
    background: url("../../assets/imgs/icon-qc.png") no-repeat center;
  }
}
.dropdown-item:hover {
  span {
    color: #1890ff;
  }
}
</style>
