import axios from "axios";

export const initMenus = (router, store,next) => {//按F5刷新的话vuex里的会被清空，长度变为0
    if (store.state.menu !== null) {//已经登录，并且已经获取菜单
        next()
    }else {
        axios.get("/api/menu").then(response => {
            if (response) {
                let responseData = response.data
                if (responseData.flag) {
                    store.state.menu = responseData.data
                    initRoute(router,store.state)
                    // next({...to,replace: true})//动态加载路由时，解决router4版本的第一次路由不匹配问题
                    next({path: '/index'})//解决router4版本的第一次路由不匹配问题
                } else {


                }
            }
        })
    }
}

const initRoute = (router,state)=> {
    const loadView = view => {//这种引入方式控制台不会报警告
        // 路由懒加载
        if(view === null)
            view = 'home/HomeView.vue'
        return () => import(`@/views/${view}`)
    };
    const menus = state.menu
    const firstLevelMenu = {
        children: [],
        component: loadView('home/HomeView.vue')
    }
    menus.forEach(menu=>{
        let component = menu.component
        menu.component = loadView(menu.component)
        if(component !== null){ //不能以menu.children作为判断条件，因为可能用户能获得一个父菜单，但是该父菜单下没有页面
            firstLevelMenu.children.push(menu)
        } else {
            if(menu.children) {
                menu.children.forEach(children=>{
                    children.component = loadView(children.component)
                })
            }
            state.routerRollBack.push(router.addRoute(menu))
        }

    })
    state.routerRollBack.push(router.addRoute(firstLevelMenu))


}