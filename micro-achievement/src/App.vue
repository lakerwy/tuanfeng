<!--
 * @Author: 任继民
 * @Date: 2020-10-22 15:44:29
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-10 14:53:33
 * @Description:
-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  data: () => ({

  }),
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // height: 100%;
  height: calc(100vh - 140px);
}

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

.footer {
  line-height: 55px;
  p {
    margin-bottom: 0;
  }
}
</style>
<style>
.el-button--primary {
  background: #397DC9 !important;
}
</style>
