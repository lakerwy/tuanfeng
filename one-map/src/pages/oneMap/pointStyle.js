import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Select from 'ol/interaction/Select';
import Stamen from 'ol/source/Stamen';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { Icon, Style, Text, Fill } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

let imgSrc = require("../../assets/imgs/icon-poi-blue.png")
let imgSrc1 = require("../../assets/imgs/icon-poi-red.png")

// 创建点的样式
/**
 * @param  {String} src 图片地址
 * @param  {} img
 * @param  {String} text 展示的文字
 */
export function createStyle(src, img, text) {
    return new Style({
        image: new Icon({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: src,
            img: img,
            imgSize: img ? [img.width, img.height] : undefined,
        }),
        text: new Text({
            font: '14px 微软雅黑 ',
            text: text,
            offsetY: -4,
            offsetY: -18,
            fill: new Fill({
                color: '#fff'
            })
        })
    });
}
// 蓝色点
/**
 * @param  {Array} poi 位置坐标
 * @param  {String} text 文字描述
 * @param  {String} desc 点描述
 * @param  {Array} location 位置坐标
 */
export function bluePoint(poi = [114.580688, 31.25802], text = undefined,desc,location) {
    let iconFeature = new Feature(new Point(poi));
    iconFeature.set('style', createStyle(imgSrc, undefined, text));
    iconFeature.set('desc', desc);
    iconFeature.set('location', location);
    let pointLayer = new VectorLayer({
        style: function (feature) {
            return feature.get('style');
        },
        source: new VectorSource({ features: [iconFeature] }),
        className: 'bluePoint',
    })
    return pointLayer
}
// 红色点
export function redPoint(poi = [114.580688, 31.25802], text,desc) {
    let iconFeature = new Feature(new Point(poi));
    iconFeature.set('style', createStyle(imgSrc1, undefined, text));
    iconFeature.set('desc', desc);
    let pointLayer = new VectorLayer({
        style: function (feature) {
            return feature.get('style');
        },
        source: new VectorSource({ features: [iconFeature] }),
        className: 'redPoint'
    })
    return pointLayer
}
// 红色点点击时
export function redPoint1(poi = [114.580688, 31.25802], text,desc) {
    let iconFeature = new Feature(new Point(poi));
    iconFeature.set('style', createStyle(imgSrc1, undefined, text));
    iconFeature.set('desc', desc);
    let pointLayer = new VectorLayer({
        style: function (feature) {
            return feature.get('style');
        },
        source: new VectorSource({ features: [iconFeature] }),
        className: 'redPoint1'
    })
    return pointLayer
}