
// 请求服务
window.tuanfengxian = {
  url: 'http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer',
  xian: 1,
  xiang: 0,
}


// 矢量底图
window.vectorLayer = [
    {// 天地图影像数据
        url: 'http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d',
        projection: 'EPSG:3857',
        type: 'xyz',
    },
    {// 天地图影像注记数据
        url: 'http://t4.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d',
        projection: 'EPSG:3857',
        type: 'xyz',
    },
];

window.imageLayer = [
    {
        // 天地图矢量数据
        url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d',
        projection: 'EPSG:3857',
        type: 'xyz',
    },
    {
        // 天地图矢量注记数据
        url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d',
        projection: 'EPSG:3857',
        type: 'xyz',
    },
];
// 团风县缩放级别
window.zoom = 11
// 团风县中心点坐标
window.center = [114.867012, 30.646081]
// 永久基本农田图层数据
window.farmlandLayer = {
    type: "ArcGISServer",
    url: "http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_0/MapServer",
    layers: '*',
    extent: [
        111.65962418692916,
        32.37649791688585,
        111.68100810521858,
        32.38834008678981
    ],
    layerName: "farmlandLayer"
}
// 生态保护红线图层数据
window.ecologyLayer = {
    type: "ArcGISServer",
    url: "http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer",
    layers: '*',
    extent: [
        111.40038439955704,
        32.254957980527855,
        111.78193097184193,
        32.46625411784559,
    ],
    layerName: "ecologyLayer"
}
// 城镇扩展边界图层数据
window.borderLayer = {
    type: "ArcGISServer",
    url: "http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_11/MapServer",
    layers: '*',
    extent: [
        111.61670714824957,
        32.35481801029004,
        111.68029824363039,
        32.39003403317633
    ],
    layerName: 'borderLayer'
}

