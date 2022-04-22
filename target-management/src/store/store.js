/*
 * @Author: 任继民
 * @Date: 2020-10-13 18:58:57
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-13 19:02:56
 * @Description: 
 */
import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/userInfo';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    useInfo: userModule,
  },
});
