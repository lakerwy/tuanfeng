/*
 * @Author: 任继民
 * @Date: 2020-12-15 09:22:22
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-27 17:08:29
 * @Description:
 */
import Http from '@/libs/request';
const DYNAMICURL = window.globalUrl.DYNAMIC_URL;
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
/**
 * 预警指标体系
 * @param params
 */
export const getWarnTree = (params) => {
  return Http.get(`${DYNAMICURL}/timelyWarning/warnTree`, { params });
}

/**
 * 根据预警树获取指标
 * @param params
 */
export const getIndexByWarnTree = (params) => {
  return Http.get(`${DYNAMICURL}/timelyWarning/getIndexByWarnTree`,{ params });
}
