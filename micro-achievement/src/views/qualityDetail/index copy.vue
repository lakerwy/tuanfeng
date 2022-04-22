<template>
  <!-- 成果质检 审查任务详情页面 -->
  <div class="quality-detail">
    <div class="p-top">
      <div class="query">
        <div class="taskName">
          <span class="taskName-one"></span> <i></i>
          <span class="taskName-two">
             成果名称：{{ rowData.taskName }}
          </span>
        </div>
        <div v-if="isShowDetails">
          <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in auditTypes"
              :label="item.label"
              :name="item.name"
              :key="item.name"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="btn">
          <el-button type="primary" plain @click="goTasktList">
            <!-- <img src="../../assets/imgs/icon-less.png" alt="" /> -->
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
      <othersTree v-if="currentTab == '0'"></othersTree>
      <template v-if="isShowDetails">
        <template v-if="type == '12'">
          <left-detail
            :dataList="dataList"
            :type="type"
            v-if="activeTab == 0 && dataList.length > 0"
            ref="child"
          />
          <left-detail1
            :dataList="dataList"
            :type="type"
            v-if="activeTab == 1 && dataList.length > 0"
            ref="child"
          />
          <left-detail3
            :dataList="dataList"
            :type="type"
            v-if="activeTab == 2 && dataList.length > 0"
            ref="child"
          />
          <left-detail4
            :dataList="dataList"
            :type="type"
            v-if="activeTab == 3 && dataList.length > 0"
            ref="child"
          />
        </template>
        <template v-else>
          <left-detail :dataList="dataList" v-if="activeTab == 0" ref="child" />
          <left-detail1
            :dataList="dataList"
            v-if="activeTab == 1"
            ref="child"
          />
          <left-detail3
            :dataList="dataList"
            v-if="activeTab == 2"
            ref="child"
          />
          <left-detail4
            :dataList="dataList"
            v-if="activeTab == 3"
            ref="child"
          />
        </template>
        <!-- <left-detail2 v-else-if="activeTab == 2" ref="child" /> -->
        <!-- <left-detail5 v-else-if="activeTab == 5" ref="child" />
      <left-detail6 v-else-if="activeTab == 6" ref="child" /> -->
      </template>
        <!-- <image-text v-if="isShow" :pdfSrc="pdfSrc" />
        <div v-else class="mdb">
          <template v-if="isMdb">
            <image-mdb :mdbId="mdbId" />
          </template>
          <image-gdb :mdbUrl="mdbUrl" v-else />
        </div> -->

      <template v-if="currentTab == '0'">
        <image-text v-if="isShow" :pdfSrc="pdfSrc" />
        <div v-else class="mdb">
          <template v-if="isMdb">
            <image-mdb :mdbId="mdbId" />
          </template>
          <image-gdb :mdbUrl="mdbUrl" v-else />
        </div>
      </template>
      <template v-if="currentTab == '1'">
        <table1 :rowData="rowData"></table1>
      </template>
      <template v-if="currentTab == '2'">
        <table2 :rowData="rowData"></table2>
      </template>
    </div>
  </div>
</template>

<script>
import othersTree from "./components/overAllTree";
import leftDetail from "../../components/detail/indexOverAll";
import leftDetail1 from "../../components/detail/indexOverAll1";
// import leftDetail2 from "../../components/detail/indexOverAll2";
import leftDetail3 from "../../components/detail/indexOverAll3";
import leftDetail4 from "../../components/detail/indexOverAll4";
import leftDetail5 from "../../components/detail/indexOverAll5";
import leftDetail6 from "../../components/detail/indexOverAll6";
import imageText from "./components/imageTextOthers";
import imageMdb from "./components/imageMdb";
import table1 from "./components/tableTsyzx";
import table2 from "./components/tableZbfhx";
import imageGdb from "./components/imageGdbDetails";
import {
  getReportList,
  getApproveList,
  getStateList
} from "../../api/auditTaskOthers.js";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      mdbUrl: "",
      mdbId: "",
      isShow: true,
      isMdb: true,
      isShowDetails: true,
      activeTab: "0",
      auditTypes: [
        { label: "图文一致性审查", name: "0" },
        { label: "图数一致性审查", name: "1" },
        // { label: "表述规范性辅助审查", name: "2" },
        { label: "指标符合性审查", name: "2" },
        { label: "空间布局符合性审查", name: "3" }
        // { label: "规划冲突检查", name: "5" },
        // { label: "成果完整性检查", name: "6" }
      ],
      pdfSrc: "",
      currentTab: '0',
      approveReqList: [
        {
          attachmentDescription: "",
          attachmentId: "",
          remarks: "",
          status: null,
          approveType: 0
        },
        {
          attachmentDescription: "",
          attachmentId: "",
          machineCheck: "",
          remarks: "",
          status: null,
          approveType: 1
        },
        // {
        //   attachmentDescription: "",
        //   attachmentId: "",
        //   remarks: "",
        //   status: null,
        //   approveType: 2
        // },
        {
          attachmentDescription: "",
          attachmentId: "",
          machineCheck: "",
          remarks: "",
          status: null,
          approveType: 2
        },
        {
          attachmentDescription: "",
          attachmentId: "",
          remarks: "",
          status: null,
          approveType: 3
        },
        {
          attachmentDescription: "",
          attachmentId: "",
          remarks: "",
          status: null,
          approveType: 5
        },
        {
          attachmentDescription: "",
          attachmentId: "",
          remarks: "",
          status: null,
          approveType: 6
        }
      ],
      query: [],
      tableData: [],
      queryData: {
        taskObjId: "",
        approveList: []
      },
      rowData: JSON.parse(sessionStorage.getItem("rowData")),
      dataList: [],
      type: this.$route.params.type
    };
  },
  components: {
    leftDetail,
    leftDetail1,
    // leftDetail2,
    leftDetail3,
    leftDetail4,
    leftDetail5,
    leftDetail6,
    imageText,
    imageMdb,
    imageGdb,
    othersTree,
    table1,
    table2,
  },
  mounted() {
    // console.log(this.currentTab)
    this.handleClick(this.auditTypes[0]);
    if (this.type == "12") {
      this.getState();
    }
  },
  watch: {
    approveReqList: {
      handler(newVal, oldVal) {
        newVal.forEach(item => {
          if (item.status !== null) {
            this.query.push(item);
            var result = [];
            var obj = {};
            for (var i = 0; i < this.query.length; i++) {
              if (!obj[this.query[i].approveType]) {
                result.push(this.query[i]);
                obj[this.query[i].approveType] = true;
              }
            }
            // console.log(result)
            this.query = result;
            if (this.query.length === 4) {
              this.getQueryData();
            }
          }
        });
      },
      deep: true
    }
  },
  methods: {
    async getQueryData() {
      this.queryData.approveList = this.query;
      this.queryData.taskObjId = this.rowData.id;
      let params = this.queryData;
      let res = await getApproveList(params);
      if ((res.data.msg = "执行成功")) {
        this.$alert(
          "您已经全部审核完成，点击确定跳转至任务列表页面",
          "审核完成",
          {
            confirmButtonText: "确定",
            callback: () => {
              this.$router.push({ name: "taskManage" });
            }
          }
        );
      }
    },
    async getState() {
      let params = this.rowData.id;
      let res = await getStateList(params);
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
      // console.log(val);
      // tab点击
      this.currentTab = val.name;
      if (this.approveReqList[val.name].status != null) {
        this.$nextTick(() => {
          this.$refs.child.isBtn = false;
          this.$refs.child.isUpload = false;
          if (this.approveReqList[val.name].status == 1) {
            this.$refs.child.isPass = true;
          } else {
            this.$refs.child.isPass = false;
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mdb {
  width: 100%;
}
.quality-detail {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    padding-top: 5px;
    .query {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .taskName {
        i {
          padding-left: 8px;
        }
        &-one {
          padding-left: 5px;
          background: #3e6efa;
          font-size: 17px;
        }
        &-two{
          padding-left: 3px;
          font-size: 16px;
        }
      }
      .el-button {
        // margin-top: -15px;
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
    width: calc(100% - 425px);
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
