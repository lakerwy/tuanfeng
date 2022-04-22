import service from "../request";
import Qs from "qs";

const baseUrl = window.globalUrl.API_MODEL;

// ModelDesc新增保存接口
export const addModelRequest = data => {
  return service.post(`${baseUrl}/modeloverview/save`, data);
};

// ModelDesc更新接口
export const editModelRequest = data => {
  return service.put(`${baseUrl}/modeloverview/update`, data);
};

// ModelDesc按ID删除批量接口
export const deleteBatchModelRequest = ids => {
  return service.delete(`${baseUrl}/modeloverview/delete`, {
    params: { ids },
    paramsSerializer: function(params) {
      return Qs.stringify(params, { indices: false });
    }
  });
};

// 按ID查询ModelDesc详情接口
export const getModelByIdRequest = params => {
  return service.get(`${baseUrl}/modeloverview/selectbyid`, { params });
};

// 注册模型服务接口
export const registerGraphRequest = data => {
  return service.post(`${baseUrl}/modeloverview/redgistermodel`, data);
};

// 更新模型服务接口
export const updateGraphRequest = data => {
  return service.post(`${baseUrl}/modeloverview/redgisterupate`, data);
};

// 注销模型服务接口
export const destroyGraphRequest = data => {
  return service.post(`${baseUrl}/modeloverview/redgistercancel`, data);
};

// 模型执行
export const exeModelRequest = data =>{
  return service.post(`${baseUrl}/modeloverview/kpimodelcal`, data);
}
