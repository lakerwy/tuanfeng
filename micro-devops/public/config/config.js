/*
 * @Author: your name
 * @Date: 2020-01-15 14:59:23
 * @LastEditTime: 2020-11-17 18:48:20
 * @LastEditors: 任继民
 * @Description: In User Settings Edit
 * @FilePath: \userCenter\public\config\config.js
 */
window.globalUrl = {
  // API_HOME: 'http://192.168.99.128:10005', // 用户中心接口地址
  API_HOME: 'http://192.168.99.132:10005/sys', // 用户中心接口地址
  API_SERVICE: 'http://192.168.99.132:8081',
  IMG_UPLOAD: 'http://192.168.100.202:20001', // 上传图片地址 (用户管理后台API地址)
  IMG_PREFIX: 'http://192.168.100.3:10009', // 图片服务器地址
  baseUrl: {
    // dev: 'http://192.168.99.43:10005',
    pro: 'http://192.168.250.29:10005' // 网关地址  暂时没用
  },
  sso: {
    OAUTH_REDIRECT_URI: 'http://192.168.99.146:8080', // 登录返回地址
    SSO_BASE_URL: 'http://192.168.99.132:30001/cas/',
    OAUTH_CLIENT_ID: 'cmsadmin',
    OAUTH_CLIENT_SECRET: 'cmsadmin'
  }
}
