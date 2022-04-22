/*
 * @Author: 任继民
 * @Date: 2020-11-13 16:40:00
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-13 10:28:17
 * @Description:
 */
import axios from 'axios'
import Cookie from 'js-cookie'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import actions from "@/shared/actions";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 500000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 请求头部带认证信息
  if (Cookie.get('j_s_id') && config.url.indexOf(window.globalUrl.API_ONEMAP_STATISTICS) < 0) {
    config.headers['J-Token'] = Cookie.get('j_s_id');
  }
  if(config.isForm) {
        config.responseType = 'arraybuffer';
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
      return Promise.resolve(response)
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
