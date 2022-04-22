/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-28 18:52:19
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 查询设备
 * @param param
 */
export const devicelist = (params) => {
  return request.post(`${userUrl}/sys/t-pos//findLike`, params)
}
/**
 * 删除设备
 * @param param
 */
export const delDevice = (params) => {
  return request.get(`${userUrl}/sys/t-pos/delById`, { params })
}
/**
 * 根据id查询设备
 * @param param
 */
export const deviceById = (params) => {
  return request.get(`${userUrl}/sys/t-pos/findById`, { params })
}
/**
 * 查询设备
 * @param param
 */
export const updateDevice = (params) => {
  return request.post(`${userUrl}/sys/t-pos/update`, params)
}
/**
 * 新增设备
 * @param param
 */
export const addDevice = (params) => {
  return request.post(`${userUrl}/sys/t-pos/add`, params)
}
/**
 * 分配设备给用户
 * @param param
 */
export const deviceToUser = (params) => {
  return request.post(`${userUrl}/sys/t-pos/posAllotUser`, params)
}
