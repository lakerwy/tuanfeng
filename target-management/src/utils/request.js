/*
 * @Author: 任继民
 * @Date: 2020-10-12 17:14:45
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-12 17:18:38
 * @Description: 
 */
import axios from 'axios'
// import store from '../store/store.js'
import Cookie from 'js-cookie'

// import { getToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: window.globalUrl.TARGET_API, // api的base_url
  // baseURL: window.globalUrl.HOME_API, // api的base_url
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 请求头部带认证信息
  // if (store.getters.token) {
  //   config.headers['token'] = '';
  // }
  if (Cookie.get('j_s_id')) {
    config.headers['J-Token'] = Cookie.get('j_s_id');
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
    const res = response.data
    if (res.code !== 200) {
      console.log(res.msg)
      // 401:未登录;
      if (res.code === 401) {
        this.$confirm({
          title: '你已被登出',
          content: '你已被登出，可以取消继续留在该页面，或者重新登录',
          okText: '重新登录',
          cancelText: '取消',
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
      return res
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service