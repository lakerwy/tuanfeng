/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:30
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-19 14:21:37
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 获取行政区列表
 * @param param
 */
export const getDistrict = (param) => {
  return request.get(`${userUrl}/sys/t-xzqh/getSelect`, param)
}
/**
 * 更新行政区
 * @param {*} param
 */
export const updateDistrict = (param) => {
  return request.post(`${userUrl}/sys/t-xzqh/update`, param)
}
/**
 * 删除行政区
 * @param {*} param
 */
export const deleteDistrict = (param) => {
  return request.post(`${userUrl}/sys/t-xzqh/delByIds`, param)
}
/**
 * 通过ID获取行政区
 * @param {*} param
 */
export const getDistrictByID = (params) => {
  return request.get(`${userUrl}/sys/t-xzqh/findById`, { params })
}
/**
 * 新增行政区
 * @param {*} param
 */
export const addDistrict = (param) => {
  return request.post(`${userUrl}/sys/t-xzqh/add`, param)
}
/**
 * 新增行政区
 * @param {*} param
 */
export const getFindLike = (param) => {
  return request.post(`${userUrl}/sys/t-xzqh/findLike`, param)
}
