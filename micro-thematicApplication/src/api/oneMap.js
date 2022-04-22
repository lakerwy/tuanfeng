import request from '@/utils/request';
import axios from "axios";
const  LAYER_API = window.globalUrl.LAYER_API;
// 获取左侧目录树
export async function getTreeInfo(params) {
    return request.get(`${LAYER_API}/sys/t-nav-dir/` + params.type);
}
// 获取目录树点击后的urls
export async function getLayerUrls(options) {
    return request.get(`${LAYER_API}/sys/t-nav-dir/services`, options);
}
// 目录树urls的筛选
export async function filterUrls(options) {
    return request.get(`${LAYER_API}/sys/t-nav-dir/service/{name}`, options);
}
// 天地图 -- 获取地名地址
/**
 * 密钥 -- d9160cdd3e165f779df0909d33be966d
 */
export function getAddressInfo(params) {
    return axios
        .get("http://api.tianditu.gov.cn/search", {
            params: {
                postStr: params,
                type: "query",
                tk: "d9160cdd3e165f779df0909d33be966d",
            },
        })
}
// 具体地名搜索
export function getAddressNameInfo(params) {
    return axios
        .get("http://api.tianditu.gov.cn/administrative", {
            params: {
                postStr: params,
                type: "query",
                tk: "d9160cdd3e165f779df0909d33be966d",
            },
        })
}