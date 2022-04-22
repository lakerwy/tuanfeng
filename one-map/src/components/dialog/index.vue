<!--  -->
<template>
  <div class="dialog">
    <div class="header">
      {{ title }}
      <div class="close" @click="handleCancel"></div>
    </div>
    <slot name="content"></slot>
    <div class="footer" v-show="showFooter">
      <div class="ok btn" @click="handleOk">{{ okText }}</div>
      <div class="cancle btn" @click="handleCancel">{{ cancleText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  data() {
    return {};
  },

  props: {
    title: {
      type: String,
    },
    okText: {
      type: String,
      default: "确定",
    },
    cancleText: {
      type: String,
      default: "取消",
    },
    showFooter: {
        type: Boolean,
        default: true,
    }
  },

  components: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    handleOk() {
      this.$emit("handleOk");
    },
    handleCancel() {
      this.$emit("handleCancel");
    },
  },
};
</script>
<style lang='less' scoped>
.dialog {
  width: 320px;
  height: auto;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  border-radius: 4px;
  .header {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #454954;
    text-align: left;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    position: relative;
    .close {
        cursor: pointer;
      background: url("../../assets/imgs/icon-clear.png") no-repeat center;
      width: 20px;
      height: 20px;
      position: absolute;
      top: 12px;
      right: 0px;
    }
  }
  .footer {
    margin-top: 20px;
    height: 52px;
    padding-bottom: 20px;
    position: relative;
    .btn {
      cursor: pointer;
      width: 60px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      border-radius: 4px;
      position: absolute;
      top: 0;
    }
    .ok {
      background: #1890ff;
      color: #fff;
      right: 20px;
    }
    .cancle {
      border: 1px solid #dddddd;
      color: #454954;
      right: 100px;
    }
  }
}
</style>
