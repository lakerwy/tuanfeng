<template>
  <!-- 成果质检 审查任务详情页面 -->
  <div class="quality-detail">
    <div class="p-top">
      <div class="query">
       <div class="taskName"><span></span>
            <i></i>成果名称：{{rowData.taskName}}</div>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in auditTypes"
            :label="item.label"
            :name="item.name"
            :key="item.name"
          >
          </el-tab-pane>
        </el-tabs>
        <div class="btn">
          <el-button type="primary" plain @click="goTasktList">
            <img src="../../assets/imgs/icon-less.png" alt="" />
            <span>返回任务列表</span>
          </el-button>
          <!-- <el-button type="primary" style="width: 127px;height: 36px;padding: 0;" @click="showReport">
            <img src="../../assets/imgs/query-white.png" alt="">
            <span>查看审查报告</span>
          </el-button> -->
        </div>
      </div>
    </div>
    <div class="p-bottom">
      <othersTree></othersTree>
      <template v-if="isShowDetails">
        <template v-if="type == '12'">
          <left-detail :type="type"
            :dataList="dataList"
            v-if="dataList.length > 0"
            :currentTab="currentTab"
          />
        </template>
        <template v-else>
          <left-detail :currentTab="currentTab" />
        </template>
      </template>
      <image-text :pdfSrc="pdfSrc" />
    </div>
  </div>
</template>

<script>
import othersTree from "./components/othersTree";
import leftDetail from "../../components/detail/indexOthers";
import imageText from "./components/imageTextOthers";
import { getReportList, getStateList } from "../../api/auditTaskOthers.js";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      dataList: [],
      isShowDetails: true,
      activeTab: "0",
      auditTypes: [{ label: "村庄规划审查", name: "0" }],
      pdfSrc: "",
      currentTab: {},
      rowData: JSON.parse(sessionStorage.getItem("rowData")),
      type: this.$route.params.type
    };
  },
  components: {
    leftDetail,
    imageText,
    othersTree
  },
  mounted() {
    console.log(this.type);
    this.handleClick(this.auditTypes[0]);
    if (this.type != "11") {
      this.getState();
    }
  },
  methods: {
    async getState() {
      let params = this.rowData.id;
      let res = await getStateList(params);
      console.log(res.data.data);
      if (res.data.data.length == 0) {
        this.isShowDetails = false;
      } else {
        this.dataList = res.data.data;
      }
    },
    goTasktList() {
      // 返回成果质检任务页面
      this.$router.push({ name: "taskManage" });
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
    handleClick(val) {
      // tab点击
      this.currentTab = val;
      // console.log(this.currentTab, "tab");
    }
  }
};
</script>

<style lang="less" scoped>
.quality-detail {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    .query {
      display: flex;
      justify-content: space-between;
      align-items: center;
            .taskName{
         i{
            padding-left: 8px;
          }
          span{
            padding-left: 3px;
            background:#3e6efa;
          }
      }
      .el-button {
        margin-top: -15px;
        img {
          margin-right: 5px;
        }
      }
    }
  }
  .p-bottom {
    padding: 0;
    background: #f5f5f5;
    height: calc(100% - 100px);
    display: flex;
  }
  .right {
    width: calc(100% - 495px);
    margin-left: 16px;
    height: 100%;
    background: #fff;
  }
  .pdf-con {
    width: 674px;
    height: 100%;
    background: #fff;
    margin-right: 16px;
    overflow-y: auto;
  }
  .map-con {
    width: calc(100% - 674px);
    height: 100%;
    background: #fff;
    position: relative;
  }
  .image-text {
    background: #f5f5f5;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>

<style lang="less">
.quality-detail {
  .el-tabs__nav-wrap::after {
    height: 0;
  }
  .el-tabs__active-bar {
    width: 0 !important;
  }
  .el-tabs__item {
    padding: 0;
    margin: 0 20px;
  }
  .el-tabs__item.is-active {
    border-bottom: 3px solid #409eff;
  }
}
</style>
