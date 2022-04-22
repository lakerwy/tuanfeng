<!--
 * @Author: 任继民
 * @Date: 2020-11-17 13:58:41
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-26 16:55:27
 * @Description:
-->
<template>
  <div id="oneMapapp">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
};
</script>

<style lang="less">
@import "./assets/styles/common.less";
#oneMapapp {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei";
}
</style>
