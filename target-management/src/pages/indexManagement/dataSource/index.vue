<template>
  <!-- 数据源配置 -->
  <div class="indexItems">
    <div class="topBox">
      <!-- <div class="breadcrumbBox">
        <bread-crumb :list="breadList"></bread-crumb>
      </div> -->
    </div>
    <div class="contentBox">
      <div class="rightListBox">
        <list :tableData="tableData"></list>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import List from "./component/table";
export default {
  components: {
    breadCrumb,
    List
  },
  data() {
    return {
      breadList: ["运维管理", "数据源配置"],
      tableData: []
    };
  },
  mounted() {},
  methods: {
    onSearch(value) {
      console.log(value);
    }
  }
};
</script>

<style lang="less" scoped>

* {
  box-sizing: border-box;
}

.indexItems {
  width: 100%;
  // .topBox {
  //   width: 100%;
  //   height: 60px;
  //   background-color: #fff;
  //   padding: 1px;
  //   overflow: hidden;

  // }
  .contentBox {
    // width: 1880 px;
    background-color: #fff;
    // margin: 20px;
    padding-right: 20px;
  }
}
</style>
