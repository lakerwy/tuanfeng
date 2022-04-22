window.globalUrl = {
  //HOME_API: "http://192.168.99.166:13666/api1.0", // 后台IP地址
  // API_MODEL: "http://192.168.250.220:8899",
  API_MODEL: "http://localhost:10303/api", // "http://192.168.99.127:8899",
  API_ETL: "http://localhost:10303", // "http://192.168.250.220:8901",
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
  }
};
