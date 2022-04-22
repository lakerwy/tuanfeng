<!--  -->
<template>
  <div class="set-new-map">
    <div class="header">
      <div class="back">
        <a-breadcrumb>
          <a-breadcrumb-item @click.native="backOne">
            <span>一张图</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item @click.native="backTwo">
            <span>专题制图</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item href="">
            <span>查看地图模板</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="content">
      <div class="map-wrapper">
        <map-template :layer="layer" ref="mapTep"></map-template>
        <!-- <div class="map-content">
          <div id="map2"></div>
          <div class="btns">
            <a-button type="primary">打印</a-button>
            <a-button type="primary">输出</a-button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import MapTemplate from "@/components/mapTemplate";
import { createImageLayer } from "@/mapjs/layer.js";
export default {
  name: "",
  data() {
    return {
      layer: null,
    };
  },
  watch: {
    // current(val) {
    //   if (val == 2) {
    //     this.loadMap();
    //   }
    // },
  },
  props: {},

  components: { MapTemplate },

  created() {},

  computed: {},

  mounted() {
    this.getLayer();
    this.givForm1Val()
  },

  methods: {
    backOne() {
      this.$router.push("/oneMap");
    },
    backTwo() {
      this.$router.push("/oneMap/themeMapping");
    },
    // 通过url获取地图服务
    async getLayer() {
      let params = {
        url: this.$route.query.url,
        id: "*",
        type: "ArcGISServer",
      };
      let layer = await createImageLayer(params);
      // console.log(layer);
      if (layer) {
        this.layer = layer;
      }
    },
    // 给属性面板复制
    givForm1Val() {
      this.$refs.mapTep.form1 = this.$route.query;
    },
  },
};
</script>
<style lang='less' scoped>
.set-new-map {
  width: 100%;
  height: calc(100vh - 88px);
  padding: 6px 20px 0 20px;
  .header {
    height: 30px;
    // background: #eee;
    .back {
      text-align: left;
      cursor: pointer;
      margin-left: 30px;
      /deep/.ant-breadcrumb-link:hover {
        color: #1890ff;
      }
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 80px);
    .map-wrapper {
      height: 100%;
      /deep/.map-content {
        height: 100%;
        padding-top: 10px;
        text-align: left;
        margin: 0 auto;
        position: relative;
      }
      /deep/#map2 {
        width: 100%;
        height: 100%;
        background: #eee;
      }
      /deep/.btns {
        position: absolute;
        top: 50px;
        right: 50px;
        .ant-btn:first-child {
          margin-right: 20px;
        }
      }
    }
    .bottom-btn {
      //height: 40px;
      .ant-btn {
        margin-top: 10px;
      }
      .ant-btn:first-child {
        margin-right: 20px;
      }
    }
  }
}
.pagination {
  margin-top: 20px;
  margin-right: 100px;
  text-align: right;
}
</style>
