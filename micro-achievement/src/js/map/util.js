import { checkStyle } from './style'
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import { xz } from './xzGeoJSON'

// 乡镇区域样式
export const townStyle = function (feature) {
  // console.log(feature.getProperties());
  let townName = feature.getProperties().Name;
  let townCode = feature.getProperties().ad_code;
  let townType = feature.getProperties().type;
  // let townStyle = checkStyle(townName, type);
  let townStyle = checkStyle(townName, townType)
  // switch (townCode) {
  //   case "421121100":
  //     // 团风镇
  //     townStyle = checkStyle(townName, 0)
  //     break;
  //   case "421121104":
  //     // 马曹庙镇
  //     townStyle = checkStyle(townName, 1)
  //     break;
  //   case "421121102":
  //     // 方高坪镇
  //     townStyle = checkStyle(townName, 2)
  //     break;
  //   case "421121106":
  //     // 总路咀镇
  //     townStyle = checkStyle(townName, 0)
  //     break;
  //   case "421121200":
  //     // 贾庙乡
  //     townStyle = checkStyle(townName, 1)
  //     break;
  //   case "421121107":
  //     // 但店镇
  //     townStyle = checkStyle(townName, 2)
  //     break;
  //   case "421121101":
  //     // 淋山河镇
  //     townStyle = checkStyle(townName, 0)
  //     break;
  //   case "421121105":
  //     // 上巴河镇
  //     townStyle = checkStyle(townName, 1)
  //     break;
  //   case "421121201":
  //     // 杜皮乡
  //     townStyle = checkStyle(townName, 2)
  //     break;
  //   case "421121103":
  //     // 回龙山镇
  //     townStyle = checkStyle(townName, 0)
  //     break;
  // }
  return townStyle
}

// 获取乡镇的矢量图层
export async function getTownVectorLayer(geoJson, type) {
  // let res = await xiangGeoJson();
  // console.log(res, 'townres')
  // if(res) {
    // debugger
    // console.log(geoJson, 'townVector')
    let params = {
      type: 3,
      // url: './config/tf_xz.geojson'
      geojsonObject: geoJson
    }
    let layer = createVectorLayer(params);
    // 获取乡镇要素
    if (layer) {
      let style = townStyle
      layer.setStyle(style)
      layer.set('layerName', 'townLayer')
      // console.log(layer, 'layer')
      return layer
    }
  // }
}

// 根据属性删除图层
export function removeLayerByAttr(map, attr, val) {
  let layers = map.getLayers().getArray();
  let layer = layers.filter((item) => item.values_[attr] == val);
  if (layer.length > 0) {
      layer.forEach((item) => {
          map.removeLayer(item);
      })
  }
}

// 永久基本农田
export async function farmlandLayer(map) {
  let params = window.redLines.farmland
  let layer = await createImageLayer(params);
  if (layer) {
      layer.set("layerName", params.layerName)
      map.addLayer(layer);
      map.getView().fit(params.extent);
  }
}

// 生态保护红线
export async function ecologyLayer(map) {
  let params = window.redLines.ecologicalProtection
  let layer = await createImageLayer(params);
  if (layer) {
      layer.set("layerName", params.layerName)
      map.addLayer(layer);
      map.getView().fit(params.extent);
  }
}

export async function createLayerByType(map, layerData) {
  let params = layerData;
  let layer = await createImageLayer(params);
  if (layer) {
      layer.set("layerName", params.layerName)
      map.addLayer(layer);
      map.getView().fit(params.extent);
  }
}


export default {
  getTownVectorLayer
}
