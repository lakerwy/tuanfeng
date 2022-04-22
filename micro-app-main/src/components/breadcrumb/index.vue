<!--
 * @Author: 任继民
 * @Date: 2021-03-29 11:41:03
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-25 14:57:25
 * @Description:面包屑
-->
<template>
  <a-breadcrumb class="micro-breadcrumb">
    <a-breadcrumb-item v-if="mainMenu">{{mainMenu}}</a-breadcrumb-item>
    <a-breadcrumb-item v-if="submenuName"><a href="">{{submenuName}}</a></a-breadcrumb-item>
    <a-breadcrumb-item v-if="thirdmenuName">{{thirdmenuName}}</a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Crumbs extends Vue {
  get mainMenu() {
    return (this as any).$store.state.crumbs.mainName || sessionStorage.mainName;
  }
  set mainMenu(newValue) {

  }
  get submenuName() {
    return (this as any).$store.state.crumbs.subName || sessionStorage.subName;
  }
  set submenuName(newValue) {

  }
  get thirdmenuName() {
    return (this as any).$store.state.crumbs.thirdName|| sessionStorage.thirdName;
  }
  set thirdmenuName(newValue) {

  }
}
</script>
<style lang="less">
.micro-breadcrumb {
	width: 100%;
	height: 35px;
  line-height: 35px !important;
  padding-left: 35px !important;
	background-color: #ffffff;
  .cns-breadcrumb-link {
    span {
      .cns-breadcrumb-link {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #6a7496;
      }
    }

    a {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #6a7496;
    }
  }
  span:last-child {
    color: #162d7a !important;
  }
}

</style>
