const routes = [
  {
    path: "/",
    name: "achievementManagement",
    component: () => import("../components/achievementManagement/index"),
    redirect: "/manage",
    children: [
      {
        path: "/manage",
        name: "manage",
        component: () => import("../views/auditProgress/index")
      },
      {
        // 总体规划
        path: "/taskTree",
        name: "taskTree",
        component: () => import("../views/auditTaskTree/index")
      },
      {
        // 专项规划
        path: "/taskTreeSpecial",
        name: "taskTreeSpecial",
        component: () => import("../views/auditTaskTree/specialIndex")
      },
      {
        // 详情规划
        path: "/taskTreeDetail",
        name: "taskTreeDetail",
        component: () => import("../views/auditTaskTree/detailIndex")
      },
      {
        // 村庄规划
        path: "/taskTreeVillage",
        name: "taskTreeVillage",
        component: () => import("../views/auditTaskTree/villageIndex")
      },
      {
        path: "/planning",
        name: "planning",
        component: () => import("../views/comprehensivePlanning/index")
      }
    ]
  },
  {
    path: "/quality",
    name: "achievementQuality",
    component: () => import("../components/achievementManagement/index"),
    redirect: "/taskManage",
    children: [
      {
        path: "/taskManage",
        name: "taskManage",
        component: () => import("../views/auditManagement/index")
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import("../views/qualityDetail/index")
      },
      {
        //专项
        path: "/specialIndex",
        name: "specialIndex",
        component: () => import("../views/qualityDetail/specialIndex")
      },
      {
        //详情
        path: "/detailIndex",
        name: "detailIndex",
        component: () => import("../views/qualityDetail/detailsIndex")
      },
      {
        //村庄
        path: "/villageIndex",
        name: "villageIndex",
        component: () => import("../views/qualityDetail/villageIndex")
      }
    ]
  }
];

export default routes;
