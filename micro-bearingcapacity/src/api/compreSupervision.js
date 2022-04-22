/*
 * @Author: 任继民
 * @Date: 2020-12-09 10:10:05
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-16 11:22:08
 * @Description: 综合监管
 */
import Http from "@/utils/request";
const DYNAMICURL = window.globalUrl.DYNAMIC_URL;
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;

/**
 * 总体预警状态
 * @param params
 */
export const getCapacOverview = (params) => {
  return Http.get(`${DYNAMICURL}/carryingCapacity/overview`,{ params });
}
/**
 * 动态监测
 * @param params
 */
export const getIntegratedMonitoring = (params) => {
  return Http.get(`${DYNAMICURL}/carryingCapacity/integratedMonitoring`,{ params });
}

