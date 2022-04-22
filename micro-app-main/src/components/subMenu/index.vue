<!--
 * @Author: 任继民
 * @Date: 2020-11-03 10:26:26
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-25 11:34:29
 * @Description:
-->
<template>
  <div class="cns-sub-menu" @mouseenter="meunEnter($event,submenus)" @mouseleave="meunLeave(submenus)">
    <div class="cns-sub-menu-list">
      <div class="one-level">
        <section v-for="(item,index) in submenus" :key="item.id" @mouseenter="showMenus(item,index)" @click="showMenus(item,index)" :class="{ activeSection: currentIndex === index }">
          <router-link :to="{path: item.path }">
            <img :src="currentIndex===index ? `img/ico/${item.meta.title}-hover.png`:`img/ico/${item.meta.title}.png`" alt="" srcset="">
            <span>{{item.meta.title}}</span>
          </router-link>
        </section>
      </div>
      <div class="menu-list" v-for="item in  otherMenu" :key="item.id">
        <div class="title">{{item.meta.title}}</div>
        <section v-for="itm in item.children" :key="itm.id" @click="menuClick(item,itm)">
          <router-link :to="{path: itm.name }">
            <span>{{itm.meta.title}}</span>
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import actions from "../../shared/actions";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
@Component
export default class Menu extends Vue {
  @Prop() submenus?: any[];
  @Prop() mevent?: any;
  @Prop() Flevel?: object;
  otherMenu: any[] = [];
  currentIndex: number = 0;

  private created(): void {
    this.otherMenu = (this as any).submenus[0]?.children;
  }
  private meunEnter(event: Event): void {
    this.$emit('meunEnter',this.mevent,this.Flevel)
  }
  private meunLeave(submenus: any): void {
    this.$emit('meunLeave',this.submenus);
  }
  private showMenus(item: any,index: number): void {
    this.currentIndex = index;
    this.otherMenu = item.children;
  }
  private menuClick(item: any, itm: any): void {
    this.$emit('menuClick',item);
    actions.setGlobalState({submenuName:item.meta.title,thirdmenuName: itm.meta.title});
  }
}
</script>
<style lang="less" scoped>
a:link,
a:visited,
a:hover,
a:active{
  color: #fff;
  text-decoration: none;
}
.cns-sub-menu {
  left: 0;
  top: 68px;
  position: fixed;
  z-index: 99;
  height: auto;
  width: 100vw;
  border-top: 1px solid #273847;
  overflow: hidden;
  background-color: #001529;
  box-shadow: 0px 0px 13px 0px
    rgba(0, 0, 0, 0.11);
  display: flex;
  justify-content: flex-start;
  padding-left: 320px;
  align-items: center;
  &-list {
    display: flex;
    justify-content: flex-start;
    padding: 40px 0;
    .one-level {
      color: #E1E2E3;
      font-size: 14px;
      // height: 186px;
      width: 126px;
      // overflow-x: auto;
      border-right: 1px solid #293B4B;
      margin-right: 27px;
      section {
        padding: 14px 0;
        cursor: pointer;
        a {
          display: flex;
          align-items: center;
          img {
            margin-right: 15px;
          }
        }
      }
      section:hover, .activeSection {
        border-right: 2px solid #1890ff;
        span {
          color: #1890ff;
        }
      }
    }
    .menu-list {
      padding: 0 20px;
      // height: 186px;
      // overflow-x: auto;
      .title {
        color: #E1E2E3;
        font-size: 14px;
      }
      section {
        a{
          width: 124px;
          height: 34px;
          margin: 12px 0;
          background-color: #0f2336;
          border-radius: 4px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          span {
            color: #A6AAAE;
          }
        }
      }
      a:hover {
        background-color: #1890ff;
        span {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
