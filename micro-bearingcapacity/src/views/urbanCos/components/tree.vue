<!--
 * @Author: 任继民
 * @Date: 2020-11-13 17:14:42
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-13 17:28:35
 * @Description:
-->
<template>
	<div class="itemTree">
		<a-tree :show-line="showLine" :replaceFields="defaultProps" :tree-data="data" :show-icon="showIcon" @select="onSelect" :blockNode="true">

		</a-tree>
	</div>
</template>

<script>
	export default {
    data: () => ({
      showLine: true,
      showIcon: true,
    }),
		props:['data','defaultProps'],
		mounted() {

		},
		methods: {
			onSelect(selectedKeys, info) {
				this.$parent.choosenTree(selectedKeys[0])
			},
		}
	}
</script>

<style lang="scss" scoped>
	.itemTree {
		width: 100%;
		height: 95%;
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
