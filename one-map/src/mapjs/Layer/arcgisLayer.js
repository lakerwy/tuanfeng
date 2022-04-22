import { appendParams } from "ol/uri";
import { Image as ImageLayer, Tile as TileLayer } from "ol/layer";
import { get } from "ol/proj";
import ImageArcGISRest from "ol/source/ImageArcGISRest";
import TileArcGISRest from "ol/source/TileArcGISRest";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";

/**
 * @param  {Object} params
 * params = {url,layer}
 * layer = [show | hide | include | exclude]:layerId1,layerId2 eg:layers=show:2,4,7
 * @returns {(null | TileLayer)} 瓦片图层
 */
export default async function ArcGISServerLayer(params) {
  const options = params || {};

  // 判断地图服务地址是否存在
  if (!options.url) {
    return null;
  }

  const jsonUrl = appendParams(params.url, {
    f: "pjson"
  });

  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    if (!data) {
      return null;
    }

    const projection =
      `EPSG:${data.spatialReference.latestWkid}` || data.spatialReference.wkid;
    let extent = [
      data.fullExtent.xmin,
      data.fullExtent.ymin,
      data.fullExtent.xmax,
      data.fullExtent.ymax
    ];
    let layer = null;
    if (data.tileInfo) {
      layer = WMTSArcGISLayer(params, projection, data);
    } else {
      layer = WMSArcGISLayer(params, projection);
    }
    if (layer) {
      layer.extent = extent;
      layer.projection = projection;
    }
    return layer;
  } catch (error) {
    return null;
  }
}

function WMSArcGISLayer(params, projection) {
  // 将params.url提取处理，并赋值
  const { url } = params;
  // delete params.url;

  const layer = new ImageLayer({
    source: new ImageArcGISRest({
      // crossOrigin: "Anonymous",
      projection: get(projection),
      ratio: 1,
      params: {
        LAYERS: params.layers
      },
      url
    })
  });
  return layer;
}

function WMTSArcGISLayer(params, projection, data) {
  // TileArcGISRest 对3857和4326外的坐标系不够友好，结论暂时
  //   const { url } = params;

  //   const obj = { ...params };
  //   delete obj.url;

  //   const layer = new TileLayer({
  //     source: new TileArcGISRest({
  //       url,
  //       projection: get(projection),
  //       params: obj,
  //       wrapX: false,
  //     }),
  //   });

  // 另外一种方式
  let resolutions = [];
  let matrixIds = [];
  const origin = [
    Number.parseFloat(data.tileInfo.origin.x),
    Number.parseFloat(data.tileInfo.origin.y)
  ];
  const tileSize = [data.tileInfo.cols, data.tileInfo.rows];
  const { lods } = data.tileInfo;
  for (let i = 0; i < lods.length; i += 1) {
    const element = lods[i];
    matrixIds.push(element.level);
    resolutions.push(element.resolution);
  }
  const url = `${params.url}/tile/{z}/{y}/{x}`;
  const layer = new TileLayer({
    source: new XYZ({
      // crossOrigin: "Anonymous",
      projection: get(projection),
      tileUrlFunction(tileCoord) {
        const z = tileCoord[0];
        const x = tileCoord[1];
        const y = tileCoord[2];
        return url
          .replace("{z}", z.toString())
          .replace("{y}", y.toString())
          .replace("{x}", x.toString());
      },
      tileGrid: new TileGrid({
        origin,
        tileSize,
        resolutions,
        matrixIds
      }),
      wrapX: false
    })
  });
  return layer;
}
