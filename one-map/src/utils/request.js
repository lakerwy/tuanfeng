/*
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 * @Author: 任继民
 * @LastEditors: 任继民
 */
import { extend } from 'umi-request';
import actions from "@/shared/actions";

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  // console.log(error)
  const { response } = error;
  return response;
};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  //prefix,//: "http://192.168.99.132:20001",
  errorHandler, // 默认错误处理
  //credentials: 'include', // 默认请求是否带上cookie
});

//headers 内容（token）之类的写不进去, 解决方法是加个拦截器
request.interceptors.request.use(async (url, options) => {
  let token = ''
  actions.onGlobalStateChange(state => {
    const { accessToken } = state;
    //// console.log('123456789',accessToken)
    token = accessToken
    // 未登录 - 返回主页
  }, true);
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'J-Token': token
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
    // console.log(response)
    let tempstatus = null;
    if (response.status === 401) {
      actions.onGlobalStateChange((state) => {
        tempstatus = state;
      }, true);
      tempstatus.isLogin = true;
      actions.setGlobalState(tempstatus);
    }
    const data = await response.clone().json();
    return data;
  }
);
export default request;
