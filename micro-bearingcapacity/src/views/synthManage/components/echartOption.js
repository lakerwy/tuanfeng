/*
 * @Author: 任继民
 * @Date: 2020-11-18 11:08:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-17 09:34:26
 * @Description:
 */
export default {
  quotaOptions: {
    // color: ['#ffc770', '#47d6ff', '#479eff', 'rgba(255,255,255,.5)'],
    tooltip: {
      trigger: "item",
      padding: [10, 10, 10, 10],
      formatter: "{b} :<br/> {d}%",
    },
    legend: {
      show: true,
      orient: "horizontal",
      itemGap: 24,
      icon: "rect",
      itemWidth: 20,
      itemHeight: 12,
      bottom: "5%",
      // top: "42%",
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '18%',
      bottom: '5%',
      containLabel: true
    },
    series: [{
      name: "",
      type: "pie",
      radius: ["30%", "45%"],
      center: ["45%", "50%"],
      label: {
        fontSize: 18,
        // color: '#333',
        padding: [0, -65, 15, -35],
        formatter: function (param) {
          return param.percent + "%";
        },
        rich: {
          per0: {
            padding: [0, 0, 0, 5],
            fontSize: 13,
            fontWeight: "bold",
            color: "#ffc770",
          },
          per1: {
            padding: [0, 0, 0, 5],
            fontSize: 13,
            fontWeight: "bold",
            color: "#47d6ff",
          },
          per2: {
            padding: [0, 0, 0, 15],
            fontSize: 13,
            fontWeight: "bold",
            color: "#479eff",
          },
        },
      },
      labelLine: {
        show: true,
        length: '10%',
        length2: '12%',
      },
      data: [{
        name: "健康",
        value: "300",
        itemStyle: {
          normal: {
            color: "#5ec26d",
          },
        },
      }, {
        name: "轻警",
        value: "120",
        itemStyle: {
          normal: {
            color: "#f6d641",
          },
        },
      }, {
        name: "重警",
        value: "556",
        itemStyle: {
          normal: {
            color: "#eda169",
          },
        },
      }],
    }, {
      type: "pie",
      radius: ["30%", "33%"],
      center: ["45%", "50%"],
      silent: true,
      data: [{
        name: "",
        value: 1,
        itemStyle: {
          normal: {
            color: "#d7e4fd",
            opacity: 0.5,
          },
        },
      }],
    }],
  },
};
