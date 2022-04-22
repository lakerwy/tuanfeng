import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    fullScreen: true
  },
  mutations: {
    fullScreenChange (state) {
      state.fullScreen = !state.fullScreen
    },
  }
})
export default store
