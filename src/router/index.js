import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from "@/views/login/LoginView";
import DefaultPage from "@/views/home/DefaultPage";
import HomeView from "@/views/home/HomeView";




const routes = [
  {
    path: '',
    name: 'login',
    component: LoginView,
  },
  {
    component: HomeView,
    children: [
      {
        path: '/index',
        name: '首页',
        component: DefaultPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
