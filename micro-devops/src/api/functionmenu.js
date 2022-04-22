/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-28 18:52:38
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 查询系统菜单列表
 * @param param
 */
export const systemMenu = (params) => {
  return request.get(`${userUrl}/sys/t-system-menu/findList`, { params })
}
/**
 * 获取子系统
 * @param {*} params
 */
export const selectList = (params) => {
  return request.get(`${userUrl}/sys/t-system-menu/selectList`, { params })
}
/**
 * 通过ID获取相信信息
 * @param {*} params
 */
export const getsystemMenuByID = (params) => {
  return request.get(`${userUrl}/sys/t-system-menu/findById`, { params })
}
/**
 * 新增菜单
 * @param {*} params
 */
export const addSysMenu = (params) => {
  return request.post(`${userUrl}/sys/t-system-menu/add`, params)
}
/**
 * 修改菜单
 * @param {*} params
 */
export const updateSysMenu = (params) => {
  return request.post(`${userUrl}/sys/t-system-menu/update`, params)
}
/**
 * 删除菜单
 * @param {*} params
 */
export const delSysMenu = (params) => {
  return request.delete(`${userUrl}/sys/t-system-menu/del`, { params })
}
