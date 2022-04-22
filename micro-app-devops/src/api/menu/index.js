/*
 * @Author: 任继民
 * @Date: 2021-01-28 10:34:38
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-28 10:35:35
 * @Description:
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.250.220:10005/sys';
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
export const selectList = () => {
  return request.get(`${userUrl}/sys/t-system-menu/selectList`)
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
