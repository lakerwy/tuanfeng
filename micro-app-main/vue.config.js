/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:12:36
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-15 09:38:59
 * @Description:
 */
const path = require("path");

module.exports = {
  publicPath: './',
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  //修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  chainWebpack: config =>{
    config.plugin('html')
      .tap(args => {
        args[0].title = "团风国土空间规划基础信息平台";
        return args;
      })
  },
  devServer: {
    port: 8888,
    open: true,
    disableHostCheck: true,
  },
};
