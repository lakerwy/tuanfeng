/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-28 18:53:29
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 根据参数获取实名认证列表
 * @param param
 */
export const getUserAuth = (params) => {
  return request.post(`${userUrl}/sys/t-user-auth/findLike`, params)
}
/**
 * 根据ID获取实名认证详情
 * @param {*} param
 */
export const getUserAuthByID = (params) => {
  return request.get(`${userUrl}/sys/t-user-auth/findById`, { params })
}
/**
 * 设置审核状态
 * @param {*} params
 */
export const updateUserAuthStatus = (params) => {
  return request.post(`${userUrl}/sys/t-user-auth/updateStatus`, params)
}
