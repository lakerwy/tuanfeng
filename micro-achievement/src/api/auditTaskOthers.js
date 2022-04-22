import service from "../request";

const baseUrl = window.globalUrl.RESOURCE_API;
// const baseUrl = window.globalUrl.HOME_API;
// const writeDataUrl = 'http://192.168.99.231:5000';
// 成果审查任务
// 获取审查任务列表 查询
export const getTaskOtherLists = params => {
  return service.post(`${baseUrl}/v1/achievement/page`, params);
};

// 查询组织单位列表
export const orgList = () => {
  return service.get(`${baseUrl}/v1/achievement/orgList`);
};

// 查询编制单位列表
export const unitList = () => {
  return service.get(`${baseUrl}/v1/achievement/unitList`);
};

// 获取审查任务列表 新增
export const getAddOtherLists = params => {
  return service.post(`${baseUrl}/v1/achievement/save`, params);
};

// 通过id删除审核任务
export const deleteById = params => {
  return service.patch(`${baseUrl}/v1/achievement/${params}`);
};

// 根据行政区级别父节点id获取行政区列表
export const getNodeById = params => {
  return service.get(`${baseUrl}/v1/achievement/districts/${params}`);
};

// 查询目录树列表
export const treeDataList = params => {
  return service.post(`${baseUrl}/v1/directory/tree`, params);
};

// 查询表格上传文件接口
export const uploadDataList = params => {
  return service.post(`${baseUrl}/v1/achievement/upload`, params);
};

// 查询审核上传附件接口
export const getUploadDataList = params => {
  return service.post(`${baseUrl}/v1/achievement/attachment`, params);
};

// 查询审查要点下拉列表
export const keyPointsList = () => {
  return service.get(`${baseUrl}/v1/approve/keyPoints`);
};

// 查询审核上传附件接口
export const getSubmitList = params => {
  return service.post(`${baseUrl}/v1/approve/submit`, params);
};

// 审查报告下载接口
export const getReportList = params => {
  return service.get(
    `${baseUrl}/v1/achievement/resultDocument?taskObjid=${params}`,
    { isForm: true }
  );
};

// 查看版本号接口
export const getVersionList = params => {
  return service.get(
    `${baseUrl}/v1/achievement/taskVersions?taskObjId=${params}`
  );
};

// 批量提交审核
export const getApproveList = params => {
  return service.post(`${baseUrl}/v1/approve/multiSubmit`, params);
};

// 成果质检-表格预览
export const getStateList = params => {
  return service.get(`${baseUrl}/v1/approve/detail/${params}` );
};

// 成果质检-表格预览
export const getTrueStateList = params => {
  return service.post(`${baseUrl}/v1/approve/autoPassed`,params);
};

// 成果质检-gdb预览
export const getGdbList = params => {
  return service.get(`${baseUrl}/v1/approve/gdbPreviewList?taskObjId=${params}`);
};



// 成果质检-图数一致性
export const getTsyzxList = params => {
  return service.get(`${baseUrl}/v1/approve/graphTextCompareList?taskObjId=${params}`);
};

// 成果质检-指标符合性
export const getZbfhxList = params => {
  return service.get(`${baseUrl}/v1/approve/indicatorCompareList?taskObjId=${params}`);
};

// 成果质检-空间符合性
export const getKjbjfhxList = params => {
  return service.post(`${baseUrl}/v1/approve/spaceSummaryList`,params);
};

// 成果质检-空间符合性详情
export const getKjbjfhxDetailsList = params => {
  return service.post(`${baseUrl}/v1/approve/spaceDetailList`,params);
};

