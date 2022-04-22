/*
 * @Author: 任继民
 * @Date: 2021-01-28 14:02:07
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-01 15:24:03
 * @Description:
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.250.220:10005/sys';

 /**
 * 获数据库相关信息
 */
export const getdataBases = (params) => {
  return request.get(`${userUrl}/sys/inspection/dataBases`,{ params })
}

/**
 * 根据Ids测试数据源连接
 * @params params
 */
export const testconnectionIds = (params) => {
  return request.post(`${userUrl}/sys/db/connection-ids`, params)
}

/**
 * 获取服务器相关信息
 */
export const getServicesInfo = () => {
  return request.get(`${userUrl}/sys/inspection/platform`)
}

/**
 * 获数平台服务相关信息
 */
export const getServiceInspectiond = (params) => {
  return request.get(`${userUrl}/sys/inspection/services`,{params})
}
