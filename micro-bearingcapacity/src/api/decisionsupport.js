/*
 * @Author: 任继民
 * @Date: 2020-12-07 16:45:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-21 15:41:29
 * @Description:
 */
import Http from "@/utils/request";
const DYNAMICURL = window.globalUrl.DYNAMIC_URL;
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
/**
 * 问题列表
 * @param params
 */
export const getQuestionList = (params) => {
  return Http.get(`${DYNAMICURL}/questionDecision/questionList`,params);
}


/**
 * 决策列表
 * @param params
 */
export const getDecisionList = (params) => {
  return Http.get(`${DYNAMICURL}/questionDecision/decisionList`,{params});
}

/**
 * 历年承载力情况
 * @param params
 */
export const getQuestionDetails = (params) => {
  return Http.get(`${DYNAMICURL}/questionDecision/questionDetails`,{params});
}

/**
 * 决策建议
 * @param params
 */
export const setDecisionSuggest = (param) => {
  return Http.post(`${DYNAMICURL}/questionDecision/decisionSuggest`, param);
}

/**
 * 决策建议-结果
 * @param params
 */
 export const getQuestionResult = (param) => {
  return Http.get(`${DYNAMICURL}/questionDecision/questionResult`, {param});
}

/**
 * 决策建议-报告
 * @param params
 */
 export const getQuestionReport = (param) => {
  return Http.post(`${DYNAMICURL}/questionDecision/questionReport`, param);
}
