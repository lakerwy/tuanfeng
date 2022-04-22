<template>
  <!-- 更新方式配置 -->
  <div class="content">
    <div class="content-top">
      <!-- <div class="content-top-breadcrumb">
        <bread-crumb :list="breadList"></bread-crumb>
      </div> -->
      <div class="content-top-select">
        <SelectTwo ref="selectValue" @changeIndex="handleChange"></SelectTwo>
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
import SelectTwo from "@/components/select/el-input";
import TableOne from "@/pages/indexManagement/UpdateWay/component/table";
export default {
  components: {
    breadCrumb,
    SelectOne,
    TableOne,
    SelectTwo
  },
  data() {
    return {
      titleOne: "指标名称",
      breadList: ["运维管理", "指标计算配置", "更新方式配置"],
      nationOptions: []
    };
  },
  methods: {
    //   点击select选择框，改变其选择的值
    handleChange(value) {
      this.$refs.table.queryData.kpiname = value;
    },
    handleOK() {
      this.$refs.table.pagination.current = 1;
      this.$refs.table.queryData.page = null;
      this.$refs.table.meatData();
    },
    //   点击 重置 按钮
    handleReset() {
      this.$refs.selectValue.value = "";
      this.nationOptions = [];
      this.$refs.table.queryData = {};
      this.$refs.table.pagination.current = 1;
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
      left: 30px;
      top: 3px;
    }
    &-btn {
      position: absolute;
      left: 470px;
      top: 13px;
    }
  }
  &-main {
    // width: 1880 / @vw;
    background-color: #fff;
    margin: 20px 0;
    padding-right: 20px;
  }
}
</style>
