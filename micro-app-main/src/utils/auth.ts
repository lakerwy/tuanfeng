import { setToken, getToken, clearToken } from './tools'
import shared from "@/shared";
import actions from "@/shared/actions";
import Http from "@/utils/request";

// import config from '@/config'
const SSO_CONFIG = (window as any).mainUrl.sso
// 需要区分环境的配置
const OAUTH_REDIRECT_URI = SSO_CONFIG.OAUTH_REDIRECT_URI
const SSO_BASE_URL = SSO_CONFIG.SSO_BASE_URL
const OAUTH_CLIENT_ID = SSO_CONFIG.OAUTH_CLIENT_ID
const OAUTH_CLIENT_SECRET = SSO_CONFIG.OAUTH_CLIENT_SECRET

const OAUTH_RESPONSE_CODE = 'code'
const OAUTH_GRANT_TYPE = 'authorization_code'
const SSO_OAUTH_AUTHOIZE_URL = SSO_BASE_URL + 'oauth2.0/authorize?response_type=' + OAUTH_RESPONSE_CODE + '&client_id=' + OAUTH_CLIENT_ID + '&redirect_uri=' + OAUTH_REDIRECT_URI
const SSO_OAUTH_ACCESSTOKEN_URL = 'oauth2.0/accessToken'


export const getTokenInfo = (params: any) => {
  return Http.get(`${SSO_BASE_URL}${SSO_OAUTH_ACCESSTOKEN_URL}`, { params })
}

export const handleAuth = async (code: string, callback: Function) => {
  let token = getToken()
  // 没有token，表示未登录/已登录但还没获取token
  if (!sessionStorage.accessToken) {
    // // 登录过但未获取token
    if (code) {
     await requestToken(code)
    } else { // 还未登录，重定向到登录页
      toLogin()
    }
  } else {
    actions.setGlobalState({ accessToken: token, isLogin: false});
    // 有token,直接调用路由钩子函数回调函数
    callback()
  }
  // 有token，表示已经登录过，token过期后需要刷新token
  // else{
  //   refreshToken();
  // }
}

export const toLogin = () => {
  clearAllToken()
  window.location.href = SSO_OAUTH_AUTHOIZE_URL
}

export const requestToken = async  (code: string) => {
  let params = {
    grant_type: OAUTH_GRANT_TYPE,
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    redirect_uri: OAUTH_REDIRECT_URI,
    code: code
  };
  let res: any = await getTokenInfo(params);
  const { expires_in, access_token } = res;
  if (expires_in === 28800) {
    let accessToken = access_token
    if (accessToken) {
      setToken(accessToken);
      sessionStorage.accessToken = accessToken;
      actions.setGlobalState({ accessToken:accessToken, isLogin: false });
      shared.setToken(accessToken);
      // 获取到token，调用路由钩子函数回调函数
      // callback()
    } else {
      toLogin()
    }
  }else {
    toLogin()
  }
  // axios.requestByBaseUrl(SSO_BASE_URL, {
  //   url: SSO_OAUTH_ACCESSTOKEN_URL,
  //   method: 'get',
  //   params: {
  //     grant_type: OAUTH_GRANT_TYPE,
  //     client_id: OAUTH_CLIENT_ID,
  //     client_secret: OAUTH_CLIENT_SECRET,
  //     redirect_uri: OAUTH_REDIRECT_URI,
  //     code: code
  //   }
  // }).then(function (res) {

  //   let accessToken = res.data.access_token
  //   debugger
  //   debugger

  //   debugger
  //   if (accessToken) {
  //     setToken(accessToken);
  //     // actions.setGlobalState({accessToken});
  //     actions.setGlobalState({ accessToken:accessToken });
  //     shared.setToken(accessToken);
  //     // 获取到token，调用路由钩子函数回调函数
  //     callback()
  //   } else {
  //     toLogin()
  //   }
  //   // let refreshToken = res.data.refresh_token
  //   // let timeout  = res.data.expires_in
  //   // if(accessToken && refreshToken){
  //   //   setToken(accessToken)
  //   //   setRToken(refreshToken)
  //   // }else{
  //   //   toLogin();
  //   // }
  // }).catch(function (error: any) {
  //   console.info(error)
  //   // 获取accesstoken失败，表示code过期，需重新登录
  //   toLogin()
  // })
}

// token交互失败时，清空所有token，重新获取
export const clearAllToken = () => {
  clearToken();
  // clearCodeValue();
  // clearRToken()
}

export const logout = () => {
  sessionStorage.clear();
  clearAllToken()
  // console.log((window as any).mainUrl.sso.SSO_BASE_URL + 'logout?service=' +  (window as any).mainUrl.sso.OAUTH_REDIRECT_URI)
  // debugger
  window.location.href = (window as any).mainUrl.sso.SSO_BASE_URL + 'logout?service=' +  (window as any).mainUrl.sso.OAUTH_REDIRECT_URI;
}
