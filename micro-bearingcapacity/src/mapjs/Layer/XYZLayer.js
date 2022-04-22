import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import XYZ from 'ol/source/XYZ';
import {get} from 'ol/proj';

/**
 * @param  { Object} params 
 * params = {url , projection , tileGrid{origin,tileSize,resolutions,matrixIds}}
 * @returns {(null | TileLayer)} 瓦片图层
 */
export default function XYZLayer(params) {
    const options = params || {};
    
    // 判断地图服务地址是否存在
    if (!options.url) {
        return null;
    }
    
    // 判断坐标系 ol 默认为view坐标系
    let projection = options.projection ? get(options.projection) : null;
    
    // 根据参数,生成 TileGrid 对象
    let tileGrid = options.tileGrid ? createTileGird(options.tileGrid) : null ;

    let layer = new TileLayer({
        source: new XYZ({
            crossOrigin: 'Anonymous',
            projection: projection,
            //url:options.url,
            tileUrlFunction: function (tileCoord) {
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = tileCoord[2];
                return options.url.replace("{z}", z.toString()).replace("{y}", y.toString()).replace("{x}", x.toString());
            },
            tileGrid: tileGrid,
            wrapX: false
        })
    });
    return layer
}


function createTileGird(params){
    return new TileGrid({
        origin: params.origin,
        tileSize: params.tileSize,
        resolutions: params.resolutions,
        matrixIds: params.matrixIds
    });
}