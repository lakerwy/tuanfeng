import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import { appendParams } from "ol/uri";
import { Image as ImageLayer, Tile as TileLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import { get } from "ol/proj";

/**
 * @param  { Object} params
 * params = { url,layers,projection,tilematrixset}
 * @returns {(null | TileLayer)} 瓦片图层
 */
export default async function GeoServrLayer(params) {
  const options = params || {};

  // 判断地图服务地址是否存在
  if (!options.url) {
    return null;
  }

  // 图层名必须指定
  if (!options.layers) {
    return null;
  }

  // 根据 tilematrixset 判断是WMS还是WMSTS服务
  // tilematrixset:tileGird的唯一标识符
  if (params.tilematrixset) {
    // 存在，则调用WMTS服务
    return await WMTSGeoServerLayer(options);
  } else {
    // 不存在，则调用WMS服务
    return WMSGeoServerLayer(options);
  }
}

function WMSGeoServerLayer(params) {
  // 将params.url提取处理，并赋值
  let url = params.url;
  // delete params.url;

  // 判断坐标系 ol 默认为view坐标系
  let projection = null;
  if (params.projection) {
    projection = get(params.projection);
    // delete params.projection;
  }

  let layer = new ImageLayer({
    source: new ImageWMS({
      // crossOrigin: "Anonymous",
      url: url,
      // params: params,
      params: {
        LAYERS: params.layers,
        STYLES: params.styles || "",
        FORMAT: params.format || "image/png",
      },
      projection: projection,
      ratio: 1,
      serverType: "geoserver",
    }),
  });
  return layer;
}

async function WMTSGeoServerLayer(params) {
  let metaXmlUrl = appendParams(params.url, {
    Service: "WMTS",
    request: "GetCapabilities",
  });

  let parser = new WMTSCapabilities();

  try {
    let response = await fetch(metaXmlUrl);
    let text = await response.text();
    var result = parser.read(text);
    var options = optionsFromCapabilities(result, {
      layer: params.layers,
      matrixSet: params.tilematrixset,
      format: params.format,
    });

    // 判断参数是否获取成功
    if (!options) {
      return null;
    }
    // let opts = { ...options, crossOrigin: "Anonymous" };
    let opts = { ...options };
    let layer = new TileLayer({
      source: new WMTS(opts),
    });
    return layer;
  } catch (error) {
    return null;
  }
}
