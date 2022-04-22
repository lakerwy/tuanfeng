<template>
  <!-- 查询组件 -->
  <div>
    <el-input clearable v-model="queryVal"></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryVal: ''
    }
  }
}
</script>