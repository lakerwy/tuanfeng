<!--
 * @Author: 任继民
 * @Date: 2020-11-13 17:14:42
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-07 17:17:08
 * @Description:
-->
<template>
	<div class="itemTree">
		<a-tree :checkable="checkable" :show-line="showLine" :replaceFields="defaultProps" :tree-data="data" :show-icon="showIcon" @select="onSelect" @check="onCheck" :blockNode="true" :default-expanded-keys="expandedKeys" >
		</a-tree>
	</div>
</template>

<script>
export default {
  data: () => ({
    showLine: true,
    showIcon: true,
  }),
  props: {
    data: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => {}
    },
    checkable: {
      type: Boolean,
      default: false
    },
    expandedKeys: {
      type: Array,
      default: () => []
    }
  },
  mounted() {

  },
  methods: {
    onSelect(data, { selected: bool, selectedNodes, node, event }) {
      // console.log(data, { selected: bool, selectedNodes, node, event })
      this.$emit('treeSelect', node.dataRef)
    },
    onCheck(checkedKeys, {checked: bool, checkedNodes, node, event}) {
      this.$emit('treeCheck',checkedKeys, {checked: bool, checkedNodes, node, event})
    },
    onLoadData(treeNode) {
      // console.log(treeNode.dataRef)
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        setTimeout(async () => {
          let url = treeNode.dataRef.MapServerPath + '?f=pjson';
          let res = await Http.get(url);
          let temparr = [];
          let tempobj = res.layers.pop();
          tempobj.key = tempobj.id + treeNode.dataRef.Name2;
          tempobj.type = treeNode.dataRef.Name2;
          tempobj.title = tempobj.name;
          tempobj.isLeaf = true;
          tempobj.MapServerPath = treeNode.dataRef.MapServerPath;
          temparr.push(tempobj)
          treeNode.dataRef.children = temparr;
          this.data = [...this.data];
          resolve();
        }, 200);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
	.itemTree {
		width: 100%;
    .ant-tree-show-line {
      height: 95%;
      overflow-y: auto;
      overflow-x: auto;
    }
    .ant-tree-show-line::-webkit-scrollbar {
      /*滚动条整体样式*/
      width : 8px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    .ant-tree-show-line::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow   : inset 0 0 5px rgba(90, 89, 89, 0.2);
      background   : #535353;
    }
    .ant-tree-show-line::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow   : inset 0 0 5px rgba(68, 68, 68, 0.2);
      border-radius: 10px;
      background   : #ededed;
    }
	}
	::deep .ant-tree li .ant-tree-node-content-wrapper{
		height:34px;
		line-height: 34px;
	}
	::deep .ant-tree li span.ant-tree-switcher, .ant-tree li span.ant-tree-iconEle{
		margin-top:6px;
	}
	::deep .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected{
		color: #1890ff;
		background-color: #e6f1ff;
	}
</style>
