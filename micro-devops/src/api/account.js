/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:30
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-19 15:15:42
 * @Description:
 */
import request from '@/libs/request'
const  userUrl = window.globalUrl.API_HOME;
/**
 * 获取邮箱发送验证码
 * @params params
 */
export const sendEmail = (params) => {
  return request.get(`${userUrl}/sys/sendEmail`, { params })
}
/**
 * 忘记密码修改密码
 * @params params
 */
export const checkCode = (params) => {
  return request.get(`${userUrl}/sys/checkCode`, { params })
}
