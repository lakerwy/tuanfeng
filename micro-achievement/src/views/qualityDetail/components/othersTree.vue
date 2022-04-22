<template>
  <div class="treeBox">
    <div class="left">
      <div class="title">
        <h1>规划成果审查任务一棵树</h1>
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
                src="../../../assets/imgs/query-gray.png"
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
                node.data.filetype === 'PDF'
                  ? require('../../../assets/imgs/PDF.png')
                  : ''
              ]"
              alt=""
            />
            <img
              :src="[
                node.data.filetype === 'DWG'
                  ? require('../../../assets/imgs/dwg.png')
                  : ''
              ]"
              alt=""
            />
            <img
              :src="[
                node.data.filetype === 'XLS' || node.data.filetype === 'XLSX'
                  ? require('../../../assets/imgs/xls.png')
                  : ''
              ]"
              alt=""
            />
            <img
              :src="[
                node.data.filetype === 'TXT'
                  ? require('../../../assets/imgs/txt.png')
                  : ''
              ]"
              alt=""
            />
            <img
              :src="[
                node.data.filetype === 'JPG'
                  ? require('../../../assets/imgs/jpg.png')
                  : ''
              ]"
              alt=""
            />
            <img
              :src="[
                node.data.filetype === 'MDB'
                  ? require('../../../assets/imgs/mdb.png')
                  : ''
              ]"
              alt=""
            />
            <img
              :src="[
                node.data.filetype === 'GDB'
                  ? require('../../../assets/imgs/gdb.png')
                  : ''
              ]"
              alt=""
            />
            <!-- {{node.data.filetype}} -->
            <span
              :class="{ circle: node.level === 4 || node.level === 3 }"
              style="margin-left: 10px;"
              :title="node.label"
              >{{ node.label }}</span
            >
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { treeDataList } from "../../../api/auditTaskOthers";
export default {
  data() {
    return {
      treeData: [],
      treeKeyword: "",
      form: {},
      currentTask: sessionStorage.getItem("currentTask")
        ? JSON.parse(sessionStorage.getItem("currentTask"))
        : {},
      defaultProps: {
        label: "directoryName"
      },
      rowData: JSON.parse(sessionStorage.getItem("rowData"))
    };
  },
  mounted() {
    this.TreeData();
  },
  watch: {
    treeKeyword(val) {
      this.$refs.taskTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.directoryName.indexOf(value) !== -1;
    },
    async TreeData() {
      let params = {
        achievementType: this.rowData.taskType,
        taskObjId: this.rowData.id
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
      // console.log(data)
      data.forEach(item => {
        if (item.metadataList != null) {
          item.children = item.metadataList;
          item.children.forEach(items => {
            items.directoryName = items.filename;
          });
        }
      });
      if (this.rowData.taskType != 3) {
        this.$parent.pdfSrc =
          result[0].children[0].children[0].children[0].fileUrl;
      } else {
        this.$parent.pdfSrc = result[0].children[0].children[0].fileUrl;
      }
      return result;
    },
    handleNodeClick(obj, node, self) {
      // console.log(obj, node, self);
      if (obj.filetype) {
        this.$parent.pdfSrc = obj.fileUrl;
      }
    },
    queryTreeData() {
      // 查询成果目录树
      this.TreeData();
    },
    resetQuery() {
      // 重置查询
      this.treeKeyword = "";
      this.TreeData();
    }
  }
};
</script>

<style lang="less" scoped>
.treeBox {
  width: 25%;
  display: flex;
  background: #f5f5f5;
  padding: 0;
  margin-right: 16px;
  .left {
    // width: 100%;
    width: 400px;
    height: 100%;
    background-color: #ffffff;
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
        height: calc(100% - 65px);
        overflow-y: auto;
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
        margin-bottom: 20px;
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
    content: url("../../../assets/imgs/unfolded.png"); /*具体的图标*/
  }
  /*/ / 展开*/
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    font-size: 18px;
    content: url("../../../assets/imgs/expand.png"); /*具体的图标*/
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
