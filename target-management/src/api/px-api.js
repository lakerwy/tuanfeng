import service from "@/utils/requestPxApi.js";
const baseUrl =window.globalUrl.API_PX;
const baseUrlServe =window.globalUrl.API_SERVICE;

// 二次开发API 左侧树结构
export const getTreeLists =()=> {
  return service.get(`${baseUrl}/service/px-api-type/types`);
};


// 二次开发--删除某一项服务
export const getDeleteLists = params => {
  return service.delete(`${baseUrl}/service/px-api-type/${params}`);
};

// 二次开发--查询分页树状结构数据
export const getDataLists = params => {
  return service.get(`${baseUrl}/service/px-api-type/service`,{params});
};

// 二次开发--添加服务数据
export const getDataListsAdd = params => {
  return service.post(`${baseUrl}/service/px-api-type/services`,params);
};

// 二次开发--查询表格数据
export const getServeDataLists = params => {
  return service.post(`${baseUrlServe}/service/serviceList.do`,params,{formData:true});
};




