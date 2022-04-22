<!--
 * @Author: 任继民
 * @Date: 2021-03-11 11:08:33
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-21 09:50:38
 * @Description:左侧菜单
-->
<template>
  <section
    class="menuslist"
    :style="{ width: menuWidth }"
  >
    <section
      class="left-menu"
      :style="{ width: leftmenuWidth }"
    >
      <a-menu
        :open-keys="[currentOpenKeys]"
        :defaultSelectedKeys="[currentSelectKeys]"
        :selectedKeys="[currentSelectKeys]"
        @openChange="onOpenChange"
        mode="inline"
      >
        <template v-for="item in subMenulist">
          <a-sub-menu
            :key="item.code"
            v-if="item.children"
          >
            <span slot="title"><span>{{item.name}}</span></span>
            <template v-for="itm in item.children">
              <a-menu-item
                :key="itm.code"
                @click="changeMenu(item,itm)"
              >
                <router-link :to="{path: itm.url }">
                  {{itm.name}}
                </router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
          <a-menu-item
            :key="item.code"
            v-else
            @click="changeMenu(item,null)"
          >
            <router-link :to="{path: item.url }">
              <img
                style="width:25px;margin-right: 10px"
                src="img/icon-1.png"
                alt=""
                srcset=""
              >
              {{item.name}}
            </router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </section>
    <img
      class="left-arrow"
      @click="rollMenu"
      :src="currentImg"
      alt=""
      srcset=""
      :style="{left: arrowLeft}"
    >
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// @ts-ignore
import Footer from "@/components/footer/index.vue";
@Component({
  components: {
    Footer,
  },
})
export default class Home extends Vue {
  @Prop({ default: () => [] })
  subMenulist!: any[];
  @Prop({ default: () => [] })
  defaultSelectKeys!: any[];
  @Prop({ default: () => [] })
  defaultopenkeys!: any[];
  currentImg: string = "img/left-arrow.png";
  showMenu: Boolean = true;
  leftmenuWidth: string = "296px";
  menuWidth: string = "327px";
  arrowLeft: string = "296px";
  current = ["mail"];
  get currentOpenKeys() {
    return (this as any).$store.state.crumbs.openKeys;
  }
  get currentSelectKeys() {
    return (this as any).$store.state.crumbs.selectKeys;
  }
  private changeMenu(item: any, itm: any) {
    (this as any).$store.commit("crumbs/ADDSUBNAME", item.name);
    (this as any).$store.commit("crumbs/ADDTHIRDNAME", itm ? itm.name : "");
  }
  private rollMenu() {
    this.showMenu = !this.showMenu;
    this.currentImg = this.showMenu
      ? "img/left-arrow.png"
      : "img/right-arrow.png";
    this.leftmenuWidth = this.showMenu ? "296px" : "0";
    this.menuWidth = this.showMenu ? "327px" : "15px";
    this.arrowLeft = this.showMenu ? "296px" : "0";
    this.$emit("rollMenus", this.showMenu);
  }
  private onOpenChange(openKeys: string) {
      /*
      经测试传入的变量openKeys是数组 点击已经展开的菜单时传入的是空数组
      点击未展开的菜单时传入的是[当前展开菜单的key,点击的菜单key]
      下面的if判断用openKeys === [] 无效 所以我只能判断数组length是否等于0
      */
      if (openKeys.length !== 0) {
        // @ts-ignore
        this.$store.commit('crumbs/SETOPENKEYS', openKeys[1]);
      } else {
        // @ts-ignore
        this.$store.commit('crumbs/SETOPENKEYS', '');
      }
  }
}
</script>
<style lang="less">
.menuslist {
  position: relative;
  
  .left-menu {
    
    width: 296px;
    box-shadow: 0px 0px 3px 0px rgba(78, 45, 45, 0.2);
    border-right: 1px solid #eaeaea;
    background-color: #ffffff;
    height: calc(100vh - 128px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-right: 31px;
    
    .cns-menu {
      border-right: none;
      .cns-menu-submenu {
        padding: 0;
        .cns-menu-submenu-title {
          border-bottom: 1px solid #eaeaea;
          height: 56px;
          line-height: 56px;
          span {
            margin-left: 16px;
          }
        }
        .cns-menu-submenu-title:hover {
          background: #ffffff !important;
        }
        .cns-menu-submenu-active {
          background: #ffffff !important;
        }
        .cns-menu-sub {
          .cns-menu-item {
            width: 190px;
            height: 36px;
            line-height: 36px;
            border-radius: 2px;
            margin-left: 49px;
            color: #6a7495;
            padding-left: 16px !important;
          }
        }
        .cns-menu-item {
          border-bottom: 1px solid #eaeaea;
          height: 56px;
          line-height: 56px;
        }
      }
      .cns-menu-item {
        border-bottom: 1px solid #eaeaea;
        height: 56px;
        line-height: 56px;
      }
      .cns-menu-item::after {
        border-right: 0px solid #1890ff;
      }
      .cns-menu-item-selected {
        background-color: #e4eafb !important;
        color: #1890ff;
      }
      .cns-menu-submenu-arrow {
        left: 24px;
      }
    }
  }
  .left-arrow {
    position: absolute;
    left: 296px;
    top: 21px;
    cursor: pointer;
  }
}
</style>
