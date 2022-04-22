<!--
 * @Author: 任继民
 * @Date: 2020-11-02 11:40:41
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-25 09:30:41
 * @Description:
-->
<template>
  <a-config-provider prefixCls="cns" :locale="locale">
    <section class="selectSys" v-if="!isSelectSys">
      <section class="home-container">
        <section class="home-header">
          <img src="img/logo.png" alt="" srcset="">
          <span>团风国土空间规划基础信息平台</span>
        </section>
        <section class="home-content">
          <section class="menu-lists">
            <div class="sys-menu">
              <div class="sysMenu-bg" @click="selectMenu(true)" v-show="permisMens.includes('baseInfo')" >
                <img src="img/云平台.png" alt="">
                <div>国土空间基础信息平台</div>
              </div>
              <div class="sysMenu-bg" @click="selectMenu(false)" @mouseenter="enterMenu" @mouseleave="leaveMenu" v-show="permisMens.includes('MonSystem')">
                <img src="img/一张图.png" alt="">
                <div>“一张图”实施监督信息系统</div>
              </div>
            </div>
            <div class="menu-showA" v-if="showMenu ===0">
              <div v-for="item in menulist" :key="item.code" class="list" @click="routerWay(item)">
                  <img :src="item.icon" alt="" srcset="">
                  <div>{{item.title}}</div>
              </div>
            </div>
            <div class="menu-showB" v-show="showMenu ===1">
              <div v-for="item in menulist" :key="item.code" class="list" @click="routerWay(item)">
                  <img :src="item.icon" alt="" srcset="">
                  <div>{{item.title}}</div>
              </div>
            </div>
          </section>
        </section>
        <section class="home-footer">
          <div>Copyright©2020-2021 湖北地信科技集团股份有限公司 All Right Reserved.</div>
        </section>
        <a-modal
          title="温馨提示"
          :visible="loginvisible"
          :centered="true"
          :closable="false"
          :keyboard="false"
          @ok="logout"
          :cancel-button-props="{ style: { display: 'none' } }"
        >
          <p>当前用户暂无权限，请更换账号重新登录！</p>
        </a-modal>
      </section>
    </section>
    <section class="cns-frame-wrapper" v-else>
      <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
      <!-- <router-view v-show="$route.name" /> -->

      <!-- 子应用渲染区，用于挂载子应用节点 -->
      <section>
        <section class="user-area">
          <div class="sys-name" @click="changeSys">
            <img src="img/logo.png" alt="" srcset="">
            <span>{{singleSys.name}}</span>
          </div>
          <section class="sys-menu-info">
            <div class="">
              <main-menu
                @changeMenu="changeMenu"
                :menus="currentMenus"
              />
            </div>
            <div class="logout-ico">
              <a-avatar :size="34" :src="userAvatar" :alt="realName" />
              <!-- <div class="username">{{ realName }}</div> -->
             <a-dropdown>
              <a class="username" @click="e => e.preventDefault()">
                {{ realName }} <a-icon type="down" />
              </a>
              <a-menu slot="overlay" @click="onClick">
                <a-menu-item key="1">
                  个人信息
                </a-menu-item>
                <a-menu-item key="2">
                  修改密码
                </a-menu-item>
              </a-menu>
            </a-dropdown>
              <img
                src="img/logout-icon.png"
                alt="退出"
                srcset=""
                @click="logout"
              />
            </div>
          </section>
        </section>
        <!-- <Breadcrumb /> -->
        <template v-if="userCenter">
          <UserCenter ref="user"></UserCenter>
        </template>
        <template v-if="changePassword">
          <ChangePassword ref="passWord"></ChangePassword>
        </template>
        <section class="cns-content">
          <LeftMenu ref="leftRef" v-if="subMenulist" :subMenulist="subMenulist"  @rollMenus="rollMenus"/>
          <section class="microframe" :style="{width: frameWidth}">
            <section id="frame"></section>
          </section>
        </section>
      </section>
    </section>
  </a-config-provider>
</template>

<script lang="ts">
import { setDefaultMountApp } from 'qiankun';
import Cookies from "js-cookie";
import actions from "./shared/actions";
// @ts-ignore
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { Component, Vue, Watch} from "vue-property-decorator";
import { getUserByToken } from "./apis/index";
// @ts-ignore
import Breadcrumb from "@/components/breadcrumb/index.vue";
// @ts-ignore
import UserCenter from "@/components/userList/userCenter.vue";
// @ts-ignore
import ChangePassword from "@/components/userList/changePassword.vue";
// @ts-ignore
import MainMenu from "@/components/menu/index.vue";
// @ts-ignore
import LeftMenu from "@/components/leftMenu/index.vue";
// @ts-ignore
import Footer from "@/components/footer/index.vue";
import { logout, clearAllToken } from "./utils/auth";
interface sysCodeObj {
  url: string,
  code: string,
  parentCode: string,
  ppCode?: string
}
@Component({
  components: {
    MainMenu,
    UserCenter,
    Breadcrumb,
    LeftMenu,
    Footer,
    ChangePassword
  }
})
export default class App extends Vue {
  public $refs!:{
    user:HTMLFormElement,
    passWord:HTMLFormElement
  }
  isSelectSys: Boolean = sessionStorage.isSelectSys || false;
  locale = zhCN;
  userName = sessionStorage.uCenterName || "";
  realName = sessionStorage.uCenterRealName || "";
  userAvatar = sessionStorage.uCenterAvatar || "";
  showSubMenu: Boolean = false;
  userCenter: Boolean = false;
  changePassword: Boolean = false;
  singleSys: any[] = [];
  submenus: any[] = [];
  subMenulist: any[] = [];
  showFooter: Boolean = false;
  submenuleft: string = "";
  mevent: any = null;
  Flevel: Object = {};
  subMenu: any[] = [];
  showMenu: number = -1; // -1不显示 1 运维 2其他
  frameWidth: string = 'calc(100%)';
  loginvisible: Boolean = false;
  sysCode: any[] = sessionStorage.SYS_CODE?JSON.parse(sessionStorage.SYS_CODE):[];
  currentCode: string = '';
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  currentMenus: any[] = [];
  menulist: any[] = [];
  permisMens: any[] = [];
  baseInfoMenus = [
    {
      key: "naturalResources",
      title: "自然资源可视化",
      icon: "img/ico/yizhangtu.png",
      code: "naturalresource",
      path: "/naturalResources"
    },
    {
      key: "ControlthematicApp",
      title: "用途管制专题",
      icon: "img/ico/guanzhi.png",
      code: "controlApp",
      path: "/thematicApplication#/useControl/conformity"
    },
    {
      key: "thematicApplandUse",
      title: "开发利用专题",
      icon: "img/ico/jiance.png",
      code: "developApp",
      path: "/thematicApplication#/developUse/landUse"
    },
    {
      key: "targetManagement",
      title: "支撑专题应用",
      icon: "img/ico/chenzaili.png",
      code: "zcztyy",
      path: "/targetManagement#/SecondaryDevelopment"
    },
    {
      key: "resoucreDevOps",
      title: "资源管理与平台运维管理",
      icon: "img/ico/yunwei.png",
      code: "resoucreDevOps",
      path: "/devops"
    }
  ];
  implementMenus = [
    {
      key: "OneMap",
      title: "一张图",
      icon: "img/ico/yizhangtu.png",
      code: "OneMap1",
      path: "/OneMap"
    },
    {
      key: "AnalysisEval",
      title: "分析评价",
      icon: "img/ico/fenxi.png",
      code: "analysisEval",
      path: "/analysisEval"
    },
    {
      key: "Achievement",
      title: "成果审查管理",
      icon: "img/ico/chengguo.png",
      code: "achManagement",
      path: "/achievement"
    },
    {
      key: "monitorWarn",
      title: "监测评估预警",
      icon: "img/ico/jiance.png",
      code: "monitorWarning",
      path: "/monitorWarn"
    },
    {
      key: "UserCenter3",
      title: "承载力监测预警",
      icon: "img/ico/chenzaili.png",
      code: "bearingcapacity",
      path: "/bearingcapacity"
    },
    {
      key: "modelManage",
      title: "模型管理",
      icon: "img/ico/yunwei.png",
      code: "modelManage",
      path: "/modelManage"
    },
    {
      key: "targetManage",
      title: "指标管理",
      icon: "img/ico/yunwei.png",
      code: "targetManage",
      path: "/targetManagement"
    }
  ];
  baseMenu = [
    {
      key: "zrzyksh",
      title: "自然资源可视化",
      icon: "img/icon-1.png",
      code: "zrzyksh",
      path: "/OneMap"
    },
    {
      key: "ytgzzt",
      title: "用途管制专题",
      icon: "img/icon-4.png",
      code: "ytgzzt",
    },
    {
      key: "OneMap",
      title: "开发利用专题",
      icon: "img/icon-5.png",
      code: "kflyzt",
    },
    {
      key: "OneMap",
      title: "支撑专题应用",
      icon: "img/icon-2.png",
      code: "zcztyy",
    },
    {
      key: "OneMap",
      title: "资源管理与平台运维管理子系统",
      icon: "img/icon-3.png",
      code: "zyglyptywgl",
    }
  ];
  implMenu = [
    {
      key: "OneMap",
      title: "一张图",
      icon: "img/icon-1.png",
      code: "yzt",
    },
    {
      key: "OneMap",
      title: "分析评价",
      icon: "img/icon-2.png",
      code: "fxpj",
    },
    {
      key: "OneMap",
      title: "成果审查管理",
      icon: "img/icon-3.png",
      code: "cgsc",
    },
    {
      key: "OneMap",
      title: "监测评估预警",
      icon: "img/icon-4.png",
      code: "jcpgyj",
    },
    {
      key: "OneMap",
      title: "承载力监测预警",
      icon: "img/icon-5.png",
      code: "czljcyj",
    },
    {
      key: "OneMap",
      title: "模型管理",
      icon: "img/icon-6.png",
      code: "mxgl",
    },
    {
      key: "OneMap",
      title: "指标管理",
      icon: "img/icon-6.png",
      code: "zbgl",
    },
  ];
  created() {
    this.getMenuInfo();
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
      if (state.accessToken && !prevState.accessToken) {
        this.getMenuInfo();
      }
    });
    this.menulist = this.baseMenu;
    if (sessionStorage.MenuCode) {
      (this as any).changeMenu({ code: sessionStorage.MenuCode })
    }
  }

  private onClick({key}:any) {
    if(key=='1'){
      this.userCenter=true
      if(this.$refs.user){
        this.$refs.user.visible=true
      }
    }else{
      this.changePassword=true
      if(this.$refs.passWord){
        this.$refs.passWord.visibles=true
      }
    }
  }
  /**
   * 初始化用户数据
   */
  private async initData(): Promise<void> {
    this.currentMenus =  Cookies.get('CMENS') === 'true' ? this.baseInfoMenus: this.implementMenus;
    if (sessionStorage.systemMenu) {
      // @ts-ignore
      JSON.parse(sessionStorage.systemMenu).forEach(item => {
        this.permisMens.push(item.code);
      })
      if (!Cookies.get('CMENS')) {
        if (this.permisMens.includes('baseInfo')) {
          this.changeMenulist(true);
        }else {
          this.changeMenulist(false);
        }
      }else {
        let menubool = Cookies.get('CMENS') === 'true'? true: false;
        this.changeMenulist(menubool);
      }
    }
  }
  private changeMenu(value: any): void {
    sessionStorage.MenuCode = value.code;
    // this.getMenuInfo();
    let menulist = this.singleSys.length > 0 ? this.singleSys : JSON.parse(sessionStorage.singleSys? sessionStorage.singleSys: '[]');
    // @ts-ignore
    let tempArr = menulist.children.filter(item => item.code === value.code);
    this.subMenulist = tempArr.length > 0 ? tempArr[0].children : {};
    (this as any).frameWidth = tempArr[0].children ? 'calc(100% - 327px)' : '100%';
    // @ts-ignore
    // this.$refs.leftRef.rollMenu();
      // @ts-ignore
    // this.$store.commit('crumbs/ADDMAINNAME', tempArr[0].name);
      // @ts-ignore
    // this.$store.commit('crumbs/ADDSUBNAME', tempArr[0].children ? tempArr[0].children[0].name: '');
      // @ts-ignore
    // this.$store.commit('crumbs/ADDTHIRDNAME', tempArr[0].children[0].children?tempArr[0].children[0].children[0].name: '')
  }
  private async getMenuInfo(): Promise<void> {
    if (!sessionStorage.accessToken) return;
    this.submenus = sessionStorage.systemMenu
      ? JSON.parse(sessionStorage.systemMenu)
      : null;
    if (!sessionStorage.systemMenu) {
      let params = {
        token: sessionStorage.accessToken,
        code: 'systemCode'
      };
      let res = await getUserByToken(params);
      const { success, data } = res as any;
      if (success) {
        this.showMenu = 0;
        let org = ''
        actions.setGlobalState({ useInfoData: data });
        this.userName = data.userInfo.username;
        this.userAvatar = data.userInfo.userPic;
        sessionStorage.uCenterName = data.userInfo.username;
        if (data.userordList.length > 0) org = `(${data.userordList[0].name})`;
        this.realName = data.userInfo.realname + org;
        sessionStorage.passwordId = data.userInfo.id;
        sessionStorage.uCenterRealName = data.userInfo.realname + org;
        sessionStorage.uCenterAvatar = data.userInfo.userPic;
        sessionStorage.userPhone = data.userInfo.phone;
        sessionStorage.userEmail = data.userInfo.email;
        sessionStorage.userAddress = data.userInfo.address;
        sessionStorage.remark = data.userInfo.remark;
        this.submenus = this.treeData(data.systemList[0].sysMenuList,'parentId');
        this.submenus.forEach(item => {
          this.permisMens.push(item.code);
        })
        this.getMenuCode(data.systemList[0].sysMenuList);
        sessionStorage.systemMenu = JSON.stringify(this.submenus);
        if (this.permisMens.length === 0) {
          this.showMenu = -1;
          // @ts-ignore
          this.$warning({
            title: '警告',
            content: '当前用户暂无权限，请更换账号重新登录！',
            onOk() {
              logout();
            },
          });
        }else if(this.permisMens.length === 1) {
          if (this.permisMens.includes('baseInfo')) {
            this.changeMenulist(true);
          }else {
            this.changeMenulist(false);
          }
          this.goNaviagtion();
        }
      }else {
        this.showMenu = -1;
        // @ts-ignore
        this.$warning({
          title: '警告',
          // @ts-ignore
          content: res.status.message,
          onOk() {
            logout();
          },
        });
      }
    }else {
      // @ts-ignore
      JSON.parse(sessionStorage.systemMenu).forEach(item => {
        this.permisMens.push(item.code);
      })
    }
  }
  private getMenuCode(data: any): void {
    if (!data) return;
    let temp: any[] = []
    data.forEach((item: sysCodeObj) => {
      let obj: any = {};
      obj.path = item.url;
      obj.code = item.code;
      obj.parentCode = item.parentCode;
      obj.ppCode = item.ppCode;
      temp.push(obj);
    });
    sessionStorage.SYS_CODE = JSON.stringify(temp);
    this.sysCode = temp;
  }
  /**
   * 登出系统
   */
  private logout(): void {
    this.loginvisible = false;
    logout();
  }
  // @ts-ignore
  private treeData(data: any,pid: string): any {
    // 删除所有 children,以防止多次调用
    data.forEach(function (item: any) {
      delete item.children;
    });
    let map = {}; // 构建map
    // @ts-ignore
    data.forEach((i) => {
        // @ts-ignore
      map[i.id] = i; // 构建以area_id为键 当前数据为值
    });

    let treeData: any[] = [];
    // @ts-ignore
    data.forEach((child) => {
      // @ts-ignore
      const mapItem = map[child[pid]]; // 判断当前数据的pid是否存在map中

      if (mapItem) { // 存在则表示当前数据不是最顶层数据
        // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
        child.parentCode = mapItem.code; // 父节点值
        (mapItem.children || (mapItem.children = [])).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
      } else { // 不存在则是组顶层数据
        treeData.push(child);
      }
    });
    // @ts-ignore
    return treeData;
  }
  private changeMenulist(value: boolean) {
    this.showMenu = value? 0 : 1 ;
    this.submenus = sessionStorage.systemMenu
      ? JSON.parse(sessionStorage.systemMenu)
      : [];
    this.currentMenus = value ? this.baseInfoMenus: this.implementMenus;

    this.menulist = value? this.baseMenu: this.implMenu;

    this.singleSys = value? this.submenus[0]: this.submenus[1] || this.submenus[0];

    sessionStorage.singleSys = JSON.stringify(this.singleSys);

    this.isSelectSys = true;

    sessionStorage.isSelectSys = true; // 存储状态

    Cookies.set('CMENS', value, { expires: 1 || 1 })
  }
  private selectMenu(value: any): void {
    this.userCenter=false,
      this.changePassword=false
    this.changeMenulist(value)
    this.goNaviagtion();
    this.realName = sessionStorage.uCenterRealName;
  }
  private goNaviagtion() {
    this.$nextTick(() => {
      // @ts-ignore
      this.$router.push(this.singleSys.children[0].url)
        // @ts-ignore
      this.changeMenu(this.singleSys.children[0])
        // @ts-ignore
      // this.$store.commit('crumbs/ADDMAINNAME', this.singleSys.children[0].name);
        // @ts-ignore
      // this.$store.commit('crumbs/ADDSUBNAME', this.singleSys.children[0].children?this.singleSys.children[0].children[0].name: '');
        // @ts-ignore
      // this.$store.commit('crumbs/ADDTHIRDNAME', this.singleSys.children[0].children?this.singleSys.children[0].children[0].name: '')
    })
  }
  private enterMenu() {
    this.showMenu = 1;
    this.menulist = this.implMenu;
  }
  private leaveMenu() {
    this.showMenu = 0;
    this.menulist = this.baseMenu;
  }
  private rollMenus(isRoll: Boolean) {
    (this as any).frameWidth = isRoll ? 'calc(100% - 327px)' : '100%';
  }
  private changeSys() {
    if (JSON.parse(sessionStorage.systemMenu).length > 1) {
      this.isSelectSys = !this.isSelectSys;
    }
  }
  private getAllParentArr(list: Array<any>, id: string) {
    for (let i in list) {
      if (list[i].url === id) {
        //查询到返回该数组对象
        return [list[i]];
      }
      if (list[i].children) {
        let node: any = null;
        node = this.getAllParentArr(list[i].children, id);
        if (node !== undefined) {
          //查询到把父节点连起来
          return node.concat(list[i]);
        }
      }
    }
  }
  @Watch("$route.fullPath")
  routePath(newValue: string) {
    if (newValue.indexOf("OneMap") > -1) {
      this.showFooter = false;
    } else {
      this.showFooter = true;
    }
    // 没有值 直接返回
    if (this.sysCode.length ===0) return;
    // this.goNaviagtion();
    if (sessionStorage.systemMenu) {
      let currArr = this.getAllParentArr(JSON.parse(sessionStorage.systemMenu),(this as any).$route.fullPath)
      if (currArr) {
        this.changeMenu(currArr[currArr.length-2]);
      }
    }
    this.$nextTick(() => {
      let defaultopenkeys = this.sysCode.filter(item => item.path == (this as any).$route.fullPath)[0].parentCode;
      let defaultSelectKeys = this.sysCode.filter(item => item.path == (this as any).$route.fullPath)[0].code;
      (this as any).$store.commit('crumbs/SETOPENKEYS', defaultopenkeys);
      (this as any).$store.commit('crumbs/SETSELECTKEYS', defaultSelectKeys);
    })

  }
}
</script>

<style lang="less" scoped>
.selectSys {
  .home-container {
    height: 100vh;
    background-image: url('./assets/images/bg.png');
    background-repeat: no-repeat;
    background-position: 100% 100%;
    background-size: cover;
    .home-header {
      display: flex;
      justify-content: flex-start;
      padding: 54px 0 0 91px;
      img {
        width: 56px;
        margin-right: 31px;
      }
      span {
        font-family: SourceHanSansCN-Bold;
        font-size: 36px;
        color: #ffffff;
      }
    }
    .home-content {
      padding: 0 218px 0 168px;
      height: calc(100% - 178px);
      display: flex;
      justify-content: center;
      align-items: center;
      .menu-lists {
        .sys-menu {
          display: flex;
          justify-content: flex-start;
          .sysMenu-bg {
            background-image: url('./assets/images/矩形 2 拷贝.png');
            width: 361px;
            height: 164px;
            margin-right: 70px;
            cursor: pointer;
            transition: all 0.5s ease-in-out;
            display: flex;
            align-items: center;
            img {
              height: 56px;
              margin: 0 37px  0 47px;
            }
            div {
              width: 181px;
              font-family: SourceHanSansCN-Bold;
              font-size: 26px;
              color: #ffffff;
            }
          }
          .sysMenu-bg:hover, .sysMenuSelect {
            background-image: url('./assets/images/矩形 2.png');
            div {
              color: #77edff;
            }
          }
        }
        .menu-showA {
          background-image: url('./assets/images/矩形 4.png');
          width: 791px;
          height: 219px;
          margin-top: 42px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .list {
            height: 219px;
            text-align: center;
            cursor: pointer;
            img {
              padding-top: 52px;
            }
            div {
              padding-top: 35px;
              width: 120px;
              color: #ffffff;
            }
          }
          .list:nth-child(3) {
            div {
              width: 112px;
            }
          }
        }
        .menu-showB {
          background-image: url('./assets/images/矩形5.png');
          width: 791px;
          height: 219px;
          margin-top: 42px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .list {
            height: 219px;
            text-align: center;
            cursor: pointer;
            img {
              padding-top: 52px;
            }
            div {
              padding-top: 35px;
              width: 100px;
              color: #ffffff;
            }
          }
          .list:nth-child(3) {
            div {
              width: 112px;
            }
          }
        }
      }
      .login-formbg {
        margin-left: 229px;
      }
    }
    .home-footer {
      padding: 27px 0;
      text-align: center;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #ffffff;
    }
  }
}
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
  background-color: #F0F2F6;
  .user-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 64px;
    background-color: #3e6efa;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.2);
    .sys-name {
      font-family: SourceHanSansCN-Regular;
      font-size: 22px;
      font-weight: bold;
      color: #ffffff;
      padding-left: 42px;
      cursor: pointer;
      img {
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
    }
    .sys-menu-info {
      display: flex;
      justify-content: space-between;
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
        width: 150px;
      }
    }
  }
  .cns-content {
    display: flex;
    justify-content: space-between;
    padding: 20px 20px 0;
    .microframe {
      width: 100%;
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
#frame{
  width: calc(100%);
  height: 100%;
  > div{
    width: 100%;
    height: 100%;
    overflow:auto;
  }
}
</style>
