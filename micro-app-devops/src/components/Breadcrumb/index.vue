<!--
 * @Author: 任继民
 * @Date: 2021-01-08 13:59:02
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-04 16:33:37
 * @Description:面包屑
-->
<template>
  <section class="head-bread" :style="{height:BreadHeight}">
    <a-breadcrumb>
      <a-breadcrumb-item>运维管理</a-breadcrumb-item>
      <a-breadcrumb-item><a href="">资源管理</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="">服务管理</a></a-breadcrumb-item>
    </a-breadcrumb>
    <slot />
  </section>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    BreadHeight: { // 面包屑默认高度
      type: String,
      default: '54px'
    },
  },
  setup() {

  }
})
</script>
<style lang="less">
.head-bread {
  background-color: #ffffff;
  .ant-breadcrumb {
    height: 54px;
    line-height: 54px;
    padding-left: 50px;
    background-color: #ffffff;
  }
  .ant-form {
    margin-left: 50px;
  }
}
</style>
