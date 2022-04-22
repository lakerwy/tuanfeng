/*
 * @Author: 任继民
 * @Date: 2020-11-18 11:06:05
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-30 11:48:46
 * @Description:
 */
import echarts from 'echarts'
export const initEcharts = (id, options) => {
  let echart = echarts.init(document.getElementById(id));
  echart.setOption(options,true);
  window.addEventListener('resize', () => {
    echart.resize();
  })
  return echart
}
