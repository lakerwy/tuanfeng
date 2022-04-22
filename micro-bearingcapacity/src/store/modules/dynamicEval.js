/*
 * @Author: 任继民
 * @Date: 2020-12-11 12:47:14
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-11 12:47:18
 * @Description:
 */

const state = {
  selectTreeId: ''
}

const getters = {
  getselectTreeId: (state) => {
    return state.selectTreeId;
  },
}

const mutations = {
  setselectTreeId(state, info) {
    state.selectTreeId = info;
  },
}

const actions = {
  actionselectTreeId({
    commit,
  }, info) {
    commit("setselectTreeId", info);
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
