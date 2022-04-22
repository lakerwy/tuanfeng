<template>
  <el-tree
    lazy
    :load="loadNode"
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  ></el-tree>
</template>

<script>
import { getTreeLists2 } from "../../api/api.js";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf"
      }
    };
  },
  props: ["data"],
  methods: {
    handleNodeClick(data, node) {
      if (node.isLeaf) {
        this.$emit("node", data);
      }
    },
    async loadNode(node, resolve) {
      if (node.level === 1) {
        return resolve(node.data.children);
      }
      if (node.level > 1) {
        if (node.level < 3) {
          if (node.data.children.length == 0) {
            let res = await getTreeLists2(node.data.spjtype);
            if (res.code == 200) {
              var newArr = [];
              for (var i in res.data) {
                newArr.push({
                  name: res.data[i].modername,
                  id: res.data[i].id,
                  spjtype: res.data[i].spjtype,
                  leaf: true
                });
              }
              return resolve(newArr);
            }
          } else {
            return resolve(node.data.children);
          }
        } else {
          return resolve([]);
        }
      }
    }
  }
};
</script>
