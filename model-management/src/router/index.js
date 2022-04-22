/*
 * @Author: 任继民
 * @Date: 2020-10-22 15:44:30
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-22 15:49:23
 * @Description:
 */
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/index"),
    redirect: "modelManager",
    meta: { title: "首页" },
    children: [
      {
        path: "/modelBuilding",
        name: "modelBuilding",
        component: () => import("../views/modelBuilding/index2"),
        meta: { title: "模型构建" }
      },
      {
        path: "/modelConfig",
        name: "modelConfig",
        component: () => import("../views/modelConfig/index"),
        meta: { title: "模型配置" }
      },
      {
        path: "/dataSourceManager",
        name: "dataSourceManager",
        component: () => import("../views/dataSourceManager/index"),
        meta: { title: "数据源管理" }
      },
      {
        path: "/modelManager",
        name: "modelManager",
        component: () => import("../views/modelManager/index"),
        meta: { title: "模型总览" }
      },
      {
        path: "/logManager",
        name: "logManager",
        component: () => import("../views/logManager/index"),
        meta: { title: "运行监控" }
      },
      {
        path: "/resultManager",
        name: "resultManager",
        component: () => import("../views/resultManager/index"),
        meta: { title: "模型结果上报" }
      },
      {
        path: "/fileManager",
        name: "fileManager",
        component: () => import("../views/fileManager/index"),
        meta: { title: "模型文件管理" }
      }
    ]
  }
];

export default routes;
