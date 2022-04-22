<template>
  <!-- 指标维度管理 -->
  <div class="content">
    <!-- <div class="content-top">
      <div class="content-top-breadcrumb">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
    </div> -->
    <div class="content-main">
      <table-one></table-one>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import TableOne from "@/pages/indexManagement/latitude/component/table";
export default {
  components: {
    breadCrumb,
    TableOne
  },
  data() {
    return {
      breadList: ["运维管理", "指标管理","指标维度管理"]
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>


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
  }
  &-main {
    // width: 1880 / @vw;
    background-color: #fff;
    // margin: 20px;
    padding-right: 20px;
  }
}
</style>
