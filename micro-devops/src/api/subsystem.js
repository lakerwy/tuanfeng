import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 获取子系统列表
 * @param param
 */
export const getsubSys = (param) => {
  return request.post(`${userUrl}/sys/t-system/findByPage`, param)
}
/**
 * 根据ID获取子系统详细信息
 * @param param
 */
export const getsubSysByID = (param) => {
  return request.get(`${userUrl}/sys/t-system/findById`, { param })
}
/**
 * 新增子系统
 * @param param
 */
export const addsubSysBy = (param) => {
  return request.post(`${userUrl}/sys/t-system/add`, param)
}
/**
 * 更新子系统
 * @param param
 */
export const updatesubSysBy = (param) => {
  return request.post(`${userUrl}/sys/t-system/update`, param)
}
/**
 * 删除子系统
 * @param param
 */
export const deletesubSysBy = (params) => {
  return request.post(`${userUrl}/sys/t-system/delByIds`, params)
}
