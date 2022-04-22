/*
 * @Author: 任继民
 * @Date: 2020-11-11 16:06:07
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-22 15:03:10
 * @Description:
 */
const path = require("path");

module.exports = {
  outputDir: "childTargetManag",
  publicPath: "./",
  lintOnSave: false,
  devServer: {
    // 监听端口
    port: 10300,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: {
      "/api": {
        target: "http://192.168.99.150:8778/kpi",
        changeOrigin: true,
        secure:true,
        ws: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "VueMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_VueMicroApp`
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            /* less 变量覆盖，用于自定义 ant design 主题 */
            "primary-color": "rgba(24,144,255,0.5)",
            "link-color": "rgba(24,144,255,0.5)",
            "border-radius-base": "4px"
          }
        }
      }
    }
  }
};
