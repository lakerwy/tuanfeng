import service from "../request";

const baseUrl = window.globalUrl.API_ANALYSIS_STATICS;

// 表头信息 查询
export const getTableTitalLists = params => {
  return service.get(`${baseUrl}/TFGTKJGH/ResultCheckService/GetAccessTableNames?id=${params}`);
};

// 表格内容列表
export const getTableDataLists = (params) => {
  return service.get(`${baseUrl}/TFGTKJGH/ResultCheckService/GetDataTableByName`,{params});
};

