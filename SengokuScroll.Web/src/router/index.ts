import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MainView from '@/views/MainView.vue'
import RouterConstant from '@/constants/router-constant'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: RouterConstant.main,
    component: MainView
  },
  {
    path: '/',
    name: RouterConstant.gameMapEditor,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/GameMapEditorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
