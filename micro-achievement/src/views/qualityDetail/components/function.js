import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import { transformExtent } from "ol/proj";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";

export async function getBaseLayers(type) {
  let data = [];
  switch (type) {
    case 1:
      data = window.globalUrl.vectorLayer;
      break;
    case 0:
      data = window.globalUrl.imageLayer;
      break;
    default:
      data = window.globalUrl.vectorLayer;
      break;
  }
  let layers = [];
  for (let i = 0; i < data.length; i++) {
    let layer = await createImageLayer(data[i]);
    if (layer) {
      layers.push(layer);
    }
  }
  return layers;
}
/**
 * 添加图层
 * @param  {ol/map} map -- 地图
 * @param  {String} layerName -- 图层名称
 * @param  {Object} layerSource -- 图层服务
 */
export async function addBasicLayerOnMap(map, layerName, layerSource) {
  let layer = await createImageLayer(layerSource);
  if (layer) {
    layer.set("layerName", layerName);
    map.addLayer(layer);
    if (layer.extent && layer.projection) {
      let extent = layer.extent;
      let viewProj = map
        .getView()
        .getProjection()
        .getCode();
      if (layer.projection !== viewProj) {
        extent = transformExtent(layer.extent, layer.projection, viewProj);
      }

      map.getView().fit(extent);
    }
  }
  return layer;
}
// 县区域样式
let countyStyle = new Style({
  stroke: new Stroke({
    //边界样式
    color: "blue",
    lineDash: [4, 6],
    width: 2
  })
});
// 获取县的矢量图层
export function getCountyVectorLayer() {
  let params = {
    type: 3,
    // url: './config/tf_xian.geojson'
    geojsonObject: window.TF_XIAN
  };

  let layer = createVectorLayer(params);
  if (layer) {
    // layer.extent = extent
    layer.setStyle(countyStyle);
    layer.set("layerName", "xianLayer");
    return layer;
  }
}
// 乡镇区域样式
export const townStyle = function(feature) {
  let colorArr = [
    "rgba(238,241,181,0.95)",
    "rgba(36,149,195,0.95)",
    "rgba(74,185,198,0.95)",
    "rgba(70,184,199,0.95)",
    "rgba(77,127,203,0.95)",
    "rgba(44,134,193,0.95)",
    "rgba(141,210,177,0.95)",
    "rgba(40,149,194,0.95)",
    "rgba(201,233,182,0.95)",
    "rgba(201,233,182,0.95)"
  ];
  let townName = feature.getProperties().Name;
  let index = feature.getProperties().FID;
  let townStyle = new Style({
    fill: new Fill({
      //矢量图层填充颜色，以及透明度
      color: colorArr[index]
    }),
    text: new Text({
      font: "14px 微软雅黑 ",
      text: townName,
      offsetX: 0,
      offsetY: 0,
      fill: new Fill({
        color: "#fff"
      })
    })
  });
  return townStyle;
};
// 获取乡镇的矢量图层
export function getTownVectorLayer() {
  let params = {
    type: 3,
    // url: './config/tf_xz.geojson'
    geojsonObject: window.TF_XZ
  };
  let layer = createVectorLayer(params);
  // 获取乡镇要素
  if (layer) {
    layer.setStyle(townStyle);
    layer.set("layerName", "townLayer");
    return layer;
  }
}
/**
 * 根据类名移除图层
 */
/**
 * @param  {ol/map} map 地图
 * @param  {String} className 类名
 */
export function removeLayerByClass(map, className) {
  let layers = map.getLayers().getArray();
  let layer = layers.filter(item => item.className_ == className);
  if (layer.length > 0) {
    layer.forEach(item => {
      map.removeLayer(item);
    });
  }
}
/**
 * 根据自定义属性移除图层
 */
/**
 * @param  {ol/map} map 地图
 * @param  {String} attr 属性名
 * @param  {String} val 属性值
 */
export function removeLayerByAttr(map, attr, val) {
  let layers = map.getLayers().getArray();
  let layer = layers.filter(item => item.values_[attr] == val);
  if (layer.length > 0) {
    layer.forEach(item => {
      map.removeLayer(item);
    });
  }
}

/**
 * 根据key-value移除图层
 * @param  { ol.Map} map
 * @param  { String } key
 * @param  { } value
 */
 export function removeLayersByKVP(map, key, value) {
  let layers = map.getLayers().getArray();
  for (let i = layers.length - 1; i >= 0; i--) {
    let layer = layers[i];
    if (layer[key] && layer[key] == value) {
      map.removeLayer(layer);
    }
  }
}

/**
 * 获取要移除临时图层的所有key
 */
/**
 * @param  {ol/map} map 地图
 * @param  {String} attr 属性名
 */
export function getTreeLayerKeys(map, attr) {
  let layers = map.getLayers().getArray();
  let arr = [];
  if (layers.length > 0) {
    layers.forEach(item => {
      if (item.values_[attr]) {
        arr.push(item.values_[attr]);
      }
    });
  }
  return arr;
}

/**
 * @param  {ol/View} oneView 左侧地图视图
 * @param  {ol/View} twoView 右侧地图视图
 */
export function allChange(oneView, twoView) {
  let oneCenter = oneView.getCenter();
  let oneZoom = oneView.getZoom();

  let twoCenter = twoView.getCenter();
  let twoZoom = twoView.getZoom();
  if (oneCenter !== twoCenter || oneZoom !== twoZoom) {
    twoView.setCenter(oneCenter);
    twoView.setZoom(oneZoom);
  }
}
