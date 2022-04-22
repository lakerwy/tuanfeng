/*
 * @Author: 任继民
 * @Date: 2020-10-21 15:03:04
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-25 09:29:24
 * @Description:
 */
window.mainUrl = {
  API_HOME: "http://192.168.250.220:10005", // 用户中心接口地址
  NACOS_URL: "http://192.168.250.220:8848",
  baseUrl: {
    pro: "http://192.168.250.220:10005" // 网关地址  暂时没用
  },
  sso: {
    OAUTH_REDIRECT_URI: "http://192.168.99.209:8888", // 登录返回地址
    SSO_BASE_URL: "http://192.168.250.220:30001/cas/",
    OAUTH_CLIENT_ID: "cmsadmin",
    OAUTH_CLIENT_SECRET: "cmsadmin"
  }
};
