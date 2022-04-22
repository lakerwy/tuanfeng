/*
 * @Author: 任继民
 * @Date: 2020-12-17 14:16:41
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-28 15:06:49
 * @Description: 定期评估
 */
import Http from '@/libs/request';
const DYNAMICURL = window.globalUrl.DYNAMIC_URL;
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
/**
 * 获取评估指标树
 * @param params
 */
export const getEvaluationTree = () => {
  return Http.get(`${DYNAMICURL}/regularEvaluation/getEvaluationTree`);
}

/**
 * 获取地区评估
 * @param params
 */
export const getareaEvaluation = (params) => {
  return Http.get(`${DYNAMICURL}/regularEvaluation/areaEvaluation`, { params });
}

/**
 * 分类汇总
 * @param params
 */
export const getSortSummary = (params) => {
  return Http.get(`${DYNAMICURL}/regularEvaluation/sortSummary?${params}` );
}

/**
 * 获取数据字典
 * @param params
 */
export const getRegularEvaluation = (params) => {
  return Http.get(`${DYNAMICURL}/regularEvaluation`, { params });
}

/**
 * 根据评估指标树获取指标详情
 * @param params
 */
export const getEvaluationIndexByTree = (params) => {
  return Http.get(`${DYNAMICURL}/regularEvaluation/getEvaluationIndexByTree`, { params });
}

/**
 * 上报数量情况
 * @param params
 */
 export const getProgressReport = (params) => {
  return Http.get(`${DYNAMICURL}/regularEvaluation/progressReport`, { params });
}

/**
 * 预警数量情况
 * @param params
 */
 export const getProgressWarning = (params) => {
  return Http.get(`${DYNAMICURL}/regularEvaluation/progressWarning`, { params });
}
