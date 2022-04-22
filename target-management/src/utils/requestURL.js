
import axios from 'axios'
import Cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: window.globalUrl.API_SERVICE, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {

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
    // console.log(response.data)
    return response.data
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service