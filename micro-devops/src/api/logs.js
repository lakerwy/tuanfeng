/*
 * @Author: 任继民
 * @Date: 2020-10-22 10:14:23
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-15 16:07:56
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.99.132:20001';
const  serverUrl = window.globalUrl.API_SERVICE;
/**
 * 获取运维日志
 * @param param
 */
export const getDevOpslog = (params) => {
  return request.get(`${userUrl}/sys/t-op-log`, { params })
}

/**
 * 备份运维日志
 * @param param
 */
export const backUpDevOpslog = (params) => {
  return request.post(`${userUrl}/sys/t-op-log/excel`, params, { responseType: 'blob' })
}

/**
 * 获取异常日志
 * @param param
 */
export const getErrorlog = (params) => {
  return request.get(`${userUrl}/sys/error-log`, { params })
}

/**
 * 导出异常日志
 * @param param
 */
export const exportErrorlog = (param) => {
  return request.post(`${userUrl}/sys/error-log`, param,  { responseType: 'blob' } )
}

/**
 * 删除异常日志
 * @param param
 */
export const delErrorlog = (params) => {
  debugger
  return request.delete(`${userUrl}/sys/error-log`, {data:params})
}

/**
 * 获取用户操作日志
 * @param param
 */
export const serviceRequestLogList = (param) => {
  return request.post(`${serverUrl}/serviceRequestLog/serviceRequestLogList.do`, param ,{formData:true})
}
