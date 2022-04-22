import Select from "ol/interaction/Select";
import { click, pointerMove } from 'ol/events/condition';
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { createStyle } from './pointStyle'
import { createPointTooltip } from "../../mapjs/tool/measure"
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Cluster, Vector as VectorSource } from 'ol/source';
/**
 * @param map 地图
 * @param selectType 类型 1--点击 2--鼠标划入
 */
// 点击时选中的区域的样式
function createPolygonStyle(text, x = 0, y = 0) {
    return new Style({
        fill: new Fill({ //矢量图层填充颜色，以及透明度
            color: 'rgba(0,0,255,0.95)'
        }),
        text: new Text({
            font: '14px 微软雅黑 ',
            text: text,
            offsetX: x,
            offsetY: y,
            fill: new Fill({
                color: '#fff'
            })
        })
    });
}
let style = new Style({
    fill: new Fill({ //矢量图层填充颜色，以及透明度
        color: 'rgba(0,0,255,0.95)'
    }),
});

let imgSrc = require("../../assets/imgs/icon-poi-red.png")

let select = null; // ref to currently selected interaction

// select interaction working on "click"
let selectClick = new Select({
    condition: click,
});

// select interaction working on "pointermove"
let selectPointerMove = new Select({
    condition: pointerMove,
});

let selects = [select, selectClick, selectPointerMove]

export function changeInteraction(map, selectType,callback) {
    if (select !== null) {
        map.removeInteraction(select);
    }

    select = selects[selectType];
    if (selectType == 1) {
        map.addInteraction(select);
        select.on("select", function (e) {
            let feature = e.selected[0]
            callback(feature);
            let geomType = e.selected[0].getGeometry().getType()
            if (geomType == 'Polygon') {
                // 面的样式
                let townName = feature.getProperties().Name
                // console.log(townName)
                if (townName == "总路咀镇") {
                    feature.setStyle(createPolygonStyle(feature.values_.Name, -10, 20))
                } else if (townName == "贾庙乡") {
                    feature.setStyle(createPolygonStyle(feature.values_.Name, -10, -20))
                } else {
                    feature.setStyle(createPolygonStyle(feature.values_.Name))
                }

            } else if (geomType == 'Point') {
                // console.log(feature.get('style').getText().getText())
                let text = feature.get('style').getText().getText() == undefined ? '' : feature.get('style').getText().getText()
                feature.setStyle(createStyle(imgSrc, undefined, text));
            }

        });
    } else if (selectType == 2) {
        map.addInteraction(select);
        select.on("select", function (e) {
            if (e.selected.length > 0) {
                let feature = e.selected[0]
                let geomType = feature ? e.selected[0].getGeometry().getType() : ''
                if (geomType == 'MultiPolygon') {
                    // 面的样式
                    feature.setStyle(null)
                } else if (geomType == 'Point') {
                    let text = feature.get('style').getText().getText() == undefined ? '' : feature.get('style').getText().getText()
                    let desc = feature.get('desc')
                    let location = feature.get('location')
                    feature.setStyle(createStyle(imgSrc, undefined, text));
                    createPointTooltip(map, desc, location, 'pointTip')
                }
            } else {
                let tips = map.getOverlays().getArray()
                if (tips.length > 0) {
                    tips.forEach((item) => {
                        if (item.id == 'pointTip') {
                            map.removeOverlay(item)
                        }
                    })
                }
            }

        });
    }
    
};

// 根据乡镇名称获取feature
export function getFeatureByName(name) {
    if (!name) {
        return
    }
    let fes = new GeoJSON().readFeatures(window.TF_XZ)
    if (fes.length > 0) {
        let fe = fes.filter((item) => item.values_.Name == name)
        if (fe.length > 0) {
            // console.log(fe[0].getGeometry().getExtent())
            // console.log(fe)
            fe[0].setStyle(createPolygonStyle(name))
            let layer = new VectorLayer({
                source: new VectorSource({
                    features: [fe[0]]
                })
            })
            layer.set("layerName", "xzClickLayer")
            return layer
        }

    }
}

/**
 * 根据code获取行政区划的范围
 * @param  {String} code 行政区划code
 */
export function getFeatureByCode(code) {
    if (!code) {
        return
    }
    if (code.length == 6) {
        let fe = new GeoJSON().readFeatures(window.TF_XIAN)
        // // console.log(fe[0].getGeometry().getExtent())
        if (fe.length > 0) {
            let extent = fe[0].getGeometry().getExtent()
            return extent
        }

    } else {
        let fes = new GeoJSON().readFeatures(window.TF_XZ)
        if (fes.length > 0) {
            let fe = fes.filter((item) => item.values_.ad_code == code)
            if (fe.length > 0) {
                // // console.log(fe[0].getGeometry().getExtent())
                let extent = fe[0].getGeometry().getExtent()
                return extent
            }
        }
    }

}