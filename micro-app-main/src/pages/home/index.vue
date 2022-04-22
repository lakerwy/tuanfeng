<!--
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-09 16:05:52
 * @Description:
-->
<template>
  <section>
    <section class="cns-frame-wrapper">
      <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
      <router-view v-show="$route.name" />

      <!-- 子应用渲染区，用于挂载子应用节点 -->
      <section v-show="!$route.name">
        <section class="user-area">
          <div class="sys-name">
            <img src="img/logo.png" alt="" srcset="" />
            <span>{{ systemName }}</span>
          </div>
          <div class="">
            <main-menu @changeMenu="changeMenu" :menus="baseInfoMenus" />
          </div>
          <div class="logout-ico">
            <a-avatar :size="34" :src="userAvatar" :alt="userName" />
            <div class="username">{{ userName }}</div>
            <img
              src="img/logout-icon.png"
              alt="退出"
              srcset=""
              @click="logout"
            />
          </div>
        </section>
        <!-- <Breadcrumb /> -->
        <section class="cns-content">
          <LeftMenu
            v-if="submenus.length > 1"
            :subMenulist="submenus"
            @rollMenus="rollMenus"
          />
          <section class="microframe" :style="{ width: frameWidth }">
            <section id="frame"></section>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import Cookies from "js-cookie";
import actions from "../../shared/actions";
// @ts-ignore
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { Component, Vue, Watch } from "vue-property-decorator";
import { getUserByToken } from "../../apis/index";
// @ts-ignore
import Breadcrumb from "@/components/breadcrumb/index.vue";
// @ts-ignore
import subMenu from "@/components/subMenu/index.vue";
// @ts-ignore
import otherMenu from "@/components/subMenu/otherMenu.vue";
// @ts-ignore
import MainMenu from "@/components/menu/index.vue";
// @ts-ignore
import LeftMenu from "@/components/leftMenu/index.vue";
// @ts-ignore
import Footer from "@/components/footer/index.vue";
import { logout } from "../../utils/auth";
@Component({
  components: {
    MainMenu,
    Breadcrumb,
    subMenu,
    otherMenu,
    LeftMenu,
    Footer
  }
})
export default class App extends Vue {
  locale = zhCN;
  userName = sessionStorage.uCenterName || "";
  userAvatar = sessionStorage.uCenterAvatar || "";
  showSubMenu: Boolean = false;
  showMenu: number = 0; // 0不显示 1 运维 2其他
  submenus: any[] = sessionStorage.systemMenu
    ? JSON.parse(sessionStorage.systemMenu)
    : [];
  showFooter: Boolean = false;
  submenuleft: string = "";
  mevent: any = null;
  Flevel: Object = {};
  subMenu: any[] = [];
  systemName: string = "国土空间规划“一张图”实施监督信息系统";
  frameWidth: string = "calc(100% - 327px)";
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  baseInfoMenus = [
    {
      key: "naturalResources",
      title: "自然资源可视化应用",
      icon: "img/ico/yizhangtu.png",
      menuCode: "naturalresource",
      path: "/naturalResources"
    },
    {
      key: "ControlthematicApp",
      title: "用途管制与专题应用",
      icon: "img/ico/guanzhi.png",
      menuCode: "controlApp",
      path: "/thematicApplication#/useControl/conformity"
    },
    {
      key: "thematicApplandUse",
      title: "开发利用专题应用",
      icon: "img/ico/jiance.png",
      menuCode: "developApp",
      path: "/thematicApplication#/developUse/landUse"
    },
    {
      key: "UserCenter3",
      title: "支撑专题应用",
      icon: "img/ico/chenzaili.png",
      menuCode: "bearingcapacity",
      path: "/bearingcapacity"
    },
    {
      key: "resoucreDevOps",
      title: "资源管理与平台运维管理子系统",
      icon: "img/ico/yunwei.png",
      menuCode: "resoucreDevOps",
      path: "/devops"
    }
  ];
  implementMenus = [
    {
      key: "OneMap",
      title: "一张图",
      icon: "img/ico/yizhangtu.png",
      menuCode: "OneMap",
      path: "/OneMap"
    },
    {
      key: "AnalysisEval",
      title: "分析评价",
      icon: "img/ico/fenxi.png",
      menuCode: "analysisEval",
      path: "/analysisEval"
    },
    {
      key: "Achievement",
      title: "成果审查",
      icon: "img/ico/chengguo.png",
      menuCode: "achManagement",
      path: "/achievement"
    },
    {
      key: "monitorWarn",
      title: "监测评估预警",
      icon: "img/ico/jiance.png",
      menuCode: "monitorWarning",
      path: "/monitorWarn"
    },
    {
      key: "UserCenter3",
      title: "承载力监测预警",
      icon: "img/ico/chenzaili.png",
      menuCode: "bearingcapacity",
      path: "/bearingcapacity"
    },
    {
      key: "modelManage",
      title: "模型管理",
      icon: "img/ico/yunwei.png",
      menuCode: "modelManage",
      path: "/modelManage"
    },
    {
      key: "targetManage",
      title: "指标管理",
      icon: "img/ico/yunwei.png",
      menuCode: "targetManage",
      path: "/targetManagement"
    }
  ];
  created(): void {
    this.initData();
  }
  // mounted` 是 Vue 的生命周期钩子函数，在组件挂载时执行
  mounted() {
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      // 监听是否够权限
      if (state.isLogin) {
        logout();
      }
    });
  }
  /**
   * 初始化用户数据
   */
  private async initData(): Promise<void> {
    let params = {
      token: Cookies.get("j_s_id"),
      code: "resource"
    };
    let res = await getUserByToken(params);
    const { success, data } = res as any;
    if (success) {
      actions.setGlobalState({ useInfoData: data });
    }
  }
  private changeMenu(item: any): void {
    this.getMenuInfo(item);
  }
  private async getMenuInfo(item: any): Promise<void> {
    this.submenus = sessionStorage.systemMenu
      ? JSON.parse(sessionStorage.systemMenu)
      : null;
    if (item.menuCode) {
      let params = {
        token: Cookies.get("j_s_id"),
        code: item.menuCode
      };
      let res = await getUserByToken(params);
      const { success, data } = res as any;
      if (success) {
        actions.setGlobalState({ useInfoData: data });
        this.userName = data.userInfo.username;
        this.userAvatar = data.userInfo.userPic;
        sessionStorage.uCenterName = data.userInfo.username;
        sessionStorage.uCenterAvatar = data.userInfo.userPic;
        let tempArr: any[] = [];
        let menuslist: any[] = [];
        let allmuenName: any[] = [];
        data.systemList[0].sysMenuList.forEach((element: any) => {
          element.meta = {};
          element.meta.title = element.name;
          element.name = element.url;
          allmuenName.push(element.name);
        });
        tempArr = this.treeData(data.systemList[0].sysMenuList);
        tempArr.forEach((item: any) => {
          menuslist.push(item);
        });
        sessionStorage.systemMenu = JSON.stringify(menuslist);
        this.submenus = menuslist;
        (this as any).$store.commit(
          "crumbs/ADDSUBNAME",
          this.submenus[0].meta.title
        );
        (this as any).$store.commit(
          "crumbs/ADDTHIRDNAME",
          this.submenus[0].children
            ? this.submenus[0].children[0].meta.title
            : null
        );
      }
    }
  }
  /**
   * 登出系统
   */
  private logout(): void {
    logout();
  }
  private treeData(data: any): any {
    //
    let cloneData = JSON.parse(JSON.stringify(data)); // 对源数据深度克隆
    let tree = cloneData.filter((father: any) => {
      // 循环所有项
      let branchArr = cloneData.filter((child: any) => {
        return father.id == child.parentId; // 返回每一项的子级数组
      });
      if (branchArr.length > 0) {
        father.children = branchArr; // 如果存在子级，则给父级添加一个children属性，并赋值
      }
      return father.parentId == "0"; // 返回第一层
    });
    return tree; // 返回树形数据
  }
  private rollMenus(isRoll: Boolean) {
    console.log("1231", isRoll);
    this.frameWidth = isRoll ? "calc(100% - 327px)" : "100%";
  }
  @Watch("$route.path")
  routePath(newValue: string) {
    if (newValue.indexOf("OneMap") > -1) {
      this.showFooter = false;
    } else {
      this.showFooter = true;
    }
  }
}
</script>
<style lang="less" scoped>
.cns-main-app {
  position: relative;
  min-width: 1300px;
  height: calc(100vh - 68px);
  .cns-menu-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: 68px;
    width: 100vw;
    min-width: 1920px;
    z-index: 40;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #001529;
    box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.11);
    .cns-title-name {
      padding-left: 30px;
      padding-right: 160px;
      display: flex;
      align-items: center;
      span {
        font-family: SourceHanSansCN-Regular;
        font-size: 24px;
        color: #ffffff;
        margin-left: 28px;
      }
    }
  }
  .cns-menu-wrapper {
    @supports (position: sticky) {
      position: sticky;
    }
  }
  .clear {
    clear: both;
  }
  .cns-nav-wrapper {
    position: fixed;
    width: 100%;
    min-width: 1060px;
    padding-left: 172px;
    left: 0;
    top: 0;
    z-index: 30;
  }
  .subMenuhover {
    transition: height 1s ease-in-out;
    height: auto;
  }
  .subMenuhide {
    transition: height 0.1s ease-in-out;
    height: 0px;
  }
}

.cns-frame-wrapper {
  margin-top: 68px;
  height: 100vh;
  width: 100%;
  background-color: #f0f2f6;
  .user-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1920px;
    height: 64px;
    background-color: #3e6efa;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
    .sys-name {
      font-family: SourceHanSansCN-Regular;
      font-size: 22px;
      font-weight: bold;
      color: #ffffff;
      padding-left: 42px;
      img {
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
    }
    .logout-ico {
      margin-left: 26px;
      margin-right: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .username {
        color: #ffffff;
        margin-left: 14px;
        margin-right: 46px;
      }
    }
  }
  .cns-content {
    display: flex;
    justify-content: space-between;
    padding: 20px 20px 0;
    .microframe {
      transition: width 1s;
      width: calc(100% - 327px);
    }
  }
}
.cns-frame-wrapper {
  @supports (position: sticky) {
    margin-top: 0;
  }
}
.cns-footer {
  position: relative;
}
#cns-frame {
  width: 100%;
  height: 100%;
  > :first-child {
    height: 100%;
  }
}
</style>

<style lang="less">
#frame {
  width: calc(100%);
  height: 100%;
  > div {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
