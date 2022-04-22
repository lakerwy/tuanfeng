/*
 * @Author: 任继民
 * @Date: 2020-10-29 14:50:45
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-28 15:09:30
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 获取服务器相关信息
 */
export const getServicesInfo = () => {
  return request.get(`${userUrl}/sys/inspection/platform`)
}

/**
 * 获数据库相关信息
 */
export const getdataBases = (params) => {
  return request.get(`${userUrl}/sys/inspection/dataBases`,{ params })
}

/**
 * 获数据库相关信息
 */
export const getServiceInspectiond = (params) => {
  return request.get(`${userUrl}/sys/inspection/services`,{params})
}
