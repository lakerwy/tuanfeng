/*
 * @Author: 任继民
 * @Date: 2020-10-13 18:59:28
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-13 19:02:14
 * @Description: 
 */
const state = {
  useInfo: {},
};
const mutations = {
  setuserInfo(state, info) {
    state.useInfo = info;
  },
};
const getters = {
  getuserInfo(state) {
    return state.useInfo;
  },
};
const actions = {
  actionuserInfo({ commit }, info) {
    commit("setuserInfo", info);
  },
};
export default {
  namespaced: true, // 增加命名空间
  state,
  mutations,
  actions,
  getters,
};
