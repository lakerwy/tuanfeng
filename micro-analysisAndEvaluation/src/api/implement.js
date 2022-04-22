/*
 * @Author: 任继民
 * @Date: 2020-12-07 11:37:18
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-10 13:12:41
 * @Description:
 */
import service from '../request'

// const baseUrl = 'http://192.168.99.150:8778/kpi';
const baseUrl = window.globalUrl.API_ANALYSIS_EVALUATE;

// 请求评估树形列表数据
export const getTreeData = (params) => {
  return service({
    url: `${baseUrl}/kpiItemEval/get/list`,
    method: 'get',
    data: params,
  })
}

// 获取评估树子节点
export const geTreeDataChild = (params) => {
  return service.get(`${baseUrl}/kpiItemEval/get/item/list`, { params })
}

// 获取评估的详情
export const getEvaluateData = (params) => {
  return service.get(`${baseUrl}/kpiItem/get/deta`, {params})
}

// 新增评估
export const addEvaluate = (params) => {
  return service.post(`${baseUrl}/kpiItemEval/upd/save`, params)
}

// 获取指标列表
export const getKpiList = (params) => {
  return service.post(`${baseUrl}/kpiItem/get/deta/list`, params)
}

// 新增评估
export const updateEvaluate = (params) => {
  return service.post(`${baseUrl}/kpiItemEval/upd/update`, params)
}

// 删除评估
export const delEvaluate = (params) => {
  return service.get(`${baseUrl}/kpiItemEval/del`, {params})
}

// 获取规划目标值与现状分析
export const getComparision = (params) => {
  return service.post(`${baseUrl}/kpiItem/item/eval`, params)
}

export const getItemSearch = (params) => {
  return service.post(`${baseUrl}/kpiItemEval/get/item/search`, params)
}
