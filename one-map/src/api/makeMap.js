import axios from "axios";
const MAPDOC_API = window.globalUrl.API_ONEMAP_STATISTICS; //;"http://192.168.250.208:5000"

// 获取专题制图列表
export async function getZtztList(params) {
  return axios.post(
    `${MAPDOC_API}/TFGTKJGH/MapDocService/GetMapDocList`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
}
// 单个删除文档数据
export async function delZtztData(params) {
  return axios.post(
    `${MAPDOC_API}/TFGTKJGH/MapDocService/DeleteMapDoc`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
}
// 通过模板新建地图服务
export async function createNewMap(params) {
  return axios.post(
    `${MAPDOC_API}/TFGTKJGH/MapDocService/NewMapDocByTemplate`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
}
// 获取地图文档详细信息
export async function getMapDocInfo(params) {
  return axios.post(
    `${MAPDOC_API}/TFGTKJGH/MapDocService/GetMapDocInfo`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
}
// 设置图层数据
export async function setMapDocData(params) {
  return axios.post(
    `${MAPDOC_API}/TFGTKJGH/MapDocService/SetLayerDataSource`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
}
// 保存文档信息
export async function saveMapDoc(params) {
  return axios.post(`${MAPDOC_API}/TFGTKJGH/MapDocService/SaveMapDoc`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}
