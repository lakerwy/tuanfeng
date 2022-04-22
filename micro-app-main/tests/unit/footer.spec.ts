/*
 * @Author: 任继民
 * @Date: 2020-12-08 14:15:18
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-08 14:22:51
 * @Description: 测试footer
 */
import {mount} from '@vue/test-utils'
import Footer from '@/components/footer/index.vue'

describe('测试footer组件', () => {
  // 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
  const wapper = mount(Footer)
  it('测试DOM',()=>{
    // 使用find来寻找dom中的元素
    expect(wapper.find('.cns-footer'))
  })
})
