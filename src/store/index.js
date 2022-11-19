import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
export default createStore({
  state: {
    user: {
      id: null,
      account: null,
      name: null,
      mail: null
    }
  },
  getters: {
  },
  mutations: {
    login(state, user) {
      state.user.id = user.id;
      state.user.acount = user.acount;
      state.user.name = user.name;
      state.user.mail = user.mail;
    },
    logout(state) {
      state.user.id = null;
      state.user.account = null;
      state.user.name = null;
      state.user.mail = null;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
