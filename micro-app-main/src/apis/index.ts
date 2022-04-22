/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-19 15:11:30
 * @Description:
 */
import Http from "@/utils/request";
const userUrl = (window as any).mainUrl.API_HOME;
const nacosUrl = (window as any).mainUrl.NACOS_URL;
// let url = "http://192.168.99.169:20001"
/**
 * 登录
 * @param params
 */
export const userLogin = (params: any) => {
  return Http.get('/sys/sys/login', { params })
}

export const getNacosInfo = (params: any) => {
  return Http.get(`${nacosUrl}/nacos/v1/cs/configs`, { params })
}

export const getUserByToken = (params: any) => {
  return Http.post(`${userUrl}/sys/sys/t-user/info`, params)
}

//修改密码
export const getPasswdChange = (params: any) => {
  return Http.post(`${userUrl}/sys/t-user/pt/passwdChange`, params)
}
