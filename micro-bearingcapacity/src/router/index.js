/*
 * @Author: 任继民
 * @Date: 2020-11-12 13:46:53
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-24 15:38:22
 * @Description:
 */
const routes = [
  {
    path: '/',
    redirect: '/synthManage'
  },
  {
    path: '/synthManage',
    name: 'synthManage',
    component: () => import('../views/synthManage/index.vue')
  },
  {
    path: '/urbanCos',
    name: 'urbanCos',
    component: () => import('../views/urbanCos/index.vue')
  },
  {
    path: '/dynamicEvaluate',
    name: 'dynamicEvaluate',
    component: () => import('../views/dynamicEvaluate/index.vue')
  },
  {
    path: '/monitoringData',
    name: 'monitoringData',
    component: () => import('../views/dynamicEvaluate/monitoringData.vue')
  },
  {
    path: '/decisionSupport',
    name: 'decisionSupport',
    component: () => import('../views/decisionSupport/index.vue')
  },
  {
    path: '/dynamicDeail',
    name: 'dynamicDeail',
    component: () => import('../views/dynamicEvaluate/detail.vue')
  }
]
export default routes
