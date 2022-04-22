/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2020-07-28 11:49:23
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2020-09-28 14:03:34
 * @ Description: 要素格式转换
 */

import WKT from "ol/format/WKT";

export function writeGeometryToWKT(geometry) {
  if (geometry) {
    return new WKT().writeGeometry(geometry);
  }
  return;
}

export function writeFeatureToWKT(feature) {
  if (feature) {
    return new WKT().writeFeature(feature);
  }
  return;
}

export function readFeatureByWKT(str) {
  return new WKT().readFeature(str);
}
