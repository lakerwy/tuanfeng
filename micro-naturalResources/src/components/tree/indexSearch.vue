<template>
  <div>
    <a-input-search
      style="margin-bottom: 8px"
      placeholder="Search"
      @change="onChange"
    />
    <a-tree
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
import {
  getTreeInfo,
  getLayerUrls,
  filterUrls,
  selectListbyNatureResources
} from "@/api/oneMap.js";
const gData = [];
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
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      gData,
      dataList
    };
  },
  mounted() {
    this.getTreeInfo();
  },
  methods: {
    // 获取树信息
    async getTreeInfo() {
      this.gData = [];
      let params = {};
      let res = await getTreeInfo(params);
      // console.log("树", res);

      let data = this.toTreeData(res.body);
      // this.getExpandKeys(data);
      this.gData = data;
      // this.dataCopy = data;
      generateList(this.gData);
    },
    //格式化数据
    toTreeData(data) {
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach(item => {
        item.key = item.id;
        // item.selectable = false,
        item.isLeaf = false;
        item.disabled = false;
        item.checkable = false;
        item.title = item.resourcesName;
        (item.scopedSlots = { title: "title" }), delete item.children;
      });
      let map = {};
      data.forEach(item => {
        map[item.id] = item;
      });
      data.forEach(item => {
        let parent;
        parent = map[item.pid];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
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
            return getParentKey(item.key, this.gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      // debugger;
      this.$nextTick(() => {
        this.searchValue = value;
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = true;
      });
      // Object.assign(this, {
      //   expandedKeys,
      //   searchValue: value,
      //   autoExpandParent: true
      // });
    }
  }
};
</script>
