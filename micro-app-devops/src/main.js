/*
 * @Author: 任继民
 * @Date: 2021-01-08 11:44:17
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-01 15:13:28
 * @Description:
 */
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import routes from "./router";
import actions from "./shared/actions";
import loadAntdCom from './utils/loadAntdCom';
// import store from "./store";
console.log(routes)

let instance = null;
let router = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render(props = {}) {
  if (props) {
    console.log(props)
    // 注入 actions 实例
    actions.setActions(props);
  }

  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  // const { routerBase } = props
  router = createRouter({
    history: createWebHashHistory(window.__POWERED_BY_QIANKUN__ ? "/userdevops" : "/"),
    routes,
  });
  // 挂载应用
  instance = createApp(App)
  // .use(store)
  .use(router)

  loadAntdCom(instance);
  instance.mount('#app');
  // instance = new Vue({
  //   router,
  //   store,
  //   render: (h) => h(instance),
  // }).$mount("#app");
}

if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
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
  console.log("microDevops bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("microDevops mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("microDevops unmount");
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}
