/*
 * @Author: 任继民
 * @LastEditors: 任继民
 */
import axios from 'axios'
import qs from 'qs';
// import { toLogin } from '@/libs/auth'
import { Message } from 'iview'
import SharedModule from "@/shared";
import actions from "@/shared/actions";

// let baseUrl = ''
// switch (process.env.NODE_ENV) {
//   case 'development':
//     // 这里是本地的请求url
//     baseUrl = config.apiUrl.dev
//     break
//   case 'production':
//     // 生产环境url
//     baseUrl = config.apiUrl.pro
//     break
// }
let baseUrl = '';
/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  // api的base_url
  baseURL: baseUrl,
  // 设置请求超时时间30s
  timeout: 30000
})

service.apiUrl = baseUrl

/**
 * 请求参数处理
 */
service.interceptors.request.use((config) => {
  //  获取token
  // const shareds = SharedModule.getShared();
  let token = null;
  actions.onGlobalStateChange(state => {
    const { accessToken } = state;
    token = accessToken;
    // 未登录 - 返回主页
  }, true);
  // 使用 shared 获取 token
  // const token = shareds.getToken();
  // console.log('token',token)
  if (config.formData) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // config.headers['Cookie111'] = `j_s_id=${token}`
    config.data = qs.stringify(config.data);
  }
  if (token) {
    config.headers['J-Token'] = token
  }
  if (sessionStorage.uCenterName) {
    config.headers['username'] = sessionStorage.uCenterName
  }
  return config
}
)
/**
 * 响应结果处理
 */
service.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data)
    // if (response.data.success) {
    //   // 服务端定义的响应code码为0时请求成功
    //   // 使用Promise.resolve 正常响应
    //   return Promise.resolve(response.data)
    // } else {
    //   // 使用Promise.reject 响应
    //   Message.error({ content: response.data.status.message })
    //   return Promise.reject(response.data)
    // }
  }, error => {
    let message = ''
    let tempstatus = null;
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          actions.onGlobalStateChange((state) => {
            tempstatus = state;
          }, true);
          tempstatus.isLogin = true;
          actions.setGlobalState(tempstatus);
          break
        case 403:
          message = error.response.data.path + ',' + error.response.data.message
          break
        case 502:
          message = '连接服务器失败'
          break
        case 429:
          message = '访问太过频繁，请稍后再试!'
          break
        default:
          message = error.response.data.message ? error.response.data.message : '服务器错误'
          break
      }
      if (error.response.status !== 401) Message.error({ content: message })
      // 请求错误处理
      return Promise.reject(error)
    } else {
      message = '连接服务器失败'
      Message.error({ content: message })
      return Promise.reject(error)
    }
  }
)

export default service
