/*
 * @Author: 任继民
 * @Date: 2020-12-10 14:07:00
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-14 10:57:12
 * @Description:
 */
import service from '../request'

// const baseUrl = window.globalUrl.RESOURCE_API;
const baseUrl = window.globalUrl.RESOURCE_API;


// 获取目录树
export const getTreeData = (params) => {
  return service.get(`${baseUrl}/v1/directory`, { params })
}

// 获取目录下的资源文件
export const getResourceList = (params) => {
  return service.get(`${baseUrl}/v1/directory/resources`, { params })
}

// 获取目录下的资源文件列表
export const getResourceFile = (params) => {
  return service.get(`${baseUrl}/v1/directory/files`, { params })
}

// 获取当前任务的版本号
export const getVersions = (params) => {
  return service.get(`${baseUrl}/v1/task/versions/${params}`)
}
