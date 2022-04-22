<template>
  <!-- 成果管理页面 成果审查进度 -->
  <div class="audit-progress">
    <div class="p-top">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"
          ><span class="old-path">成果审查</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/' }"
          ><span class="old-path">成果管理</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span class="current-path">审查进度</span></el-breadcrumb-item
        >
      </el-breadcrumb> -->
      <div class="query">
        <el-form
          :model="form"
          :inline="true"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="行政区级别：">
            <el-select
              clearable
              v-model="form.regionLevel"
              @change="changeRegions"
            >
              <el-option
                v-for="item in levelOption"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行政区：">
            <el-select clearable v-model="form.regions">
              <el-option
                v-for="item in regionOptionsName"
                :key="item.name"
                :label="item.name"
                :value="item.adCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select clearable v-model="form.approveStatus">
              <el-option
                v-for="item in checkOptions"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input clearable
              v-model="form.keyword"
              placeholder="请输入任务名称关键字查询"
            >
              <!-- <i slot="suffix">
                <img
                  src="../../assets/imgs/query.png"
                  alt
                  class="select-icon"
                />
              </i> -->
            </el-input>
          </el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="querys"
            >查询</el-button
          >
          <el-button style="margin-left: 20px;" @click="handleResets"
            >重置</el-button
          >
          <el-button type="primary" class="right-btn" @click="showPlanning">
            <span>查看进度布局</span>
          </el-button>
        </el-form>
      </div>
    </div>
    <div class="middle" style="margin-top:20px">
      <el-menu
        :default-active="planType"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">总体规划</el-menu-item>
        <el-submenu index="1">
          <template slot="title">详细规划</template>
          <el-menu-item index="3">村庄规划</el-menu-item>
          <el-menu-item index="2">控制性详细规划</el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- <el-radio-group v-model="planType" @change="changePlanType">
        <el-radio
          v-for="item in planTypes"
          :key="item.label"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-radio-group> -->
    </div>
    <div class="p-bottom" v-if="total != 0">
      <div class="audit-item" v-for="(item, index) in lists" :key="index">
        <div class="item-title">
          <h4>{{ regionFormatter(item.region) }}</h4>
          <div
            class="my-button"
            :class="
              item.approveStatus === 1
                ? 'success'
                : item.approveStatus === 2
                ? 'warning'
                : 'info'
            "
          >
            {{
              item.approveStatus == 1
                ? "审查通过"
                : item.approveStatus == 2
                ? "审查中"
                : "审查未通过"
            }}
          </div>
        </div>
        <div class="item-content">
          <div>
            <p>
              <span>成果名称：</span><span>{{ item.taskName }}</span>
            </p>
            <p>
              <span>组织单位：</span><span>{{ item.orgName }}</span>
            </p>
            <p>
              <span>编制单位：</span><span>{{ item.unitsName }}</span>
            </p>
            <p>
              <span>审查单位：</span
              ><span>{{
                item.approveUnitName ? item.approveUnitName : "--"
              }}</span>
            </p>
            <p>
              <span>入库日期：</span
              ><span>{{ dateFormatter(item.createTime) }}</span>
            </p>
          </div>

          <img
            :src="[
              item.approveStatus === 1
                ? require('../../assets/imgs/finished.png')
                : item.approveStatus === 2
                ? require('../../assets/imgs/checking.png')
                : require('../../assets/imgs/unchecking.png')
            ]"
            alt=""
          />
        </div>
        <el-button
          class="plan"
          :type="
            item.success === 2
              ? 'success'
              : item.success === 1
              ? 'warning'
              : 'info'
          "
          plain
          @click="achievementDetail(item)"
          >规划成果</el-button
        >
      </div>
    </div>
    <div class="noneData" v-else>暂无数据</div>
  </div>
</template>

<script>
import { getTaskOtherLists, getNodeById } from "../../api/auditTaskOthers.js";
import { getRegions } from "../../js/map/region";
import { dateFormatter } from "../../js/utils/util";
export default {
  data() {
    return {
      queryOthers: {
        pageSize: 10,
        pageIndex: 1,
        taskType: 1,
        isSubmit: 1,
        approveStatus: null, //是否通过0未通过1通过2审核中
        levels: null, //规划层级(2：县级;3：市级)
        region: null, //行政区划代码/编号
        taskName: null //任务名称
      },
      form: {},
      regionOptionsName: [],
      planType: "",
      planTypes: [
        { label: "国土空间总体规划", value: 0 },
        { label: "专项规划", value: 1 },
        { label: "详细规划", value: 2 },
        { label: "村庄规划", value: 3 }
      ],
      levelOptions: [
        { name: "县级", value: 0 },
        { name: "市级", value: 1 }
      ],
      levelOption: [
        { name: "县级", value: 2 },
        { name: "市级", value: 3 }
      ],
      planOptions: [
        { name: "县级", value: 0 },
        { name: "乡镇", value: 1 }
      ],
      checkOptions: [
        { name: "通过", value: 1 },
        { name: "不通过", value: 0 },
        { name: "未审查", value: 2 }
      ],
      regionOptions: [],
      townList: [],
      countryList: [],
      lists: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.initRegions();
  },
  mounted() {
    if (sessionStorage.getItem("planType")) {
      this.planType = JSON.parse(sessionStorage.getItem("planType"));
      this.queryOthers.taskType = JSON.parse(
        sessionStorage.getItem("planType")
      );
    } else {
      this.planType = "0";
      this.queryOthers.taskType = 0;
    }
    this.getOthersList();
  },
  methods: {
    querys() {
      // 查询
      this.getOthersList();
    },
    handleResets() {
      this.form = {};
      this.regionOptionsName=[]
      this.queryOthers.levels = null;
      this.getOthersList();
    },
    // 行政区名称下拉列表
    async getRegionData() {
      let res = await getNodeById(this.pId);
      // console.log(res);
      this.regionOptionsName = res.data.data;
    },
    // 列表
    async getOthersList() {
      this.queryOthers.region = this.form.regions;
      this.queryOthers.taskName = this.form.keyword;
      this.queryOthers.approveStatus = this.form.approveStatus;
      let params = this.queryOthers;
      let res = await getTaskOtherLists(params);
      let { records, total } = res.data.data;
      if (res.data.code === 0) {
        this.lists = records;
        this.total = total;
      }
    },
    // 主页面-选择行政区层级
    changeRegions(val) {
      if (val === 2) {
        this.queryOthers.levels = 3;
        this.pId = "15_0";
        this.getRegionData();
      } else if(val===3) {
        this.queryOthers.levels = 2;
        this.pId = "0_15";
      this.getRegionData();
      }else{
        this.form.regions=""
        this.regionOptionsName=[]
      }
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      sessionStorage.setItem("planType", JSON.stringify(key));
      this.planType = key;
      this.queryOthers.taskType = this.planType;
      this.getOthersList();
    },
    changePlanType(val) {
      sessionStorage.setItem("planType", JSON.stringify(val));
      this.planType = val;
      this.queryOthers.taskType = this.planType;
      this.getOthersList();
    },
    query() {
      // 查询
    },
    achievementDetail(data) {
      // console.log(data);
      // 审查任务一棵树
      sessionStorage.setItem("currentTask", JSON.stringify(data));
      if (this.planType === '0') {
        this.$router.push({ name: "taskTree", params: { id: data.id } });
        // } else if (this.planType === 1) {
        //   this.$router.push({ name: "taskTreeSpecial", params: { id: data.id } });
      } else if (this.planType === '2') {
        this.$router.push({ name: "taskTreeDetail", params: { id: data.id } });
      } else if (this.planType === '3') {
        this.$router.push({ name: "taskTreeVillage", params: { id: data.id } });
      }
    },
    showPlanning() {
      // 国土空间规划
      this.$router.push({ name: "planning" });
    },
    async initRegions() {
      // 初始化行政区域列表
      this.townList = await getRegions(
        window.globalUrl.districts.town.url,
        window.globalUrl.districts.town.id
      );
      this.countryList = await getRegions(
        window.globalUrl.districts.county.url,
        window.globalUrl.districts.county.id
      );
    },
    async changeRegionLevel(val) {
      // 切换行政区级别
      if (val === 0) {
        this.regionOptions = this.countryList;
      } else {
        this.regionOptions = this.townList;
      }
    },
    regionFormatter(val) {
      // 行政区格式化
      let regions = this.countryList.concat(this.townList);
      let res = regions.filter(item => {
        return item.code == val;
      });
      return res.length > 0 ? res[0].name : "";
    },
    dateFormatter(val) {
      return dateFormatter(val);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-form--inline .el-form-item__label {
  display: inline;
}
.query {
  position: relative;
  .right-btn {
    position: absolute;
    right: -5px;
  }
}
.audit-progress {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    .select-icon {
      margin: 10px;
    }
    .el-input {
      margin-left: 10px;
      margin-right: 16px;
    }
  }
  .p-middle {
    margin: 21px 30px 0;
    text-align: left;
    background: #ffffff;
    padding: 0 20px;
    height: 49px;
    line-height: 49px;
  }
  .noneData {
    height: 200px;
    line-height: 200px;
    margin: 21px 30px 0;
    background: #ffffff;
  }
  .p-bottom {
    padding: 20px;
    display: grid;
    // grid-template-columns: 1fr 1fr 1fr;
    grid-template-columns: repeat(auto-fill, 440px);
    justify-content: center;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: 18px;
    grid-row-gap: 20px;
    max-height: 811px;
    overflow-y: auto;
    .audit-item {
      padding: 0 20px;
      width: 440px;
      height: 244px;
      background-color: #f9fdfa;
      border: solid 1px #eeeeee;
      position: relative;
      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 53px;
        border-bottom: dashed 1px #cccccc;
        h4 {
          margin-bottom: 0;
        }
        .my-button {
          width: 80px;
          height: 28px;
          border-radius: 10px;
          line-height: 28px;
          padding: 0;
          margin-right: 12px;
          text-align: center;
        }
        .warning {
          background: #e6a23c;
        }
        .success {
          background: #67c23a;
        }
        .info {
          background: #909399;
        }
      }
      .item-content {
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        p {
          margin-bottom: 8px;
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #999999;
          }
        }
        img {
          margin-top: 28px;
          margin-right: 15px;
        }
      }
      .plan {
        position: absolute;
        right: 27px;
        bottom: 24px;
      }
    }
  }
}
</style>
<style lang="less">
.audit-item {
  .el-button--success.is-plain,
  .el-button--warning.is-plain,
  .el-button--info.is-plain {
    background: #fff;
  }
  .el-button--success.is-plain:focus,
  .el-button--success.is-plain:hover {
    background: #67c23a;
    color: #fff;
  }
  .el-button--warning.is-plain:focus,
  .el-button--warning.is-plain:hover {
    background: #e6a23c;
    color: #fff;
  }
  .el-button--info.is-plain:focus,
  .el-button--info.is-plain:hover {
    background: #d3d4d6;
    color: #fff;
  }
}
</style>
