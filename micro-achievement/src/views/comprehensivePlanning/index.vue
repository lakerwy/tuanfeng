<template>
  <!-- 成果管理 规划页面 -->
  <div class="planning">
    <div class="p-bottom">
      <div class="plan-tab">
        <el-menu
          :default-active="planType"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="0">总体规划</el-menu-item>
          <el-submenu index="1">
            <template slot="title">详细规划</template>
            <el-menu-item index="3">村庄规划</el-menu-item>
            <el-menu-item index="2">控制性详细规划</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-button class="backBtn" type="primary" @click="showLists">
          <img
            style="margin-right: 5px;"
            src="../../assets/imgs/query-white.png"
            alt=""
          />
          <span>查看成果列表</span>
        </el-button>
      </div>
      <div class="map-container">
        <my-map :id="'earth'" :vector="vector" />
      </div>
    </div>
  </div>
</template>

<script>
import myMap from "../../components/map/index.vue";
import { getTownVectorLayer } from "../../js/map/util";
import { queryArcGISProperties } from "../../js/map/arcgis";
import { getTaskOtherLists, getNodeById } from "../../api/auditTaskOthers.js";

export default {
  data() {
    return {
      query0: {
        pageSize: 10,
        pageIndex: 1,
        taskType: 1,
        isSubmit: 1,
        approveStatus: null, //是否通过0未通过1通过2审核中
        levels: null, //规划层级(2：县级;3：市级)
        region: null, //行政区划代码/编号
        taskName: null //任务名称
      },
      form: {},
      regionOptionsName: [],
      lists: [],
      planTypes: [
        { label: "国土空间总体规划", value: 0 },
        { label: "专项规划", value: 1 },
        { label: "详细规划", value: 2 },
        { label: "村庄规划", value: 3 }
      ],
      levelOptions: [
        { name: "县级", value: 0 },
        { name: "市级", value: 1 }
      ],
      planOptions: [
        { name: "县级", value: 0 },
        { name: "乡镇", value: 1 }
      ],
      checkOptions: [
        { name: "通过", value: 1 },
        { name: "不通过", value: 0 },
        { name: "审查中", value: 2 }
      ],
      planType: "",
      vector: null,
      geoJson: null,
      regionOptions: [],
      levelOption: [
        { name: "县级", value: 2 },
        { name: "市级", value: 3 }
      ]
    };
  },
  components: {
    myMap
  },
  created() {},
  mounted() {
    if (sessionStorage.getItem("planType")) {
      this.planType = JSON.parse(sessionStorage.getItem("planType"));
    } else {
      this.planType = "0";
    }
    this.handleSelect(this.planType);
    // this.changePlanType(this.planType);
    this.getOthersList();
  },
  methods: {
    // 获取数据
    async getOthersList() {
      this.query0.region = this.form.regions;
      this.query0.taskName = this.form.keyword;
      this.query0.approveStatus = this.form.approveStatus;
      let params = this.query0;
      let res = await getTaskOtherLists(params);
      let { records } = res.data.data;
      if (res.data.code === 0) {
        if (records.length > 0) {
          records.map(item => {
            this.lists.push({
              code: item.region,
              type: item.approveStatus
            });
          });
          var result = [];
          var obj = {};
          for (var i = 0; i < this.lists.length; i++) {
            if (!obj[this.lists[i].code]) {
              result.push(this.lists[i]);
              obj[this.lists[i].code] = true;
            }
          }
          this.lists = result;
          // console.log(this.lists, "lists");
        } else {
          this.$message.info("暂无数据！");
        }
        this.initXiangGeoJson();
      }
    },
    // 主页面-选择行政区层级
    changeRegions(val) {
      // if (val === 2) {
      //   this.query0.levels = 3;
      //   this.pId = "15_0";
      // } else {
      //   this.query0.levels = 2;
      //   this.pId = "0_15";
      // }
      // this.getRegionData();
      if (val === 2) {
        this.queryOthers.levels = 3;
        this.pId = "15_0";
        this.getRegionData();
      } else if (val === 3) {
        this.queryOthers.levels = 2;
        this.pId = "0_15";
        this.getRegionData();
      } else {
        this.form.regions = "";
        this.regionOptionsName = [];
      }
    },
    // 行政区名称下拉列表
    async getRegionData() {
      let res = await getNodeById(this.pId);
      this.regionOptionsName = res.data.data;
    },
    query() {
      // 查询
      this.lists = [];
      this.getOthersList();
    },
    handleResets() {
      this.form = {};
      this.lists = [];
      this.query0.levels = null;
      this.getOthersList();
    },
    showLists() {
      // 查看成果列表
      this.$router.push({ name: "manage" });
    },
    async initXiangGeoJson() {
      // 加载乡镇GeoJSON数据
      let res = await queryArcGISProperties(
        window.globalUrl.districts.town.url,
        window.globalUrl.districts.town.id,
        { format: "geojson" }
      );
      this.geoJson = res;
      if (res) {
        this.handleGeoJsonData(this.lists);
      }
    },
    async handleGeoJsonData(data) {
      // 处理数据 将图层数据与GeoJSON数据匹配
      this.geoJson.features.forEach(item => {
        item.properties.type = 0;
      });
      this.geoJson.features.forEach(feature => {
        data.forEach(item => {
          if (feature.properties.ad_code === item.code) {
            feature.properties.type = item.type ? item.type : 0;
          } else {
            // feature.properties.type = 0;
          }
        });
      });
      // console.log(this.geoJson, 'geojson')
      this.vector = await getTownVectorLayer(this.geoJson);
    },
    handleSelect(val) {
      sessionStorage.setItem("planType", JSON.stringify(val));
      this.planType = val;
      this.lists = [];
      this.query0.taskType = this.planType;
      this.getOthersList();
    },
    changePlanType(val) {
      sessionStorage.setItem("planType", JSON.stringify(val));
      this.planType = val;
      this.lists = [];
      this.query0.taskType = this.planType;
      this.getOthersList();
    }
  }
};
</script>

<style lang="less" scoped>
.planning {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    .query {
      .el-button {
        width: 90px;
        border-radius: 0;
      }
    }
  }
  .p-bottom {
    padding: 0;
    background: #f5f5f5;
    .plan-tab {
      // background: #ffffff;
      // padding: 0 20px;
      // height: 49px;
      // line-height: 49px;
      position: relative;
      .backBtn {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 127px;
        height: 36px;
        padding: 0px;
        // margin-top: 6px;
      }
    }
    .map-container {
      background: #ffffff;
      margin-top: 16px;
      padding: 20px 20px 0 20px;
      height: 100%;
      // height: calc(100% - 65px);
      position: relative;
    }
  }
}
</style>
