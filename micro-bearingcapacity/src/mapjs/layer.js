/**
 * 图层数据格式
 * [
 *   { // arcgis server 发布的wms 服务
 *       "type":"arcgis",
 *       "url":"http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer",
 *       "layers":"show:0,1,2"
 *   },
 *   { // arcgis server 发布的wmts 服务
 *       "type":"arcgis",
 *       "url":"https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer",
 *       "layers":"show:0,1,2,3,4"
 *   },
 *   { // geoserver 发布的wms 服务
 *       "type":"geoserver",
 *       "url":"http://localhost:8081/geoserver/topp/wms",
 *       "layers":"topp:states",
 *       "projection":"EPSG:4326"
 *   },
 *   { // geoserver 发布的wmts 服务
 *       "type":"geoserver",
 *       "url":"http://localhost:8081/geoserver/gwc/service/wmts",
 *       "layers":"nurc:Arc_Sample",
 *       "projection":"EPSG:4326",
 *       "tilematrixset":"EPSG:4326"
 *   },
 *   { // url为xyz的wmts服务类型，标准的瓦片切片方案
 *       "type":"xyz",
 *       "url":"http://t4.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=",
 *       "projection":"EPSG:4326"
 *   },
 *   { // url为xyz的wmts服务类型，自定义的瓦片切片方案
 *       "type":"xyz",
 *       "url":"http://192.168.100.5:6080/arcgis/rest/services/Hubei_DZDT/MapServer/tile/{z}/{y}/{x}",
 *       "projection":"EPSG:3857",
 *		"tileGrid":{
 *			"origin": [-2.00377E7,3.02411E7],
 *           "tileSize": [256,256],
 *           "resolutions": [19567.87924100177,9783.939620501018,4891.969810251302,2445.9849051255187,1222.9924525627594,611.* 4962262813797,305.7481131408221,152.87405657041106,76.43702828507324,38.21851414253662,19.10925707126831,9.554628535634155]* ,
 *           "matrixIds":[0,1,2,3,4,5,6,7,8,9,10,11]
 *		}
 *   }
 * ];
 *
 * 函数使用
 *
 * let layer = await createImageLayer(data);
 *   if(layer){
 *       mst.map.addLayer(layer);
 *   }
 *
 */

import ArcGISServerLayer from "./Layer/arcgisLayer";
import GeoServrLayer from "./Layer/geoserverLayer";
import XYZLayer from "./Layer/XYZLayer";
import {
  EmptyVectorLayer,
  GeoJsonVectorLayer,
  EmptyClusterVectorLayer,
  GeoJSONObjectVectorLayer,
} from "./Layer/vectorLayer";
import VectorLayer from "ol/layer/Vector";

/**
 * 说明,因为采用异步的方式调用，图层的先后顺序可能和函数的先后执行顺序错位，
 * 因此，针对特殊图层，需手动排序——先获取图层结合，然后采用insertAt()函数
 *      底图 map.getLayers().insertAt(0,layer);
 *      注记 map.getLayers().insertAt(map.getLayers().getLength(),layer);
 *
 * @param  {Object} params
 * params = {
 *   type : "arcgis"|"geoserver"|"xyz",
 *   url : "", 必参
 *   layers: null | String, 当type = "arcgis"时，layer = null|"show:0,1"; 当type = "geoserver"时，layer = 图层名
 *   projection: null | String, 当type = "geoserver" | "xyz"时,必参;
 *   tilematrixset : null | String , 当type = "geoserver",且为WMTS是,需指定tileGrid的唯一标识符
 *   tileGrid{origin,tileSize,resolutions,matrixIds}: null | Object;当type = "xyz",且自定义tileGrid时，需配置
 * }
 * @returns {(null | TileLayer)} 瓦片图层
 */

export async function createImageLayer(params) {
  const options = params || {};

  let type = options.type;
  // delete options.type;

  let layer = null;
  switch (type) {
    case "arcgis":
    case "ArcGISServer":
      // 需要读取图层信息后初始化图层，因此采用异步的方式
      layer = await ArcGISServerLayer(options);
      break;
    case "geoserver":
    case "GeoServer":
      // 加载wmts服务是，需要通过api获取并识别xml文件，因此采用异步的方式
      layer = await GeoServrLayer(options);
      break;
    case "xyz":
      layer = XYZLayer(options);
      break;
    default:
      break;
  }
  return layer;
}

/**
 * 根据type 创建不同类型的矢量图层,默认创建空的矢量图层
 * type 0 空的矢量图层
 *      1 geojson的矢量图层，通过url 获取
 * @param  {Object} params
 * params = {
 *    type : 0 | 1  | 2 | 3,
 *    url: null | String ,当 type = 1 时，url 为必参
 *    clusterDistance : Number ,当type =2 时，url 为可惨
 *    geojsonObject ：Object , 当type = 3时， geojsonObject为必参
 * }
 * @returns { (null | VectorLayer ) }
 */
export function createVectorLayer(params) {
  const options = params || { type: 0 };

  let type = options.type;
  // delete options.type;

  let layer = null;
  switch (type) {
    case 0:
      layer = EmptyVectorLayer();
      break;
    case 1:
      layer = GeoJsonVectorLayer(options.url);
      break;
    case 2:
      layer = EmptyClusterVectorLayer(options.clusterDistance);
      break;
    case 3:
      layer = GeoJSONObjectVectorLayer(options.geojsonObject);
      break;
    default:
      layer = EmptyVectorLayer();
      break;
  }
  return layer;
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
