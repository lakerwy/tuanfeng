/*
 * @Author: 任继民
 * @Date: 2021-03-01 09:36:23
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-01 09:36:24
 * @Description:
 */
export default {
  DictData: {
    type: [
      { name: '目录', type: 'category' },
      { name: '栅格', type: 'raster' },
      { name: '矢量', type: 'vector' },
    ],
    layertype: [
      { name: '政务', type: 'GovDataNode' },
      { name: 'DOM', type: 'DOMDataNode' },
      { name: 'DLG', type: 'DLGDataNode' },
    ]
  }
}
