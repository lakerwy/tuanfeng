window.globalUrl = {
  API_MODEL: "http://192.168.250.220:8899",
  districts: {
    // 镇
    town: {
      url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
      id: 0,
      type: "ArcGISServer"
    },
    // 县
    county: {
      url: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer",
      id: 1,
      type: "ArcGISServer"
    }
  },
  viewConfig: {
    zoom: 11,
    center: [114.989726, 30.723695]
  },
  vectorLayer: [
    {
      url:
        "http://192.168.250.200:6080/arcgis/rest/services/tf/tfVector/MapServer",
      layers: "*",
      type: "ArcGISServer"
    }
  ],
  imageLayer: [
    {
      url: "http://192.168.250.200/arcgis/rest/services/tfimage/MapServer",

      layers: "*",
      type: "ArcGISServer"
    }
  ],
  redLines: {
    farmland: {
      url:
        "http://192.168.250.200/arcgis/rest/services/tf_redlines/YJJBNT/MapServer",
      layers: "*",
      type: "ArcGISServer"
    },
    ecologicalProtection: {
      url:
        "http://192.168.250.200/arcgis/rest/services/tf_redlines/STBHHX/MapServer",
      layers: "*",
      type: "ArcGISServer"
    },
    borderTown: {
      url:
        "http://192.168.250.200/arcgis/rest/services/tf_redlines/CZKFBJ/MapServer",
      layers: "*",
      type: "ArcGISServer"
    }
  }
};
