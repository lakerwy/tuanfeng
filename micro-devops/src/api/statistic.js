/*
 * @Author: 任继民
 * @Date: 2020-11-11 10:16:10
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-18 10:21:43
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_SERVICE;
/**
 * 获取服务访问控制
 */
export const getserviceControlList = (param) => {
  return request.post(`${userUrl}/serviceRequestLog/serviceControlList.do`, param ,{formData:true})
}

/**
 * 获取服务访问次数
 */
export const getserviceRequestLogStatistics = (params) => {
  return request.post(`${userUrl}/serviceRequestLog/serviceRequestLogStatistics.do`, params ,{formData:true})
}


export const getserviceRequestLogIntervalStatistics = (params) => {
  return request.post(`${userUrl}/serviceRequestLog/serviceRequestLogStatistics.do`, params ,{formData:true})
}


