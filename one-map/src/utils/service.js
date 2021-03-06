/*
 * @Author: 任继民
 * @Date: 2021-02-01 09:37:22
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-03 14:09:00
 * @Description:
 */
import axios from 'axios'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    // console.log(error, error.response) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
      return res
  },
  error => {
    // console.log('err' + error, error.response) // for debug
    return Promise.reject(error)
  }
)

export default service
