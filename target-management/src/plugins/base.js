/*
 * @Author: 任继民
 * @Date: 2020-10-13 11:22:40
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-13 11:26:49
 * @Description: 用来处理基础组件
 */
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

// const requireComponent = require.context(
//   '@/components/base', true, /\.vue$/,
// )

// requireComponent.keys().forEach(fileName => {
//   const componentConfig = requireComponent(fileName)

//   const componentName = upperFirst(
//     camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')),
//   )

//   Vue.component(`Base${componentName}`, componentConfig.default || componentConfig)
// })
