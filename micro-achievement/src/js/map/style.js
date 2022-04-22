import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

// 审核进度的样式
export const checkStyle = function(text, type) {
  return new Style({
    fill: new Fill({
      //矢量图层填充颜色，以及透明度  通过 未通过 正在审核 {name: '通过', value: 1}, {name: '不通过', value: 0}, {name: '审核中', value: 2}
        color: type == 1 ? 'rgba(0, 153, 68,0.7)' : type == 2 ? 'rgba(243, 152, 1,0.7)' : type == 0 ? 'rgba(149, 149, 149,0.7)' : 'rgba(0,0,0,0)'
    }),
    text: new Text({
        font: '14px 微软雅黑 ',
        text: text,
        offsetX: 0,
        offsetY: 0,
        fill: new Fill({
            color: 'rgba(25,25,25,1)'
        })
    })
  });
}


export default{
  checkStyle
}
