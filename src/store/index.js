import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    routerRollBack: [],//删除路由的回调函数
    user: {//用户筛选条件缓存
      id: null,
      account: null,
      name: null,
      mail: null,
      authorities: null
    },
    tabList: [{path: '/index', name: '首页'}],//标签缓存
    currentTabPath: '/index',
    menu: null,
    employeePage: {
      conditionUser: {
        name: "",
        account: "",
        mail: "",
        disable: null
      },
      count: 0,
      current: 1,
      size: 10
    },
  },
  getters: {
  },
  mutations: {
    resetRouter(state) {
      state.routerRollBack.forEach(rollBack =>{
        rollBack()
      })
    },
    saveEmployeePage(state, employeePage){
      state.employeePage.conditionUser.name = employeePage.conditionUser.name
      state.employeePage.conditionUser.account = employeePage.conditionUser.account
      state.employeePage.conditionUser.mail = employeePage.conditionUser.mail
      state.employeePage.conditionUser.disable = employeePage.conditionUser.disable
      state.employeePage.count = employeePage.count
      state.employeePage.current = employeePage.current
      state.employeePage.size = employeePage.size
    },
    removeEmployeePage(state){
      state.employeePage.conditionUser.name = ""
      state.employeePage.conditionUser.account = ""
      state.employeePage.conditionUser.mail = ""
      state.employeePage.conditionUser.disable = null
      state.employeePage.count = 0
      state.employeePage.current = 1
      state.employeePage.size = 10
    },
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
      state.tabList = [{path: '/index', name: '首页'}];
      this.commit('removeEmployeePage')
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
    },
    emptyMenu(state){
      state.menu = null

    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer(state){//指定需要持久化的数据，不写则默认全部
        return{
          user: state.user,
          tabList: state.tabList,
          currentTabPath: state.currentTabPath
        }
      }
    })
  ]
})
