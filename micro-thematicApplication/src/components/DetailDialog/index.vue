<!--  -->
<template>
<div class="detail-dialog" v-if="showDetail">
    <div class="detail-header">
      <div class="detail-title">{{title}}</div>
      <div class="detail-close" @click="closeDetail"></div>
    </div>
    <div class="detail-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
name: '' ,
data () {
    return {
    }
},

props: {
    showDetail: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    }
},

components: {},

created () {},

computed: {},

mounted (){},

methods: {
    closeDetail() {
        this.$emit("closeDetail")
    }
}
}

</script>
<style lang='less' scoped>
.detail-dialog {
    width: 700px;
    height: 350px;
    background: #fff;
    border-radius: 12px;
    padding: 0 20px;
    position: absolute;
    left: 24%;
    top: 56%;
    z-index: 99;

    /deep/.detail-header {
        height: 54px;
        border-bottom: 1px solid #eee;
        margin-bottom: 14px;
        text-align: left;

        .detail-title {
            font-size: 16px;
            color: #454954;
            line-height: 54px;
        }

        .detail-close {
            cursor: pointer;
            background: url("../../assets/imgs/icon-close.png") no-repeat center;
            height: 24px;
            width: 24px;
            position: absolute;
            right: 20px;
            top: 16px;
        }
    }
    .detail-content {
        width: 100%;
        height: 280px;
        overflow: auto;
    }
}
</style>
