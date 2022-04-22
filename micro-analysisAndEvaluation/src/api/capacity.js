/*
 * @Author: 任继民
 * @Date: 2020-12-07 11:37:18
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-25 17:16:04
 * @Description:
 */
import service from '../request'

// const mapBaseUrl = 'http://192.168.250.208:5000';
// const xiaoliUrl = 'http://192.168.99.216:5000';
// const yujingUrl = 'http://192.168.99.127:8899';
const mapBaseUrl = window.globalUrl.API_ONEMAP_STATISTICS;
const xiaoliUrl = window.globalUrl.API_ANALYSIS_STATICS;
const yujingUrl = window.globalUrl.API_ANALYSIS_SPJ_RULE;
const writeDataUrl = 'http://192.168.99.231:5000';
// 请求地图服务的接口 图层数据
export const getGeoUrl = (params) => {
  // return service.post(`${mapBaseUrl}/TFGTKJGH/MapDocService/GetMxdInfoByType`, params)
  return service({
    url: `${mapBaseUrl}/TFGTKJGH/MapDocService/GetMxdInfoByType`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const WriteDataPackageFileMetaData = (params) => {
  return service({
    url: `${mapBaseUrl}/TFGTKJGH/RestultsPackageService/WriteDataPackageFileMetaData`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // url: `${mapBaseUrl}/TFGTKJGH/RestultsPackageService/WriteDataPackageFileMetaData`,
    // method: 'post',
    // data: params,
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
  // return service.get(`${mapBaseUrl}/TFGTKJGH/GTKJMetaDataService/WriteDataPackageFileMetaData`, params )
}

// 请求数据图表数据
export const getChartData = (params) => {
  // return service.post(`${xiaoliUrl}/TFGTKJGH/SpatialStaticsService/StaticsRasterArea`, params)
  return service({
    url: `${xiaoliUrl}/TFGTKJGH/SpatialStaticsService/StaticsRasterArea`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}


// 请求有分级分析数据的图层数据 key是图层http://192.168.99.127:8898/modelconfig/getspjrulebymodel?mapid=12
export const getAnalysisLayerData = (params) => {
  return service.get(`${yujingUrl}/modelconfig/getspjrulebymodel`, {params})
}

// 承载力请求数据
export const getCapacityAnaData = (params) => {
  return service.get(`${yujingUrl}/modelresult/bearevalresult`, {params})
}
