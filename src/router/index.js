import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from "@/views/login/LoginView";


const routes = [
  {
    path: '',
    name: 'login',
    component: LoginView,
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
