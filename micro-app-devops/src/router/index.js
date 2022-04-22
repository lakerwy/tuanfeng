/*
 * @Author: 任继民
 * @Date: 2021-01-08 13:46:29
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-02 10:15:04
 * @Description: 路由
 */

const routes = [
  // 用户角色
  {
    path: "/userManage",
    name: 'userManage',
    component: () => import("../views/useAndroleManage/user.vue"),
  },
  // 角色
  {
    path: "/roleManage",
    name: 'roleManage',
    component: () => import("../views/useAndroleManage/role.vue"),
  },
  // 菜单
  {
    path: "/menuManage",
    name: 'menuManage',
    component: () => import("../views/menu/index.vue"),
  },
  // 机构
  {
    path: "/organManage",
    name: 'organManage',
    component: () => import("../views/organ/index.vue"),
  },
  // 权限
  {
    path: "/permission",
    name: 'permission',
    component: () => import("../views/permission/index.vue"),
  },
  // 数据库巡检
  {
    path: "/checkDataBase",
    name: 'checkDataBase',
    component: () => import("../views/checkDataBase/index.vue"),
  },
  // 服务器状态
  {
    path: "/serverStatus",
    name: 'serverStatus',
    component: () => import("../views/serverStatus/index.vue"),
  },
  // 平台服务巡检
  {
    path: "/platfromService",
    name: 'platfromService',
    component: () => import("../views/platfromService/index.vue"),
  },

  // 服务管理
  {
    path: "/servicesManage",
    name: 'servicesManage',
    component: () => import("../views/resourceManage/servicesManage.vue"),
  },
  // 专题服务
  {
    path: "/specialServices",
    name: 'specialServices',
    component: () => import("../views/resourceManage/specialServices.vue"),
  },
  // 专题权限
  {
    path: "/specialPermission",
    name: 'specialPermission',
    component: () => import("../views/resourceManage/specialPermission.vue"),
  },
  // 专题监控
  {
    path: "/resourceMonitoring",
    name: 'resourceMonitoring',
    component: () => import("../views/resourceManage/resourceMonitoring.vue"),
  },
  // 在线用户
  {
    path: "/onlineUser",
    name: 'onlineUser',
    component: () => import("../views/onlineUser/index.vue"),
  },
  // 自定义访问规则
  {
    path: "/userdefinedRule",
    name: 'userdefinedRule',
    component: () => import("../views/userdefinedRule/index.vue"),
  },
  // 用户日志
  {
    path: "/userlog",
    name: 'userlog',
    component: () => import("../views/logs/userlog.vue"),
  },
  // 运维日志
  {
    path: "/devopslog",
    name: 'devopslog',
    component: () => import("../views/logs/devopslog.vue"),
  },
  // 运维错误日志
  {
    path: "/errorlog",
    name: 'errorlog',
    component: () => import("../views/logs/errorlog.vue"),
  },
  // 目录相关router
  {
    path: "/dataDomain",
    name: 'dataDomain',
    component: () => import("../views/catalogManage/dataDomain.vue"),
  },
  {
    path: "/sourceUnit",
    name: 'sourceUnit',
    component: () => import("../views/catalogManage/sourceUnit.vue"),
  },
  {
    path: "/businessType",
    name: 'businessType',
    component: () => import("../views/catalogManage/businessType.vue"),
  },
  {
    path: "/dataDirectory",
    name: 'dataDirectory',
    component: () => import("../views/catalogManage/dataDirectory.vue"),
  },
];
export default routes;
