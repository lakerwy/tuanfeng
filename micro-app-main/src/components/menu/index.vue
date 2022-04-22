<template>
  <section class="cns-main-menu">
    <a-menu mode="horizontal" theme="dark" :selectedKeys="[selectKey]">
      <a-menu-item v-for="item in menus" :key="item.key" @click="changeMenu(item)" v-if="permisMens.includes(item.code)">
        <router-link :to="{path: item.path }">
          <img v-if="item.icon" :src="item.icon" alt="">
          <span>{{item.title}}</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
};

@Component
export default class Menu extends Vue {
  @Prop({ type: Array, default: [] })
  menus!: MenuItem[];

  @Watch("$route.path")
  onPathChange() {
    console.log(this.$route.path)
    this._initMenus();
  }

  selectKey: string = "";
  permisMens: any[] = [];

  created() {
    this._initMenus();
    this.getMenuCode();
  }

  private getMenuCode() {
    const menulist = JSON.parse(sessionStorage.singleSys);
    // @ts-ignore
    menulist.children.forEach(item => {
      this.permisMens.push(item.code)
    });
  }
  private _initMenus(): void | null {
    const currentMenu = this._findCurrentMenu(
      this.menus,
      (this as any).$route.path
    ) as MenuItem;
    console.log('currentMenu',currentMenu)
    if (!currentMenu) return;
    const { key } = currentMenu;
    this.selectKey = key;
  }

  private _findCurrentMenu(
    menus: MenuItem[],
    currentPath: string
  ): MenuItem | null {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      const { path } = menu;
      if (path === currentPath) return menu;

      const currentMenu = this._findCurrentMenu(
        menu.children || [],
        currentPath
      );
      if (currentMenu) return currentMenu;
    }
    return null;
  }

  /**
   * 切换菜单
   */
  private changeMenu(item: MenuItem): void {
    const { key } = item;
    this.selectKey = key;
    (this as any).$store.commit('crumbs/ADDMAINNAME', item.title);
    (this as any).$store.commit('crumbs/ADDSUBNAME', '');
    (this as any).$store.commit('crumbs/ADDTHIRDNAME', '')
    this.$emit('changeMenu',item);
  }
}
</script>

<style lang="less" scoped>
.cns-main-menu {
  height: 64px;
  background: transparent;
  .cns-menu {
    font-family: SourceHanSansCN-Regular;
    font-size: 16px;
    width: 100%;
    a {
      color: #a9cef3;
      text-decoration: none;
      img {
        margin-right: 10px;
      }
    }
  }
  .cns-parent-title {
    font-size: 13px;
    color: rgba(233, 241, 255, 0.75);
  }
  .cns-child-title {
    font-size: 13px;
    color: #a9cef3;
  }
  .cns-child-title:hover {
    color: #a9cef3;
  }
  .cns-menu-dark {
    background: transparent;
  }
  .cns-menu-item-selected {
    background: url("../../assets/images/img_guide/bg_menu.png") repeat-x !important;
    >a {
      background: transparent !important;
      color: #a9cef3 !important;
    }
  }
  .cns-menu-dark .cns-menu-item-selected a {
    color: #a9cef3
  }
  .cns-menu-item-active {
    background: url("../../assets/images/img_guide/bg_hover.png") repeat-x !important;
    >a{
      color: #a9cef3 !important;
    }
  }
}
</style>
