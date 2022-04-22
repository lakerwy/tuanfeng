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
    >
    </a-tree>
  </div>
</template>

<script>
import { getTreeLists } from "@/api/px-api";

export default {
  name: "",
  data() {
    return {
      data: [], // 转化之后的树数据
      defaultExpandedKeys: [],
      expandedKeys: [1], // 要展开的节点
      defaultCheckedKeys: [], // 要选中的节点
      checkedKeys: [],
      dataList: [], //右侧列表
      treeList: [] //左侧树
    };
  },
  mounted() {
    this.getTreeInfo();
  },

  methods: {
    // 获取树信息
    async getTreeInfo() {
      // this.data = [];
      let res = await getTreeLists();
      // console.log("树", res);
      let data = this.toTreeData(res);
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
        if (item.typeName) {
          item.title = item.typeName;
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

    // 树点击事件
    async onSelect(a, b) {
      this.$parent.query.page = 1;
      console.log(a, b);
      this.$parent.queryId=a
      if(b.node.dataRef.parentId!=0){
        b.node.dataRef.isLeaf=true
      }
      this.$parent.id = b.node.dataRef.id;
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
    },

    // 树节点复选框触发
    onChecked(a, b) {
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
