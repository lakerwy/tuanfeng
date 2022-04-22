// 地图初始化位置:团风县
window.viewConfig = {
  zoom: 11,
  center: [114.867012, 30.646081],
};

// 矢量底图
window.vectorLayer = [
  {
    // 天地图矢量数据
    url:
      "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
    projection: "EPSG:3857",
    type: "xyz",
  },
  {
    // 天地图矢量注记数据
    url:
      "http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
    projection: "EPSG:3857",
    type: "xyz",
  },
];

// 影像底图
window.imageLayer = [
  {
    // 天地图影像数据
    url:
      "http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
    projection: "EPSG:3857",
    type: "xyz",
  },
  {
    // 天地图影像注记数据
    url:
      "http://t4.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
    projection: "EPSG:3857",
    type: "xyz",
  },
];

// 团风县行政区划图
window.districts = {
  // 镇
  town: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 0,
    type: "ArcGISServer",
  },
  // 县
  county: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 1,
    type: "ArcGISServer",
  },
};

// 三条红线
window.redLines = {
  // 永久基本农田
  farmland: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 0,
    type: "ArcGISServer",
  },
  // 生态保护红线
  ecologicalProtection: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 0,
    type: "ArcGISServer",
  },
  // 城镇扩展边界
  borderTown: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 0,
    type: "ArcGISServer",
  },
};

// 城市规划
window.cityPlan = {
  // 控制性详细规划 (控规)
  regulatoryPlan: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 0,
    type: "ArcGISServer",
  },
  // 修建性详细规划 (详规)
  sitePlan: {
    url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
    id: 0,
    type: "ArcGISServer",
  },
};
