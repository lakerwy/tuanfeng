<template>

</template>
<script>
export default {
  beforeCreate() {
    const { query } = this.$route;
    const name = query.name;
    this.$router.replace({name: name})
  },
  mounted: {
    render(h) {
      return h();
    }
  }
}
</script>
