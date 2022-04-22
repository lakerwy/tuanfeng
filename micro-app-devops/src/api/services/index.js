/*
 * @Author: 任继民
 * @Date: 2021-01-19 13:56:19
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-08 14:26:19
 * @Description:服务注册相关接口
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_SERVICE;
const pxUrl = window.globalUrl.API_PX;
// const  userUrl = 'http://192.168.99.169:8081';
// const pxUrl = 'http://192.168.99.169:8088';
/**
 * 获取服务列表
 * @param param
 */
export const getServiceList = (params) => {
  return request.post(`${userUrl}/service/serviceList.do`, params ,{formData:true})
}

/**
 * 获取源数据列表
 * @param param
 */
export const getViewData = (params) => {
  return request.get(`${pxUrl}/sys/view`, { params } )
}

/**
 * 获取源数据字典
 * @param param
 */
export const getViewDict = (params) => {
  return request.get(`${pxUrl}/sys/view/dict`, { params })
}

/**
 * 添加注册服务
 * @param param
 */
export const getserviceAdd = (param) => {
  return request.post(`${userUrl}/service/serviceAdd.do`, param ,{formData:true})
}
/**
 * 更新服务
 * @param param
 */
export const getServiceUpdate = (param) => {
  return request.post(`${userUrl}/service/serviceUpdate.do`, param ,{formData:true})
}
/**
 * 删除服务
 * @param param
 */
export const getServiceDeleteById = (param) => {
  return request.post(`${userUrl}/service/serviceDeleteById.do`, param ,{formData:true})
}

/**
 * 启动服务
 * @param param
 */
export const getServiceStart = (param) => {
  return request.post(`${userUrl}/service/serviceStart.do`, param ,{formData:true})
}
/**
 * 停止服务
 * @param param
 */
export const getServiceStop = (param) => {
  return request.post(`${userUrl}/service/serviceStop.do`, param ,{formData:true})
}

/**
 * 获取服务分组
 * @param param
 */
export const getserviceCategoryList = (param) => {
  return request.post(`${userUrl}/serviceCategory/serviceCategoryList.do`, param ,{formData:true})
}

/**
 * 获取服务类型
 * @param {*} param
 */
export const getenabledServiceType = () => {
  return request.post(`${userUrl}/data/enabledServiceType.do`)
}

/**
 * 服务分组
 * @param {*} param
 */
export const getenabledServiceCategory = () => {
  return request.post(`${userUrl}/data/enabledServiceCategory.do`)
}
/**
 * 获取服务类型
 * @param {*} param
 */
export const getfindOrgSelect = () => {
  return request.get(`${userUrl}/data/findOrgSelect.do`)
}

/**
 * 添加服务分组
 * @param param
 */
export const getserviceCategoryAdd = (param) => {
  return request.post(`${userUrl}/serviceCategory/serviceCategoryAdd.do`, param ,{formData:true})
}

/**
 * 更新服务分组
 * @param param
 */
export const getserviceCategoryUpdate = (param) => {
  return request.post(`${userUrl}/serviceCategory/serviceCategoryUpdate.do`, param ,{formData:true})
}

/**
 * 停止服务分组
 * @param param
 */
export const getserviceCategoryDisable = (param) => {
  return request.post(`${userUrl}/serviceCategory/serviceCategoryDisable.do`, param ,{formData:true})
}

/**
 * 删除服务分组
 * @param param
 */
export const getserviceCategoryDelete = (param) => {
  return request.post(`${userUrl}/serviceCategory/serviceCategoryDelete.do`, param ,{formData:true})
}

/**
 * 获取专题申请列表
 * @param param
 */
export const getserviceTypeList = (param) => {
  return request.post(`${userUrl}/serviceType/serviceTypeList.do`, param ,{formData:true})
}

/**
 * 添加专题申请列表
 * @param param
 */
export const getserviceTypeAdd = (param) => {
  return request.post(`${userUrl}/serviceType/serviceTypeAdd.do`, param ,{formData:true})
}

/**
 * 更新专题申请列表
 * @param param
 */
export const getserviceTypeUpdate = (param) => {
  return request.post(`${userUrl}/serviceType/serviceTypeUpdate.do`, param ,{formData:true})
}
/**
 * 停止专题申请列表
 * @param param
 */
export const getserviceTypeDisable = (param) => {
  return request.post(`${userUrl}/serviceType/serviceTypeDisable.do`, param ,{formData:true})
}

/**
 * 删除专题申请列表
 * @param param
 */
export const getserviceTypeDelete = (param) => {
  return request.post(`${userUrl}/serviceType/serviceTypeDelete.do`, param ,{formData:true})
}

/**
 * 获取专题申请上级类型
 * @param param
 */
export const getallServiceType = () => {
  return request.post(`${userUrl}/data/allServiceType.do`)
}

/**
 * 查询专题
 * @param params
 */
export const getpxSubject = (params) => {
  return request.get(`${pxUrl}/api/px-subject`,{params})
}

/**
 * 新增专题
 * @param params
 */
export const addpxSubject = (params) => {
  return request.post(`${pxUrl}/api/px-subject/`, params)
}

/**
 * 修改专题
 * @param params
 */
export const updatepxSubject = (params) => {
  return request.put(`${pxUrl}/api/px-subject/`, params)
}

/**
 * 删除专题
 * @param params
 */
export const delpxSubject = (params) => {
  return request.delete(`${pxUrl}/api/px-subject/`,{params})
}

/**
 * 修改专题下服务
 * @param params
 */
export const updatepxSubjectRelation = (params) => {
  return request.post(`${pxUrl}/api/px-subject/relation`, params)
}

/**
 * 查询专题下服务
 * @param params
 */
export const getpxSubjectServices = (params) => {
  return request.get(`${pxUrl}/api/px-subject/services`, {params})
}

/**
 * 获取服务访问控制
 */
export const getserviceControlList = (param) => {
  return request.post(`${userUrl}/serviceRequestLog/serviceControlList.do`, param ,{formData:true})
}

/**
 * 获取专题监控列表
 */
export const getserviceMonitoring = (params) => {
  return request.get(`${pxUrl}/api/px-subject/monitoring`, { params })
}


