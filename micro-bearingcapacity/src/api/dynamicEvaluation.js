/*
 * @Author: 任继民
 * @Date: 2020-12-03 13:58:02
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 09:12:24
 * @Description:
 */
import Http from "@/utils/request";
const DYNAMICURL = window.globalUrl.DYNAMIC_URL;
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
const modelUrl = window.globalUrl.API_MODEL;
/**
 * 获取行政区
 * @param params
 */
export const getDistrict = (params) => {
  return Http.get(`${DYNAMICURL}/xzqh/getDistrict`, { params });
}

/**
 * 搜索动态评估
 * @param params
 */
export const dynamicEvaluationSearch = (params) => {
  return Http.get(`${DYNAMICURL}/dynamicEvaluation/search`,  { params } );
}

/**
 * 新增动态评估
 * @param params
 */
export const dynamicEvaluationAdd = (params) => {
  return Http.post(`${DYNAMICURL}/dynamicEvaluation/add`,  params );
}

/**
 * 删除动态评估
 * @param params
 */
export const dynamicEvaluationDel = (params) => {
  return Http.delete(`${DYNAMICURL}/dynamicEvaluation/delete`, { params });
}

/**
 * 更新动态评估
 * @param params
 */
export const dynamicEvaluationUpdate = (params) => {
  return Http.post(`${DYNAMICURL}/dynamicEvaluation/update`,  params );
}

/**
 * 获取监测数据
 * @param params
 */
export const getMonitorData = (params) => {
  return Http.put(`${DYNAMICURL}/dynamicEvaluation/monitorData`,  { params });
}

/**
 * 获取分类监测
 * @param params
 */
export const getIntegratedMonitoring = (params) => {
  return Http.get(`${DYNAMICURL}/carryingCapacity/integratedMonitoring`,  { params });
}

// 请求地图服务的接口 图层数据
export const GetMxdInfoByType = (params) => {
  return Http.post(`${mapBaseUrl}/TFGTKJGH/MapDocService/GetMxdInfoByType`,params ,{formData:true});
}

// 请求模型树
export const getconfiglTree = () => {
  return Http.get(`${modelUrl}/modelconfig/getconfiglTree`);
}

// 请求模型树子节点
export const selectbyspjype = (params) => {
  return Http.get(`${modelUrl}/modeloverview/selectbyspjype`,{ params } );
}

// 请求模型树
export const getconfiglCzl = () => {
  return Http.get(`${modelUrl}/modelcontruct/q/list/czl`);
}

// 动态评估详情
export const getEvaluationDetail = (params) => {
  return Http.get(`${DYNAMICURL}/dynamicEvaluation/getEvaluationDetail`, { params });
}
