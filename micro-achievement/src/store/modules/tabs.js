/*
 * @Author: 任继民
 * @Date: 2020-11-02 11:40:45
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-27 17:26:49
 * @Description:
 */
// 审查任务一棵树的导航页管理
const state = {
  tabsLists: JSON.parse(sessionStorage.getItem('tabsLists')) || [],
  currentTab:  JSON.parse(sessionStorage.getItem('currentTab')) || {},
  currentIndex: Number(sessionStorage.getItem('currentIndex')) || 0
}

const getters = {
  getTabsLists(state) {
    // 获取导航页列表
    return state.tabsLists;
  },
  getCurrentTab(state) {
    // 获取当前导航
    return state.currentTab;
  },
  getCurrentIndex(state) {
    return state.currentIndex;
  }
}

const mutations = {
  setTabsLists(state, tab) {
    // 将导航页添加进导航页列表
    // 不能使用includes，从session里拿到的指向不一致了
    if(state.tabsLists.some(i => {return i.id === tab.id})) {
      // 如果当前列表存在
      let index = state.tabsLists.findIndex((i) => {return i.label === tab.label})
      this.commit('tabs/setCurrentTab', tab)
      this.commit('tabs/setCurrentIndex', index)
    } else {
      state.tabsLists.push(tab);
      this.commit('tabs/setCurrentTab', tab);
      this.commit('tabs/setCurrentIndex', state.tabsLists.length - 1);
      sessionStorage.setItem('tabsLists', JSON.stringify(state.tabsLists));
    }
  },
  setCurrentTab(state, current) {
    // 设置当前导航页
    state.currentTab = current;
    if (state.currentTab) {
      sessionStorage.currentTab = JSON.stringify(state.currentTab);
    }
  },
  setCurrentIndex(state, index) {
    // 设置当前选中序号
    state.currentIndex = index;
    sessionStorage.currentIndex = state.currentIndex;
  },
  deleteTab(state, index) {
    // 删除导航
    state.tabsLists.splice(index, 1);
    sessionStorage.setItem('tabsLists', JSON.stringify(state.tabsLists));
  }
}

const actions = {
  dispatchDeleteTab({ commit }, index) {
    commit("deleteTab", index);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
