/*
 * @Author: 任继民
 * @Date: 2020-12-15 11:22:45
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-30 11:48:07
 * @Description:动态监测
 */
import Http from '@/libs/request';
const DYNAMICURL = window.globalUrl.DYNAMIC_URL;
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
const userUrl = window.globalUrl.API_HOME;
// const DYNAMICURL = "http://192.168.99.150:8086"

/**
 * 获取行政区划
 * @param params
 */
export const getDistrict = (params) => {
  return Http.get(`${DYNAMICURL}/xzqh/getDistrict`, { params });
}


/**
 * 动态监测概览
 * @param params
 */
export const getDynamicMonOverview = (params) => {
  return Http.get(`${DYNAMICURL}/dynamicMonitoring/overview`, { params });
}

/**
 * 目录树
 * @param params
 */
export const getBusiness = () => {
  return Http.get(`${userUrl}/sys/t-nav-dir/business`);
}

/**
 * 获取监测指标体系树
 * @param params
 */
export const getMonitTree = (params) => {
  return Http.get(`${DYNAMICURL}/dynamicMonitoring/monit/tree`, { params });
}

/**
 * 动态监测概览详情-年份和行政区划数据联动
 * @param params
 */
export const getViewDetail = (params) => {
  return Http.get(`${DYNAMICURL}/dynamicMonitoring/view/detail`, { params });
}

/**
 * 动态监测概览详情-图标年份固定数据
 * @param params
 */
export const getViewTable = (params) => {
  return Http.get(`${DYNAMICURL}/dynamicMonitoring/view/table`, { params });
}
