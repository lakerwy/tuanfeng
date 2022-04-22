<!--
 * @Author: 任继民
 * @LastEditors: 任继民
-->
<template></template>
<script>
export default {
  created () {
    this.init()
  },
  mounted: {
    render (h) {
      return h()
    }
  },
  methods: {
    init () {
      this.$store.dispatch('getUserInfo').then(res => {
      })
    }
  }
}
</script>
