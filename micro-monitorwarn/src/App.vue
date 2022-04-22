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
html,body {
  overflow: hidden;
}
#app {
  background-color: #F5F5F5;
}
</style>
