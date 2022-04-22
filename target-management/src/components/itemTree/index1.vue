<template>
  <div class="itemTree">
    <a-tree
      :show-line="showLine"
      :replaceFields="defaultProps"
      :tree-data="data"
      :show-icon="showIcon"
      @select="onSelect"
      :blockNode="true"
      :defaultExpandAll="true"
    >
    </a-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLine: true,
      showIcon: true
    };
  },
  props: ["data", "defaultProps"],
  mounted() {},
  methods: {
    onSelect(selectedKeys, info) {
      this.$parent.choosenTree(selectedKeys[0],info.node.dataRef);
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

.itemTree {
  width: 100%;
  height: 95%;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  height: 34px;
  line-height: 34px;
}
/deep/ .ant-tree li span.ant-tree-switcher,
.ant-tree li span.ant-tree-iconEle {
  margin-top: 6px;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  color: #1890ff;
  background-color: #e6f1ff;
}
</style>
