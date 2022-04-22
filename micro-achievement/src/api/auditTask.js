/*
 * @Author: 任继民
 * @Date: 2020-11-24 16:50:25
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-27 13:32:24
 * @Description:
 */
import service from '../request'

const baseUrl = window.globalUrl.RESOURCE_API;
const writeDataUrl = window.globalUrl.API_ONEMAP_STATISTICS;
// const writeDataUrl = 'http://192.168.99.231:5000';
// 成果审查任务
// 获取审查任务列表 查询
export const getTaskLists = (params) => {
  return service.get(`${baseUrl}/v1/task`, { params })
}

// 上传成果数据文件
export const uploadAchievementFile = (params) => {
  return service.post(`${baseUrl}/v1/task/zip`, params)
}

// 通过id删除审核任务
export const deleteTaskById = (params) => {
  return service.delete(`${baseUrl}/v1/task/${params}`)
}

// 更新审查任务和版本号
export const updateTaskAndVersion = (params) => {
  return service.put(`${baseUrl}/v1/task`, params)
}


// 保存审查任务信息,新建
export const addTask = (params) => {
  return service.post(`${baseUrl}/v1/task`, params)
}

// 上传成功后写入数据库
export const WriteDataPackageFileMetaData = (params) => {
  return service({
    url: `${writeDataUrl}/TFGTKJGH/RestultsPackageService/WriteDataPackageFileMetaData`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取excle数据
export const dataPackageExcelDeal = (params) => {
  return service({
    url: `${writeDataUrl}/TFGTKJGH/FileDealService/ExcelDeal`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取pdf数据
export const dataPackageFileDeal = (params) => {
  return service({
    url: `${writeDataUrl}/TFGTKJGH/FileDealService/FileDeal`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
