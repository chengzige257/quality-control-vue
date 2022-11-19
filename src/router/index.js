import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import LoginView from "@/views/login/LoginView";
import BelowStandard from "@/views/product/BelowStandard";
import employeeConfig from "@/views/config/EmployeeConfig";

const routes = [
  {
    path: '',
    name: 'login',
    component: LoginView
  },
  {
    component: HomeView,
    children: [
      {
        path: '/home',
        name: 'product',
        component: BelowStandard
      }
    ]
  },
  {
    component: HomeView,
    children: [
      {
        path: '/employee',
        name: 'employee',
        component: employeeConfig
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
