/*
 * @Author: 任继民
 * @Date: 2020-12-03 16:05:07
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-13 10:29:06
 * @Description:
 */
import axios from 'axios'
import Cookie from 'js-cookie'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import actions from "@/shared/actions";

// const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
// const mapBaseUrl = 'http://192.168.250.231:5000';
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 请求头部带认证信息
  // 请求头部带认证信息
  const whitelist = ['']
  if (config.url.indexOf(window.globalUrl.API_ONEMAP_STATISTICS) < 0 && config.url.indexOf('http://192.168.250.200') < 0) {
    if (Cookie.get('j_s_id')) {
      config.headers['J-Token'] = Cookie.get('j_s_id');
    }
  }
  // 双评价请求图层的接口解决跨域
  // let reg = /TFGTKJGH\/MapDocService\/GetMxdInfoByType/;
  // if(reg.test(config.url)) {
  //   axios.get( `${mapBaseUrl}/clientaccesspolicy.xml`)
  // }
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  console.log(config)
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
    const res = response
    // console.log(response, 'response')
    if (res.status !== 200) {
      // Message({
      //   message: res.message,
      //   type: 'error',
      //   duration: 3 * 1000
      // })

      // 401:未登录;
      if (res.status === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        })
      }
      return Promise.reject('error')
    } else {
      // return response.data
      return Promise.resolve(response.data)
    }
  },
  error => {
    console.log('err' + error)// for debug
    let tempstatus = null;
    if (error && error.response) {
      switch (error.response.status) {

        case 401:
          actions.onGlobalStateChange((state) => {
            tempstatus = state;
          }, true);
          tempstatus.isLogin = true;
          actions.setGlobalState(tempstatus);
          break;
        default:
          break;
      }
    }
    return Promise.reject(error)
  }
)

export default service
