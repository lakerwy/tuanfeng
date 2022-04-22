import request from '@/utils/request';
import axios from 'axios'
const HOME_API = window.globalUrl.API_HOME //"http://192.168.99.166:10005/sys"
const TDT_API = window.globalUrl.API_TDT_SEARCH //;"http://api.tianditu.gov.cn/search"
const TDT_TK = window.globalUrl.API_TDT_TK //"tuanfeng" //window.globalUrl.TF_NAME;
// const DX_API = "http://192.168.99.132:20001/sys"//window.globalUrl.API_DX_SEARCH;
const TF_API = window.globalUrl.API_TF_SEARCH //;"http://192.168.250.220:8080"
const TF_NAME = window.globalUrl.API_TF_NAME //;"tuanfeng"
const SERVER_URL = window.globalUrl.API_PX
const STATISTICS_API = window.globalUrl.API_ONEMAP_STATISTICS; //"http://192.168.250.208:5000"

// 获取左侧目录树
export async function getTreeInfo(params) {
    return request(`${HOME_API}/sys/t-natural-resources/tree`, {
        method: 'get',
        params: params
    });
}
// 获取目录树点击后的urls
export async function getLayerUrls(options) {
    return request.get(`${HOME_API}/sys/t-nav-dir/services`, options);
}
// 目录树urls的筛选
export async function filterUrls(options) {
    return request.get(`${HOME_API}/sys/t-nav-dir/service/`+options);
}
//获取当前用户信息
export async function getUserInfo(params) {
    return request(`${HOME_API}/sys/t-user/info`, {
        method: 'post',
        data: params,
    });
}
// 天地图 -- 地名地址搜索
/**
 * 密钥 -- d9160cdd3e165f779df0909d33be966d
 */
export function getTDTAddressInfo(params) {
    // console.log()
    return axios
        .get(TDT_API, {
            params: {
                postStr: params,
                type: "query",
                tk: TDT_TK,
            },
        })
}
// 地信 -- 地名地址搜索
// export function getDXAddressInfo(params) {
//     return axios
//         .get(`${DX_API}/query/queryPoiByCode`, {
//             params
//         })
// }
// 团风 -- 地名地址搜索
export function getTFAddressInfo(params, code) {
    return axios
        .get(`${TF_API}/GeocodingServer/att/search/alias`, {
            params: {
                districtname: `${TF_NAME};${code}`,
                ...params
            }
        })
}

//自然资源
export async function selectListbyNatureResources(params) {
  return request.get(`${SERVER_URL}/service/px-service/selectListbyNatureResources?naturalResourcesId=${params}`);
}

//政务数据
export async function getGovDataNumber(params) {
  return axios.get(
    `${STATISTICS_API}/TFGTKJGH/GovService/GetGovDataNumber`,
    { params },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
}
