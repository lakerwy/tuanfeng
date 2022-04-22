/*
 * @Author: your name
 * @Date: 2019-10-22 13:38:21
 * @LastEditTime: 2020-11-27 14:46:59
 * @LastEditors: 任继民
 * @Description: In User Settings Edit
 * @FilePath: \userCenter\src\main.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import routes from "./router/routers";
import actions from "@/shared/actions";
import store from './store'
// import { handleAuth } from '@/libs/auth'
import iView from 'view-design'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'view-design/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// import TreeTable from 'tree-table-vue'
import TreeTable from '@/components/tree-table/Table/Table'
import 'highlight.js/styles/googlecode.css' // 样式文件
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// import Cookies from 'js-cookie';
Vue.use(Viewer)
Vue.use(VueRouter);
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.component(TreeTable.name, TreeTable)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
/**
 * 按钮全新控制
 *authorities 多个用,号隔开
 * v-show="hasAuthority('systemUserCreate')"
 * v-show="hasAuthority('systemUserCreate,systemUserUpdate,')"
 * @param authorities
 * @returns {boolean}
 */
// Vue.prototype.hasAuthority = function (authorities) {
//   if (!authorities) {
//     return false
//   }
//   return authorities.split(',').some(item => {
//     return store.state.user.access.includes('ACTION_' + item)
//   })
// }

let instance = null
let router = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render(props = {}) {
  // 当传入的 shared 为空时，使用子应用自身的 shared
  // 当传入的 shared 不为空时，主应用传入的 shared 将会重载子应用的 shared
  // const { shared = SharedModule.getShared() } = props;
  // SharedModule.overloadShared(shared);

  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  // const { routerBase } = props
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /vue
    base: window.__POWERED_BY_QIANKUN__ ? "/devops" : "/",
    mode: "hash",
    routes,
  });

  // 路由进入前获取用户信息
  router.beforeEach((to,from,next)=>{
    let usertoken = '';
    // 添加观察者
    // onGlobalStateChange 第二个入参为 true，代表立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      const { accessToken,useInfoData } = state;
      console.log(state)
      usertoken = accessToken;
      console.log(useInfoData)
      // 未登录 - 返回主页
    }, true);
    if (!sessionStorage.devOps) {
      if (usertoken) {
        console.log(window.globalUrl)
        store.dispatch('getUserInfo').then(res => {
          console.log(res)
        })
        next()
      }else {
        next()
      }
    }else {
      next();
    }

  })
  // 挂载应用
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}
