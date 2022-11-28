import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    collapse: false,
    user: {
      id: null,
      account: null,
      name: null,
      mail: null,
      authorities: null
    },
    tabList: [{ name: "不合格品列表", path: "/home" }],
    menu: null
  },
  getters: {
  },
  mutations: {
    saveTab(state, tab) {
      if (state.tabList.findIndex(item => item.path === tab.path) === -1) {
        state.tabList.push({ name: tab.name, path: tab.path });
      }
    },
    removeTab(state, tab) {
      const index = state.tabList.findIndex(item => item.name === tab.name);
      state.tabList.splice(index, 1);
    },
    resetTab(state) {
      state.tabList = [{ name: "不合格品列表", path: "/home" }];
    },
    login(state, user) {
      state.user.id = user.id;
      state.user.account = user.account;
      state.user.name = user.name;
      state.user.mail = user.mail;
      state.user.authorities = user.authorities;
    },
    logout(state) {
      state.user.id = null;
      state.user.account = null;
      state.user.name = null;
      state.user.mail = null;
      state.user.authorities = null;
    }

  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(state){//指定需要持久化的数据
        return{
          user: state.user,
          tabList: state.tabList
        }
      }
    })
  ]
})
