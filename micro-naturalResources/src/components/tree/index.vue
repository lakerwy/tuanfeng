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
      :loadedKeys="['111']"
    >
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
export default {
  name: "",
  data() {
    return {
      data: [], // 转化之后的树数据
      originalData: [], // 最初的树数据
      dataCopy: [], //转化之后的树数据
      searchValue: [], // 搜索后获取的数据
      defaultExpandedKeys: [],
      expandedKeys: [], // 要展开的节点
      defaultCheckedKeys: [], // 要选中的节点
      checkedKeys: []
    };
  },
  watch: {
    type(val) {
      // console.log(val);
      this.data = [];
      this.expandedKeys = [];
      this.getNewTreeData(val);
      this.getTreeInfo(val);
    },
    filterText(val) {
      // console.log(val);
      // this.checkedKeys = [];
      // this.filterTree(val);
       if (val != "") {
        this.filterTree(val);
      } else {
        this.data = [];
        this.expandedKeys = [];
        this.searchValue = [];
        this.getTreeInfo(this.type);
      }
    },
    removeTreeCheckedKeys() {
      this.checkedKeys = [];
    }
  },
  props: ["type", "filterText", "removeTreeCheckedKeys"],

  components: {},

  created() {},

  computed: {},

  mounted() {
    //this.getTreeInfo("business");
  },

  methods: {
    // 获取树信息
    async getTreeInfo(type) {
      this.data = [];
      this.dataCopy = [];
      // this.originalData = [];
      let params = {
        // name: '',
      };
      let res = await getTreeInfo(params);
      // console.log("树", res);
       if (this.searchValue.length == 0) {
        let data = this.toTreeData(res.body);
        this.getExpandKeys(data);
        this.data = data;
        this.dataCopy = data;
      } else {
        this.searchValue.forEach(e => {
          e.resourcesName = e.serviceName;
          e.key = e.id;
          e.serviceType = 1;
          e.resourcetype = e.resourceType;
          e.resourceid = e.resourceId;
        });
        this.originalData.forEach(item => {
          this.searchValue.forEach(items => {
              if (items.naturalResourcesId == item.id) {
                items.pid = item.id;
              }
          });
        });
        let arr = this.originalData.concat(this.searchValue);
        let data = this.toTreeData(arr);
        this.getExpandKeys(data);
        this.data = data;
      }
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
        if (item.serviceType) {
          item.checkable = true;
          item.isLeaf = true;
        } else {
          item.checkable = false;
          item.isLeaf = false;
        }
        item.title = item.resourcesName;
        delete item.children;
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
    // 懒加载
    onLoadData(treeNode) {
      return new Promise(async resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        const res = await selectListbyNatureResources(treeNode.dataRef.id);
        if (res.success) {
          res.data.map(item => {
            item.title = item.serviceName;
            item.key = item.id;
            item.isLeaf = true;
          });
          if (res.data.length === 0) {
            treeNode.dataRef.isLeaf = true;
            treeNode.dataRef.children = res.data;
            this.data = [...this.data];
            resolve();
            return;
          } else {
            treeNode.dataRef.children = res.data;
            this.data = [...this.data];
            resolve();
          }
        }
      });
    },
    // 树点击事件
    async onSelect(a, b) {
      // console.log(b);
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
      this.$emit("treeNodeCheck", b.checked, b.node.dataRef);
    },
    // 树筛选事件
    async filterTree(e) {
      this.filterUrls(e);
      // this.getTreeInfo(this.type);
      // this.$nextTick(() => {
      //   let id = "1446C6B40A5A4F2C90AFE58F8BE63FD5";
      //   this.expandedKeys.push(id);
      // });
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
    },
    // 获取urls
    async getLayerUrls(id) {
      let ops = {
        params: {
          id: id,
          type: this.type
        }
      };
      let res = await getLayerUrls(ops);
      // console.log(123,res)
      let { success, body } = res;
      if (success) {
        // console.log(150, body);
      }
    },
    // 筛选urls
    async filterUrls(e) {
      this.searchValue=[]
      let ops = e;
      let res = await filterUrls(ops);
      let { success, body } = res;
      // console.log(success)
      if (success) {
        body.forEach(item=>{
          if(item.naturalResourcesId){
            this.searchValue.push(item)
          }
        })
        

      } else {
        this.searchValue = [];
      }
      // console.log(this.searchValue)
      this.getTreeInfo(this.type);
    },
    async getNewTreeData(type) {
      this.originalData = [];
      let params = {
        // type: type
      };
      let res = await getTreeInfo(params);
      // console.log("树", res);
      this.originalData = res.body;
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
  padding: 5px 0;
}
/deep/.ant-tree-child-tree-open li {
  margin-left: 13px;
}
/deep/.ant-tree-child-tree > li:first-child {
  padding-top: 4px;
}
/deep/.ant-tree-child-tree {
  padding-top: 5px;
  padding-bottom: 5px;
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
