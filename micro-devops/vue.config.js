/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:17:40
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-22 15:01:58
 * @Description:
 */
const path = require('path');

module.exports = {
  outputDir: 'childDevops',
  publicPath: './',
  devServer: {
    // 监听端口
    port: 10201,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .test(/.(ttf|otf|eot|woff|woff2)$/)
      .use('url-loader')
      .loader('url-loader')
      .options({})
      .end()
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '_c' :path.resolve(__dirname,'src/components')
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "DevOps",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_DevOps`,
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
