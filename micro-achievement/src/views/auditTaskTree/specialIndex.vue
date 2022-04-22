<template>
  <!-- 成果审查 审查任务一棵树 -->
  <div class="audit-task-tree">
    <!-- <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"
          ><span class="old-path">成果审查</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/manage' }"
          ><span class="old-path">成果管理</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span class="current-path">审查任务一棵树</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>-->
    <div class="p-bottom">
      <div class="left">
        <div class="title">
          <h1>专项规划成果审查任务一棵树</h1>
        </div>
        <div class="tree">
          <div class="tree-query">
            <el-input
              style="width: 264px;"
              v-model="treeKeyword"
              placeholder="请输入关键字查询"
            >
              <i slot="prefix">
                <img
                  src="../../assets/imgs/query-gray.png"
                  alt
                  class="select-icon"
                  style="width: 14px;height: 15px;margin: 14px;"
                />
              </i>
            </el-input>
            <!-- <el-button type="primary" @click="queryTreeData">查询</el-button> -->
            <el-button style="margin-left:15px" @click="resetQuery"
              >重置</el-button
            >
          </div>
          <div class="version">
            <el-form :model="form" :inline="true" label-position="left">
              <el-form-item label="版本号：">
                <el-select
                  style="width: 100%;"
                  v-model="form.version"
                  @change="versionChange"
                >
                  <el-option
                    v-for="item in versionOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <el-tree
            ref="taskTree"
            class="my-tree"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :indent="0"
            :filter-node-method="filterNode"
            :default-expand-all="true"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <img
                :src="[
                  node.level === 4
                    ? require('../../assets/imgs/circle.png')
                    : ''
                ]"
                alt=""
              />
              <span
                :class="{ circle: node.level === 4 }"
                style="margin-left: 10px;"
                :title="node.label"
                >{{ node.label }}</span
              >
            </span>
          </el-tree>
        </div>
      </div>
      <div class="right">
        <div class="nav">
          <!-- <tabsView class="tabs" /> -->
          <div class="tabs"></div>
          <div class="btn">
            <el-button type="primary" plain @click="goAchievementList">
              <img src="../../assets/imgs/icon-less.png" alt="" />
              <span>返回成果列表</span>
            </el-button>
            <el-button
              v-if="rowData.approveStatus != 2"
              type="primary"
              style="width: 127px;height: 36px;padding: 0;"
              @click="showReport"
            >
              <img src="../../assets/imgs/query-white.png" alt="" />
              <span>查看审查报告</span>
            </el-button>
          </div>
        </div>
        <div class="content">
          <div class="pdf-container">
            <iframe
              :src="pdfSrc"
              width="100%"
              height="99%"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tabsView from "../../components/tabsView/index";
import { mapGetters, mapMutations } from "vuex";
import { treeDataList } from "../../api/auditTaskOthers";
import { getReportList,getVersionList } from "../../api/auditTaskOthers.js";
import fileDownload from "js-file-download";
export default {
  components: {
    tabsView
  },
  data() {
    return {
      treeData: [],
      keyword: "",
      defaultProps: {
        label: "directoryName"
      },
      pdfSrc: "http://image.cache.timepack.cn/nodejs.pdf",
      treeKeyword: "",
      currentTask: sessionStorage.getItem("currentTask")
        ? JSON.parse(sessionStorage.getItem("currentTask"))
        : {},
      rowData: JSON.parse(sessionStorage.getItem("currentTask")),
      versionOptions: [],
      form: {}
    };
  },
  computed: {
    ...mapGetters("tabs", ["getCurrentTab"])
  },
  mounted() {},
  created() {
    this.TreeData();
    this.getVersions()
  },
  watch: {
    treeKeyword(val) {
      this.$refs.taskTree.filter(val);
    }
  },

  methods: {
    ...mapMutations("tabs", {
      setTabs: "setTabsLists"
    }),
     // 切换版本
        versionChange() {
          this.TreeData();
    },
    // 获取版本号
    async getVersions(){
      let params=this.rowData.id
      let res= await getVersionList(params)
      if(res.data.msg === "执行成功"){
        this.versionOptions=res.data.data
        this.form.version=this.versionOptions[this.versionOptions.length-1]
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.directoryName.indexOf(value) !== -1;
    },
    // 获取报告下载接口数据
    async getReport() {
      let params = this.rowData.id;
      let res = await getReportList(params);
      // console.log(res);
      if (res.status === 200) {
        this.$notify({
          title: "成功",
          message: "正在下载审查报告，请稍后...",
          type: "success"
        });
        // console.log();
        fileDownload(res.data, "成果审核结果附件.doc");
      } else {
        this.$notify.error({
          title: "错误",
          message: "审查报告下载失败，请联系管理员"
        });
      }
    },
    // 查看审核报告
    showReport() {
      this.getReport();
    },
    async TreeData() {
      let params = {
        achievementType: this.rowData.taskType,
        taskObjId: this.rowData.id,
        version:this.form.version
      };
      let res = await treeDataList(params);
      if (res.data.msg === "执行成功") {
        this.treeData = this.handleTreeData(res.data.data);
      }
    },
    // 处理后台返回的树形数据以便展示
    handleTreeData(data) {
      let map = {};
      let result = [];
      data.forEach(item => {
        map[item.id] = item;
      });

      data.forEach(item => {
        let parent;
        if (item.parentId) {
          parent = map[item.parentId];
        }
        if (parent) {
          // 有父级就push到父级的children中
          (parent.children || (parent.children = [])).push(item);
        } else {
          // 没有父级就push到当前数组
          result.push(item);
        }
      });
      data.forEach(item => {
        if (item.metadataList != null) {
          item.children = item.metadataList;
          item.children.forEach(items => {
            items.directoryName = items.filename;
          });
        }
      });
      this.pdfSrc=result[0].children[0].children[0].children[0].fileUrl
      return result;
    },
    handleNodeClick(obj, node, self) {
      // console.log(obj, node, self);
      // 主要是第4层节点的操作
      if (node.level === 4) {
        this.pdfSrc = obj.fileUrl;
      }
    },
    resetQuery() {
      // 重置查询
      this.treeKeyword = "";
      this.TreeData();
    },

    goAchievementList() {
      // 返回审查进度页面
      this.$router.push({ name: "manage" });
    }
  }
};
</script>

<style lang="less" scoped>
.audit-task-tree {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    height: 50px;
    .query {
      margin-top: 23px;
      text-align: center;
    }
  }
  .select-icon {
    margin: 10px;
  }

  .p-bottom {
    display: flex;
    background: #f5f5f5;
    padding: 0;
    margin-top: 0;
    height: 100%;
    .left {
      width: 374px;
      // height: 812px;
      height: 100%;
      background-color: #ffffff;
      margin-right: 15px;
      .title {
        line-height: 64px;
        height: 64px;
        margin: 0 9px 10px 31px;
        border-bottom: 1px dashed #e8e8e8;
        h1 {
          font-family: MicrosoftYaHei;
          font-size: 18px;
          font-weight: bold;
          font-stretch: normal;
          color: #454954;
          margin: 0;
        }
      }
      .tree {
        margin-left: 25px;
        height: calc(100% - 100px);
        .my-tree {
          // 给树最里层加竖线
          height: calc(100% - 112px);
          overflow-y: auto;
          // margin-top: 20px;
          .custom-tree-node {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .circle {
            position: relative;
          }
          .circle:before {
            content: "";
            height: 20px;
            position: absolute;
            top: 14px;
            left: -15px;
            border-left: 1px dashed #dddddd;
          }
        }
        .tree-query {
          .el-button {
            width: 60px;
            padding: 12px 12px;
            border-radius: 0;
          }
        }
        .version {
          margin-top: 15px;
        }
      }
    }

    .right {
      width: calc(100% - 389px);
      background: #f5f5f5;
      .nav {
        // padding: 6px 10px;
        padding-right: 20px;
        height: 50px;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .tabs {
          width: 75%;
        }
        .btn {
          width: 25%;
          text-align: right;
          .el-button {
            padding: 10px;
            height: 36px;
          }
          img {
            margin-right: 7px;
            margin-bottom: 2px;
          }
        }
      }
      .content {
        background: #fff;
        margin-top: 20px;
        height: calc(100% - 70px);
        position: relative;
        .container {
          height: calc(100% - 69px);
          overflow: auto;
          background-color: #3d4143;
        }
        .img-title {
          height: 47px;
          background-color: #32363a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 27px;
          .title {
            text-align: center;
            margin: 0;
            line-height: 69px;
            font-size: 14px;
            color: #ffffff;
          }
          span {
            color: #fff;
          }
          .operation {
            img {
              margin-right: 41px;
              width: 14px;
              height: 15px;
              cursor: pointer;
            }
          }
        }
        .pdf-container {
          height: 100%;
          .operation {
            position: absolute;
            right: 55px;
            bottom: 35px;
            z-index: 9999;
            img {
              margin-right: 16px;
              cursor: pointer;
            }
            img:last-child {
              margin-right: 0;
            }
          }
        }
        .container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          background-color: #fff;
        }
        /*定义滚动条轨道 内阴影+圆角*/
        .container::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
          border-radius: 10px;
          background-color: #fff;
        }
        /*定义滑块 内阴影+圆角*/
        .container::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #eeeeee;
        }

        .table-title {
          position: relative;
          .type {
            position: absolute;
            left: 30px;
            top: 18px;
            margin: 0;
            img {
              margin-right: 13px;
            }
          }
          .title {
            text-align: center;
            margin: 0;
            line-height: 69px;
            font-size: 16px;
            color: #6f7583;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.query {
  .el-input--prefix .el-input__inner {
    padding-left: 50px;
  }
  .el-input-inner {
    border-radius: 0;
  }
}
.my-tree {
  .el-tree-node__content {
    height: 35px;
  }
  .el-tree-node__content:hover {
    background-color: #e6f1ff;
  }
  .el-tree-node__label {
    color: #454954;
    margin-left: 10px;
  }

  /*/ / 动画取消*/
  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  /*/ / 收起*/
  .el-icon-caret-right:before {
    font-size: 18px;
    content: url("../../assets/imgs/unfolded.png"); /*具体的图标*/
  }
  /*/ / 展开*/
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    font-size: 18px;
    content: url("../../assets/imgs/expand.png"); /*具体的图标*/
  }
  // 最后一个叶子节点不展示图标
  .el-tree-node__expand-icon.is-leaf.el-icon-caret-right:before {
    font-size: 18px;
    content: ""; /*具体的图标*/
  }

  // 给树加上竖线
  .el-tree-node__children {
    position: relative;
    padding-left: 31px; // 缩进量
    // border-left: 1px dashed red;
  }
  // 竖线
  .el-tree-node__children:before {
    content: "";
    // height: 90%;
    height: 100%;
    position: absolute;
    // left: 27px;
    // top: 30px;
    left: 10px;
    top: 0;
    border-width: 1px;
    border-left: 1px dashed#dddddd;
  }
}
.tree-query {
  .el-input--prefix .el-input__inner {
    padding-left: 38px;
  }
}
</style>
