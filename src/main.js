import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入element-plus和它的图标库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

router.beforeEach((to, from, next) => {//配置路由守卫

    if(to.path==='/'||store.state.user.id){
        next()
    }else{
        next({ path: '/',query: {redirect: to.path}});
    }
});

const app = createApp(App).use(store).use(router).use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {//注册ElementPlusIconsVue图标,使用方法prefix-icon="Lock"
    app.component(key, component)
}

app.mount('#app')