<!--
 * @Author: 任继民
 * @Date: 2020-11-12 13:46:53
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-24 09:50:43
 * @Description:
-->
<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
  name: 'App',
  data: () => ({
    locale: zhCN,
  }),
};
</script>
<style lang="scss">
@import url('./assets/styles/common.scss');
html,body {
  overflow: hidden;
}
#app {
  background-color: #F0F2F6;
}
</style>
