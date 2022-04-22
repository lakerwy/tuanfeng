<template>
  <!-- 元数据管理 -->
  <div class="content">
    <div class="content-top">
      <div class="content-top-breadcrumb">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
    </div>
    <div class="content-main">
      <table-one></table-one>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import TableOne from "@/pages/indexManagement/meatData/component/table";
export default {
  components: {
    breadCrumb,
    TableOne
  },
  data() {
    return {
      breadList: ["运维管理", "指标管理","元数据管理"]
    };
  },
  methods: {}
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
    height: 56 / @vh;
    background-color: #fff;
    padding: 1px;
  }
  &-main {
    width: 1880 / @vw;
    background-color: #fff;
    margin: 20px;
  }
}
</style>
