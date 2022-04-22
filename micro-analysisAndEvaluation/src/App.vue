<!--
 * @Author: 任继民
 * @Date: 2020-10-22 15:44:29
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-13 14:55:51
 * @Description:
-->
<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
    <!-- <div class="footer">
      <p>Copyright©2019-2020 All Right Reserved</p>
    </div> -->
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
  font-family: Microsoft YaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // height: 100%;
  height: calc(100vh - 134px);
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
  color: #fff !important;
}
</style>
