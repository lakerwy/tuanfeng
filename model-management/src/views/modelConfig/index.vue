<template>
  <div class="app-canvas">
    <!--<div class="app-canvas__left">
      <div class="title">模型配置</div>
      <div class="treeBox">
        <left-tree @node="getNode" :data="treeData"></left-tree>
      </div>
    </div>-->
    <div
      class="app-canvas__main"
      v-loading="showCover"
      element-loading-text="请先选择评价项"
      element-loading-spinner="el-icon-thumb"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      customClass="config-load"
    >
      <div class="container">
        <div v-if="selectItem" class="title">
          {{ selectItem.name }}
        </div>
        <div class="content">
          <div class="leftNavBox">
            <div
              :class="index == nav ? 'navItems navItemsC' : 'navItems'"
              v-for="(item, index) in navList"
              :key="index"
              @click="changeItem(index)"
            >
              <p style="font-weight: bold;">{{ item.name }}</p>
              <p>{{ item.title }}</p>
            </div>
          </div>

          <div>
            <step-one v-show="nav == 0" ref="step1" @next="next"></step-one>
            <step-two v-show="nav == 1" ref="step2" @next="next"></step-two>
            <step-three v-show="nav == 2" ref="step3" @next="next"></step-three>
            <step-fore v-show="nav == 3" ref="step4"></step-fore>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeLists, getModelData } from "@/api/api.js";
import stepOne from "./components/stepOne.vue";
import stepTwo from "./components/stepTwo.vue";
import stepThree from "./components/stepThree.vue";
import stepFore from "./components/stepFore.vue";
import leftTree from "@/components/leftTree/index.vue";
export default {
  data() {
    return {
      treeData: [],
      showCover: true,
      selectItem: null, // 当前选中节点
      nav: 0,
      navList: [
        {
          name: "步骤一",
          title: "选择评价区域"
        },
        {
          name: "步骤二",
          title: "选择评价参数"
        },
        {
          name: "步骤三",
          title: "选择修正参数"
        },
        {
          name: "步骤四",
          title: "选择报告"
        }
      ]
    };
  },
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFore,
    leftTree
  },
  mounted() {
    this.getTree();

    let model = this.$route.params.model;
    if (model) {
      let item = {
        name: model.modername,
        id: model.id,
        spjtype: model.spjtype,
        leaf: true
      };
      this.getNode(item);
    }
  },
  methods: {
    async getTree() {
      var res = await getTreeLists();
      if (res.code == 200) {
        this.treeData = res.data;
      }
    },
    async getNode(val) {
      this.showCover = false;
      this.selectItem = val;
      this.nav = 0;
      this.getModelDatas(val.id);
    },
    changeItem(index) {
      // 更新
      if (this.selectItem) {
        this.getModelDatas(this.selectItem.id);
      }

      this.nav = index;
    },
    async getModelDatas(id) {
      let res = await getModelData(id);
      this.$refs.step1.init(res.data);
      this.$refs.step2.init(id, res.data);
      this.$refs.step3.init(id, res.data);
      this.$refs.step4.init(id, res.data);
    },
    next() {
      this.nav += 1;
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;

.app-canvas {
  &__main {
    .container {
      .title {
        text-align: center;
      }
      .content {
        flex: 1;
        display: grid;
        grid-template-columns: 198 / @vw 1fr;
        height: 100%;
        .leftNavBox {
          border-right: 1px solid #e8e8e8;

          .navItems {
            width: 100%;
            height: 76 / @vh;
            box-sizing: border-box;
            padding: 10 / @vh;
            cursor: pointer;
            transition: all 0.4s;

            p {
              line-height: 28 / @vh;
              font-size: 14 / @vh;
              text-align: left;
              color: #6f7583;
              padding-left: 20 / @vw;
            }
          }

          .navItemsC {
            background-color: #e6f1ff;
            border-right: 6px solid #1890ff;

            p {
              color: #1890ff;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
@vw: 19.2vw;
@vh: 10.8vh;

.step {
  width: 100%;
  height: 100%;

  .configContainer {
    margin-left: 46 / @vw;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-basis: auto;
    box-sizing: border-box;
    .header {
      .saveBut {
        position: absolute;
        width: 84 / @vw;
        height: 36 / @vh;
        line-height: 36 / @vh;
        text-align: center;
        color: #fff;
        border-radius: 4px;
        font-size: 14 / @vh;
        right: 0;
        top: 0;
        background-color: #1890ff;
        cursor: pointer;
      }
      .title {
        font-size: 16 / @vh;
        color: #454954;
        text-align: left;
        line-height: 26 / @vh;
        font-weight: bold;
      }
    }
    .content {
      flex: 1;
      .areaTitle {
        font-size: 14 / @vh;
        text-align: left;
        line-height: 26 / @vh;
        font-weight: bold;
        margin-top: 30 / @vh;
        margin-bottom: 10 / @vh;
        span {
          padding-left: 18 / @vw;
          color: #1890ff;
          font-weight: normal;
          cursor: pointer;
        }
      }

      .areaSelectBox {
        display: flex;
        margin-top: 20 / @vh;

        .el-select {
          margin-right: 20 / @vw;
        }
      }

      .step-content {
        display: flex;
        flex-wrap: wrap;
        .step-item {
          display: block;
          border: solid 1px #e8e8e8;
          > div {
            padding: 5px;
          }
          > div + div {
            border-top: solid 1px #e8e8e8;
          }
          .step-item-1,
          .step-item-2 {
            background-color: #f0f6fb;
          }
          .step-item-2 {
            font-size: 16 / @vh;
            line-height: 16 / @vh;
            padding: 10px;
          }
          .step-item-3 {
            input {
              width: 80 / @vw;
              height: 30 / @vh;
              border: solid 1px #dddddd;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
