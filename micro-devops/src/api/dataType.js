/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-28 18:51:19
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 获取数据列表
 * @params params
 */
export const getDataType = (params) => {
  return request.post(`${userUrl}/sys/t-data-type/findLike`, params)
}
/**
 * 根据ID获取数据类型
 * @params {*} params
 */
export const getDataTypeByID = (params) => {
  return request.get(`${userUrl}/sys/t-data-type/findById`, { params })
}
/**
 * 新增数据类型
 * @params {*} params
 */
export const addDataType = (params) => {
  return request.post(`${userUrl}/sys/t-data-type/add`, params)
}
/**
 * 修改数据类型
 * @params {*} params
 */
export const updataDataType = (params) => {
  return request.post(`${userUrl}/sys/t-data-type/updateById`, params)
}
/**
 * 删除数据类型
 * @params {*} params
 */
export const deleteDataType = (params) => {
  return request.delete(`${userUrl}/sys/t-data-type/delById`, { params })
}
/**
 * 获取数据类型下拉列表
 * @params {*} params
 */
export const getSelectLIst = (params) => {
  return request.post(`${userUrl}/sys/t-data-type/getSelectLIst`, params)
}
