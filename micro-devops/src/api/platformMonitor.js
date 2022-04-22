/*
 * @Author: 任继民
 * @Date: 2020-11-09 16:49:33
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-26 10:34:58
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
const  serverUrl = window.globalUrl.API_SERVICE;
/**
 * 获取在线用户信息
 * @param param
 */
export const getMonitorUser = (params) => {
  return request.get(`${userUrl}/sys/monitor/users`, { params })
}

/**
 * 获取控制列表
 * @param param
 */
export const getServiceControlList = (params) => {
  return request.post(`${serverUrl}/serviceRequestLog/serviceControlList.do`, params,{formData:true})
}

/**
 * 修改控制列表
 * @param param
 */
export const setServicevupdate = (params) => {
  return request.post(`${serverUrl}/serviceRequestLog/vupdate.do`, params,{formData:true})
}

/**
 * 删除控制列表
 * @param param
 */
export const serviceControldel = (params) => {
  return request.post(`${serverUrl}/serviceRequestLog/serviceControldel.do`, params,{formData:true})
}

/**
 * 获取所有用户
 * @param param
 */
export const getAllUser = () => {
  return request.post(`${serverUrl}/data/allUser.do`)
}

/**
 * 获取所有用户
 * @param param
 */
export const getServiceControladd = (params) => {
  return request.post(`${serverUrl}/serviceRequestLog/serviceControladd.do`,params,{formData:true})
}
