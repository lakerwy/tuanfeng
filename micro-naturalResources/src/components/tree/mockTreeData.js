export const TreeData = [
    {
        id: 1,
        pid: null,
        label: '规划资源目录',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 2,
        pid: 1,
        label: '现状数据',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 3,
        pid: 1,
        label: '规划数据',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 4,
        pid: 1,
        label: '管理数据',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 5,
        pid: 1,
        label: '社会经济数据',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 6,
        pid: 2,
        label: '资源调查',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 7,
        pid: 2,
        label: '城乡建设',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 8,
        pid: 2,
        label: '资源监测',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 9,
        pid: 2,
        label: '分析评价',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 10,
        pid: 2,
        label: '基础地理',
        url: '',
        type: '',
        layers: '',
        extent: ''
    },
    {
        id: 11,
        pid: 6,
        label: '地理国情普查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/GuoTu/Map_Anno/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50745679006496,
            32.17106600927133,
            112.00821379031618,
            32.618076899524965
        ],
    },
    {
        id: 12,
        pid: 6,
        label: '土地变更调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/GuoTu/Map_Base/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.49923134400007,
            32.16654990541072,
            112.00146639444128,
            32.666546398121866
        ],
    },
    {
        id: 13,
        pid: 6,
        label: '水资源调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50053009500004,
            32.16670241500003,
            112.00123317500004,
            32.66686736400004
        ],
    },
    {
        id: 14,
        pid: 6,
        label: '森林资源调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50053009500004,
            32.16670241500003,
            112.00123317500004,
            32.66686736400004
        ],
    },
    {
        id: 15,
        pid: 6,
        label: '湿地资源调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50053009500004,
            32.16670241500003,
            112.00123317500004,
            32.66686736400004
        ],
    },
    {
        id: 16,
        pid: 6,
        label: '海洋资源调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50053009500004,
            32.16670241500003,
            112.00123317500004,
            32.66686736400004
        ],
    },
    {
        id: 17,
        pid: 6,
        label: '矿产资源调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50053009500004,
            32.16670241500003,
            112.00123317500004,
            32.66686736400004
        ],
    },
    {
        id: 18,
        pid: 6,
        label: '地质及环境调查',
        url: 'http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer',
        type: 'ArcGISServer',
        layers: '*',
        extent: [
            111.50053009500004,
            32.16670241500003,
            112.00123317500004,
            32.66686736400004
        ],
    },
]
export const TreeData1 = [
    {
      id: "111",
      title: "土地变更调查",
      selectable: false,
      key: `111`,
      isLeaf: true,
      url:
        "http://192.168.250.44:6080/arcgis/rest/services/GuoTu/Map_Base/MapServer",
      type: "ArcGISServer",
      layers: "*",
      extent: [
        111.49923134400007,
        32.16654990541072,
        112.00146639444128,
        32.666546398121866,
      ],
    },
    {
      id: "222",
      title: "地理国情普查",
      key: `222`,
      selectable: false,
      isLeaf: true,
      label: "地理国情普查",
      url:
        "http://192.168.250.44:6080/arcgis/rest/services/GuoTu/Map_Anno/MapServer",
      type: "ArcGISServer",
      layers: "*",
      extent: [
        111.50745679006496,
        32.17106600927133,
        112.00821379031618,
        32.618076899524965,
      ],
    },
    {
      id: "333",
      key: "333",
      title: "水资源调查",
      selectable: false,
      isLeaf: true,
      url:
        "http://192.168.250.44:6080/arcgis/rest/services/LHKMAP/jcdt_10/MapServer",
      type: "ArcGISServer",
      layers: "*",
      extent: [
        111.50053009500004,
        32.16670241500003,
        112.00123317500004,
        32.66686736400004,
      ],
    },
  ];
export const filterData1 = [
    {
        businessId: 1,
        orgId: 2,
        domainId: 3,
        id: "111",
        title: "土地变更调查",
        selectable: false,
        key: `1111`,
        isLeaf: true,
        url:
          "http://192.168.250.44:6080/arcgis/rest/services/GuoTu/Map_Base/MapServer",
        type: "ArcGISServer",
        layers: "*",
        extent: [
          111.49923134400007,
          32.16654990541072,
          112.00146639444128,
          32.666546398121866,
        ],
      },
]
