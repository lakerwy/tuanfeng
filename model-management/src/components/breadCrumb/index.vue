<template>
  <el-breadcrumb>
    <el-breadcrumb-item
      :to="{ path: item.path }"
      v-for="(item, index) in list"
      :key="index"
    >
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ["list"]
};
</script>
