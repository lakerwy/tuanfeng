<!--
 * @Author: 任继民
 * @Date: 2020-11-12 17:19:56
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-12 09:14:43
 * @Description:
-->
<template>
  <div class="explain">
    <div class="title">预警状态判断说明</div>
    <p>一个地区资源环境承载能力预警状态由该地区农业生产承载能力预警状态和城镇建设承载能力预警状态共同确定，当其中一项为超载时，该地区预警状态为超载；当有一个临界超载，则该地区预警状态为不超载。</p>
  </div>
</template>
<script>
  export default {
    data: () => ({
    }),
  }
</script>
<style lang="scss" scoped>
.explain {
  max-width: 400px;
  .title {
    margin: 24px 0 24px 20px;
    color: #454954;
    font-size: 18px;
    font-weight: bold;
  }
  p {
    border-bottom: 1px dotted#e9e9e9;
    background-image: url('../../../assets/imgs/cuoff.png');
    line-height: 42px;
    text-indent: 2em;
    margin: 0 22px;
    height: 224px;
    overflow: hidden;
  }
}
</style>
