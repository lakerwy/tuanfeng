/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:17:40
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-22 15:02:09
 * @Description:
 */
const path = require('path');

module.exports = {
  outputDir: 'childMonitorWarn',
	lintOnSave:false,
  lintOnSave: false,
  publicPath: './',
  devServer: {
    // 监听端口
    port: 10304,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "monitorWarn",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_Bearingcapacity 即可
      jsonpFunction: `webpackJsonp_monitorWarn`,
    }
  },
}
