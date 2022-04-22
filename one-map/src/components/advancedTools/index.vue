<template>
  <div class="advanced-tools">
    <div
      class="box"
      v-for="(item, index) in items"
      :key="index"
      :class="[
        { 'box1-active': show1 },
        { 'box2-active': show2 },
        { 'box3-active': show3 },
        { 'box4-active': show4 },
        { 'box5-active': show5 },
      ]"
      @click="handleIconClick(index + 1, item)"
    >
      <a-tooltip
        class="item"
        effect="dark"
        :title="item.desc"
        placement="right"
        :visible="item.show"
      >
        <div
          :class="item.url"
          class="item-icon"
          @mouseover="item.show = true"
          @mouseout="item.show = false"
        ></div>
      </a-tooltip>
    </div>
    <div class="select-wrapper" v-show="show1 && showSelect"></div>
    <arrange-icons
      :items="items1"
      class="icons1"
      v-show="false"
      @iconEvents="handleEvents"
    ></arrange-icons>

    <arrange-icons
      :items="items2"
      class="icons2"
      v-show="show2"
      @iconEvents="handleEvents"
    ></arrange-icons>
    <arrange-icons
      :items="items3"
      class="icons3"
      v-show="show3"
      @iconEvents="handleEvents"
    ></arrange-icons>
    <arrange-icons
      :items="items4"
      class="icons4"
      v-show="show4"
      @iconEvents="handleEvents"
    ></arrange-icons>
    <arrange-icons
      :items="items5"
      class="icons5"
      v-show="show5"
      @iconEvents="handleEvents"
    ></arrange-icons>
  </div>
</template>

<script>
import ArrangeIcons from "@/components/arrangeIcons/index";
export default {
  props: ["map", "options"],
  watch: {
    map(val) {
      this.map = val;
    },
  },
  data() {
    return {
      collapse: false,
      items: [
        { desc: "空间筛选", url: "icon-kjsx", show: false },
        { desc: "空间统计", url: "icon-kjtj", show: false },
        { desc: "空间对比", url: "icon-kjdb", show: false },
        { desc: "空间分析", url: "icon-kjfx", show: false },
        { desc: "空间查询", url: "icon-kjcx", show: false },
      ],
      items1: [
        {
          desc: "点选",
          url: "icon-dx",
          activeClass: "icon-dx-hover",
          active: false,
          event: "pointChoose",
        },
        {
          desc: "框选",
          url: "icon-kx",
          activeClass: "icon-kx-hover",
          active: false,
          event: "boxChoose",
        },
        {
          desc: "组合",
          url: "icon-zh",
          activeClass: "icon-zh-hover",
          active: false,
          event: "markUp",
        },
      ],
      items2: [
        {
          desc: "土规、城规差异图斑统计",
          url: "icon-tgcg",
          activeClass: "icon-tgcg-hover",
          active: false,
          event: "spotStatistics",
        },
        {
          desc: "生态保护红线统计",
          url: "icon-stbh",
          activeClass: "icon-stbh-hover",
          active: false,
          event: "ecologyStatistics",
        },
        {
          desc: "永久基本农田统计",
          url: "icon-yjnt",
          activeClass: "icon-yjnt-hover",
          active: false,
          event: "farmlandStatistics",
        },
        // {
        //   desc: "规划全生命周期分析",
        //   url: "icon-smzq",
        //   activeClass: "icon-smzq-hover",
        //   active: false,
        //   event: "planAnalysis",
        // },
      ],
      items3: [
        {
          desc: "多窗口对比",
          url: "icon-dckdb",
          activeClass: "icon-dckdb-hover",
          active: false,
          event: "multiWindow",
        },
        {
          desc: "卷帘对比",
          url: "icon-jldb",
          activeClass: "icon-jldb-hover",
          active: false,
          event: "rollerShutter",
        },
      ],
      items4: [
        {
          desc: "控规、详规叠加分析",
          url: "icon-kgxg",
          activeClass: "icon-kgxg-hover",
          active: false,
          event: "detailedPlan",
        },
        {
          desc: "叠加分析",
          url: "icon-dj",
          activeClass: "icon-dj-hover",
          active: false,
          event: "superposition",
        },
        {
          desc: "缓冲区分析",
          url: "icon-hcq",
          activeClass: "icon-hcq-hover",
          active: false,
          event: "bufferAnalysis",
        },
        // {
        //   desc: "合规性分析",
        //   url: "icon-hgx",
        //   activeClass: "icon-hgx-hover",
        //   active: false,
        //   event: "complianceAnalysis",
        // },
      ],
      items5: [
        {
          desc: "历史图斑追溯查询",
          url: "icon-lstb",
          activeClass: "icon-lstb-hover",
          active: false,
          event: "reviewSearch",
        },
      ],
      show1: false,
      showSelect: false,
      showTable: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      searchLayer: undefined,
      drawGemo: "", //绘制的要素
      layerUrl: "",
      layerId: "",
    };
  },
  components: {
    ArrangeIcons,
  },
  mounted() {},
  methods: {
    handleIconClick(e, f) {
      f.show = !f.show;
      if (e == 1) {
        this.show1 = true;
        this.$emit("spaceSift", this.show1);
        //this.showSelect = true;
      } else {
        //this.showSelect = false;
      }
      let str = "show" + e;
      let arr = ["show1", "show2", "show3", "show4", "show5"];
      arr.forEach((item) => {
        if (item == str) {
          this[item] = !this[item];
        } else {
          this[item] = false;
        }
      });
    },
    async handleEvents(item) {
      item.active = false;
      this.show3 = false;
      this.show4 = false;
      switch (item.event) {
        case "rollerShutter":
          this.$emit("rollerShutter");
          break;
        case "multiWindow":
          this.$emit("multiWindow");
          break;
        case "superposition":
          this.$emit("superposition");
          break;
        case "bufferAnalysis":
          this.$emit("bufferAnalysis");
          break;
        case "pointChoose":
          break;
        case "boxChoose":
          break;
        case "ecologyStatistics":
          this.show2 = false;
          this.$emit("ecologyStatistics");
          break;
        case "reviewSearch":
          this.show5 = false;
          this.$emit("reviewSearch");
          break;
        case "spotStatistics":
          this.show2 = false;
          this.$emit("spotStatistics");
          break;
        case "farmlandStatistics":
          this.show2 = false;
          this.$emit("farmlandStatistics");
          break;
        case "detailedPlan":
          this.$emit("detailedPlan");
          break;
        default:
          this.$message.info("暂未开放此功能");
          break;
      }
    },
  },

  computed: {},
};
</script>

<style lang="less" scoped>
.advanced-tools {
  position: absolute;
  bottom: 50px;
  left: 21px;
  width: 32px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  .box {
    width: 20px;
    height: 32px;
    margin-left: 6px;
    padding-top: 6px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    .item-icon {
      width: 20px;
      height: 20px;
      outline: none;
    }
    .icon-kjsx {
      background: url("../../assets/imgs/icon-kjsx.png") no-repeat center;
    }
    .icon-kjsx:hover {
      background: url("../../assets/imgs/icon-kjsx-hover.png") no-repeat center;
    }
    .icon-kjtj {
      background: url("../../assets/imgs/icon-kjtj.png") no-repeat center;
    }
    .icon-kjtj:hover {
      background: url("../../assets/imgs/icon-kjtj-hover.png") no-repeat center;
    }
    .icon-kjdb {
      background: url("../../assets/imgs/icon-kjdb.png") no-repeat center;
    }
    .icon-kjdb:hover {
      background: url("../../assets/imgs/icon-kjdb-hover.png") no-repeat center;
    }
    .icon-kjfx {
      background: url("../../assets/imgs/icon-kjfx.png") no-repeat center;
    }
    .icon-kjfx:hover {
      background: url("../../assets/imgs/icon-kjfx-hover.png") no-repeat center;
    }
    .icon-kjcx {
      background: url("../../assets/imgs/icon-kjcx.png") no-repeat center;
    }
    .icon-kjcx:hover {
      background: url("../../assets/imgs/icon-kjcx-hover.png") no-repeat center;
    }
  }
  .box1-active {
    .icon-kjsx {
      background: url("../../assets/imgs/icon-kjsx-hover.png") no-repeat center;
    }
  }
  .box2-active {
    .icon-kjtj {
      background: url("../../assets/imgs/icon-kjtj-hover.png") no-repeat center;
    }
  }
  .box3-active {
    .icon-kjdb {
      background: url("../../assets/imgs/icon-kjdb-hover.png") no-repeat center;
    }
  }
  .box4-active {
    .icon-kjfx {
      background: url("../../assets/imgs/icon-kjfx-hover.png") no-repeat center;
    }
  }
  .box5-active {
    .icon-kjcx {
      background: url("../../assets/imgs/icon-kjcx-hover.png") no-repeat center;
    }
  }
  .box:nth-child(5).box-active {
    .icon-kjcx {
      background: url("../../assets/imgs/icon-kjcx-hover.png") no-repeat center;
    }
  }
  .box:last-child {
    border-bottom: 0;
  }
  .select-wrapper {
    position: absolute;
    top: 0px;
    left: 40px;
  }
  .icons1 {
    position: absolute;
    top: 0;
    left: 40px;
  }
  .icons2 {
    position: absolute;
    top: 32px;
    left: 40px;
  }
  .icons3 {
    position: absolute;
    top: 64px;
    left: 40px;
  }
  .icons4 {
    position: absolute;
    bottom: 32px;
    left: 40px;
  }
  .icons5 {
    position: absolute;
    bottom: 0;
    left: 40px;
  }
  .table-wrapper {
    padding: 10px 20px 5px 20px;
    overflow: auto;
    width: 1300px;
    max-height: 400px;
    position: absolute;
    bottom: 0;
    left: 40px;
    background: #fff;
  }
}
</style>
