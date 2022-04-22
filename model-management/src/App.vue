<!--
 * @Author: 任继民
 * @Date: 2020-10-22 15:44:29
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-22 19:51:53
 * @Description:
-->
<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>
<script>
export default {
  data: () => ({})
};
</script>
<style lang="less">
body {
  background-color: #f5f5f5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  background-color: #f5f5f5;
  width: 100%;
  // height: 100%;
  height: calc(100vh - 128px);
}
// html::-webkit-scrollbar { width: 0 !important }
//       html { -ms-overflow-style: none; }
//       html { overflow: -moz-scrollbars-none; }
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<style>
.el-button--primary {
  background: #397DC9 !important;
}
</style>
