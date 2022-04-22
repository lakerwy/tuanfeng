
import request from '@/utils/requestOrg'
const  userUrl = window.globalUrl.API_HOME;

/**
 * 获取机构列表
 * @param params
 */
export const getOrglist = (params) => {
  return request.post(`${userUrl}/sys/t-org/findLike`, params)
}
