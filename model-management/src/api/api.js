import service from '../request'

const baseUrl = window.globalUrl.API_MODEL;

// 模型总览
// 获取模型列表
export const getModelLists = (params) => {
  return service.get(`${baseUrl}/modeloverview/selectbymodetype?${params}`)
}

// 按属性查询ModelDesc接口
export const getModelListByParams = (params) => {
  return service.get(`${baseUrl}/modeloverview/select`,{ params })
}

// 源数据管理
// 获取源数据列表 查询
export const getDataSourceLists = (params) => {
  return service.get(`${baseUrl}/modelsrc/selectbypage`, { params })
}
// 测试源数据
export const testDataSource = (params) => {
  return service.post(`${baseUrl}/modelsrc/test?id=${params}`)
}
// 新增保存接口
export const addDataSource = (params) => {
  return service.post(`${baseUrl}/modelsrc/save?${params}`)
}
// 删除源数据
export const delDataSource = (params) => {
  return service.delete(`${baseUrl}/modelsrc/delete/${params}`)
}
// 更新源数据
export const editDataSource = (params) => {
  return service.put(`${baseUrl}/modelsrc/update?${params}`)
}

//模型配置
//模型配置左侧树
export const getTreeLists = (params) => {
  return service.get(`${baseUrl}/modelconfig/getconfiglTree`)
}
export const getTreeLists2 = (params) => {
  return service.get(`${baseUrl}/modeloverview/selectbyspjype?spjtype=`+params)
}
//模型配置-查询模型配置
export const getModelData = (params) => {
  return service.get(`${baseUrl}/modelconfig/getmoedlconfig?modelid=`+params)
}
//评价区域模型更新
export const modelinareaUpdate = (params) => {
  return service.put(`${baseUrl}/modelconfig/modelinarea/update?${params}`)
}
//修正规则更新
export const modelrevruleUpdate = (params) => {
  return service.put(`${baseUrl}/modelconfig/modelrevrule/update?${params}`)
}
//评价规则更新
export const modelsplitruleUpdate = (params) => {
  return service.put(`${baseUrl}/modelconfig/modelsplitrule/update?${params}`)
}
//输入数据配置更新
export const spjinputUpdate = (params) => {
  return service.put(`${baseUrl}/modelconfig/spjinput/update?${params}`)
}


//运行监控
//运行监控数据列表
export const getLogList = (params) => {
  return service.get(`${baseUrl}/modelmonitor/selectbypage`, { params })
}
