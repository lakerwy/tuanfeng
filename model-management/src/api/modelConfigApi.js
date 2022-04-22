import service from "../request";

const baseUrl = window.globalUrl.API_MODEL;

// 按属性分页查询栅格元数据接口
export const getRasterListRequest = params => {
  return service.get(`${baseUrl}/modelconfig/rasterselectbypage`, { params });
};

// 按属性分页查询矢量元数据接口
export const getVectorListRequest = params => {
  return service.get(`${baseUrl}/modelconfig/vectorselectbypage`, { params });
};

// 模型第一步配置保存接口
export const saveModelStepFirstRequest = data => {
  return service.post(`${baseUrl}/modelconfig/modelstepfirsave`, data);
};

// 模型第二步配置保存接口
export const saveModelStepSecondRequest = data => {
  return service.post(`${baseUrl}/modelconfig/modelstepsecsave`, data);
};

// 模型第三步配置保存接口
export const saveModelStepThreeRequest = data => {
  return service.post(`${baseUrl}/modelconfig/modelstepthrsave`, data);
};

// 模型第四步配置保存接口
export const saveModelStepFourRequest = data => {
  return service.post(`${baseUrl}/modelconfig/modelstepforsave`, data);
};

// 获取报告模板列表
export const getTemplateListRequest = params => {
  return service.get(`${baseUrl}/modelconfig/templatelist`, { params });
};
