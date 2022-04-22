<template>
  <!-- 运行监控 -->
  <div class="content">
    <div class="content-top">
      <!-- <div class="content-top-breadcrumb">
        <bread-crumb :list="breadList"></bread-crumb>
      </div> -->
      <div class="content-top-select">
        <select-one
          ref="selectValue"
          :title="titleOne"
          :options="nationOptions"
          @changeIndex="handleChanges"
        ></select-one>
      </div>
      <div class="content-top-select2">
        <select-one
          ref="selectValue1"
          :title="titleTwo"
          :options="nationOption"
          @changeIndex="handleChange"
        ></select-one>
      </div>
      <div class="content-top-btn">
        <a-button @click="handleOK" type="primary" style="margin-right:10px"
          >查询</a-button
        >
        <a-button @click="handleReset" style="margin-right:10px">重置</a-button>
        <!-- <a-button type="primary" @click="handleExportExcel"
          >导出Excel</a-button
        > -->
      </div>
    </div>
    <div class="content-main">
      <table-one ref="table"></table-one>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import SelectOne from "@/components/select/selectIndex";
import TableOne from "@/pages/indexManagement/monitoring/component/table";
export default {
  components: {
    breadCrumb,
    SelectOne,
    TableOne
  },
  data() {
    return {
      titleOne: "行政区",
      titleTwo: "指标值计算运行状态",
      breadList: ["运维管理", "运行监控", "运行监控"],
      nationOptions: [],
      option: [],
      valuess: [],
      nationOption: [
        {
          value: "未计算",
          name: 0
        },
        {
          value: "已完成计算",
          name: 1
        },
        {
          value: "计算失败",
          name: 2
        },
        {
          value: "正在执行计算",
          name: 3
        }
      ]
    };
  },
  mounted() {
    let arr = JSON.parse(sessionStorage.getItem("latitudeData"));
    for (var i in arr) {
      if (arr[i].name === "全域") {
        let nation = arr[i].names;
        let values = arr[i].valuess;
        this.option = nation.split(",");
        this.valuess = values.split(",");
      }
    }
    this.nationOptions = this.option.map((value, i) => ({
      value,
      name: this.valuess[i]
    }));
  },
  methods: {
    //   点击select选择框，改变其选择的值
    handleChange(value) {
      // console.log(value);
      this.$refs.table.query.status = value;
    },
    handleChanges(value) {
      this.$refs.table.query.arcode = value;
    },
    handleOK() {
      this.$refs.table.pagination.current=1;
      this.$refs.table.query.page=null;
      this.$refs.table.meatData();
    },
    //   点击 重置 按钮
    handleReset() {
      this.$refs.selectValue.value = "";
      this.$refs.selectValue1.value = "";
      this.$refs.table.query = {isup:2};
      this.$refs.table.pagination.current=1;
      this.$refs.table.meatData();
    },
    //   点击 导出Excel 按钮
    handleExportExcel() {}
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

* {
  box-sizing: border-box;
}

.content {
  width: 100%;
  &-top {
    width: 100%;
    height: 60px;
    background-color: #fff;
    padding: 1px;
    overflow: hidden;
    position: relative;
    &-select {
      position: absolute;
      left: 50 / @vw;
      top: 3px;
    }
    &-select2 {
      position: absolute;
      left: 460px;
      top: 3px;
    }
    &-btn {
      position: absolute;
      left: 950px;
      top: 13px;
    }
  }
  &-main {
    // width: 1880 / @vw;
    background-color: #fff;
    margin: 20px 0;
    padding: 20px 15px 0 0;
  }
}
</style>
