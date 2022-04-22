/*
 * @Author: 任继民
 * @Date: 2020-12-17 20:02:42
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-18 09:10:43
 * @Description:
 */
import IviewTreeTable from './iview-tree-table';
IviewTreeTable.install = (Vue) => {
  Vue.component(IviewTreeTable.name, IviewTreeTable);
};

export default IviewTreeTable;
