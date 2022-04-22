/*
 * @Author: 任继民
 * @Date: 2020-10-28 10:07:24
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-20 10:31:00
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
const  datasourceUrl = window.globalUrl.DATASOURCE_URL;
/**
 * 获取数据源管理
 * @params params
 */
export const getDbdata = (params) => {
  return request.get(`${userUrl}/sys/db`, {params})
}

/**
 * 保存数据源管理
 * @params params
 */
export const setDbdata = (params) => {
  return request.post(`${userUrl}/sys/db`, params)
}

/**
 * 更新数据源管理
 * @params params
 */
export const updataDbdata = (params) => {
  return request.put(`${userUrl}/sys/db`, params)
}

/**
 * 删除数据源管理
 * @params params
 */
export const deleteDbdata = (params) => {
  return request.delete(`${userUrl}/sys/db/${params}`)
}

/**
 * 测试数据源连接
 * @params params
 */
export const testDbdata = (params) => {
  return request.post(`${userUrl}/sys/db/connection`, params)
}


/**
 * 根据Ids测试数据源连接
 * @params params
 */
export const testconnectionIds = (params) => {
  return request.post(`${userUrl}/sys/db/connection-ids`, params)
}

/**
 * 查询所有数据源监测信息
 * @params params
 */
 export const datasourcestat = (params) => {
  return request.get(`${datasourceUrl}/datasource/stat`, params)
}
