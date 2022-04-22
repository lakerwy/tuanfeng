/*
 * @Author: 任继民
 * @Date: 2021-01-11 11:42:39
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-11 15:27:46
 * @Description:
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.250.220:10005/sys';
const  serverUrl = window.globalUrl.API_SERVICE;
// const  serverUrl = 'hhtp://192.168.250.220:8081';
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
export const delErrorlog = (param) => {
  return request.delete(`${userUrl}/sys/error-log`, param)
}

/**
 * 获取用户操作日志
 * @param param
 */
export const serviceRequestLogList = (param) => {
  return request.post(`${serverUrl}/serviceRequestLog/serviceRequestLogList.do`, param ,{formData:true})
}
