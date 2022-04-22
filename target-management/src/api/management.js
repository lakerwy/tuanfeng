import service from "@/utils/request.js";
import serviceUrl from "@/utils/requestURL.js";
// const baseUrl = window.globalUrl.HOME_API;
const baseUrl = window.globalUrl.TARGET_API;
const baseUrlJs = window.globalUrl.API_SERVICE;

// 指标项--查询分页数据
export const getTaskLists = params => {
  return service.post(`${baseUrl}/kpiItem/get/list`, params);
};

// 指标项--查询分页树状结构数据
export const getSearchTaskTreeLists = params => {
  return service.get(`${baseUrl}/kpiTree/get/search`, {params});
};

// 指标项--查询分页树状结构数据
export const getTaskTreeLists = params => {
  return service.post(`${baseUrl}/kpiTree/get/data`, params);
};

// 指标项--更新树状结构数据
export const getUpdTreeLists = params => {
  return service.post(`${baseUrl}/kpiItem/upd/td`, params);
};

// 指标项--获取所有指标列表
export const getAllLists = params => {
  return service.post(`${baseUrl}/kpiItem/get/deta/list`, params);
};

// 指标项--查询详细信息数据
export const getTaskTreeDetalisLists = params => {
  return service.get(`${baseUrl}/kpiItem/get/all/info?code=` + params);
};

// 指标项--更新数据
export const getTaskTreeUpdLists = params => {
  return service.post(`${baseUrl}/kpiItem/upd/update`, params);
};

// 指标项--新增指标项
export const getAddLists = params => {
  return service.post(`${baseUrl}/kpiItem/upd/save`, params);
};

// 指标项--新增指标项，获取指标编码
export const getCodeValue = () => {
  return service.post(`${baseUrl}/task/s/g/kpi/code`);
};

// 指标项--删除数据
export const getDelLists = params => {
  return service.get(`${baseUrl}/kpiItem/del?id=` + params);
};

// 获取元数据--查询分页数据
export const getMetadataLists = params => {
  return service.post(`${baseUrl}/kpiMetadata/get/list`, params);
};

// 获取元数据--新增元数据
export const getMetadataAddLists = params => {
  return service.post(`${baseUrl}/kpiMetadata/upd/save`, params);
};

// 获取元数据--更新元数据
export const getMetadataUpdLists = params => {
  return service.post(`${baseUrl}/kpiMetadata/upd/update`, params);
};

// 获取元数据--删除元数据
export const getMetadataDelLists = params => {
  return service.get(`${baseUrl}/kpiMetadata/del?id=` + params);
};

// 获取数据源--查询分页数据
export const getdataSourceLists = params => {
  return service.post(`${baseUrl}/kpiResource/get/list`, params);
};

// 获取数据源--新增元数据
export const getdataSourceAddLists = params => {
  return service.post(`${baseUrl}/kpiResource/upd/save`, params);
};

// 获取数据源--测试连接
export const getdataSourceTestLists = params => {
  return service.post(`${baseUrl}/kpiResource/test`, params);
};

// 获取数据源--更新元数据
export const getdataSourceUpdLists = params => {
  return service.post(`${baseUrl}/kpiResource/upd/update`, params);
};

// 获取数据源--删除元数据
export const getdataSourceDelLists = params => {
  return service.get(`${baseUrl}/kpiResource/del?id=` + params);
};

// 获取数据字典--查询分页数据
export const getDataDictionaryLists = params => {
  return service.post(`${baseUrl}/kpiDictionary/get/list`, params);
};

// 获取数据字典--新增分页数据
export const getDataDictionaryAddLists = params => {
  return service.post(`${baseUrl}/kpiDictionary/upd/save`, params);
};

// 获取数据字典--编辑更新数据
export const getDataDictionaryUpdLists = params => {
  return service.post(`${baseUrl}/kpiDictionary/upd/update`, params);
};

// 获取数据字典--删除数据
export const getDataDictionaryDelLists = params => {
  return service.get(`${baseUrl}/kpiDictionary/del?id=` + params);
};

// 获取对标值管理--查询分页数据
export const getManageDataLists = params => {
  return service.post(`${baseUrl}/kpiValueBenchmark/get/list`, params);
};

// 获取对标值管理--批量新增数据
export const getManageDataAddLists = params => {
  return service.post(`${baseUrl}/kpiValueBenchmark/upd/save`, params);
};

// 获取对标值管理--批量新增数据
export const getManageDataAddsLists = params => {
  return service.get(`${baseUrl}/kpiValueBenchmark/upd/save/batch?year=`+ params);
};

// 获取目标值管理--删除数据
export const getManageDataDelLists = params => {
  return service.get(`${baseUrl}/kpiValueBenchmark/del?id=`+ params);
};

// 获取对标值管理--批量删除数据
export const getManageDataDelsLists = params => {
  return service.post(`${baseUrl}/kpiValueBenchmark/del/batch`, params);
};

// 获取对标值管理--编辑更新数据
export const getManageDataUpdLists = params => {
  return service.post(`${baseUrl}/kpiValueBenchmark/upd/update`, params);
};

// 获取运行监控--查询分页数据
export const getMonitoringDataLists = params => {
  return service.post(`${baseUrl}/kpiMonitorvalue/get/list`, params);
};

// 获取运行监控--编辑更新数据
export const getMonitoringDataUpdLists = params => {
  return service.post(`${baseUrl}/kpiMonitorvalue/upd/update`, params);
};

// 获取运行监控--删除数据
export const getMonitoringDataDelLists = params => {
  return service.get(`${baseUrl}/kpiMonitorvalue/upd/del?id=` + params);
};

// 获取运行监控--新增数据
export const getMonitoringDataAddLists = params => {
  return service.post(`${baseUrl}/kpiMonitorvalue/upd/add`, params);
};

// 获取目标值管理--查询分页数据
export const getTargetManageDataLists = params => {
  return service.post(`${baseUrl}/kpiTargetvalue/get/list`, params);
};

// 获取目标值管理--新增数据
export const getTargetManageDataAddLists = params => {
  return service.post(`${baseUrl}/kpiTargetvalue/upd/save`, params);
};

// 获取目标值管理--批量新增数据
export const getTargetManageAddsLists = params => {
  return service.get(`${baseUrl}/kpiTargetvalue/upd/save/batch?year=`+ params);
};

// 获取目标值管理--删除数据
export const getTargetManageDelLists = params => {
  return service.get(`${baseUrl}/kpiTargetvalue/del?id=`+ params);
};

// 获取目标值管理--批量删除数据
export const getTargetManageDelsLists = params => {
  return service.post(`${baseUrl}/kpiTargetvalue/del/batch`, params);
};

// 获取目标值管理--编辑更新数据
export const getTargetManageDataUpdLists = params => {
  return service.post(`${baseUrl}/kpiTargetvalue/upd/update`, params);
};

// 获取计算方法配置--查询分页数据
export const getCalculatLists = params => {
  return service.post(`${baseUrl}/kpiCalculatConfig/get/list`, params);
};

// 获取计算方法配置--更新编辑的数据
export const getCalculatUpdateLists = params => {
  return service.post(`${baseUrl}/kpiCalculatConfig/upd/update`, params);
};

// 获取更新方式配置--查询分页数据
export const getUpdateWayLists = params => {
  return service.post(`${baseUrl}/kpiUpdateconfig/get/list`, params);
};

// 获取更新方式配置--编辑更新数据
export const getUpdateWayUpdLists = params => {
  return service.post(`${baseUrl}/kpiUpdateconfig/upd/update`, params);
};

// 获取更新方式配置--更新数据
export const getUpdCaluLists = params => {
  return service.post(`${baseUrl}/task/s/upd/calcu`, params);
};

// 获取预警等级--查询分页数据
export const getWarningLevelDataLists = params => {
  return service.post(`${baseUrl}/kpiWarnconfig/get/list`, params);
};

// 获取预警等级--编辑更新数据
export const getWarningLevelDataUpdLists = params => {
  return service.post(`${baseUrl}/kpiWarnconfig/upd/update`, params);
};

// 获取预警等级--更新数据预警详情状态
export const getWarningLevelDataInfoLists = params => {
  return service.post(`${baseUrl}/kpiWarnconfig/upd/infoT`, params);
};

// 获取预警等级详情--查询分页数据
export const getWarningDelDataLists = params => {
  return service.get(`${baseUrl}/kpiWarnInfo/get/list?id=` + params);
};

// 获取预警等级详情--删除数据
export const getWarningDelDataDelLists = params => {
  return service.get(`${baseUrl}/kpiWarnInfo/del?id=` + params);
};

// 获取预警等级详情--新增数据
export const getWarningDelDataUpdLists = params => {
  return service.post(`${baseUrl}/kpiWarnInfo/upd/save`, params);
};

// 获取预警等级详情--更改为默认预警等级
export const getWarningDelDataDefaultLists = params => {
  return service.get(`${baseUrl}/kpiWarnInfo/upd/default?id=` + params);
};

// 获取维度管理--查询分页数据
export const getLatitudeDataLists = params => {
  return service.post(`${baseUrl}/kpiDimension/get/page`, params);
};

// 获取维度管理--编辑更新数据
export const getLatitudeDataUpdLists = params => {
  return service.post(`${baseUrl}/kpiDimension/upd/update`, params);
};

// 获取维度管理--新增数据
export const getLatitudeDataAddLists = params => {
  return service.post(`${baseUrl}/kpiDimension/upd/save`, params);
};

// 获取维度管理--删除数据
export const getLatitudeDataDelLists = params => {
  return service.get(`${baseUrl}/kpiDimension/del?id=` + params);
};

// 获取计算方法配置---URL接口（指标计算）
export const getCalculatURLLists = () => {
  return serviceUrl.post(
    `${baseUrlJs}/service/serviceList?rows=999&page=1&create_date_begin=1970-01-01 0:0:0&category_code=zsjs`
  );
};

// 获取计算方法配置---URL接口（模型计算）
export const getCalculatURLmxjsLists = () => {
  return serviceUrl.post(
    `${baseUrlJs}/service/serviceList?rows=999&page=1&create_date_begin=1970-01-01 0:0:0&category_code=mxjs`
  );
};
