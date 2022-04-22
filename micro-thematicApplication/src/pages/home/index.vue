<!--  -->
<template>
  <div class="main">
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {},

  components: {
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style lang="less" scoped>
.main {
  margin: 0;
  padding: 0;
  height: 100%;
  .content {
    height: 100%;
    // min-height: 900px;
  }
}
</style>
