<!--
 * @Author: 任继民
 * @Date: 2021-04-08 16:35:53
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-28 13:21:24
 * @Description:
-->
<!--
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-10 16:56:38
 * @Description:
-->
<template>
  <section class="home-container">
    <section class="home-header">
      <img src="img/logo.png" alt="" srcset="">
      <span>团风国土空间规划基础信息平台</span>
    </section>
    <section class="home-content">
      <section class="menu-lists">
        <div class="sys-menu">
          <div class="sysMenu-bg" @click="selectMenu(true)">
            <img src="img/云平台.png" alt="">
            <div>国土空间基础信息平台</div>
          </div>
          <div class="sysMenu-bg" @click="selectMenu(false)">
            <img src="img/一张图.png" alt="">
            <div>“一张图”实施监督信息系统</div>
          </div>
        </div>
        <div class="menu-showA" v-show="showMenu">
          <div v-for="item in menu" :key="item.menuCode" class="list" @click="routerWay(item)">
            <!-- <router-link :to="{path: item.path }"> -->
              <img :src="item.icon" alt="" srcset="">
              <div>{{item.title}}</div>
            <!-- </router-link> -->
          </div>
        </div>
        <div class="menu-showB" v-show="!showMenu">
          <div v-for="item in menu" :key="item.menuCode" class="list" @click="routerWay(item)">
            <!-- <router-link :to="{path: item.path }"> -->
              <img :src="item.icon" alt="" srcset="">
              <div>{{item.title}}</div>
            <!-- </router-link> -->
          </div>
        </div>
      </section>
    </section>
    <section class="home-footer">
      <div v-if="false">Copyright©2020-2021 湖北地信科技集团股份有限公司 All Right Reserved.</div>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import LoginModel from './login-form.vue';

@Component({
  components: {
    LoginModel,
  }
})
export default class Home extends Vue {
  menu = [
    {
      key: "OneMap",
      title: "自然资源可视化应用",
      icon: "img/icon-1.png",
      menuCode: "resource",
      path: "/OneMap"
    },
    {
      key: "OneMap",
      title: "支撑专题应用",
      icon: "img/icon-2.png",
      menuCode: "resource",
      path: "/OneMap"
    },
    {
      key: "OneMap",
      title: "资源管理与平台运维管理子系统",
      icon: "img/icon-3.png",
      menuCode: "resource",
      path: "/OneMap"
    },
    {
      key: "OneMap",
      title: "用途管制与专题应用",
      icon: "img/icon-4.png",
      menuCode: "resource",
      path: "/OneMap"
    },
    {
      key: "OneMap",
      title: "开发利用专题应用",
      icon: "img/icon-5.png",
      menuCode: "resource",
      path: "/OneMap"
    },
    {
      key: "OneMap",
      title: "与上级平台数据对接",
      icon: "img/icon-6.png",
      menuCode: "resource",
      path: "/OneMap"
    },
  ];
  showMenu = true;
  private selectMenu(value: any) {
    this.showMenu = value;
  }
  private routerWay(item: any) {
    // @ts-ignore
    this.$router.push({path: item.path})
  }
}
</script>

<style lang="less" scope>
.home-container {
  height: 100vh;
  background-image: url('../../assets/images/bg.png');
  background-repeat: no-repeat;
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
    justify-content: flex-start;
    align-items: center;
    .menu-lists {
      .sys-menu {
        display: flex;
        justify-content: flex-start;
        .sysMenu-bg {
          background-image: url('../../assets/images/矩形 2 拷贝.png');
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
          background-image: url('../../assets/images/矩形 2.png');
          div {
            color: #77edff;
          }
        }
      }
      .menu-showA {
        background-image: url('../../assets/images/矩形 4.png');
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
            width: 80px;
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
        background-image: url('../../assets/images/矩形5.png');
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
            width: 80px;
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
</style>
