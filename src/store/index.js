// The Vue build version to load with the `import` command
import Vue from 'vue'
import "babel-polyfill"
import Vuex from 'vuex'
import com from '../common'
Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    hasLogin: false,
    userInfo: {},
  },

  mutations: {
    login(state, userInfo) {
      state.userInfo = userInfo || "";
      state.hasLogin = true;
      com.saveLocalStorage('userInfo', state.userInfo)
    },
  },
})

export default store
