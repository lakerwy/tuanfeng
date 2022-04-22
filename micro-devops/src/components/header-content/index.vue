<!--
 * @Author: 任继民
 * @Date: 2020-11-03 20:06:08
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-15 15:51:10
 * @Description:
-->
<template>
  <div class="header-content" :style="{height:headHeight}">
    <!-- <section class="crumb">
      <span class="breadcrumb-separator"></span><span>{{submenuName}}</span><span class="breadcrumb-separator">/</span><span class="active">{{thirdmenuName}} </span>
    </section> -->
    <section class="content" :style="{height:headHeight}">
      <slot />
    </section>
  </div>
</template>
<script>
import actions from '../../shared/actions'
export default {
  props:{
    headHeight: {
      type: String,
      default: '60px'
    }
  },
  data: ()=>({
    submenuName: sessionStorage.submenuName || '',
    thirdmenuName: sessionStorage.thirdmenuName || ''
  }),
  mounted() {
    actions.onGlobalStateChange(state => {
      // console.log(state)
      if (state.submenuName) {
        this.submenuName = state.submenuName;
        this.thirdmenuName = state.thirdmenuName
        sessionStorage.submenuName = state.submenuName;
        sessionStorage.thirdmenuName = state.thirdmenuName;
      }
    }, true);
  },
}
</script>
<style lang="less" scoped>
.header-content {
  // height: 120px;
  width: 100%;
  background-color: #ffffff;
  .crumb {
    margin-left: 50px;
    padding: 18px 0;
    color: #6f7583;
    font-size: 14px;
    .breadcrumb-separator{
      margin: 0 8px;
    }
    .active {
      color: #454954;
      cursor: pointer;
    }
  }
  .content {
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 62px;
    padding-top: 25px;
  }
}
</style>
