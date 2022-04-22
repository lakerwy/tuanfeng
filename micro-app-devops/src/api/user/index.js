/*
 * @Author: 任继民
 * @Date: 2021-01-19 13:55:45
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-05 16:44:08
 * @Description:用户角色权限接口
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.250.220:10005/sys';
console.log(window.globalUrl)
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

/**
 * 获取角色列表
 * @param param
 */
export const getRoles = (param) => {
  return request.post(`${userUrl}/sys/t-role/findLike`, param)
}

/**
 * 根据ID获取角色信息
 * @param  param
 */

export const findById = (params) => {
  return request.get(`${userUrl}/sys/t-role/findById`, { params })
}
/**
 * 删除角色
 * @param params
 */
export const delById = (params) => {
  return request.get(`${userUrl}/sys/t-role/delById`, { params })
}
/**
 * 添加角色
 * @param params
 */
export const addRole = (params) => {
  return request.post(`${userUrl}/sys/t-role/add`, params)
}
/**
 * 编辑角色
 * @param params
 */
export const updateRole = (params) => {
  return request.post(`${userUrl}/sys/t-role/update`, params)
}

/**
 * 添加角色
 * @param params
 */
export const collections = (params) => {
  return request.get(`${userUrl}/sys/t-role/collections`, {params})
}

/**
 * 添加业务类型权限
 * @param params
 */
export const setBusiness = (params) => {
  return request.post(`${userUrl}/sys/t-role/business`, params)
}

/**
 * 添加成果目录权限
 * @param params
 */
export const setCategory = (params) => {
  return request.post(`${userUrl}/sys/t-role/category`, params)
}

/**
 * 添加数据领域权限
 * @param params
 */
export const setDomain = (params) => {
  return request.post(`${userUrl}/sys/t-role/domain`, params)
}

/**
 * 添加来源单位权限
 * @param params
 */
export const setUnit = (params) => {
  return request.post(`${userUrl}/sys/t-role/unit`, params)
}

/**
 * 获取机构列表
 * @param params
 */
export const getOrglist = (params) => {
  return request.post(`${userUrl}/sys/t-org/findLike`, params)
}

/**
 * 获取行政区列表
 * @param param
 */
export const getDistrict = () => {
  return request.get(`${userUrl}/sys/t-xzqh/getSelect`)
}
