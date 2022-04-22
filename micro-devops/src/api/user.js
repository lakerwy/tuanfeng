/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-19 15:17:11
 * @Description:
 */
import request from '@/libs/request'

const  userUrl = window.globalUrl.API_HOME;
// console.log(window.globalUrl)
/**
 * 根据用户信息查询获取列表
 * @param {*} params
 */
export const getUserlist = (params) => {
  return request.post(`${userUrl}/sys/t-user/getUserList`, params)
}
/**
 * 根据用户ID获取用户信息
 * @param {*} params
 */
export const getUserByID = (params) => {
  return request.get(`${userUrl}/sys/t-user/findUserInfoByUserid`, { params })
}
/**
 * 根据token获取用户信息
 * @param {*} params
 */
export const getUserByToken = (params) => {
  return request.post(`${userUrl}/sys/t-user/info`, params)
}
/**
 * 删除用户
 * @param {*} params
 */
export const delteUser = (params) => {
  return request.get(`${userUrl}/sys/t-user/delById`, { params })
}
/**
 * 修改用户信息
 * @param {*} params
 */
export const updateUser = (params) => {
  return request.post(`${userUrl}/sys/t-user/updateUserInfoByUserid`, params)
}
/**
 * 修改用户密码
 * @param {*} params
 */
export const changePasswd = (params) => {
  return request.post(`${userUrl}/sys/t-user/changePasswd`, params)
}

/**
 * 管理员添加用户
 * @param {*} params
 */
export const sysAdd = (params) => {
  return request.post(`${userUrl}/sys/t-user/addUserInfoByUserid`, params)
}
/**
 * 用户列表下拉框
 * @param {*} params
 */
export const userSelect = (params) => {
  return request.post(`${userUrl}/sys/t-user/userSelect`, params)
}
/**
 * 批量删除用户
 * @param {*} params
 */
export const moredelByIds = (params) => {
  return request.post(`${userUrl}/sys/t-user/delByIds`, params)
}
/**
 * 重置用户密码
 * @param {*} params
 */
export const passwdReset = (params) => {
  return request.post(`${userUrl}/sys/t-user/pt/passwdReset`, params)
}
