import { Map, View } from "ol";
import { get as getProjection } from "ol/proj.js";
import { defaults as defaultControls, ScaleLine } from "ol/control.js";
import LayerGroup from "ol/layer/Group";

/**
 * 初始化地图容器
 *
 * @export
 * @param { string } projection 坐标系
 * @param { ol.coordinate } center 中心点
 * @param { number } zoom 当前级别
 * @param { number } resolution 当前级别对应的分辨率
 * @param { number} minZoom 最小级别
 * @param { number } maxZoom 最大级别
 * @returns Map
 */
export function initMap(
  elementId,
  { projection = "EPSG:4326", center, zoom, minZoom, maxZoom } = {}
) {
  document.getElementById(elementId).innerHTML = "";
  let map = new Map({
    target: elementId,
    layers: [],
    view: new View({
      projection: getProjection(projection),
      center: center,
      zoom: zoom,
      minZoom: minZoom,
      maxZoom: maxZoom
    }),
    controls: defaultControls({
      attribution: false,
      zoom: false,
      rotate: false
    }) //.extend([new ScaleLine({ bar: true, text: true, minWidth: 125 })]),
  });
  window.anayEvalMap = map;
  const resizeObserver = new ResizeObserver(() => {
    map.updateSize();
  });

  resizeObserver.observe(document.getElementById(elementId));
  return map;
}

/**
 * 根据像素范围，裁剪地图生成base64图片
 * @param  {ol.Map} map 地图
 * @param  {Number} left 左侧像素
 * @param  {Number} top 上侧像素
 * @param  {Number} width 宽度
 * @param  {Number} height 高度
 * @param  {Function} callback  fn(image,width,height)
 */
export function exportMapBase64(map, left, top, width, height, callback) {
  map.once("rendercomplete", () => {
    var mapCanvas = document.createElement("canvas");
    mapCanvas.width = width;
    mapCanvas.height = height;
    var mapContext = mapCanvas.getContext("2d");
    Array.prototype.forEach.call(
      document.querySelectorAll(".ol-layer canvas"),
      function(canvas) {
        if (canvas.width > 0) {
          var opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
          var transform = canvas.style.transform;
          // Get the transform parameters from the style's transform matrix
          var matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(",")
            .map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          mapContext.drawImage(
            canvas,
            left,
            top,
            width,
            height,
            0,
            0,
            width,
            height
          );
        }
      }
    );
    let base64 = mapCanvas.toDataURL();
    let params = {
      image: base64,
      width: mapCanvas.width,
      height: mapCanvas.height
    };
    callback(params);
  });
  map.renderSync();
}

/**
 * @description 添加底图
 * @param  {ol.map} map
 * @param  {Array[ol.layer]} baseLayers
 */
export function addBaseLayers(map, baseLayers) {
  if (!map || !Array.isArray(baseLayers)) {
    return;
  }

  let baseLayerGroup = new LayerGroup({
    layers: baseLayers
  });
  baseLayerGroup.classType = "base";
  map.getLayers().insertAt(0, baseLayerGroup);
  // map.addLayer(baseLayerGroup);
}

export function addBaseLayer(map, baseLayer) {
  if (!map || !baseLayer) {
    return;
  }

  let baseLayers = map.getLayers().getArray()[0];
  let layers = [...baseLayers.getLayers(), baseLayer];
  baseLayers.setLayers(layers);
}

/**
 * @description 移除底图
 * @param  {ol.map} map
 */
export function removeBaseLayers(map) {
  if (!map) {
    return;
  }
  let layers = map.getLayers();
  if (layers.getLength() > 0) {
    let baseGroup = layers.getArray()[0];
    if (baseGroup.classType === "base") {
      layers.removeAt(0);
    }
  }
}
