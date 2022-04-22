import Home from "@/pages/home/index";

const routes = [
  {
    path: "/",
    name: "thematicApplication",
    component: Home,
    redirect: "/useControl/conformity",
    children: [
      {
        path: "/useControl/conformity",
        name: "conformity",
        component: () => import("../pages/thematicApplication/index"),
        meta: { title: "合规性检查" },
      },
      {
        path: "/useControl/twoRules",
        name: "twoRules",
        component: () => import("../pages/thematicApplication/index"),
        meta: { title: "两规冲突检测" },
      },
      {
        path: "/developUse/landUse",
        name: "landUse",
        component: () => import("../pages/thematicApplication/index"),
        meta: { title: "土地利用现状分析服务" },
      },
      {
        path: "/developUse/idleLand",
        name: "idleLand",
        component: () => import("../pages/thematicApplication/index"),
        meta: { title: "闲置用地分析服务" },
      },
    ],
  },
];
export default routes;
