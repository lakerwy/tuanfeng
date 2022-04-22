import echarts from 'echarts'
export const initEcharts = (id, options) => {
  let echart = echarts.init(document.getElementById(id));
  echart.setOption(options,true);
  window.addEventListener('resize', () => {
    echart.resize();
  })
  return echart
}
