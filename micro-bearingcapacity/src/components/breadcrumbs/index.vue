<!--
 * @Author: 任继民
 * @Date: 2020-11-12 14:11:30
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-19 14:16:50
 * @Description:
-->
<template>
  <div class="vbreadcrumbs" :style="{height:headHeight}">
    <!-- <ul class="vbreadcrumbs-ul">
      <li>承载能力监测预警 </li>
      <li class="vbreadcrumbs__divider">/</li>
      <li class="active">综合监管</li>
    </ul> -->
    <section class="content">
      <slot />
    </section>
  </div>
</template>
<script>
export default {
  props:{
    headHeight: {
      type: String,
      default: '120px'
    }
  }
}
</script>
<style lang="scss" scoped>
.vbreadcrumbs {
  background-color: #ffffff;
  .vbreadcrumbs-ul{
    height: 54px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 0 0 50px;
    margin: 0 0 16px 0;
    li {
      align-items: center;
      display: inline-flex;
      font-size: 14px;
      color: #6f7583;
    }
    .active {
      color: #454954;
      cursor: pointer;
    }
    .vbreadcrumbs__divider{
      color: rgba(0,0,0,.38);
      padding: 0 12px;
    }
  }
  .content {
    padding: 10px 0 0 50px;
  }
}
</style>
