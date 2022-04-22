import Overlay from 'ol/Overlay';
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/dataset');
/**
 * @param  {ol.map} map 地图容器
 * @param  {Object} chartOptions 图表的数据
 * @param  {Array} coordinate 坐标
 * @param  {String} overlyId 提示框ID
 * @param  {String} chartOptions.title 图表名称
 * @param  {Array<Object>} chartOptions.data 图表数据
 */
export function createEchartsOverly(map, chartOptions, coordinate, overlyId) {
    // 关闭按钮图片地址
    let url = require('../../assets/imgs/icon-clear.png')
    // 悬浮框
    let overlyEle = document.createElement("div");
    overlyEle.className = "tooltip tooltip-measure";
    overlyEle.style.cssText =
        `color:#000;background: #fff;padding: 2px 8px;font-size: 12px;box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);position: absolute;
        top: 100px; right: 50px`;
    document.body.appendChild(overlyEle)
    // 关闭按钮
    let closeBtn = document.createElement("div");
    closeBtn.style.cssText =
        ` cursor: pointer; width: 20px; height: 20px;position: absolute; top: 10px; right: 10px;background: url(${url}) no-repeat center; z-index: 2`;
    overlyEle.appendChild(closeBtn)
    closeBtn.onclick = function () {
        //let ov = map.getOverlayById(overlyId)
        document.body.removeChild(overlyEle)
    }
    // 图形容器
    let echartsEle = document.createElement("div");
    echartsEle.className = "mychart";
    echartsEle.style.cssText =
        "width: 00px; height: 300px;padding: 24px 0 18px 0;";

    overlyEle.appendChild(echartsEle)

    // let overly = new Overlay({
    //     id: overlyId,
    //     element: overlyEle,
    //     offset: [0, -35],
    //     positioning: "bottom-center",
    // });
    // map.addOverlay(overly);
    // overly.setPosition(coordinate);

    let colorArr = ["#37a2da", "#32c5e9", "#9fe6b8"]
    var myChart = echarts.init(echartsEle);
    // 绘制图表
    myChart.setOption({
        title: {
            text: `${chartOptions.title}个数和面积统计`,
            textStyle: {
                width: "600px",
            },
            left: "150px"
        },
        dataset: {
            source: chartOptions.data
        },
        grid: [{
            top: 70,
            width: '38%',
            bottom: 0,
            left: 25,
            containLabel: true
        }],
        tooltip: {
        },
        yAxis: {
            type: "value",
            name: "个数",
            splitLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#424e67',
                    fontSize: 12,
                },
                interval: 0,
            },
            axisLine: {
                lineStyle: {
                    color: "#ccc"
                }
            },
            nameTextStyle: {
                color: '#424e67',
            },
            axisTick: {
                length: 2
            }
        },
        xAxis: {
            type: "category",
            axisLabel: {
                textStyle: {
                    color: '#424e67',
                    fontSize: 12,
                    lineHeight: 16,
                },
                interval: 0,
                formatter: function (value) {
                    var ret = "";//拼接加\n返回的类目项  
                    var maxLength = 4;//每项显示文字个数  
                    var valLength = value.length;//X轴类目项的文字个数  
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                    if (rowN > 1)//如果类目项的文字大于5,  
                    {
                        for (var i = 0; i < rowN; i++) {
                            var temp = "";//每次截取的字符串  
                            var start = i * maxLength;//开始截取的位置  
                            var end = start + maxLength;//结束截取的位置  
                            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                            temp = value.substring(start, end) + "\n";
                            ret += temp; //凭借最终的字符串  
                        }
                        return ret;
                    }
                    else {
                        return value;
                    }
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#ccc"
                }
            },
            axisTick: {
                length: 2
            }
        },
        series: [{
            name: '地质公园类',
            type: 'bar',
            //data: [5, 20, 36, 10, 10, 20]
            encode: {
                // 将 "amount" 列映射到 X 轴。
                x: 'hxlxejl',
                // 将 "product" 列映射到 Y 轴。
                y: 'gs'
            },
            itemStyle: {
                color: function (params) {
                    return colorArr[params.dataIndex]
                }
            },
            barWidth: 20,
        },
        {
            type: 'pie',
            id: 'pie',
            radius: '50%',
            center: ['71%', '60%'],
            label: {
                align: 'center',
                verticalAlign: 'middle',
                lineHeight: 16,
                formatter: function (e) {
                    var newStr = " ";
                    var start, end;
                    var name_len = e.name.length;    　　　　　　　　　　　　   //每个内容名称的长度
                    var max_name = 4;    　　　　　　　　　　　　　　　　　　//每行最多显示的字数
                    var new_row = Math.ceil(name_len / max_name); 　　　　// 最多能显示几行，向上取整比如2.1就是3行
                    if (name_len > max_name) { 　　　　　　　　　　　　　　  //如果长度大于每行最多显示的字数
                        for (var i = 0; i < new_row; i++) { 　　　　　　　　　　　   //循环次数就是行数
                            var old = '';    　　　　　　　　　　　　　　　　    //每次截取的字符
                            start = i * max_name;    　　　　　　　　　　     //截取的起点
                            end = start + max_name;    　　　　　　　　　  //截取的终点
                            if (i == new_row - 1) {    　　　　　　　　　　　　   //最后一行就不换行了
                                old = e.name.substring(start);
                            } else {
                                old = e.name.substring(start, end) + "\n";
                            }
                            newStr += old; //拼接字符串
                        }
                    } else {                                          //如果小于每行最多显示的字数就返回原来的字符串
                        newStr = e.name;
                    }
                    return newStr;
                },
            },
            encode: {
                itemName: 'hxlxejl',
                value: 'mj',
                tooltip: 'mj'
            },
            tooltip: {
                formatter: function (e) {
                    // // console.log(e)
                    return `${e.name} : ${e.data.mj} km<sup>2</sup> (${e.percent}%)`
                }
            },
            itemStyle: {
                color: function (params) {
                    return colorArr[params.dataIndex]
                }
            }
        }
        ]
    });
}