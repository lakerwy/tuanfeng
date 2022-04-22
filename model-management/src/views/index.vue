<template>
  <el-container class="layout">
    <!--<el-header class="layout-header">
      <breadCrumb class="breadCrumb" :list="list"></breadCrumb>
    </el-header>-->

    <el-main class="layout-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
export default {
  components: {
    breadCrumb
  },
  computed: {
    list: function() {
      return [
        { name: "模型管理", path: "/modelManager" },
        { name: this.$route.meta.title, path: "" }
      ];
    }
  }
};
</script>

<style lang="less">
@vw: 19.2vw;
@vh: 10.8vh;

// 布局页面
.layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  &-header {
    width: 100%;
    background-color: #fff;
    height: 54 / @vh !important;
    padding: 0;
    .breadCrumb {
      margin-left: 50 / @vw;
      line-height: 54 / @vh;
    }
  }
  &-main {
    padding: 0;
    height: 100%;
  }
}

// 管理页面公共样式
.manager {
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  .head {
    width: 100%;
    background-color: #fff;
    padding: 20 / @vh 0;
  }
  .container {
    flex: 1;
    height: 100%;
    margin-top: 20 / @vh;
    background-color: #fff;
    overflow: auto;
    padding: 20 / @vh 20 / @vw;
  }
}

// 模型构建和配置页面样式
.app-canvas {
  height: 100%;
  padding: 0 30 / @vw;
  display: grid;
  width:100%;
  // grid-template-columns: 374 / @vw 1fr;
  // grid-column-gap: 16 / @vw;

  > div {
    margin-top: 20 / @vh;
    background-color: #fff;
    padding: 20 / @vh 20 / @vw;
    overflow: auto;
  }

  &__left {
    .title {
      text-align: left;
      font-size: 20 / @vh;
      color: #454954;
      font-weight: bold;
      padding-bottom: 20 / @vh;
      border-bottom: 1px solid #e8e8e8;
    }
    .treeBox {
      margin-top: 20 / @vh;
    }
  }

  &__main {
    .container {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-basis: auto;
      box-sizing: border-box;
    }
    .el-loading-mask {
      z-index: 10;
    }
  }
}
</style>
