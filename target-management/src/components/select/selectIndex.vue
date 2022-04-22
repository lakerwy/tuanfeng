<template>
  <div class="contenter">
    <p>{{ title }}：</p>
    <div class="contenter-select">
      <a-select
        v-model="value"
        allow-clear 
        style="width: 304px"
        @change="handleChange"
      >
        <a-select-option v-for="item in options" :key="item.name">
          {{ item.value }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ""
    };
  },
  props: ["title", "options"],
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
      this.$emit("changeIndex", value);
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

* {
  box-sizing: border-box;
}
.contenter {
  height: 56px;
  line-height: 56px;
  box-sizing: border-box;
  p {
    float: left;
    color: #6f7583;
  }
  &-select {
    float: left;
  }
}
</style>
