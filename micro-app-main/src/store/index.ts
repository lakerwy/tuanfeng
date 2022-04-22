/*
 * @Author: 任继民
 * @Date: 2021-04-09 09:07:09
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-09 09:18:30
 * @Description:
 */
import Vue from 'vue';
// @ts-ignore
import Vuex from 'vuex';
import getters from '@/store/getters';

Vue.use(Vuex);
const modulesFiles = require.context('./modules', true, /\.ts$/)
const modules = modulesFiles.keys().reduce((modules: any, modulePath: any) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const store = new Vuex.Store({
  modules,
  getters
});
export default store
