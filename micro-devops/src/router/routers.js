import Main from '@/components/main'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/',
    name: 'userManage',
    meta: {
      title: '资源管理'
    },
    redirect: '/serviceManage',
    component: Main,
    children: [
      {
        path: '/serviceManage',
        name: 'serviceManage',
        meta: {
          title: '服务管理',
          notCache: true,
        },
        component: () => import('@/view/module/sourceManage/serviceManage.vue')
      },
      {
        path: '/specialAuth',
        name: 'specialAuth',
        meta: {
          title: '专题服务',
          notCache: true,
        },
        component: () => import('@/view/module/sourceManage/specialAuth.vue')
      },
      {
        path: '/specialManage',
        name: 'specialManage',
        meta: {
          title: '专题管理',
          notCache: true,
        },
        component: () => import('@/view/module/sourceManage/specialManage.vue')
      },
      {
        path: '/specialControl',
        name: 'specialControl',
        meta: {
          title: '专题资源监控',
          notCache: true,
        },
        component: () => import('@/view/module/sourceManage/serviceMonitor.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'userManage',
    meta: {
      title: '首页'
    },
    redirect: '/index',
    component: Main,
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/home/index.vue')
      },
      {
        path: '/userMange',
        name: 'userMange',
        meta: {
          hideInMenu: true,
          title: '用户设置',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/module/system/user/index.vue')
      },
      {
        path: '/roleManage',
        name: 'roleManage',
        meta: {
          hideInMenu: true,
          title: '角色管理'
        },
        component: () => import('@/view/module/system/role/index.vue')
      },
      {
        path: '/user-auth',
        name: 'userAuth',
        meta: {
          hideInMenu: true,
          title: '用户实名认证管理'
        },
        component: () => import('@/view/module/system/realname-auth/index.vue')
      },
      {
        path: '/authorityManage',
        name: 'authorityManage',
        meta: {
          hideInMenu: true,
          title: '权限管理'
        },
        component: () => import('@/view/module/system/authorityManage/index.vue')
      },
      {
        path: '/authManage',
        name: 'authManage',
        meta: {
          hideInMenu: true,
          title: '菜单管理'
        },
        component: () => import('@/view/module/system/authManage/index.vue')
      },
      {
        path: '/organManage',
        name: 'organManage',
        meta: {
          hideInMenu: true,
          title: '机构管理'
        },
        component: () => import('@/view/module/organ/manage.vue')
      },
      {
        path: '/submenu',
        name: 'submenu',
        meta: {
          // hideInMenu: true,
          title: '子系统管理'
        },
        component: () => import('@/view/module/subsystem/index.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'catalogueManage',
    meta: {
      title: '目录管理'
    },
    component: Main,
    children: [
      {
        path: '/catalog',
        name: 'catalog',
        meta: {
          hideInMenu: true,
          title: '目录运维'
        },
        component: () => import('@/view/module/catalogue/catalogue.vue')
      },
      {
        path: '/sourceunit',
        name: 'sourceunit',
        meta: {
          hideInMenu: true,
          title: '来源单位'
        },
        component: () => import('@/view/module/catalogue/sourceunit.vue')
      },
      {
        path: '/dataDoamin',
        name: 'dataDoamin',
        meta: {
          hideInMenu: true,
          title: '数据领域管理'
        },
        component: () => import('@/view/module/catalogue/dataDoamin.vue')
      },
      {
        path: '/mapCatalogue',
        name: 'mapCatalogue',
        meta: {
          hideInMenu: true,
          title: '一张图目录管理'
        },
        component: () => import('@/view/module/catalogue/mapCatalogue.vue')
      },
      {
        path: '/naturalRes',
        name: 'naturalRes',
        meta: {
          hideInMenu: true,
          title: '目录运维'
        },
        component: () => import('@/view/module/catalogue/naturalRes.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'inspection',
    meta: {
      title: '平台巡检'
    },
    component: Main,
    children: [
      {
        path: '/serviceinspection',
        name: 'serviceinspection',
        meta: {
          hideInMenu: true,
          title: '服务器巡检'
        },
        component: () => import('@/view/module/platformInspection/serviceInspection.vue')
      },
      {
        path: '/dbInspection',
        name: 'dbInspection',
        meta: {
          hideInMenu: true,
          title: '数据库巡检'
        },
        component: () => import('@/view/module/platformInspection/dbInspection.vue')
      },
      {
        path: '/platformInspection',
        name: 'platformInspection',
        meta: {
          hideInMenu: true,
          title: '平台服务巡检'
        },
        component: () => import('@/view/module/platformInspection/platformInspection.vue')
      },
    ]

  },
  {
    path: '/',
    name: 'platformmonitor',
    meta: {
      title: '平台监控'
    },
    component: Main,
    children: [
      {
        path: '/currentOnlineUser',
        name: 'currentOnlineUser',
        meta: {
          hideInMenu: true,
          title: '当前在线用户'
        },
        component: () => import('@/view/module/platformmonitor/currentOnlineUser.vue')
      },
      {
        path: '/accessRule',
        name: 'accessRule',
        meta: {
          hideInMenu: true,
          title: '自定义访问规则'
        },
        component: () => import('@/view/module/platformmonitor/accessRule.vue')
      },
    ]

  },
  {
    path: '/',
    name: 'platformstatistics',
    meta: {
      title: '平台统计分析'
    },
    component: Main,
    children: [
      {
        path: '/overallStatistics',
        name: 'overallStatistics',
        meta: {
          hideInMenu: true,
          title: '平台总体统计'
        },
        component: () => import('@/view/module/platformstatistics/overallStatistics.vue')
      },
      {
        path: '/userAccess',
        name: 'userAccess',
        meta: {
          hideInMenu: true,
          title: '用户访问量统计'
        },
        component: () => import('@/view/module/platformstatistics/userAccess.vue')
      },
      {
        path: '/servicesAccess',
        name: 'servicesAccess',
        meta: {
          hideInMenu: true,
          title: '服务访问量统计'
        },
        component: () => import('@/view/module/platformstatistics/servicesAccess.vue')
      },
      {
        path: '/departmentAccess',
        name: 'departmentAccess',
        meta: {
          hideInMenu: true,
          title: '部门访问量统计'
        },
        component: () => import('@/view/module/platformstatistics/departmentAccess.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'logManage',
    meta: {
      title: '日志管理'
    },
    component: Main,
    children: [
      {
        path: '/devOpslog',
        name: 'devopslog',
        meta: {
          hideInMenu: true,
          title: '运维系统日志'
        },
        component: () => import('@/view/module/logManage/devOpslog.vue')
      },
      {
        path: '/sysErrorlog',
        name: 'sysErrorlog',
        meta: {
          hideInMenu: true,
          title: '系统异常日志'
        },
        component: () => import('@/view/module/logManage/errlog.vue')
      },
      {
        path: '/userlog',
        name: 'userlog',
        meta: {
          hideInMenu: true,
          title: '用户访问日志'
        },
        component: () => import('@/view/module/logManage/userlog.vue')
      },
    ]
  }
]
