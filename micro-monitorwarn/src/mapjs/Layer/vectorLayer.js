import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Cluster, Vector as VectorSource} from 'ol/source';

/**
 * 创建空的矢量图层
 * @returns { VectorLayer }
 */
export function EmptyVectorLayer(){
    let layer = new VectorLayer({
        source:new VectorSource()
    })
    return layer;
}

export function GeoJSONObjectVectorLayer(geojsonObject){
    let layer = new VectorLayer({
        source:new VectorSource({
            features:new GeoJSON().readFeatures(geojsonObject)
        })
    })
    return layer;
}

/**
 * 通过获取geojson 的url地址，创建有数据的矢量图层
 * @param  { String } geoJsonUrl 获取geojson数据的url地址
 * @returns { (null | VectorLayer) }
 */
export function GeoJsonVectorLayer(geoJsonUrl){
   if(!geoJsonUrl){
       return null;
   }

    let layer = new VectorLayer({
        source:new VectorSource({
            url: geoJsonUrl,
            format: new GeoJSON()
        })
    })
    return layer;
}

/**
 * 聚合图层
 * @param  { Number } clusterDistance=20 聚合距离
 * @returns { ol.layer }
 */
export function EmptyClusterVectorLayer(clusterDistance = 20){
    let layer = new VectorLayer({
        source:new Cluster({
            distance:Number.parseInt(clusterDistance,10),
            source:new VectorSource()
        })
    })
    return layer;
}
