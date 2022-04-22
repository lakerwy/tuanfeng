/*
 * @Author: 任继民
 * @Date: 2020-12-03 13:36:38
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-17 19:40:37
 * @Description:
 */
const routes = [
  {
    path: '/',
    name: 'achievementManagement',
    component: () => import('../components/achievementManagement/index'),
    redirect: '/resources',
    children: [
      {
        path: '/developing',
        name: 'developing',
        component: () => import('../views/capacityOfResources/index')
      },
      {
        path: '/resources',
        name: 'resources',
        component: () => import('../views/developingSuitable/index')
      },
      {
        path: '/implement',
        name: 'implement',
        component: () => import('../views/implementAnalysis/index')
      },
      {
        path: '/implDetail',
        name: 'implDetail',
        component: () => import('../views/implementDetail/index')
      },
      {
        path: '/riskAnalysis',
        name: 'riskAnalysis',
        component: () => import('../views/implementDetail/index')
      },

    ]
  },
]

export default routes
