/*
 * @Author: 任继民
 * @Date: 2021-01-26 11:37:19
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-26 11:39:58
 * @Description:
 */
import Vue from 'vue'
import ElementUI, { Message } from 'element-ui'

// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
let messageInstance = null;
class DonMessage {
  success (options, single = true) {
    this[showMessage]('success', options, single)
  }
  warning (options, single = true) {
    this[showMessage]('warning', options, single)
  }
  info (options, single = true) {
    this[showMessage]('info', options, single)
  }
  error (options, single = true) {
    this[showMessage]('error', options, single)
  }
  [showMessage] (type, options, single) {
    if (messageInstance && single) {
      messageInstance.close()//先把原来的关闭
    }
    messageInstance = Message[type](options)//再创建新的消息
  }
}
Vue.use(ElementUI)
Vue.prototype.$message = new DonMessage()
