<!--
 * @Author: 任继民
 * @Date: 2020-11-24 16:50:26
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-27 11:28:35
 * @Description:
-->
<template>
  <el-table-column :prop="col.prop" :label="col.label" align="left">
    <template v-if="col.children">
      <my-column
        v-for="(item, index) in col.children"
        :key="index"
        :col="item"
      ></my-column>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "MyColumn",
  props: {
    col: {
      type: Object,
    },
  },
};
</script>
