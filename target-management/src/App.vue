<!--
 * @Author: 任继民
 * @Date: 2020-10-10 11:19:41
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-26 16:56:30
 * @Description:
-->
<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterAlive"/>
    </div>
  </a-config-provider>
</template>

<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'app',
  provide(){
      return{
        reload:this.reload
      }
    },
  data () {
    return {
      locale: zhCN,
      isRouterAlive:true
    }
  },
  methods:{
      reload(){
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true;
        });
      }
    },
}
</script>
<style lang="less">
	@import './styles/common';
  @import './styles/mixin';
	body{
		background-color: #f5f5f5!important;
	}
</style>
