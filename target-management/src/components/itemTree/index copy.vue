<!--  -->
<template>
  <div>
    <a-tree
      v-if="data.length > 0"
      checkable
      :show-line="true"
      :treeData="data"
      @select="onSelect"
      @check="onChecked"
      @expand="onExpand"
      :defaultExpandedKeys="defaultExpandedKeys"
      :defaultCheckedKeys="defaultCheckedKeys"
      :expandedKeys="expandedKeys"
      :checkedKeys="checkedKeys"
      :load-data="onLoadData"
    >
    </a-tree>
  </div>
</template>

<script>
import { getTaskTreeLists } from "@/api/management";
export default {
  name: "",
  data() {
    return {
      data: [], // 转化之后的树数据
      defaultExpandedKeys: [],
      expandedKeys: ["0"], // 要展开的节点
      defaultCheckedKeys: [], // 要选中的节点
      checkedKeys: [],
      query: {
        size: 9,
        page: 1,
        type: 1,
        id: -1
      },
      dataList: [], //右侧列表
      treeList: [], //左侧树
      total: 0,
      chooseTreeList: ""
    };
  },
  props: ["type", "filterText"],
  watch: {
    filterText(val) {
      this.query.name = val;
      if (val == "") {
        this.query.id = -1;
      } else {
        this.query.id = null;
      }
      this.getTreeInfo();
    }
  },
  mounted() {
    this.query.name = this.filterText;
    this.query.type = this.type;
    this.getTreeInfo();
  },

  methods: {
    // 获取树信息
    async getTreeInfo() {
      // this.data = [];
      let params = this.query;
      let res = await getTaskTreeLists(params);
      // console.log("树", res);
      let data = this.toTreeData(res.data.tree);
      this.getExpandKeys(data);
      this.data = data;
    },
    //格式化数据
    toTreeData(data) {
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach(item => {
        item.key = item.id;
        item.isLeaf = false;
        item.disabled = false;
        item.checkable = false;
        if (item.name) {
          item.title = item.name;
        }
        delete item.children;
      });
      let map = {};
      data.forEach(item => {
        map[item.id] = item;
      });
      data.forEach(item => {
        let parent;
        if (item.parentId) {
          parent = map[item.parentId];
        } else if (item.pid) {
          parent = map[item.pid];
        }
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      // console.log(result)
      return result;
    },
    // 懒加载
    onLoadData(treeNode) {
      // console.log(treeNode.dataRef);
      let res = null;
      return new Promise(async resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.query.id = treeNode.dataRef.id;
        res = await getTaskTreeLists(this.query);
        // console.log(res);

        if (res.code === 200) {
          res.data.itemList.records.forEach(item => {
            if (item.rangetype === "0") {
              item.rangetype = "全域";
            } else if (item.rangetype === "1") {
              item.rangetype = "城区";
            } else if (item.rangetype === "2") {
              item.rangetype = "市域";
            } else if (item.rangetype === "3") {
              item.rangetype = "其它";
            }
            let newArr = [];
            newArr = item.useType.split(",");
            newArr = this.unique(newArr).sort();
            item.useType = newArr.toString();
          });
          this.$parent.dataList = res.data.itemList.records;
          this.$parent.total = res.data.itemList.total;
          res.data.tree.map(item => {
            item.title = item.name;
            item.key = item.id;
            item.checkable = false;
          });
          if (res.data.tree.length === 0) {
            treeNode.dataRef.isLeaf = true;
            treeNode.dataRef.children = res.data.tree;
            treeNode.dataRef.dataList = res.data.itemList.records;
            treeNode.dataRef.total = res.data.itemList.total;
            this.data = [...this.data];
            resolve();
            return;
          } else {
            treeNode.dataRef.isLeaf = false;
            treeNode.dataRef.children = res.data.tree;
            treeNode.dataRef.dataList = res.data.itemList.records;
            treeNode.dataRef.total = res.data.itemList.total;
            this.data = [...this.data];
            // console.log(this.data);
            resolve();
          }
        }
        // console.log(this.data);
      });
    },

    // 树点击事件
    async onSelect(a, b) {
      // console.log(a, b.node.dataRef);
      if (this.type != 1) {
        this.$parent.query.id = a.toString();
      } else {
        this.$parent.getChangeText();
      }
      if (!b.node.expanded && !b.node.isLeaf) {
        this.expandedKeys.push(b.node.dataRef.key);
      } else if (b.node.expanded && !b.node.isLeaf) {
        let arr = [];
        this.expandedKeys.forEach(item => {
          if (item != b.node.dataRef.key) {
            arr.push(item);
          }
        });
        this.expandedKeys = arr;
      }
      this.$parent.chooseData = b.node.dataRef;
      // 格式化相应的属性值(应用范围)
      if (b.node.dataRef.dataList) {
        b.node.dataRef.dataList.forEach(item => {
          if (item.rangetype === "0") {
            item.rangetype = "全域";
          } else if (item.rangetype === "1") {
            item.rangetype = "城区";
          } else if (item.rangetype === "2") {
            item.rangetype = "市域";
          } else if (item.rangetype === "3") {
            item.rangetype = "其它";
          }
          let newArr = [];
          newArr = item.useType.split(",");
          newArr = this.unique(newArr).sort();
          item.useType = newArr.toString();
        });
        this.$parent.dataList = b.node.dataRef.dataList;
        this.$parent.total = b.node.dataRef.total;
      }
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 树节点复选框触发
    onChecked(a, b) {
      console.log(a, b);
      // console.log("55", b);
      if (b.checked) {
        this.checkedKeys.push(b.node.dataRef.key);
      } else {
        let index = this.checkedKeys.indexOf(b.node.dataRef.key);
        this.checkedKeys.splice(index, 1);
      }
    },
    // 树展开事件
    onExpand(a, b) {
      // console.log(a, b);
      this.expandedKeys = a;
    },
    // 查询树的展开节点
    getExpandKeys(data) {
      data.forEach(item => {
        if (item.children) {
          this.expandedKeys.push(item.key);
          this.getExpandKeys(item.children);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ant-tree-title {
  font-size: 14px;
  color: #454954;
}
/deep/.ant-tree-treenode-switcher-close,
/deep/.ant-tree-treenode-switcher-open {
  padding: 2px 0;
}
/deep/.ant-tree-child-tree-open li {
  margin-left: 13px;
}
/deep/.ant-tree-child-tree > li:first-child {
  padding-top: 2px;
}
/deep/.ant-tree-child-tree {
  padding-top: 2px;
  padding-bottom: 2px;
}
/deep/.ant-tree.ant-tree-show-line li:not(:last-child)::before {
  border-left: 1px dashed #dddddd;
  // height: 60%;
}
/deep/.ant-tree-switcher.ant-tree-switcher-noop {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 0 6px;
  background: #fff;
  // border-radius: 50%;
  // border: 1px solid #ddd;
  /deep/.anticon {
    display: none;
  }
}
/deep/.ant-tree-node-selected {
  background: #e6f1ff !important;
  min-width: 80px;
  height: 35px;
  .ant-tree-title {
    color: #1890ff;
  }
}
</style>
