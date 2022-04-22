/**
 * 根据指定的idKey,进行分组
 * @param  {Array<Object>} list
 * @param  {string} idKey
 * @param  {string} nameKey="name"
 * @param  {string} children="children"
 */
export function getGroupByList(
  list,
  idKey,
  nameKey = "name",
  children = "children"
) {
  if (!Array.isArray(list)) {
    return [];
  }
  let groups = [];
  let map = {};
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (map[item[idKey]]) {
      for (let j = 0; j < groups.length; j++) {
        const gItem = groups[j];
        if (gItem.id === item[idKey]) {
          gItem[children].push(item);
          break;
        }
      }
    } else {
      groups.push({
        id: item[idKey],
        name: item[nameKey],
        children: [item]
      });
      map[item[idKey]] = item;
    }
  }
  return groups;
}
