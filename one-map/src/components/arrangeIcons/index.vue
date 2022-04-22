<!--  -->
<template>
  <div class="wrapper">
    <div class="box" v-for="(item, index) in items" :key="index">
      <a-tooltip
        class="item"
        effect="dark"
        :title="item.desc"
        placement="top"
      >
        <div
          :class="item.active ? item.activeClass : item.url"
          @click="iconEvents(item)"
        ></div>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },

  props: ["items",],

  components: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    iconEvents(e) {
      e.active = !e.active;
      this.$emit("iconEvents", e);
    },
  },
};
</script>
<style lang='less' scoped>
.wrapper {
  height: 32px;
  padding: 0 5px;
  display: flex;
  justify-content: flex-start;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  .box {
    height: 32px;
    width: 32px;
    // margin-top: 6px;
    // border-right: 1px solid #eee;
    cursor: pointer;
    div {
      width: 32px;
      height: 32px;
      outline: none;
    }
    .icon-xz {
      background: url("../../assets/imgs/icon-xz.png") no-repeat center;
    }
    .icon-zq {
      background: url("../../assets/imgs/icon-zq.png") no-repeat center;
    }
    .icon-cj {
      background: url("../../assets/imgs/icon-cj.png") no-repeat center;
    }
    .icon-cm {
      background: url("../../assets/imgs/icon-cm.png") no-repeat center;
    }
    .icon-qp {
      background: url("../../assets/imgs/icon-qp.png") no-repeat center;
    }
    .icon-qc {
      background: url("../../assets/imgs/icon-qc.png") no-repeat center;
    }
    .icon-dx {
      background: url("../../assets/imgs/icon-dx.png") no-repeat center;
    }
    .icon-kx {
      background: url("../../assets/imgs/icon-kx.png") no-repeat center;
    }
    .icon-zh {
      background: url("../../assets/imgs/icon-zh.png") no-repeat center;
    }
    .icon-tgcg {
      background: url("../../assets/imgs/icon-tgcg.png") no-repeat center;
    }
    .icon-stbh {
      background: url("../../assets/imgs/icon-stbh.png") no-repeat center;
    }
    .icon-yjnt {
      background: url("../../assets/imgs/icon-yjnt.png") no-repeat center;
    }
    .icon-smzq {
      background: url("../../assets/imgs/icon-smzq.png") no-repeat center;
    }
    .icon-dckdb {
      background: url("../../assets/imgs/icon-dckdb.png") no-repeat center;
    }
    .icon-jldb {
      background: url("../../assets/imgs/icon-jldb.png") no-repeat center;
    }
    .icon-kgxg {
      background: url("../../assets/imgs/icon-kgxg.png") no-repeat center;
    }
    .icon-dj {
      background: url("../../assets/imgs/icon-dj.png") no-repeat center;
    }
    .icon-hcq {
      background: url("../../assets/imgs/icon-hcq.png") no-repeat center;
    }
    .icon-hgx {
      background: url("../../assets/imgs/icon-hgx.png") no-repeat center;
    }
    .icon-lstb {
      background: url("../../assets/imgs/icon-lstb.png") no-repeat center;
    }
    .icon-xz:hover {
      background: url("../../assets/imgs/icon-xz-hover.png") no-repeat center;
    }
    .icon-zq:hover {
      background: url("../../assets/imgs/icon-zq-hover.png") no-repeat center;
    }
    .icon-cj:hover {
      background: url("../../assets/imgs/icon-cj-hover.png") no-repeat center;
    }
    .icon-cm:hover {
      background: url("../../assets/imgs/icon-cm-hover.png") no-repeat center;
    }
    .icon-qp:hover {
      background: url("../../assets/imgs/icon-qp-hover.png") no-repeat center;
    }
    .icon-qc:hover {
      background: url("../../assets/imgs/icon-qc-hover.png") no-repeat center;
    }
    .icon-dx:hover {
      background: url("../../assets/imgs/icon-dx-hover.png") no-repeat center;
    }
    .icon-kx:hover {
      background: url("../../assets/imgs/icon-kx-hover.png") no-repeat center;
    }
    .icon-zh:hover {
      background: url("../../assets/imgs/icon-zh-hover.png") no-repeat center;
    }
    .icon-tgcg:hover {
      background: url("../../assets/imgs/icon-tgcg-hover.png") no-repeat center;
    }
    .icon-stbh:hover {
      background: url("../../assets/imgs/icon-stbh-hover.png") no-repeat center;
    }
    .icon-yjnt:hover {
      background: url("../../assets/imgs/icon-yjnt-hover.png") no-repeat center;
    }
    .icon-smzq:hover {
      background: url("../../assets/imgs/icon-smzq-hover.png") no-repeat center;
    }
    .icon-dckdb:hover {
      background: url("../../assets/imgs/icon-dckdb-hover.png") no-repeat center;
    }
    .icon-jldb:hover {
      background: url("../../assets/imgs/icon-jldb-hover.png") no-repeat center;
    }
    .icon-kgxg:hover {
      background: url("../../assets/imgs/icon-kgxg-hover.png") no-repeat center;
    }
    .icon-dj:hover {
      background: url("../../assets/imgs/icon-dj-hover.png") no-repeat center;
    }
    .icon-hcq:hover {
      background: url("../../assets/imgs/icon-hcq-hover.png") no-repeat center;
    }
    .icon-hgx:hover {
      background: url("../../assets/imgs/icon-hgx-hover.png") no-repeat center;
    }
    .icon-lstb:hover {
      background: url("../../assets/imgs/icon-lstb-hover.png") no-repeat center;
    }
    .icon-xz-hover {
      background: url("../../assets/imgs/icon-xz-hover.png") no-repeat center;
    }
    .icon-zq-hover {
      background: url("../../assets/imgs/icon-zq-hover.png") no-repeat center;
    }
    .icon-cj-hover {
      background: url("../../assets/imgs/icon-cj-hover.png") no-repeat center;
    }
    .icon-cm-hover {
      background: url("../../assets/imgs/icon-cm-hover.png") no-repeat center;
    }
    .icon-qp-hover {
      background: url("../../assets/imgs/icon-qp-hover.png") no-repeat center;
    }
    .icon-qc-hover {
      background: url("../../assets/imgs/icon-qc-hover.png") no-repeat center;
    }
    .icon-dx-hover {
      background: url("../../assets/imgs/icon-dx-hover.png") no-repeat center;
    }
    .icon-kx-hover {
      background: url("../../assets/imgs/icon-kx-hover.png") no-repeat center;
    }
    .icon-zh-hover {
      background: url("../../assets/imgs/icon-zh-hover.png") no-repeat center;
    }
    .icon-tgcg-hover {
      background: url("../../assets/imgs/icon-tgcg-hover.png") no-repeat center;
    }
    .icon-stbh-hover {
      background: url("../../assets/imgs/icon-stbh-hover.png") no-repeat center;
    }
    .icon-yjnt-hover {
      background: url("../../assets/imgs/icon-yjnt-hover.png") no-repeat center;
    }
    .icon-smzq-hover {
      background: url("../../assets/imgs/icon-smzq-hover.png") no-repeat center;
    }
    .icon-dckdb-hover {
      background: url("../../assets/imgs/icon-dckdb-hover.png") no-repeat center;
    }
    .icon-jldb-hover {
      background: url("../../assets/imgs/icon-jldb-hover.png") no-repeat center;
    }
    .icon-kgxg-hover {
      background: url("../../assets/imgs/icon-kgxg-hover.png") no-repeat center;
    }
    .icon-dj-hover {
      background: url("../../assets/imgs/icon-dj-hover.png") no-repeat center;
    }
    .icon-hcq-hover {
      background: url("../../assets/imgs/icon-hcq-hover.png") no-repeat center;
    }
    .icon-hgx-hover {
      background: url("../../assets/imgs/icon-hgx-hover.png") no-repeat center;
    }
    .icon-lstb-hover {
      background: url("../../assets/imgs/icon-lstb-hover.png") no-repeat center;
    }
  }
}
</style>
