/*
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 * @Author: 任继民
 * @LastEditors: 任继民
 */
import { extend } from 'umi-request';


/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error;
  console.log(response)
  return response;
};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  //prefix,//: "http://192.168.99.132:20001",
  errorHandler, // 默认错误处理
  timeout: 30000,
  //credentials: 'include', // 默认请求是否带上cookie
});

//headers 内容（token）之类的写不进去, 解决方法是加个拦截器
request.interceptors.request.use(async (url, options) => {
  // // console.log(url)
  // let urlArr = url.split('/')
  // if(urlArr[1] == 'sys' ) {
  //   url = "http://192.168.99.132:20001" + url
  // }else if(urlArr[1] == 'TFGTKJGH') {
  //   url = "http://192.168.250.208:5100" + url
  // }
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    const headers = {
      // 'Content-Type': 'application/json',
      // Accept: 'application/json',
      // 'Authorization': sessionStorage.getItem("accessToken") || ""
      // credentials model 设置为false
    };
    return {
      url,//: "http://192.168.99.132:20001" + url,
      options: { ...options, headers },
    };
  }
});

// response拦截器, 处理response
request.interceptors.response.use(
  async response => {
    const data = await response.clone().json();
    return data;
  }
);
export default request;
