import axios from 'axios'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  async config => {
    // console.log(config)
    // do something before request is sent
    // if(config.url.includes("AnalyLandUseStatus")) {
      // axios.get(
      //   window.globalUrl.API_ONEMAP_STATISTICS + "/clientaccesspolicy.xml"
      // );
    // }else {
    //   axios.get(
    //     "http://192.168.250.231:5000/clientaccesspolicy.xml"
    //   );
    // }

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
