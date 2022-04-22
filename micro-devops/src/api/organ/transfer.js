/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:32
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-28 18:47:17
 * @Description:
 */
import request from '@/libs/request'

const  userUrl = window.globalUrl.API_HOME;
/**
 * 申请机构转移列表
 * @param params
 */
export const getOruser = (params) => {
  return request.post(`${userUrl}/sys/t-target-oruser/findLike`, params)
}
/**
 * 根据id获取详细信息
 * @param params
 */
export const getOruserByID = (params) => {
  return request.post(`${userUrl}/sys/t-target-oruser/findById`, params)
}
/**
 * 根据id获取详细信息
 * @param params
 */
export const updataOruser = (params) => {
  return request.post(`${userUrl}/sys/t-target-oruser/updateStatus`, params)
}
/**
 * 修改机构转移状态
 * @param {*} params
 */
export const AuthUpdateOrgTransfer = (params) => {
  return request.post(`${userUrl}/sys/t-target-oruser/updateStatus`, params)
}
