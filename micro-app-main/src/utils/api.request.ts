/*
 * @Author: 任继民
 * @Date: 2020-10-21 16:43:21
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-21 16:46:38
 * @Description:
 */
import HttpRequest from './axios'
// import config from '@/config'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest()
export default axios
