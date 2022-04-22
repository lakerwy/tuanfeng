/*
 * @Author: 任继民
 * @Date: 2021-01-28 11:16:08
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-07 13:58:56
 * @Description: 机构
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.250.220:10005/sys';

/**
 * 获取机构列表
 * @param params
 */
export const getOrglist = (params) => {
  return request.post(`${userUrl}/sys/t-org/findLike`, params)
}
/**
 * 根据ID获取详细信息
 * @param {*} params
 */
export const getOrgByID = (params) => {
  return request.get(`${userUrl}/sys/t-org/findById`, { params })
}
/**
 * 添加机构
 * @param {*} params
 */
export const addOrg = (params) => {
  return request.post(`${userUrl}/sys/t-org/add`, params)
}
/**
 * 更新机构
 * @param {*} params
 */
export const updateOrg = (params) => {
  return request.post(`${userUrl}/sys/t-org/updateById`, params)
}
/**
 * 删除机构
 * @param {*} params
 */
export const deleteOrg = (params) => {
  return request.get(`${userUrl}/sys/t-org/delById`, { params })
}

/**
 * 根据参数获取用户机构审核列表
 * @param {*} params
 */
export const userAuthorgList = (params) => {
  return request.post(`${userUrl}/sys/t-user-auth-org/findLike`, params)
}

/**
 * 根据id获取详细信息
 * @param {*} params
 */
export const userAuthorgbyID = (params) => {
  return request.get(`${userUrl}/sys/t-user-auth-org/findById`, { params })
}

/**
 * 修改审核状态
 * @param {*} params
 */
export const userAuthorgUpdataStatus = (params) => {
  return request.post(`${userUrl}/sys/t-user-auth-org/updateStatus`, params)
}
/**
 * 申请成为该机构成员
 * @param {*} params
 */
export const userAuthorgAdd = (params) => {
  return request.post(`${userUrl}/sys/t-user-auth-org/add`, params)
}

/**
 * 根据参数获取列表认证管理
 * @param {*} params
 */
export const AuthOrgList = (params) => {
  return request.post(`${userUrl}/sys/t-auth-org/findLike`, params)
}
/**
 * 根据id获取详情认证管理
 * @param {*} params
 */
export const AuthOrgbyID = (params) => {
  return request.get(`${userUrl}/sys/t-auth-org/findById`, { params })
}
/**
 * 修改审核状态认证管理
 * @param {*} params
 */
export const AuthOrgUpdataStatus = (params) => {
  return request.post(`${userUrl}/sys/t-auth-org/updateStatus`, params)
}
/**
 * 修改机构转移状态
 * @param {*} params
 */
export const AuthUpdateOrgTransfer = (params) => {
  return request.post(`${userUrl}/sys/t-target-oruser/updateStatus`, params)
}
