/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-23 08:58:15
 * @Description:
 */
import Vue from "vue";
import Antd from "ant-design-vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import routes from "./routes";
import store from "./store/index";
import startQiankun from "./micro";
import 'ant-design-vue/dist/antd.css';
import "./assets/styles/locale.antd.css";
import { handleAuth } from '@/utils/auth';
import { getNacosInfo } from '@/apis/index';
import yaml from "js-yaml"
Vue.use(VueRouter);
Vue.use(Antd);
Vue.config.productionTip = false;
// 为 Angular 微应用所做的 zone 包注入
// 如果没有 Angular 微应用，请删除这行代码
// import "zone.js/dist/zone";


/**
 * 由于 window 中获取到的 document 对象不是真正的 document 对象，在业务逻辑中使用到此对象比较的地方都会挂掉。
 * 目前是在 vue 组件库 element-ui 中遇到的，在 popper.js 文件中有一段经典的父节点递归查找操作：
 * 暂时这样子处理 后边qinakun解决了删除该代码
 */
 // TODO
var rawGetComputedStyle = window.getComputedStyle;
(window as any).getComputedStyle = function (el: Document, pseudoElt: string) {
  if (el === document) return {'overflow': 'auto'};
  return rawGetComputedStyle((el as any), pseudoElt);
}

// 解决定位问题
// 既然 popper.js 拿了 document 作为 offsetParent 对象，那将错就错，把 document 对象模拟成 document.documentElement 对象，使它可以正常运作
Object.defineProperty(document, 'scrollLeft', {
  get () {
    return document.documentElement.scrollLeft;
  }
});
Object.defineProperty(document, 'scrollTop', {
  get () {
    return document.documentElement.scrollTop;
  }
});


/**
 * 注册路由实例
 * 即将开始监听 location 变化，触发路由规则
 */
const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to,from,next)=>{
  const searchParams = new URLSearchParams(window.location.search)
  // const code = to.query.code;
  const code = searchParams.get('code')

  // if (to.name === 'forgetpwd') {
  //   next()
  // } else {
  handleAuth(code as any, async () => {
    if (to.name === '_home') {
      next({
        name: 'index' // 跳转到homeName页
      })
    } else {
      // 登录后获取配置中心信息
      let params = {
        dataId: 'web',
        group: 'DEFAULT_GROUP',
        tenant: 'tf-dev'
      };
      let res =  await getNacosInfo(params);
      yaml.safeLoadAll((res as any), function (doc) {
        (window as any).globalUrl = doc.webConfig;
      });
      next();
    }
  })
  // }
})

new Vue({
  router,
  // @ts-ignore
  store,
  render: (h) => h(App),
}).$mount("#main-app");

startQiankun();
