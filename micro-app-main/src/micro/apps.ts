/*
 * @Author: 任继民
 * @LastEditors: 任继民
 */
import shared from "@/shared";
import { getNacosInfo } from '@/apis/index';
type appsItem = {
  name: string,
  entry: string,
  container: string,
  activeRule: boolean,
  children?: appsItem[]
};
/**
* 路由监听
* @param {*} routerPrefix 前缀
*/
function genActiveRule(routerPrefix: string) {
  return (location: any) => location.pathname.startsWith(routerPrefix);
}

/**
 * 子应用中的path路由写入数组中
 * 主应用调用子应用中的路由,如果子应用自己调用则不需要在主应用注册子应用路由
 * 主应用匹配子应用路由
 */
// async function initData() {
//   let params = {
//     dataId: 'webSubapplication',
//     group: 'DEFAULT_GROUP',
//     // tenant:'2b05197f-8d20-4121-9c57-d064fc4b48bb' // 开发测试环境切换
//     tenant: 'a2aaa944-2a54-4585-b54d-3a01135e17da'
//   };
//   debugger
//   let res =  await getNacosInfo(params);
//   const { ROUTINEURL } = res as any;
//   process.env.VUE_APP_URL = ROUTINEURL;
// }
const isDev = process.env.NODE_ENV !== "production";
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: "AnalysisEval",
    entry: isDev? `${process.env.VUE_APP_URL}:10200`: '/childAnalysisEval/index.html',
    container: "#frame",
    activeRule: genActiveRule('/analysisEval'),
    // 通过 props 将 shared 传递给子应用
    // props: { shared },
  },
  {
    name: "DevOps",
    entry: isDev? `${process.env.VUE_APP_URL}:10201` : '/childDevops/index.html',
    container: "#frame",
    activeRule: genActiveRule('/devops'),
  },
  {
    name: "OneMap",
    entry: isDev? `${process.env.VUE_APP_URL}:10205` : '/childOneMap/index.html',
    container: "#frame",
    activeRule: genActiveRule('/OneMap'),
  },
  {
    name: "Achievement",
    entry: isDev? `${process.env.VUE_APP_URL}:10206`: '/childAchievement/index.html',
    container: "#frame",
    activeRule: genActiveRule('/achievement'),
  },
  {
    name: "Bearingcapacity",
    entry: isDev? `${process.env.VUE_APP_URL}:10207`: '/childBearing/index.html',
    container: "#frame",
    activeRule: genActiveRule('/bearingcapacity'),
  },
  {
    name: "targetManagement",
    entry: isDev? `${process.env.VUE_APP_URL}:10300`: '/childTargetManag/index.html',
    container: "#frame",
    activeRule: genActiveRule('/targetManagement'),
  },
  {
    name: "naturalResources",
    entry: isDev? `${process.env.VUE_APP_URL}:10301`: '/childNaturalRes/index.html',
    container: "#frame",
    activeRule: genActiveRule('/naturalResources'),
  },
  {
    name: "thematicApplication",
    entry: isDev? `${process.env.VUE_APP_URL}:10302`: '/childThematicApp/index.html',
    container: "#frame",
    activeRule: genActiveRule('/thematicApplication'),
  },
  {
    name: "modelManage",
    entry: isDev? `${process.env.VUE_APP_URL}:10303`: '/childModelManage/index.html',
    container: "#frame",
    activeRule: genActiveRule('/modelManage'),
  },
  {
    name: "monitorWarn",
    entry: isDev? `${process.env.VUE_APP_URL}:10304`: '/childMonitorWarn/index.html',
    container: "#frame",
    activeRule: genActiveRule('/monitorWarn'),
  },
  {
    name: "userdevops",
    entry: isDev? `${process.env.VUE_APP_URL}:30000`: '/childMonitorWarn/index.html',
    container: "#frame",
    activeRule: genActiveRule('/userdevops'),
  }
];
export default apps;
