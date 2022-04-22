<template>
  <div>
    <a-input-search
      style="margin-bottom: 8px"
      placeholder="请输入指标关键字"
      @change="onChange"
    />
    <a-tree
      :checkedKeys="choosenList"
      checkStrictly
      checkable
      @check="choosen"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="gData"
      @expand="onExpand"
    >
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
const gData = [
  {
    title: "资源环境状况",
    key: "1",
    class: "treeList",
    checkable: false,
    children: [
      {
        title: "自然资源",
        key: "11",
        checkable: false,
        children: [
          {
            title: "耕地资源",
            key: "111",
            checkable: false,
            children: [
              {
                title: "耕地保有量",
                key: "1111"
              },
              {
                title: "高标准农田",
                key: "1112"
              },
              {
                title: "粮食产量",
                key: "1113"
              },
              {
                title: "高标准农田面积占比",
                key: "1114"
              }
            ]
          },
          {
            title: "矿产资源",
            key: "112",
            checkable: false,
            children: [
              {
                title: "test",
                key: "1121"
              }
            ]
          },
          {
            title: "能源资源",
            key: "113",
            checkable: false,
            children: [
              {
                title: "test",
                key: "1131"
              }
            ]
          },
          {
            title: "水资源",
            key: "114",
            checkable: false,
            children: [
              {
                title: "test",
                key: "1141"
              }
            ]
          },
          {
            title: "森林资源",
            key: "115",
            checkable: false,
            children: [
              {
                title: "test",
                key: "1151"
              }
            ]
          },
          {
            title: "草地资源",
            key: "116",
            checkable: false,
            children: [
              {
                title: "test",
                key: "1161"
              }
            ]
          }
        ]
      },
      {
        title: "生态环境",
        key: "12",
        checkable: false,
        children: [
          {
            title: "test",
            key: "121"
          }
        ]
      }
    ]
  },
  {
    title: "国土空间开发利用状况",
    key: "2",
    checkable: false,
    children: [
      {
        title: "test",
        key: "21"
      }
    ]
  }
];
const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: node.title });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
export default {
  data() {
    return {
      choosenList: [],
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      gData
    };
  },
  methods: {
    choosen(checkedKeys, e) {
      this.choosenList = [checkedKeys.checked[checkedKeys.checked.length - 1]];
      this.choosenTitle = e.node.dataRef.title;
      this.$parent.choosenTree(this.choosenList[0], this.choosenTitle);
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    }
  }
};
</script>
