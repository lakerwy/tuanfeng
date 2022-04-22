/*
 * @Author: 任继民
 * @Date: 2021-01-18 11:04:15
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-28 11:07:49
 * @Description:
 */
/**
 * 快速生成树形
 */
export const createTree = (data, parentId = "parentId") => {
  let len = data.length;
  let flagArr = [];
  for (let i = 0; i < len; i++) {
    for (let j = i; j < len; j++) {
      if (data[i][parentId] == data[j].id) {
        if (!data[j].children) {
          data[j].children = [];
        }
        data[j].children.push(data[i]);
        flagArr.push(i);
      }
      if (data[j][parentId] == data[i].id) {
        if (!data[i].children) {
          data[i].children = [];
        }
        data[i].children.push(data[j]);
        flagArr.push(j);
      }
    }
  }
  flagArr = flagArr.sort((a, b) => {
    return a - b;
  });
  for (let k = 0; k < flagArr.length; k++) {
    delete data[flagArr[k]];
  }
  let result = data.filter((item) => {
    return item;
  });

  return result;
};
export const setTreeData = (arr,pid) => {
  // 删除所有 children,以防止多次调用
  arr.forEach(function (item) {
    delete item.children;
  });
  let map = {}; // 构建map
  arr.forEach((i) => {
    map[i.id] = i; // 构建以area_id为键 当前数据为值
  });

  let treeData = [];
  arr.forEach((child) => {
    const mapItem = map[child[pid]]; // 判断当前数据的pid是否存在map中

    if (mapItem) { // 存在则表示当前数据不是最顶层数据
      // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
      (mapItem.children || (mapItem.children = [])).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
    } else { // 不存在则是组顶层数据
      treeData.push(child);
    }
  });

  return treeData;
};
