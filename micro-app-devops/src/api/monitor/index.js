/*
 * @Author: 任继民
 * @Date: 2021-01-28 14:45:33
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-01 15:23:53
 * @Description: 监控API
 */
import request from '@/utils/request'
const  userUrl = window.globalUrl.API_HOME;
// const  userUrl = 'http://192.168.250.220:10005/sys';

/**
 * 获取在线用户信息
 * @param param
 */
export const getMonitorUser = (params) => {
  return request.get(`${userUrl}/sys/monitor/users`, { params })
}
