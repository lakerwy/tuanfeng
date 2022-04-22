
import request from '@/utils/request';
const HOME_API = window.globalUrl.TARGET_API;

export function fetchList(params) {
  return request({
    url:`${HOME_API}/project/contract/save-with-accessory`,
    method:'get',
    params:params
  })
}
