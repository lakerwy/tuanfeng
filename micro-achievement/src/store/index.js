import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from './modules/user'
import TabsModule from './modules/tabs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: UserModule,
    tabs: TabsModule
  }
})
