/*
 * @Author: 任继民
 * @Date: 2020-12-21 09:40:07
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-20 08:51:33
 * @Description: 数据字典
 */
export default {
  DictData: {
    type: [
      { name: '栅格', type: 'raster' },
      { name: '矢量', type: 'vector' },
      { name: '政务', type: 'attable' },
      { name: '目录', type: 'category' },
    ],
    layertype: [
      { name: '政务', type: 'GovDataNode' },
      { name: 'DOM', type: 'DOMDataNode' },
      { name: 'DLG', type: 'DLGDataNode' },
    ]
  }
}
