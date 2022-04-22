/*
 * @Author: 任继民
 * @Date: 2020-10-26 09:22:54
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-19 16:18:52
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 获取目录树
 * @params params
 */
export const getMetaDataCategory = (params) => {
  return request.get(`${userUrl}/sys/t-metadata-category`, {params})
}
/**
 * 保存目录树
 * @params params
 */
export const setMetaDataCategory = (params) => {
  return request.post(`${userUrl}/sys/t-metadata-category`, params)
}
/**
 * 更新目录树
 * @params params
 */
export const updateMetaDataCategory = (params) => {
  return request.put(`${userUrl}/sys/t-metadata-category`, params)
}
/**
 * 删除目录树
 * @params params
 */
export const deleteMtaDataCategory = (params) => {
  return request.delete(`${userUrl}/sys/t-metadata-category/${params}`)
}

/**
 * 获取来源单位
 * @params params
 */
export const getSourceUnit = (params) => {
  return request.get(`${userUrl}/core/t-source-unit`, {params})
}
/**
 * 保存来源单位
 * @params params
 */
export const setSourceUnit = (params) => {
  return request.post(`${userUrl}/core/t-source-unit`, params)
}
/**
 * 更新来源单位
 * @params params
 */
export const updateSourceUnit = (params) => {
  return request.put(`${userUrl}/core/t-source-unit`, params)
}
/**
 * 删除来源单位
 * @params params
 */
export const deleteSourceUnit = (params) => {
  return request.delete(`${userUrl}/core/t-source-unit/${params}`)
}

/**
 * 获取数据领域
 * @params params
 */
export const getDataDomain = (params) => {
  return request.get(`${userUrl}/core/t-data-domain`, {params})
}
/**
 * 保存数据领域
 * @params params
 */
export const setDataDomain = (params) => {
  return request.post(`${userUrl}/core/t-data-domain`, params)
}
/**
 * 更新数据领域
 * @params params
 */
export const updateDataDomain = (params) => {
  return request.put(`${userUrl}/core/t-data-domain`, params)
}
/**
 * 删除数据领域
 * @params params
 */
export const deleteDataDomain = (params) => {
  return request.delete(`${userUrl}/core/t-data-domain/${params}`)
}


/**
 * 获取一张图目录
 * @params params
 */
export const getBusinessDir = (params) => {
  return request.get(`${userUrl}/sys/t-business-dir`, {params})
}
/**
 * 保存一张图目录
 * @params params
 */
export const setBusinessDir = (params) => {
  return request.post(`${userUrl}/sys/t-business-dir`, params)
}
/**
 * 更新一张图目录
 * @params params
 */
export const updateBusinessDir = (params) => {
  return request.put(`${userUrl}/sys/t-business-dir`, params)
}
/**
 * 删除一张图目录
 * @params params
 */
export const deleteBusinessDir = (params) => {
  return request.delete(`${userUrl}/sys/t-business-dir/${params}`)
}

/**
 * 获取自然资源目录
 * @params params
 */
 export const getResourTree = (params) => {
  return request.get(`${userUrl}/sys/t-natural-resources/tree`, { params })
}

/**
 * 添加自然资源目录
 * @params params
 */
 export const setNaturalResour = (params) => {
  return request.post(`${userUrl}/sys/t-natural-resources`, params )
}

/**
 * 更新自然资源目录
 * @params params
 */
 export const updateNaturalResour = (params) => {
  return request.put(`${userUrl}/sys/t-natural-resources`, params )
}

/**
 * 更新自然资源目录
 * @params params
 */
 export const deleteNaturalResour = (params) => {
  return request.delete(`${userUrl}/sys/t-natural-resources/${params}`)
}
