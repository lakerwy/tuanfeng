/*
 * @Author: 任继民
 * @Date: 2020-10-12 17:14:45
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-22 15:46:13
 * @Description:
 */
import Cookie from 'js-cookie'
import axios from 'axios'
import actions from "@/shared/actions";
import { logout } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 请求头部带认证信息
  if (localStorage.token) {
    config.headers['token'] = '';
  }
  if (Cookie.get('j_s_id')) {
    config.headers['J-Token'] = Cookie.get('j_s_id')
  }
  if (sessionStorage.uCenterName) {
    config.headers['username'] = sessionStorage.uCenterName
  }

  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code非200返错
  * 实际根据后台返回字段去判断
  */
    return response.data;
    // const res = response.data
    // if (res.code !== 200) {
    //   // Message({
    //   //   message: res.message,
    //   //   type: 'error',
    //   //   duration: 3 * 1000
    //   // })

    //   // 401:未登录;
    //   if (res.code === 401) {
    //     // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //     //   confirmButtonText: '重新登录',
    //     //   cancelButtonText: '取消',
    //     //   type: 'warning'
    //     // }).then(() => {

    //     // })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   return response.data
    // }
  },
  error => {
    // console.log('err' + error)// for debug
    if (error && error.response) {
      debugger
      switch (error.response.status) {
        case 401:
        case 400:
          logout()
          break;
        default:
          break;
      }
    }
    return Promise.reject(error)
  }
)

export default service
