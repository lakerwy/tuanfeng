<!--
 * @Author: 任继民
 * @Date: 2020-11-10 14:38:33
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-08 11:48:12
 * @Description:
-->
<template>
  <div
    class="cns-other-menu"
    @mouseenter="meunEnter($event,submenus)"
    @mouseleave="meunLeave(submenus)"
  >
    <section class="empty-section"></section>
    <section class="subleve">
      <div v-if="isThlevels < 2">
        <section
          v-for="item in submenus"
          :key="item.id"
          class="list"
        >
          <router-link :to="{path: item.name }">
            <span>{{item.meta.title}}</span>
          </router-link>
        </section>
      </div>
      <div
        v-else
        class="thrMenu-list"
      >
        <div
          class="menu-list"
          v-for="item in submenus"
          :key="item.id"
        >
          <div class="title">{{item.meta.title}}</div>
          <section
            v-for="itm in item.children"
            :key="itm.id"
          >
            <router-link :to="{path: itm.name }">
              <span>{{itm.meta.title}}</span>
            </router-link>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
@Component
export default class Menu extends Vue {
  @Prop() submenus?: any[];
  @Prop() mevent?: any;
  @Prop() Flevel?: object;
  get isThlevels() {
    return this.getMaxFloor(this.submenus);
  }
  /**
   * 计算树形层级
   */
  private getMaxFloor(treeData: any): Number {
    let floor: Number = 0;
    let max: Number = 0;
    if (!treeData) return max;
    function each(data: any, floor: number) {
      data.forEach((e: any) => {
        e.floor = floor;
        if (floor > max) {
          max = floor;
        }
        if (e.children && e.children.length > 0) {
          each(e.children, floor + 1);
        }
      });
    }
    each(treeData, 1);
    return max;
  }
  private meunEnter(event: Event): void {
    this.$emit("meunEnter", this.mevent, this.Flevel);
  }
  private meunLeave(submenus: any): void {
    this.$emit("meunLeave", this.submenus);
  }
}
</script>
<style lang="less" scoped>
a:link,
a:visited,
a:hover,
a:active {
  color: #fff;
  text-decoration: none;
}
.cns-other-menu {
  position: fixed;
  z-index: 99;
  top: 65px;
  .empty-section {
    background-color: rgba(0, 0, 0, 0);
    height: 10px;
  }
  .subleve {
    background-color: #001529;
    box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.11);
    .list {
      padding: 18px 16.5px;
      a {
        padding: 18px 16.5px;
        span {
          color: #e1e2e3;
          font-size: 14px;
        }
      }
    }
    .list:hover {
      background-color: #1890ff;
      span {
        color: #ffffff;
      }
    }
    .thrMenu-list {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      padding: 0 12px;
      .menu-list {
        padding: 0 16px;
        // height: 186px;
        // overflow-x: auto;
        .title {
          color: #e1e2e3;
          font-size: 14px;
          padding-top: 20px;
        }
        section {
          a {
            width: 146px;
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
              color: #a6aaae;
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
}
</style>
