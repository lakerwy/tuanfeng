import service from "../request";

const baseUrl = window.globalUrl.API_ETL;

export const getETLInfoRequest = params => {
  return service.get(`${baseUrl}/etl/api/modelLocation/get/detail`, {
    params
  });
};

// 按属性分页查询ETL文件
export const getETLListRequest = data => {
  return service.post(`${baseUrl}/etl/api/modelLocation/get/list`, data);
};

// 新增ETL文件
export const addETLListRequest = data => {
  return service.post(`${baseUrl}/etl/api/modelLocation/upd/save`, data);
};

// 更新ETL文件
export const editETLListRequest = data => {
  return service.post(`${baseUrl}/etl/api/modelLocation/upd/update`, data);
};

// 删除ETL文件
export const deleteETLListRequest = params => {
  return service.get(`${baseUrl}/etl/api/modelLocation/del`, { params });
};

// 模型关联
export const relationModelRequest = params => {
  return service.get(`${baseUrl}/etl/api/modelLocation/up/desc`, { params });
}
