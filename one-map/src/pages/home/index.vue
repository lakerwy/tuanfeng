<!--  -->
<template>
  <div class="main">
    <!-- <Header /> -->
    <!-- <div style="height: 68px;background: blue"></div> -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "@/components/header/index";
export default {
  data() {
    return {};
  },

  props: {},

  components: {
    Header,
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
