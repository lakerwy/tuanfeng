import Home from "@/pages/home/index";

const routes = [
  {
    path: "/",
    name: "",
    component: () => import("../pages/oneMap/index"),
    redirect: "/naturalResources",
    // component: () => import('../pages/login/index'),
    // meta: { title: '登录页' }
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/naturalResources",
    children: [
      {
        path: "/naturalResources",
        name: "naturalResources",
        component: () => import("../pages/oneMap/index"),
        meta: { title: "自然资源目录" },
      },
      
    ],
  },
];
export default routes;
