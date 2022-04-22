<template>
<!-- 规划年份配置 -->
  <div class="content">
    <div class="content-top">
      <div class="content-top-breadcrumb">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
      <div class="content-top-select">
        <select-one ref="selectValue"
        :title="titleOne"
          :options="nationOptions"
          @changeIndex="handleChange"
        ></select-one>
      </div>
      <div class="content-top-btn">
        <a-button @click="handleReset" style="margin-right:10px">重置</a-button>
        <a-button type="primary" @click="handleExportExcel"
          >导出Excel</a-button
        >
      </div>
    </div>
    <div class="content-main">
      <table-one></table-one>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import SelectOne from "@/components/select/selectIndex";
import TableOne from "@/pages/indexManagement/PlannedYear/component/table";
export default {
  components: {
    breadCrumb,
    SelectOne,
    TableOne
  },
  data() {
    return {
      titleOne:"选择行政区",
      breadList: ["运维管理", "指标计算配置", "规划年份配置"],
      nationOptions: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        }
      ]
    };
  },
  methods: {
    //   点击select选择框，改变其选择的值
    handleChange(value) {
      console.log(value);
    },
    //   点击 重置 按钮
    handleReset() {
        this.$refs.selectValue.value=""
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
    height: 100px;
    background-color: #fff;
    padding: 1px;
    overflow: hidden;
    position: relative;
        &-select {
      position: absolute;
      left: 50 / @vw;
      top: 40px;
    }
    &-btn {
      position: absolute;
      left: 450px;
      top: 53px;
    }
  }
  &-main {
    width: 1880 / @vw;
    background-color: #fff;
    margin: 20px;
  }
}
</style>
