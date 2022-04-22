const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/indexItems',
    component: () => import("@/pages/home/index.vue")
  },
  // 7-1指标项管理
  {
    path: "/indexItems",
    name: "indexItems",
    component: () =>
      import("@/pages/indexManagement/TargetManagement/indexItems/indexItems.vue")
  },
  // 7-2元数据管理
  {
    path: "/meatDataIndex",
    name: "meatDataIndex",
    component: () => import("@/pages/indexManagement/meatData/index.vue")
  },
  // 7-3指标维度管理
  {
    path: "/latitudeIndex",
    name: "latitudeIndex",
    component: () => import("@/pages/indexManagement/latitude/index.vue")
  },
  // 7-4监测指标体系
  {
    path: "/monitor",
    name: "monitor",
    component: () => import("@/pages/indexManagement/TargetSystem/monitor/monitor.vue")
  },
  // 7-5预警指标体系
  {
    path: "/warningTarget",
    name: "warningTarget",
    component: () =>
      import("@/pages/indexManagement/TargetSystem/warningTarget/warningTarget.vue")
  },
  // 7-6评估指标体系
  {
    path: "/assessmentTarget",
    name: "assessmentTarget",
    component: () =>
      import("@/pages/indexManagement/TargetSystem/assessmentTarget/assessmentTarget.vue")
  },
  // 7-7行政区指标体系
  {
    path: "/regionTarget",
    name: "regionTarget",
    component: () =>
      import("@/pages/indexManagement/TargetSystem/regionTarget/regionTarget.vue")
  },
  // 7-8监测值管理
  {
    path: "/monitorIndex",
    name: "monitorIndex",
    component: () => import("@/pages/indexManagement/MonitorManagement/index.vue")
  },
  // 7-9目标值管理
  {
    path: "/targetIndex",
    name: "targetIndex",
    component: () => import("@/pages/indexManagement/TargetManagement/index.vue")
  },
  // 7-10对标值管理
  {
    path: "/ManageIndex",
    name: "ManageIndex",
    component: () => import("@/pages/indexManagement/ManageValue/index.vue")
  },
  // 7-11计算方法配置
  {
    path: "/CalculationIndex",
    name: "CalculationIndex",
    component: () => import("@/pages/indexManagement/Calculation/index.vue")
  },
  // 7-12规划年份配置
  {
    path: "/PlannedYearIndex",
    name: "PlannedYearIndex",
    component: () => import("@/pages/indexManagement/PlannedYear/index.vue")
  },
  // 7-13预警等级配置
  {
    path: "/WarningLevelIndex",
    name: "WarningLevelIndex",
    component: () => import("@/pages/indexManagement/WarningLevel/index.vue")
  },
  // 7-14更新方式配置
  {
    path: "/UpdateWaylIndex",
    name: "UpdateWaylIndex",
    component: () => import("@/pages/indexManagement/UpdateWay/index.vue")
  },
  // 7-15数据字典管理
  {
    path: "/dataDictionaryIndex",
    name: "dataDictionaryIndex",
    component: () => import("@/pages/indexManagement/dataDictionary/index.vue")
  },
  // 7-16运行监控
  {
    path: "/monitoringIndex",
    name: "monitoringIndex",
    component: () => import("@/pages/indexManagement/monitoring/index.vue")
  },
  // 7-17数据源配置
  {
    path: "/dataSourceIndex",
    name: "dataSourceIndex",
    component: () => import("@/pages/indexManagement/dataSource/index.vue")
  },
  // 二次开发API
  {
    path: "/SecondaryDevelopment",
    name: "SecondaryDevelopment",
    component: () => import("@/pages/indexManagement/SecondaryDevelopment/index.vue")
  },
  // 上报监控
  {
    path: "/reportMonitoring",
    name: "reportMonitoring",
    component: () => import("@/pages/indexManagement/reportMonitoring/index.vue")
  },

];

export default routes;
