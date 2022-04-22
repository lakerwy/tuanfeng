/*
 * @Author: 任继民
 * @Date: 2021-01-05 17:12:24
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-21 15:50:02
 * @Description:
 */
import axios from "axios";
import { createVectorLayer } from "@/mapjs/layer.js";
/** 叠加分析
 * @param  { String } url GP service 地址
 * @param  { String } inPath 图层Url
 * @param  { String } intersectPath 叠加图层Url
 */
export async function superpositionAnalysis(url, inPath, intersectPath) {
  if (inPath && intersectPath) {
    // 叠加分析
    var params = {
      inPath,
      intersectPath,
    };
  } else {
    // 控规详规
    var params = {};
  }
  try {
    let res = await axios.get(url, {
      params,
    });
    let { data } = res;
    // 根据 geojson 获取图层和范围
    if (data.code == 200) {
      let ops = {
        type: 3,
        geojsonObject: data.data,
      };
      let layer = createVectorLayer(ops);
      let extent = layer.getSource().getExtent();
      return {
        layer,
        extent,
      };
    }else {
      return data;
    }
  } catch (error) {
    return null;
  }
}
