<template>
  <div class="contenter">
    <p>{{title}}：</p>
    <div class="contenter-select">
      <a-input
        style="width: 304px"
        v-model="value"
        @change="handleChange"
        placeholder="请输入需要查询的年份"
      />
    </div>
  </div>
</template>

<script>
export default {
  props:["title"],
  data() {
    return {
      value: ""
    };
  },
  methods: {
    handleChange() {
      this.$emit("changeIndex", this.value);
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
