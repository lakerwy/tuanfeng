<template>
  <div class="lgctjc">
    <Left ref="parentAABB"
      :title="title"
      v-bind="$attrs"
      v-on="$listeners"
      @drawFeature="drawFeature"
      @inputGemo="drawFeature"
      @startAnalysis="startAnalysis"
      @resetForm="resetForm"
    >
      <template v-slot:formContent>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <!-- <a-form-model-item ref="name" label="缓冲距离" prop="name">
            <a-input v-model="form.name" style="display: inline-block">
              <a-select
                slot="addonAfter"
                default-value=".com"
                style="width: 80px"
              >
                <a-select-option value=".com"> 米 </a-select-option>
                <a-select-option value=".jp"> 千米 </a-select-option>
                <a-select-option value=".cn"> 度 </a-select-option>
              </a-select>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="城规图层" prop="region">
            <a-select v-model="form.region" placeholder="请选择用地性质">
              <a-select-option value="shanghai"> Zone one </a-select-option>
              <a-select-option value="beijing"> Zone two </a-select-option>
            </a-select>
          </a-form-model-item> -->
          <!-- <a-form-model-item label="土地图层" prop="layerId">
            <a-select v-model="form.layerId" placeholder="请选择用地性质">
              <a-select-option value="1"> 图层1 </a-select-option>
              <a-select-option value="2"> 图层2 </a-select-option>
            </a-select>
          </a-form-model-item> -->
        </a-form-model>
      </template>
    </Left>
    <!-- <tdlyfx-chart :chartOptions="chartOptions"></tdlyfx-chart> -->
    <idle-land-dialog
      @closeDialog="closeDialog"
      v-show="showDialog"
      class="dialog"
      :data="data"
      :type="type"
      :pagination="pagination"
    ></idle-land-dialog>
  </div>
</template>

<script>
import GeoJSON from "ol/format/GeoJSON";
import Left from "@/components/left/index";
import TdlyfxChart from "@/components/charts/TdlyfxChart";
import { queryArcGISSpatial, test } from "@/mapjs/Query/arcgisQuery.js";
import { TDLYAnalysisInfo } from "@/api/statistics";
import actions from "@/shared/actions";
import IdleLandDialog from "./idleLandDialog";
import DetailDialog from "@/components/DetailDialog";
import {removeLayerByAttr} from "../../js/function"
export default {
  name: "landUse",
  data() {
    return {
      title: "土地利用现状分析服务",
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
      form: {},
      rules: {},
      data: [],
      pagination: {
        size: "small",
        total: 0,
        showTotal: (total) => `共 ${total} 条数据`,
        hideOnSinglePage: true,
      },
      userId: "111", // 当前用户id
      chartOptions: {},
      geeoJson: null,
      showDialog: false,
      type:1
    };
  },

  props: {},

  components: {
    Left,
    TdlyfxChart,
    IdleLandDialog,
    DetailDialog,
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {
    // 开始分析
    startAnalysis() {
      this.getAnalysisInfo();
      // this.showDialog = true;
    },
    // 获取当前用户信息
    async getUser() {
      let token = "";
      actions.onGlobalStateChange((state) => {
        const { accessToken } = state;
        //// console.log('123456789',accessToken)
        token = accessToken;
        // 未登录 - 返回主页
      }, true);
      let params = {
        code: "devOps",
        token,
      };
      let res = await getUserInfo(params);
      // console.log(555, res);
      if (res.success) {
        this.userId = res.data.userid;
      } else {
        this.userId = "111";
      }
    },
    // 绘制得到的范围
    drawFeature(e) {
      let data = new GeoJSON().writeGeometry(e.getGeometry());
      this.geeoJson = data;
      // // console.log(data);
      // this.geojson = data;
      // // 获取绘制的面的面积
      // let proj = this.$attrs.map.getView().getProjection().getCode();
      // let area = getArea(e.getGeometry(), {
      //   projection: proj,
      // });
      // // console.log(area);
      // this.checkArea = area
      // let value = 0;
      // let unit = "";
      // if (area > 10000) {
      //   value = Math.round((area / 1000000) * 100) / 100;
      //   unit = "k㎡";
      // } else {
      //   value = Math.round(area * 100) / 100;
      //   unit = "㎡";
      // }
      // // console.log(value, unit)
    },
    // 获取土地利用分析数据
    async getAnalysisInfo() {
      if (!this.geeoJson)  {
        this.$message.warn('请先在地图绘制图形！')
        return;
      }
      let params = {
        // id: this.form.layerId,
        // userId: this.userId,
        geoString: this.geeoJson
      };
      this.$message.info('开始分析，请稍后')
      let res = await TDLYAnalysisInfo(params);
      // console.log(res);
      if (res.code === 200) {
        this.data = res.data;
        this.showDialog = true;
        // let data = this.dealData(res.data);
        // this.chartOptions = {
        //   data
        // }
      }
    },
    // 处理得到的土地利用数据
    dealData(data) {
      let dataCopy = JSON.parse(JSON.stringify(data)) // 不改变原数组
      let arr = []; // 存储行政区划
      let arr1 = []; // 存储赋值的数组
      // 筛选需要的对象，并赋key
      dataCopy.forEach((i) => {
        if (!arr.includes(i["行政区名称"])) {
          arr.push(i["行政区名称"]);
        }
        if (i["国土用途规划分类名称"] === "草地") {
          i.cdType = i["国土用途规划分类名称"];
          i.cdCode = i["国土用途规划分类代码"];
          i.cdArea = i["面积"];
          arr1.push(i);
        } else if (i["国土用途规划分类名称"] === "公共管理与公共服务设施用地") {
          i.ggType = i["国土用途规划分类名称"];
          i.ggCode = i["国土用途规划分类代码"];
          i.ggArea = i["面积"];
          arr1.push(i);
        } else if (i["国土用途规划分类名称"] === "林地") {
          i.ldType = i["国土用途规划分类名称"];
          i.ldCode = i["国土用途规划分类代码"];
          i.ldArea = i["面积"];
          arr1.push(i);
        }
        i.region = i["行政区名称"];
        i.regionCode = i["行政区代码"];
        delete i["行政区名称"];
        delete i["行政区代码"];
        delete i["国土用途规划分类名称"];
        delete i["国土用途规划分类代码"];
        delete i["面积"];
      });
      // // console.log(arr1, arr); //
      // arr1.forEach()
      let arr2 = []; // 存储每个镇的数据
      // 外面循环一圈，里面全部循环完
      arr.forEach((i) => {
        let o = {};
        arr1.forEach((e) => {
          if (i == e.region) {
            o = {...o,...e};
          }
        });
        arr2.push(o)
      });
      // // console.log(arr2);
      return arr2;
    },
    closeDialog() {
      this.$refs.parentAABB.resetForm()
      this.showDialog = false;
    },
    resetForm() {
      this.geeoJson = null;
      this.data = [];
      this.showDialog = false;
    }
  },
};
</script>
<style lang='less' scoped>
@import "../../css/dialog.less";
/deep/.map-dialog {
  height: 400px;
  overflow: auto;
  position: absolute;
  left: 24%;
  top: 10% !important;
}
.lgctjc {
  width: 100%;
}
/deep/.ant-checkbox-group {
  width: 100%;
  text-align: left;
}
/deep/.ant-checkbox-wrapper {
  display: block;
  margin-left: 8px;
}
/deep/.ant-form-item {
  height: 34px;
  margin-bottom: 26px;
}
</style>
