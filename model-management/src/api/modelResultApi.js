import service from "../request";

const baseUrl = window.globalUrl.API_MODEL;

// 模型分析结果列表
export const getModelResultListRequest = data => {
  return service.post(`${baseUrl}/modelresult/q/page`, data);
};

// 删除模型分析结果
export const deleteModelResultInfoRequest = data => {
  return service.post(`${baseUrl}/modelresult/upd/czl/del`, data);
}

// 新增
export const addModelResultInfoRequest = data=>{
  return service.post(`${baseUrl}/modelresult/upd/czl/save`, data);
}

// 修改
export const updateModelResultInfoRequest = data=>{
  return service.post(`${baseUrl}/modelresult/upd/czl/update`, data);
}

// 详情
export const getModelResultInfoRequest = data=>{
  return service.post(`${baseUrl}/modelresult/get/detail`, data);
}
