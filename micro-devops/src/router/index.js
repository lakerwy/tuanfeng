import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
// import store from '@/store'
// import iView from 'iview'
// import { handleAuth } from '@/libs/auth'
// import { setToken, getToken, canTurnTo, formatRouters } from '@/libs/util'
import config from '@/config'
// import Cookies from 'js-cookie'
// const { homeName } = config
Vue.use(Router)
// 存放加载的动态路由
// let dyncRouters = []

let BASE_URL = ''
switch (process.env.NODE_ENV) {
  case 'development':
    BASE_URL = config.publicPath.dev // 这里是本地的请求url
    break
  case 'production':
    BASE_URL = config.publicPath.pro // 生产环境url
    break
}

const router = new Router({
  base: BASE_URL,
  routes: routes,
  mode: 'hash'
})
// const LOGIN_PAGE_NAME = '_home'

// const permitList = [LOGIN_PAGE_NAME, 'loginSuccess']

// const turnTo = (to, access, next) => {
//   if (!to.name) {
//     // 防止地址栏刷新动态路由跳转到401或404,先跳转到homeName
//     router.replace(to)
//   } else if (canTurnTo(to.name, access, routes)) {
//     next()
//   } else {
//     // 无权限，重定向到401页面
//     next({ replace: true, name: 'error_401' })
//   }
// }
// dyncRouters = dyncRouters.concat(...formatRouters(store.state.user.menus, store.state.user.access))
// // 防止重复添加路由报错
// router.addRoutes(dyncRouters)
// routes.push(...dyncRouters)
// router.beforeEach((to, from, next) => {
//   iView.LoadingBar.start()
//   const token = getToken()
//   if (!token && !permitList.includes(to.name)) {
//     // 未登录,并且不是白名单
//     next({
//       name: LOGIN_PAGE_NAME // 跳转到登录页
//     })
//   } else if (!token && permitList.includes(to.name)) {
//     next() // 跳转
//   } else if (token && to.name === LOGIN_PAGE_NAME) {
//     // 已登录且要跳转的页面是登录页
//     next({
//       name: homeName // 跳转到homeName页
//     })
//   } else {
//     if (store.state.user.hasGetInfo) {
//       turnTo(to, store.state.user.access, next)
//     } else {
//       store.dispatch('getUserInfo').then(res => {
//         if (!dyncRouters || dyncRouters.length === 0) {
//           dyncRouters = dyncRouters.concat(...formatRouters(store.state.user.menus, store.state.user.access))
//           // 防止重复添加路由报错
//           router.addRoutes(dyncRouters)
//           routes.push(...dyncRouters)
//         }
//         turnTo(to, store.state.user.access, next)
//       }).catch(err => {
//         setToken('')
//         next({
//           name: 'login'
//         })
//       })
//     }
//   }
// })
// router.beforeEach((to, from, next) => {
//   const searchParams = new URLSearchParams(window.location.search)
//   // const code = to.query.code;
//   const code = searchParams.get('code')

//   if (to.name === 'forgetpwd') {
//     next()
//   } else {
//     handleAuth(code, () => {
//       if (to.name === LOGIN_PAGE_NAME) {
//         next({
//           name: homeName // 跳转到homeName页
//         })
//       } else {
//         let params = {
//           token: Cookies.get('j_s_id'),
//           code: 'userCenter'
//         }
//         getUserByToken(params).then(res => {
//           if (res.success) {
//             if (res.data.role && res.data.role.code !== '0004') {
//               Message.info('没有权限登录用户管理中心!')
//               localStorage.clear()
//               sessionStorage.clear()
//               Cookies.set('j_s_id_token', '', -1)
//               Cookies.set('j_s_id', '', -1)
//               setTimeout(() => {
//                 window.location.href = window.globalUrl.sso.SSO_BASE_URL + 'logout?service=' + window.globalUrl.sso.OAUTH_REDIRECT_URI
//               }, 2000)
//             }else {
//               next()
//             }
//           }
//         }).catch(err => {
//         })
//         next();
//       }
//     })
//   }
// })
// router.afterEach(to => {
//   iView.LoadingBar.finish()
//   window.scrollTo(0, 0)
// })

export default router
