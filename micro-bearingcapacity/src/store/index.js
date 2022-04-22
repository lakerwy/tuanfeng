/*
 * @Author: 任继民
 * @Date: 2020-11-12 13:46:53
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-11 13:32:51
 * @Description:
 */
import Vue from 'vue'
import Vuex from 'vuex'
import dynamicEval from './modules/dynamicEval'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    dynamicEval: dynamicEval,
  }
})
