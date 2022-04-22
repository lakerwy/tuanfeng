/*
 * @Author: 任继民
 * @Date: 2020-10-21 15:22:37
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-27 14:14:38
 * @Description:
 */
import Cookies from 'js-cookie'
// cookie保存的天数

export const TOKEN_KEY = 'j_s_id'

export const USER_ID_KEY = 'j_u_id'

export const RT_TOKEN_KEY = 'j_r_id'
export const getUserId = () => {
  const uid = Cookies.get(USER_ID_KEY)
  if (uid) return uid
  else return 0
}

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 || 1 })
}

export const clearToken = () => {
  Cookies.set(TOKEN_KEY, '', -1)
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const setRToken = (rtoken: string) => {
  Cookies.set(RT_TOKEN_KEY, rtoken, { expires: 1 || 1 })
}

export const getRToken = () => {
  const rtoken = Cookies.get(RT_TOKEN_KEY)
  if (rtoken) return rtoken
  else return false
}

export const clearRToken = () => {
  Cookies.set(RT_TOKEN_KEY, '', -1)
}

