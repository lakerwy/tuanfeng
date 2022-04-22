<!--
 * @Author: 任继民
 * @Date: 2021-01-08 11:44:17
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-23 10:35:50
 * @Description:
-->
<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default defineComponent({
  name: 'App',
  components: {

  },
  setup() {
    const state = reactive({
      locale: zhCN
    })
    return {
      ...toRefs(state),
    }
  }
})
</script>
<style lang="less">
@import url('./assets/style/common.less');

</style>
