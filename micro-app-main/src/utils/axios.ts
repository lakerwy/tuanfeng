import axios from 'axios'
// import store from '@/store'
import { getToken } from './tools'
// import { Spin } from 'iview'
import Vue from 'vue'

import { toLogin } from './auth'

axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

class HttpRequest {
  constructor (baseUrl = '') {
    (this as any).baseUrl = baseUrl;
    (this as any).queue = {};
  }
  getInsideConfig () {
    const config = {
      baseURL: (this as any).baseUrl,
      timeout: 5000,
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': 'http://jbone-cms-admin-vue.majunwei.com:8080',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/x-www-form-urlencoded',
        common: { 'Accept': 'multipart/form-data,application/json,text/plain,*/*' },
        'J-Token': getToken()
        // 'X-Requested-With': 'XMLHttpRequest',
      },
      crossDomain: true,
      transformRequest: [function transformRequest (data: any, headers: any) {
        /* 把类似content-type这种改成Content-Type */
        let keys = Object.keys(headers)
        let normalizedName = 'Content-Type'
        keys.forEach(name => {
          if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
          }
        })

        // 对象采用json传参
        if (data && headers['Content-Type'] !== 'multipart/form-data') {
          headers['Content-Type'] = 'application/json;charset=utf-8'
          return JSON.stringify(data)
        }
      }]
    }
    return config
  }
  destroy (url: string) {
    delete (this as any).queue[url]
    if (!Object.keys((this as any).queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance: any, url: string) {
    // 请求拦截
    // 添加请求拦截器
    instance.interceptors.request.use(function (config: any) {
    // 在发送请求之前做某事
      return config
    }, function (error: any) {
    // 请求错误时做些事
    //   this.$Message.info(error.message);
      console.log(error)
      return Promise.reject(error)
    })
    // 响应拦截
    // 添加响应拦截器
    instance.interceptors.response.use(function (response: any) {
      // 对响应数据做些事
      return response
    }, function (error: any) {
      if (error.request.status === 401) {
        console.info('失败了，得跳转到登录页，重新授权')
        // refreshToken();
        toLogin()
      }
      return Promise.reject(error)
    })
  }
  request (options: any) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  requestFile (options: any, file:File) {
    let tconfig = {
      // 添加请求头
      headers: {
        'Content-Type': 'multipart/form-data',
        'J-Token': getToken()
      },
      // 添加上传进度监听事件
      onUploadProgress: (e: any) => {
        var completeProgress = ((e.loaded / e.total * 100) | 0) + '%'
        console.info(completeProgress)
      }
    }
    let param = new FormData()
    param.append('file', file)
    console.log(param.get('file'))
    return axios.post((this as any).baseUrl + '/' + options.url, param, tconfig)
  }

  requestByBaseUrl (burl: string, options: any) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    options.baseURL = burl
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
