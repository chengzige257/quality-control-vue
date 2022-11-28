import axios from "axios";
export const initMenus = (router, store,next,to) => {//按F5刷新的话vuex里的会被清空，长度变为0
    if (store.state.menu !== null) {
        next()
    }else {
        axios.get("/menu").then(response => {
            if (response) {
                let responseData = response.data
                if (responseData.flag) {
                    store.state.menu = responseData.data
                    initRoute(router,store.state)
                    next({...to,replace:true})//解决router4版本的第一次路由不匹配问题
                } else {
                    this.$ElMessage.error('请求菜单失败')
                }
            }
        })
    }
}

const initRoute = (router,state)=> {
    const loadView = view => {//这种引入方式控制台不会报警告
        // 路由懒加载
        return () => import(`@/views/${view}`)
    };
    const menus = state.menu
    const firstLevelMenu = {
        children: [],
        component: loadView('home/HomeView.vue')
    }
    menus.forEach(menu=>{
        menu.component = loadView(menu.component)
        if(menu.children === null || menu.children.length === 0){
            firstLevelMenu.children.push(menu)
        }else{
            menu.children.forEach(children=>{
                children.component = loadView(children.component)
            })
            router.addRoute(menu)
        }
    })
    router.addRoute(firstLevelMenu)
}