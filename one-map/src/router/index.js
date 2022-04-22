import Home from "@/pages/home/index";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../pages/oneMap/index"),
    redirect: "/oneMap",
    // component: () => import('../pages/login/index'),
    // meta: { title: '登录页' }
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/oneMap",
    children: [
      {
        path: "/oneMap",
        name: "oneMap",
        component: () => import("../pages/oneMap/index"),
        meta: { title: "一张图" },
      },
      {
        path: "/oneMap/multiWindow",
        name: "multiWindow",
        component: () => import("../pages/oneMap/components/multiWindow.vue"),
        meta: { title: "多窗口对比" },
      },
      {
        path: "/oneMap/rollerShutter",
        name: "rollerShutter",
        component: () => import("../pages/oneMap/components/rollerShutter.vue"),
        meta: { title: "卷帘对比" },
      },
      {
        path: "/oneMap/themeMapping",
        name: "themeMapping",
        component: () => import("../pages/oneMap/components/themeMapping.vue"),
        meta: { title: "专题制图" },
      },
      {
        path: "/oneMap/themeMapping/setNewMap",
        name: "setNewMap",
        component: () => import("../pages/oneMap/components/setNewMap.vue"),
        meta: { title: "新建地图" },
      },
      {
        path: "/oneMap/themeMapping/updateMap",
        name: "updateMap",
        component: () => import("../pages/oneMap/components/updateMap.vue"),
        meta: { title: "编辑地图模板" },
      },
      {
        path: "/oneMap/themeMapping/viewMap",
        name: "viewMap",
        component: () => import("../pages/oneMap/components/viewMap.vue"),
        meta: { title: "查看地图模板" },
      },
    ],
  },
];
export default routes;
