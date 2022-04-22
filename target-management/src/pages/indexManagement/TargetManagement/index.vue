<template>
  <!-- 目标值管理 -->
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
          @changeIndex="handleChange"
        ></select-one>
      </div>
      <div class="content-top-select2">
        <SelectTwo ref="selectValue1" @changeIndex="handleChange1"></SelectTwo>
      </div>
      <div class="content-top-select3">
        <SelectThree
          :title="title"
          ref="selectValue2"
          @changeIndex="handleChange2"
        ></SelectThree>
      </div>
      <div class="content-top-btn">
        <a-button @click="handleOK" type="primary" style="margin-right: 10px"
          >查询</a-button
        >
        <a-button @click="handleReset" style="margin-right: 10px"
          >重置</a-button
        >
      </div>
    </div>
    <div class="content-main">
      <table-one :options="nationOptions" ref="table"></table-one>
    </div>
  </div>
</template>

<script>
// import breadCrumb from "@/components/breadCrumb/index";
import SelectOne from "@/components/select/selectIndex";
import SelectTwo from "@/components/select/el-input";
import SelectThree from "@/components/select/el-inputTem";
import TableOne from "@/pages/indexManagement/TargetManagement/component/table";
export default {
  components: {
    // breadCrumb,
    SelectOne,
    TableOne,
    SelectTwo,
    SelectThree,
  },
  data() {
    return {
      title: "年份",
      titleOne: "行政区",
      titleTwo: "指标名称",
      breadList: ["运维管理", "指标值管理", "目标值管理"],
      nationOptions: [],
      nationOption: [],
      option: [],
      valuess: [],
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
      name: this.valuess[i],
    }));
  },
  methods: {
    //   点击select选择框，改变其选择的值
    handleChange(value) {
      this.$refs.table.query.arcode = value;
    },
    handleChange1(value) {
      this.$refs.table.query.kpiname = value;
    },
    handleChange2(value) {
      this.$refs.table.query.year = value;
    },
    handleOK() {
      this.$refs.table.pagination.current = 1;
      this.$refs.table.query.page = null;
      this.$refs.table.meatData();
    },
    //   点击 重置 按钮
    handleReset() {
      this.$refs.selectValue.value = "";
      this.$refs.selectValue1.value = "";
      this.$refs.selectValue2.value = "";
      this.$refs.table.query = {};
      this.$refs.table.pagination.current = 1;
      this.$refs.table.meatData();
    },
    //   点击 导出Excel 按钮
    handleExportExcel() {},
  },
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
      left: 425px;
      top: 3px;
    }
    &-select3 {
      position: absolute;
      left: 825px;
      top: 3px;
    }
    &-btn {
      position: absolute;
      left: 1200px;
      top: 13px;
    }
  }
  &-main {
    // width: 1880 / @vw;
    background-color: #fff;
    // height: 850/@vh;
    margin: 20px 0;
    padding-right: 20px;
    // overflow-y: auto;
  }
}
</style>
