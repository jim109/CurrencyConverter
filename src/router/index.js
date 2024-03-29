 import { createRouter, createWebHashHistory } from 'vue-router'

import isAuthenticatedGuard from '../auth/router/auth-guard'
import authRouter from '../auth/router'

const routes = [
    // {
    //   path: '/',
    //   ...authRouter,
    // },
    {
      path:'/',
      // beforeEnter: [ isAuthenticatedGuard ],
      name: 'converter',
      component: () => import('../converter/pages/ConverterPage.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: () => ({ name: 'login'}) }
  ]
  const router = createRouter({
    history: createWebHashHistory(),
    routes
  }) 



 export default router
