/*
 * @Author: 任继民
 * @Date: 2020-10-16 15:01:34
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-25 09:13:05
 * @Description:
 */
import Vue from 'vue'

const scrollBarWidth = function () {
  let scrollBarWidth
  if (Vue.prototype.$isServer) return 0
  if (scrollBarWidth !== undefined) return scrollBarWidth

  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth
  outer.parentNode.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}
export default scrollBarWidth
