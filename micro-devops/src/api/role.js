/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-19 11:12:36
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
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
 * 添加角色
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
