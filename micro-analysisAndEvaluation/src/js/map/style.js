import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

// 图表样式
export const checkStyle = function(text, color) {
  return new Style({
    fill: new Fill({ //矢量图层填充颜色，以及透明度  通过 未通过 正在审核
        color: color,
    }),
    stroke: new Stroke({
      color: "rgba(255,255,255,0.5)",
      width: 1.25,
    }),
    text: new Text({
        font: '14px 微软雅黑 ',
        text: text,
        offsetX: 0,
        offsetY: 0,
        fill: new Fill({
            color: 'rgba(25,25,25,1)'
        })
    }),

  });
}



export default{
  checkStyle
}
