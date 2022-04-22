/*
 * @Author: 任继民
 * @Date: 2020-12-09 12:13:19
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-30 11:24:10
 * @Description:
 */

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect:'/dynamicSupervisory',
  },
  {
    path: '/dynamicSupervisory',
    name: 'dynamicSupervisory',
    component: () => import('../views/dynamicSupervisory/index.vue')
  },
  {
    path: '/earlyWarning',
    name: 'earlyWarning',
    component: () => import('../views/earlyWarning/index.vue')
  },
  {
    path: '/periodicEvaluation',
    name: 'periodicEvaluation',
    component: () => import('../views/periodicEvaluation/index.vue')
  },
  {
    path: '/singleIndex',
    name: 'singleIndex',
    component: () => import('../views/dynamicSupervisory/singleIndex.vue')
  },
]

export default routes
