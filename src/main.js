import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入element-plus和它的图标库
import ElementPlus, {ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入axios和vue-axios
import axios from 'axios'
import vueAxios from 'vue-axios'
import {initMenus} from "@/utils/menu";


router.beforeEach((to, from, next) => {//配置路由守卫
    if(to.path==='/'){
        next()
    }else if(store.state.user.id){
        initMenus(router,store,next,to)
    }else{
        next({ path: '/',query: {redirect: to.path}});
    }
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    switch (response.data.code) {
        case 51000:
            this.$ElMessage.error(response.data.message)
            break;
        case 50000:
            this.$ElMessage.error(response.data.message)
            break;
        case 40400:
            this.$ElMessage.error(response.data.message)
            this.$router.push({ path: '/',query: {redirect: this.$route.path}})
            break;
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});


const app = createApp(App).use(vueAxios,axios).use(store).use(router).use(ElementPlus)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {//注册ElementPlusIconsVue图标,使用方法prefix-icon="Lock"
    app.component(key, component)
}


app.config.globalProperties.$ElMessage = ElMessage
app.mount('#app')