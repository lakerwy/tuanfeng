/*
 * @Author: 任继民
 * @Date: 2020-10-21 18:58:52
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-07 17:01:23
 * @Description:
 */
import { commit} from 'vuex';
interface State  {
  token?: string,
  mainName?: string,
  subName?: string,
  thirdName?: string,
}
const state: State = {
  token: '',
  mainName : '',
  subName: '',
  thirdName: ''
}

const getters = {
  getmainMenu(): string {
    return state.mainName || sessionStorage.mainName;
  },
  getSubmenuName(name: string): void {
    return state.mainName || sessionStorage.mainName;
  },
  getThirdmenuName(): string {
    return state.thirdName || sessionStorage.thirdName;
  }
}

const mutations = {
  setmainMenu(state:State, info:string) {
    state.mainName = info;
  }
}

const actions = {
  dispatchDeleteTab({ commit }, index) {
    commit("deleteTab", index);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
