<template>
  <div class="breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, index) in list" :key="index">{{
        item
      }}</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["list"]
};
</script>

<style lang="less" scoped>
.breadcrumb {
  margin-top: 16px;
  padding-left: 30px;
}
</style>
