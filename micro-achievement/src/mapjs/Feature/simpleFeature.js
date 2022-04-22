/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2020-07-24 17:13:43
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2020-07-24 17:42:58
 * @ Description: 简单要素的创建
 */

import Feature from "ol/Feature";
import { Point, LineString, Polygon, Circle } from "ol/geom";
import GeometryType from "ol/geom/GeometryType";

/**
 * 根据类型和坐标值创建要素
 * 依旧类型不同，传递的参数不同
 *
 * @export
 * @param {{id, geometryType, coordinates, center, radius}} param
 * @param {string} [idKey="id"] 设置要素的id的属性名
 * @returns feature
 */
export function JsonObjectFeature(param, idKey = "id") {
  const option = { ...param } || {};

  const geometryType = option.geometryType;

  if (!geometryType) {
    return null;
  }

  let geometry = null;
  switch (geometryType) {
    case GeometryType.POINT:
      geometry = option.coordinates ? new Point(option.coordinates) : null;
      break;
    case GeometryType.LINE_STRING:
      geometry = option.coordinates ? new LineString(option.coordinates) : null;
      break;
    case GeometryType.POLYGON:
      geometry = option.coordinates ? new Polygon(option.coordinates) : null;
      break;
    case GeometryType.CIRCLE:
      geometry =
        option.center && option.radius
          ? new Circle(option.center, option.radius)
          : null;
      break;
    default:
      break;
  }

  if (!geometry) {
    return null;
  }

  const feature = new Feature({
    geometry,
  });

  // 设置要素id
  if (idKey && option[idKey]) {
    feature.setId(option[idKey]);
  }

  return feature;
}
