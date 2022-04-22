import service from "@/utils/service";
const STATISTICS_API = window.globalUrl.API_ONEMAP_STATISTICS; //"http://192.168.250.208:5000"

// 获取生态红线类型
export async function getStbhhxType() {
  return service.get(
    `${STATISTICS_API}/TFGTKJGH/SpatialStaticsService/STHXStaticsType`,
  );
}
// 获取生态红线数据
export async function getStbhhxData(params) {
  return service.post(
    `${STATISTICS_API}/TFGTKJGH/SpatialStaticsService/STHXStaticsResult`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", //'application/x-www-form-urlencoded'//'application/json'
      },
    },
  );
}

//土规城规差异统计结果
export async function getTgcgcyData(params) {
  return service.post(
    `${STATISTICS_API}/TFGTKJGH/SpatialStaticsService/TGCGDifStaticsResult`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
}
//永久基本农田统计结果
export async function getYjjbntData(params) {
  return service.post(
    `${STATISTICS_API}/TFGTKJGH/SpatialStaticsService/YJJBNTStaticsResult`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
}

//空间筛选
export async function SpatialQuery(params) {
  return service.get(
    `${STATISTICS_API}/TFGTKJGH/GPService/SpatialQuery`,
    {params},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
}

//政务数据
export async function getGovDataNumber(params) {
  return service.get(
    `${STATISTICS_API}/TFGTKJGH/GovService/GetGovDataNumber`,
    {params},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
}
