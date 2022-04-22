<template>
  <div class="app-canvas">
    <!--<div class="app-canvas__left">
      <div class="title">模型构建</div>
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
      <div class="main-title">
        当前模型：
        <template v-if="selectItem">
          <span>{{ selectItem.name }}</span>
          <span class="configSpan" @click="showBuildDialog">配置</span>

          <etlDialog ref="etlDialog" @submit="setETLEvent"></etlDialog>
        </template>
      </div>
      <div class="container">
        <template v-if="isGraph">
          <div id="graphContainer" class="graphContainer"></div>
          <graphTool class="tool"></graphTool>
          <div id="outline"></div>
        </template>
        <template v-else>
          <img id="imgContainer" :src="imgUrl" @mousewheel="imgWheelEvent" />
          <div class="graphContainer noImage" v-if="!imgUrl">
            <div>
              <i class="icon el-icon-picture-outline"></i>
              <div>点击配置，进行流程图关联</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getTreeLists } from "@/api/api.js";
import leftTree from "@/components/leftTree/index.vue";
import graphTool from "./components/graphTool";

import hgtGraph from "./graphFunction";
import xmlToJSON from "xmltojson";

import etlDialog from "./etlDialog";
import {
  getModelByIdRequest,
  registerGraphRequest,
  updateGraphRequest,
  destroyGraphRequest
} from "@/api/modelManagerApi";
import { relationModelRequest } from '@/api/etlApi';
import { zoomInAndOut } from "@/utils/imageUtl";

export default {
  components: {
    leftTree,
    graphTool,
    etlDialog
  },
  data() {
    return {
      treeData: [],
      showCover: true,
      selectItem: null, // 当前选中节点
      graph: null,
      mxgraphData: {
        nodesList: [],
        edgesList: []
      },
      buildDialogVisible: false,
      isGraph: false, // 流程图采用哪种技术
      modelInfo: null,
      imgUrl: null,
      image: null
    };
  },
  mounted() {
    this.getTree();

    // 初始化
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
        this.showTree = true;
      }
    },
    async getNode(val) {
      this.showCover = false;
      this.selectItem = val;

      // 获取模型详细信息
      let res = await getModelByIdRequest({ id: this.selectItem.id });
      if (res.code !== 200) {
        this.$message.error(res.msg);
        return;
      }

      let modelInfo = res.data;
      if (!modelInfo) {
        return;
      }

      this.modelInfo = modelInfo;
      this.imgUrl = this.modelInfo?.modelLocation?.imgUrl;
      if (this.imgUrl) {
        let img = new Image();
        img.src = this.imgUrl;
        img.onload = function() {
          let el = document.getElementById("imgContainer");
          el.style.width = img.width + "px";
          el.style.height = img.height + "px";
        };
      } else {
        let el = document.getElementById("imgContainer");
        el.style.width = "unset";
        el.style.height = "unset";
      }

      // if (this.isGraph) {
      //   this.chooseModel();
      // }
    },
    imgWheelEvent(e) {
      zoomInAndOut(e);
    },
    init() {
      this.showCover = false;
      this.graph = new hgtGraph(
        "graphContainer",
        this.mxgraphData.nodesList,
        this.mxgraphData.edgesList
      );
      this.graph.setOutline("outline");
    },
    showBuildDialog() {
      let data = this.modelInfo?.modelLocation;
      this.$refs.etlDialog.init(data);
    },
    async setETLEvent(data) {
      if (!this.modelInfo && !this.modelInfo.modelDesc) {
        return;
      }
      let params = null;
      let res = null;
      // let modelDesc = this.modelInfo.modelDesc;
      // params = {
      //   moduleid:modelDesc.id,
      //   lid: data? data.id : ""
      // };
      // res = await relationModelRequest(params);
      // if (res.status) {
      //   this.$message("模型绑定成功！");
      //   this.getNode(this.selectItem);
      // } else {
      //   this.$message.error(res.message);
      // }
      // 注册
      let modelDesc = this.modelInfo.modelDesc;
      let processid = modelDesc.processid;
      if (!processid && data) {
        params = {
          modelDesc: { ...modelDesc, processid: data.id },
          modelLocation: { ...data, createtime: null, updatetime: null }
        };
        res = await registerGraphRequest(params);
      }

      // 销毁
      if (processid && !data) {
        let regservid = this.modelInfo.modelDesc.regservid;
        params = {
          ...modelDesc,
          processid: null,
          regservid: regservid,
        };
        res = await destroyGraphRequest(params);
      }

      // 更新
      if (processid && data && processid !== data.id) {
        params = {
          modelDesc: { ...modelDesc, processid: data.id },
          modelLocation: { ...data, createtime: null, updatetime: null }
        };
        res = await updateGraphRequest(params);
      }
      if (res.code === 200) {
        this.$message("模型绑定成功！");
        this.getNode(this.selectItem);
      } else {
        this.$message.error(res.msg);
      }
    },
    // 选择模型 获取xml 解析xml
    async chooseModel() {
      axios({
        url: "aaa.ktr",
        methods: "get"
      })
        .then(res => {
          let xmlData = xmlToJSON.parseString(res.data).transformation[0];
          let nodeArr = [];
          let edgesArr = [];
          for (var i in xmlData.step) {
            nodeArr.push([
              xmlData.step[i].name[0]._text,
              xmlData.step[i].type[0]._text
            ]);
          }
          this.mxgraphData.nodesList = nodeArr;
          for (var j in xmlData.order[0].hop) {
            edgesArr.push([
              xmlData.order[0].hop[j].from[0]._text,
              xmlData.order[0].hop[j].to[0]._text
            ]);
          }
          this.mxgraphData.edgesList = edgesArr;
          this.init();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
@import "../../assets/style/module/util";

.app-canvas {
  &__main {
    display: flex;
    flex-direction: column;
    flex-basis: auto;
    box-sizing: border-box;
    .main-title {
      margin: 10 / @vh 0;
      .configSpan {
        padding-left: 18 / @vw;
        color: #1890ff;
        font-weight: normal;
        cursor: pointer;
      }
    }
    .container {
      flex: 1;
      position: relative;
      .graphContainer {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #eee url("../../assets/images/grid.gif") 0 0 repeat;
        overflow: auto;
      }
      .tool {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
      }
      #outline {
        position: absolute;
        right: 0;
        top: 0;
        width: 15%;
        height: 15%;
        background-color: #f8f9fa;
        border: 1px solid #000;
      }
      .noImage {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
        font-size: 20px;
        > div {
          text-align: center;
        }
        .icon {
          font-size: 200px;
        }
      }
    }
  }
}
</style>
