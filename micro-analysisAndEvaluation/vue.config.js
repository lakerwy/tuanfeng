/*
 * @Author: 任继民
 * @Date: 2020-10-19 14:44:32
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-22 15:04:02
 * @Description:
 */
const path = require('path');
const resolve = (dir) => {
	return path.join(__dirname, dir);
};
module.exports = {
	// pwa: {
	// 	iconPaths: {
	// 		favicon32: 'favicon.ico',
	// 		favicon16: 'favicon.ico',
	// 		appleTouchIcon: 'favcion.ico',
	// 		maskIcon: 'favcion.ico',
	// 		msTileImage: 'favcion.ico'
	// 	}
  // },
  outputDir: 'childAnalysisEval',
	lintOnSave: false,
	publicPath: './',
	chainWebpack: (config) => {
    config.module
    .rule('fonts')
    .test(/.(ttf|otf|eot|woff|woff2)$/)
    .use('url-loader')
    .loader('url-loader')
    .options({})
    .end()
		// config.entry('main').add('babel-polyfill'); // main为入口文件 babel-polyfill兼容IE的插件
		// config.plugins.delete('prefetch');
		config.resolve.alias
			.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
			.set('_c', resolve('src/components'))
			.set('_v', resolve('src/views'));
	},
	devServer: {
		// 监听端口
		port: 10200,
		// 关闭主机检查，使微应用可以被 fetch
		disableHostCheck: true,
		// 配置跨域请求头，解决开发环境的跨域问题
		headers: {
		  'Access-Control-Allow-Origin': '*'
		},
		proxy: {
			// '/api': {
      //   target: 'http://192.168.99.166:13800',
      //   // terget: 'http://192.168.99.166:13666',
			// 	changeOrigin: true,
			// 	// ws: true,
			// 	pathRewrite: {
			// 		'^/api': '/api'
			// 	}
			// },
			'/server': {
        target: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer',
        // terget: 'http://192.168.99.166:13666',
				changeOrigin: true,
				// ws: true,
				pathRewrite: {
					'^/server': '/server'
				}
			},
		}
	},
	configureWebpack: {
	output: {
		// 微应用的包名，这里与主应用中注册的微应用名称一致
		library: "AnalysisEval",
		// 将你的 library 暴露为所有的模块定义下都可运行的方式
		libraryTarget: 'umd',
		// 按需加载相关，设置为 webpackJsonp_AnalysisEval 即可
		jsonpFunction: `webpackJsonp_AnalysisEval`,
	}
	},
};
