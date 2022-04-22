<template>
  <!-- 成果质检 审查任务详情页面 -->
  <div class="quality-detail">
    <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"
          ><span class="old-path">成果审查</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span class="old-path">成果质检</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/manage' }"
          ><span class="old-path">成果审查</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span class="current-path">审查任务详情</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span class="current-path">专项规划审查</span></el-breadcrumb-item
        >
      </el-breadcrumb> -->
      <div class="query">
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
        </div>
      </div>
    </div>
    <div class="p-bottom">
      <othersTree></othersTree>
      <left-detail :currentTab="currentTab" />
      <image-text :pdfSrc="pdfSrc" />
    </div>
  </div>
</template>

<script>
import othersTree from "./components/othersTree";
import leftDetail from "../../components/detail/indexOthers";
import imageText from "./components/imageTextOthers";
import { getReportList } from "../../api/auditTaskOthers.js";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      activeTab: "0",
      auditTypes: [{ label: "专项规划审查", name: "0" }],
      pdfSrc:"http://image.cache.timepack.cn/nodejs.pdf",
      currentTab: {},
      rowData: JSON.parse(sessionStorage.getItem("rowData"))
    };
  },
  components: {
    leftDetail,
    imageText,
    othersTree
  },
  mounted() {
    this.handleClick(this.auditTypes[0]);
  },
  methods: {
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
