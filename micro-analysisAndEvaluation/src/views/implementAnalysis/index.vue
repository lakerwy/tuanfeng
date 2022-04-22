<template>
<!-- 实施评估-->
  <div class="audit-task-tree">
    <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><span class="old-path">分析评价</span></el-breadcrumb-item>
        <el-breadcrumb-item><span class="old-path" :to="{ path: '/implement' }">国土空间规划实施评估</span></el-breadcrumb-item>
        <el-breadcrumb-item><span class="current-path">{{currentContent.label}}</span></el-breadcrumb-item>
      </el-breadcrumb> -->
      <div class="query">
        <el-input v-model="keyword" placeholder="请输入关键字">
          <i slot="prefix">
            <img src="../../assets/imgs/query-gray.png" alt class="select-icon" />
          </i>
        </el-input>
        <el-button style="width: 90px;border-radius: 0;" type="primary" @click="searchName">搜索</el-button>
      </div>
    </div>
    <div class="p-bottom">
      <div class="left">
        <div class="title">
          <h1>国土空间规划实施评估</h1>
        </div>
        <div class="tree">
          <!-- <div class="tree-query">
            <el-input style="width: 204px;" v-model="treeKeyword" placeholder="请输入关键字查询">
              <i slot="prefix">
                <img src="../../assets/imgs/query-gray.png" alt class="select-icon" style="width: 14px;height: 15px;margin: 14px;" />
              </i>
            </el-input>
            <el-button type="primary" @click="queryTreeData">确定</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </div> -->
          <el-tree
            ref="tree"
            class="my-tree"
            :data="treeData"
            :props="defaultProps"
            :load="loadTreeNode"
            lazy
            node-key="id"
            :indent="0"
            :default-expanded-keys="defaultExpandedKey"
            :default-expand-all="false"
            @node-click="handleNodeClick"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <img :src="[node.level === 2 ? require('../../assets/imgs/circle.png') : '']" alt="">
              <span :class="{circle:node.level === 2}" style="margin-left: 10px;" :title="node.label">{{node.label}}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="right">
        <div class="right-header">
          <div class="current">
            <span>
              <img style="margin-right: 12px;" src="../../assets/imgs/checked.png" alt="">
              <span>当前选中：<span class="active text" :title="currentContent.label">{{currentContent.label}}</span></span>
            </span>
            <span  class="c-item">所属类别：<span class="active text" :title="parentContent.label">{{parentContent.label}}</span></span>
            <span class="c-item">包含评估成果：<span class="active">{{total}}个</span></span>
          </div>
          <div class="operation">
            <!-- <span class="btn" title="一键生成报告">
              <img src="../../assets/imgs/report.png" alt="">
              <span class="active">一键生成报告</span>
            </span> -->
            <span class="c-item btn" title="新增评估">
              <img src="../../assets/imgs/add-ana.png" alt="">
              <span class="active" @click="handleClick('add')">新增评估</span>
            </span>
            <span v-if="newObj" class="c-item btn" title="编辑评估">
              <img src="../../assets/imgs/edit.png" alt="">
              <span class="active" @click="handleClick('edit')">编辑评估</span>
            </span>
            <span  v-if="newObj" class="c-item btn" title="删除评估">
              <img src="../../assets/imgs/delete.png" alt="">
              <span class="active" @click="handleClick('del')">删除评估</span>
            </span>
            <!-- <span class="c-item btn" title="流程说明">
              <img src="../../assets/imgs/progress.png" alt="">
              <span class="active">流程说明</span>
            </span> -->
          </div>
        </div>
        <div class="content">
          <div class="analysis-card" v-for="item in analysisLists" :key="item.id">
            <div class="title">
              <div class="type">{{item.itemname.slice(0,1)}}</div>
              <!-- <div class="type">{{(currentContent.label + '').slice(0,1)}}</div> -->
              <span>{{item.itemname}}</span>
            </div>
            <div class="desc">
              <img src="../../assets/imgs/data.png" alt="">
              <span>所需数据：<span>{{item.source}}</span></span>
            </div>
            <div class="desc">
              <img src="../../assets/imgs/code.png" alt="">
              <span>评价编号：<span>{{item.itemcode}}</span></span>
            </div>
            <div class="desc opt">
              <div>
                <img src="../../assets/imgs/time.png" alt="">
                <span>创建时间：<span>{{item.createtime ? dateFormatter(item.createtime) : ''}}</span></span>
              </div>
              <div>
                <el-button style="height: 32px;padding: 6px 20px;" type="primary" plain @click="showDetail(item)">预览</el-button>
                <!-- <el-button style="height: 32px;padding: 6px 20px;" type="danger" plain>删除</el-button> -->
              </div>
            </div>
          </div>
            <el-pagination
              background
              style="margin-top: 20px; text-align: right;"
              layout="prev, pager, next"
              :current-page="currentPage"
              :hide-on-single-page="true"
              :page-size="pageSize"
              :total="total"
              @current-change="handleCurrentChange">
            </el-pagination>
        </div>
      </div>
    </div>

    <!-- 新增评估 -->
    <el-dialog
      class="implement-dialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      top="20vh"
      @close="handleClose">
      <el-form ref="elform" label-position="right" label-width="120px" :model="form" :rules="formRule">
        <el-form-item label="评估名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="关联指标">
          <div>
            <!-- <el-table :data="tableData">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="itemname" label="指标名称"></el-table-column>
              <el-table-column prop="itemcode" label="指标编号" width="200px"></el-table-column>
            </el-table> -->
            <el-transfer
              ref="transfer"
              filterable
              filter-placeholder="请输入指标名称"
              :titles="['指标', '已选择']"
              v-model="selectEva"
              :data="tableData"
              :props="{key: 'id', label: 'itemname'}">
            </el-transfer>
            <!-- <el-pagination
              background
              style="margin-top: 20px;"
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              @current-change="handleCurrentChange">
            </el-pagination> -->
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="form = {}">重 置</el-button>
        <el-button type="primary" @click="submitData">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myMap from '../../components/map/index'
import { getTreeData, geTreeDataChild,  getEvaluateData, getKpiList, addEvaluate, updateEvaluate, delEvaluate, getItemSearch } from '../../api/implement'
import { dateFormatter } from '../../js/utils/util'

export default {
  components: {
    myMap
  },
  data() {
    return {
      newObj:false,
      treeData: [],
      keyword:"",
      defaultExpandedKey: [],
      defaultProps: {
        // label: (data, node) => {
        //   if(node.level === 1) {
        //     return data.eval.name
        //   } else if(node.level === 2) {
        //     return data.itemname
        //   }
        // },
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      pageNum: 1,
      pageTotalNum: 2,
      numPages:2,
      treeKeyword: '',
      viewer: null,
      mapId: 'map',
      imgId: 'image',
      image: null,
      isAudit: false,
      analysisLists: [],
      currentContent: '',
      parentContent: '',
      form: {
        name: ''
      },
      formRule: {
        name: [
          { required: true, message: '评估名称不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '评估名称为2到50个字符'},
          { pattern: /^[^\s]*$/, message: '评估名称不能输入空格'}
        ]
      },
      anaOptions: [],  // 选择评估关联的分析
      dialogTitle: '',
      dialogVisible: false,
      tableData: [
        // {itemname: 'xxxxx', itemcode: 'A123'}
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectEva: [], // 选择的指标名称
      submitType: '',
    }
  },
  computed: {
  },
  created() {
    // this.getNumPages()
  },
  mounted() {

  },
  watch: {

  },
  mounted() {
    this.initTreeData();
    this.searchName();
  },
  methods: {
    async initTreeData() {
      // 初始化数据 成果目录树
     let params = {
       name: ''
     };
      let res = await getTreeData(params);
      let { code, data } = res;
      if (code === 200) {
        this.treeData = data;
        // this.$nextTick(() => {
        //   // 默认展开的节点
        //   // 判断是不是从预览跳转过来的，如果是则当前展开的节点是之前的节点，否则就是第一个节点
        //   let expand = this.$route.params.current || this.treeData[0].itemList[0];
        //   let expandId = this.$route.params.current ? this.$route.params.current.id : this.treeData[0].itemList[0].id
        //   this.defaultExpandedKey = [expandId];
        //   this.$refs.tree.setCurrentKey(expandId);
        //   this.handleNodeClick(
        //     expand,
        //     this.$refs.tree.getNode(expandId)
        //   );
        // });
      }
    },
    loadTreeNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData);
      }
      if (node.level > 1) return resolve([]);
      setTimeout(async () => {
        this.getEvaluateData(node.data.id);
        let params = {
          id: node.data.id
        };
        let res = await geTreeDataChild(params);
        if (res.code == 200) {
          this.total=res.data.length
          res.data.forEach(item => {
            item.name = item.itemname
            item.leaf = true;
          })
          resolve(res.data);
        }else {
          resolve([]);
        }
        // resolve(data);
      }, 500);
    },
    handleTreeData(data) {
      // 处理后台返回的树形数据以便展示
      let map = {};
      let result = [];
      data.forEach((item) => {
        map[item.id] = item;
      });
      data.forEach((item) => {
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
      return result;
    },
    queryTreeData() {
      // 查询成果目录树
      this.initTreeData();
    },
    resetQuery() {
      // 重置查询
      this.treeKeyword = '';
      this.initTreeData();
    },
    handleNodeClick(obj, node, self) {
      // 点击节点的方法，
      // console.log(obj, node, self)
      if(obj){
        this.newObj=true
      }
      this.currentContent = node;
      this.parentContent = node.level === 1 ? node : node.parent;
      if(node.level === 1) {
        // 如果是一级节点就加载子项第一个数据
        let temp = node.childNodes[0]
        this.getEvaluateData(node.data.itemid);
      } else {
        this.getEvaluateData(this.currentContent.data.itemid);
      }
    },
    async getEvaluateData(id) {
      this.total = 0;
      if (!id) return;
      // 获取评估的详情数据
      this.analysisLists = [];
      let params = {
        id: id
      }
      let that = this;
      let res = await getEvaluateData(params);
      let { code, data } = res;
      if(code === 200) {
        // that.analysisLists = data;
        if(data.item) {
          that.analysisLists.push(data.item)
          this.total = 1;
        }
      }
    },
    showDetail(item) {
      // 预览
      // if(this.analysisLists.update.monitorNum !== null ) {
      //   sessionStorage.setItem('evaluate', JSON.stringify(this.analysisLists));
      //   sessionStorage.analyKipid = this.analysisLists.update.kpiid
      //   this.$router.push({name: 'implDetail'})
      // } else {
      //   this.$message.info('没有配置指标更新！');
      // }
      if (item.itemcode) {
        sessionStorage.setItem('evaluate', JSON.stringify(this.analysisLists));
        sessionStorage.analyKipid = item.itemcode;
        this.$router.push({name: 'implDetail'})
      }
    },
    async getTableData() {
      // 获取所有指标信息
      let params = {
        // currentPage: this.currentPage,
        // pageSize: this.pageSize,
      }
      let res = await getKpiList(params);
      let { code, data} = res;
      if(code === 200) {
        this.tableData = data;
      }
    },
    handleCurrentChange(val) {
      // 分页获取数据
      this.currentPage = val;
      this.searchName();
    },
    handleClick(type) {
      // 处理操作事件
      this.submitType = type;
      switch(type) {
        case 'add':
          this.dialogTitle = '新增评估';
          this.dialogVisible = true;
          this.getTableData();
          break;
        case 'edit':
          this.selectEva = [];
          this.dialogTitle = '编辑评估';
          this.dialogVisible = true;
          this.form = Object.assign({}, this.parentContent.data);
          // 现有的指标初始化
          this.parentContent.childNodes.map(item => {
            this.selectEva.push(item.data.itemid);
          })
          this.getTableData();
          break;
        case 'del':
          this.deleteData();
          break;
        default:
          break;
      }
    },
    async submitData() {
      // 提交表单数据
      switch(this.submitType) {
        case 'add':
          {
            console.log(this.selectEva, 'selectEva');
            this.$refs.elform.validate(async (valid) => {
              if (valid) {
                let params = {
                  eval: {
                    name: this.form.name
                  },
                  list: this.selectEva
                }
                let res = await addEvaluate(params);
                let { code, msg } = res;
                if(code === 200) {
                  this.$message.success('添加成功！');
                  this.dialogVisible = false;
                  this.initTreeData();
                } else {
                  this.$message.error(msg);
                }
              }
            })
          }
          break;
        case 'edit':
          {
            console.log(this.selectEva, 'selectEva');
            this.$refs.elform.validate(async (valid) => {
              if (valid) {
                let params = {
                  eval: this.form,
                  list: this.selectEva
                }
                let res = await updateEvaluate(params);
                let { code, msg } = res;
                if(code === 200) {
                  this.$message.success('编辑成功！');
                  this.dialogVisible = false;
                  this.initTreeData();
                } else {
                  this.$message.error(msg);
                }
              }
            })
          }
          break;
        default:
          break;
      }
    },
    deleteData() {
      this.$confirm('确定要删除该条评估信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(this.parentContent.data)
        let params = {
          id: this.parentContent.data.id
        };
        let res = await delEvaluate(params);
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.newObj=false
          this.initTreeData();
          this.searchName();
        }else {
        this.$message({
          type: 'info',
          message: res.msg
        });
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleClose() {
      // 弹框关闭的回调函数
      this.form = {};
      this.selectEva = [];
      this.$refs.transfer.clearQuery('left');
      this.$refs.transfer.clearQuery('right');
      this.$refs.elform.resetFields();
    },
    dateFormatter(val) {
      return dateFormatter(val)
    },
    async searchName() {
      this.currentContent = {};
      this.parentContent = {};
      let params = {
        name: this.keyword,
        page: this.currentPage,
        size: this.pageSize
      };
      let res = await getItemSearch(params);
      let { code, data } = res;
      if (code == 200) {
        this.analysisLists = data.records;
        this.total = data.total;
      }else {

      }
    }
  }
}
</script>

<style lang="less" scoped>
.audit-task-tree {
  background: #f5f5f5;
  height: 100%;
  overflow-y: hidden;
  .p-top {
    .query {
      // margin-top: 23px;
      text-align: center;
      .el-input {
        width: 512px;
      }
    }
  }
  .select-icon {
    margin: 10px;
  }

  .p-bottom {
    display: flex;
    background: #f5f5f5;
    padding: 0;
    .left {
      width: 374px;
      // height: 812px;
      height: 100%;
      background-color: #ffffff;
      margin-right: 15px;
      .title {
        line-height: 64px;
        height: 64px;
        margin:  0 9px 0 31px;
        // border-bottom: 1px dashed #e8e8e8;
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
        padding-left: 25px;
        height: calc(100% - 0px);
        background-color: #ffffff;
        .my-tree {
          // 给树最里层加竖线
          height: calc(100% - 20px);
          margin-top: 18px;
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
            content: '';
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
      }
    }

    .right {
      width: calc(100% - 389px);
      height: 100%;
      background: #fff;
      .right-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        height: 65px;
        line-height: 65px;
        border-bottom: solid 1px #dddddd;
        color: #454954;
        .active {
          color: #1890ff;

        }
        .text {
          display: inline-block;
          width: 230px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          margin-bottom: -27px;
        }
        img {
          vertical-align: middle;
          margin-bottom: 2px;
          margin-right: 6px;
        }
        .c-item {
          margin-left: 15px;
        }
        .operation {
          .btn {
            cursor: pointer;
          }
        }
      }
      .content {
        margin-top: 16px;
        width: 100%;
        height: calc(100% - 5px);
        background-color: #ffffff;
        overflow-y: auto;
        padding-bottom: 20px;
        .analysis-card {
          // height: 165px;
          padding-left: 24px;
          margin-top: 10px;
          border-bottom: 1px solid #e8e8e8;
          .title {
            .type {
              width: 30px;
              height: 30px;
              border-radius: 15px;
              background-color: #8fbbe3;
              display: inline-block;
              text-align: center;
              line-height: 30px;
              color: #fff;
              margin-right: 20px;
            }
            span {
              font-size: 16px;
              color: #454954;
            }
          }
          .desc {
            color: #6f7583;
            padding-left: 50px;
            padding-right: 20px;
            line-height: 40px;
            img {
              margin-right: 14px;
            }
          }
          .opt {
            display: flex;
            justify-content: space-between;
            align-items: center;
            el-button {
              height: 32px;
            }
          }
        }
      }
    }
  }

  .implement-dialog {
    text-align: left;
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
    content: url('../../assets/imgs/unfolded.png');                    /*具体的图标*/
  }
  /*/ / 展开*/
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    font-size: 18px;
    content: url('../../assets/imgs/expand.png');                   /*具体的图标*/
  }
  // 最后一个叶子节点不展示图标
  .el-tree-node__expand-icon.is-leaf.el-icon-caret-right:before {
    font-size: 18px;
    content: '';                   /*具体的图标*/
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
.implement-dialog .el-dialog {
  border-radius: 12px;
}
</style>
