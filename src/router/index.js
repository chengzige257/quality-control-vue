import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import LoginView from "@/views/login/LoginView";
import BelowStandard from "@/views/product/BelowStandard";
import employeeConfig from "@/views/config/EmployeeConfig";

const routes = [
  {
    component: HomeView,
    children: [
      {
        path: '/product',
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
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
