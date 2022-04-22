<template>
  <div class="lgctjc">
    <Left ref="parentAABB"
      :title="title"
      v-bind="$attrs"
      v-on="$listeners"
      @startAnalysis="startAnalysis"
      @drawFeature="drawFeature"
      @uploadData="uploadData"
      @inputGemo="drawFeature"
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
          <!-- <a-form-model-item label="地块名称" prop="XMMC">
            <a-input v-model="form.XMMC" placeholder="请输入地块名称" />
          </a-form-model-item> -->
          <!-- <a-form-model-item label="行政区划" prop="XMXZQDM">
            <a-select v-model="form.XMXZQDM" placeholder="请选择行政区划" @change="handleAreaChange">
              <a-select-option
                v-for="item in XZQH"
                :key="item.code"
                :value="item.code"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item> -->
          <!-- <a-form-model-item label="面积范围" prop="Shape_Area">
            <a-input-number
              v-model="form.number1"
              :min="0"
              :max="10000"
            />
            —
            <a-input-number
              v-model="form.number2"
              :min="0"
              :max="10000"
            />
            KM<sup>2</sup>
          </a-form-model-item> -->
        </a-form-model>
      </template>
    </Left>
    <idle-land-dialog ref="idleDialog"
      @closeDialog="closeDialog"
      @getDetailData="getDetailData"
      v-show="showDialog"
      class="dialog"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    ></idle-land-dialog>
    <detail-dialog
      :showDetail="showDetail"
      :title="detailData['XMMC'] + '详细信息'"
      @closeDetail="showDetail = false"
    >
      <template #content>
        <a-form-model
          layout="horizontal"
          v-bind="formItemLayout"
          class="detail-form"
        >
          <a-form-model-item
            :label="item.title"
            v-for="item in columns"
            :key="item.dataIndex"
          >
            <span>{{ detailData[item.dataIndex] }}</span>
          </a-form-model-item>
        </a-form-model>
      </template>
    </detail-dialog>
  </div>
</template>

<script>
import GeoJSON from "ol/format/GeoJSON";
import Left from "@/components/left/index";
import IdleLandDialog from "./idleLandDialog";
import DetailDialog from "@/components/DetailDialog";
import {
  queryArcGISSpatial,
  queryArcGISProperties
} from "@/mapjs/Query/arcgisQuery.js";
import { createVectorLayer } from "@/mapjs/layer.js";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
import { AnalyIdleLand } from "@/api/statistics";
import {
  getTownVectorLayer,
  setTownLayer,
  removeLayerByAttr
} from "../../js/function";

const featureStyle = new Style({
  fill: new Fill({
    color: "#1890ff"
  }),
  stroke: new Stroke({
    //边界样式
    color: "blue",
    width: 1
  })
});
export default {
  name: "idleLand",
  data() {
    return {
      title: "闲置用地分析",
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
      form: {},
      rules: {},
      layerUrl: "",
      //"http://192.168.250.200/arcgis/rest/services/tf_analyse/tdly/MapServer",
      layerId: "", //"0",
      drawType: "Polygon",
      drawGemo: null,
      features: [],
      showDialog: false,
      columns: [],
      data: [],
      pagination: {
        defaultCurrent: 1,
        size: "small",
        total: 0,
        showTotal: total => `共 ${total} 条数据`,
        hideOnSinglePage: true
      },
      showDetail: false,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      detailData: {},
      where: ""
    };
  },
  props: {
    XZQH: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    XZQH(val) {
      // console.log(val);
      if (val) {
        this.XZQH = val;
      }
    }
  },
  components: {
    Left,
    IdleLandDialog,
    DetailDialog
  },

  created() {},

  computed: {},

  mounted() {
    let idleLand = window.globalUrl.themeApplication.idleLand;
    (this.layerUrl = idleLand.url), (this.layerId = idleLand.id + "");
  },

  methods: {
    // 空间查询
    startAnalysis() {
      this.getAnalysisInfo();
      // this.joinString();
      // let res = null;
      // if (this.drawGemo) {
      //   res = await queryArcGISSpatial({
      //     url: this.layerUrl,
      //     layerId: this.layerId,
      //     geometryType: this.drawType,
      //     geometry: this.drawGemo,
      //     where: this.where,
      //   });
      // } else {
      //   res = await queryArcGISProperties(
      //     this.layerUrl,
      //     this.layerId,
      //     this.where
      //   );
      // }
      // console.log(456, res);
      // if (res.features.length > 0) {
      // res.features.forEach((i) => {
      //   i.setStyle(featureStyle);
      // });
      // this.features = res.features;
      // this.createLayer();
      // this.getTable();
      // } else {
      //   this.$message.info("暂无数据");
      // }
      // this.showDialog = true;
    },
    // 绘制的要素, 输入坐标的要素
    drawFeature(e) {
      this.drawGemo = new GeoJSON().writeGeometry(e.getGeometry());
      // console.log(this.drawGemo)
    },
    async getAnalysisInfo() {
      if (!this.drawGemo) {
        this.$message.warn("请先在地图绘制图形！");
        return;
      }
      let params = {
        // id: this.form.layerId,
        // userId: this.userId,
        geoString: this.drawGemo
      };
      this.$message.info("开始分析，请稍后");
      let res = await AnalyIdleLand(params);
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
    uploadData(value) {
      this.drawGemo = value;
    },
    // 输入坐标的面
    // inputGemo(e) {
    //   this.drawGemo = e.getGeometry();
    // },
    // 创建空的矢量图层
    createLayer() {
      let params = {
        type: 0
      };
      let layer = createVectorLayer(params);
      layer.getSource().addFeatures(this.features);
      layer.set("layerName", "XZYD");
      this.$attrs.map.addLayer(layer);
      let extent = layer.getSource().getExtent();
      // console.log(extent);
      this.$attrs.map.getView().fit(extent);
    },
    // 获取table数据
    async getTable() {
      let params = {
        // xzqbh: this.form.XMXZQDM,
        geoString: this.drawGemo
      };
      let res1 = await AnalyIdleLand(params);
      if (res1.code === 200) {
        this.data = res1.data;
      }
      // if (res.data.fields) {
      //   res.data.fields.forEach((i, j) => {
      //     i.title = i.name;
      //     i.dataIndex = i.alias;
      //     i.type = i.type.toLowerCase();
      //   });
      //   this.columns = res.data.fields;
      // } else {
      //   this.columns = [];
      // }
      // let arr = [];
      // if (res.data.features) {
      //   res.data.features.forEach((i, j) => {
      //     arr[j] = i.attributes;
      //     arr[j].key = i.attributes.OBJECTID;
      //     arr[j].geometry = i.geometry;
      //   });
      //   this.pagination.total = arr.length;
      //   this.data = arr;
      // }
    },
    closeDialog() {
      this.$refs.parentAABB.resetForm()
      this.showDialog = false;
      this.showDetail = false;
      this.$refs.idleDialog.reload();
    },
    // 点击之后的详情展示
    getDetailData(e) {
      this.detailData = e;
      this.showDetail = true;
    },
    // 拼接查询的字段
    joinString() {
      let str = "";
      // console.log(this.form);
      let { XMMC, XMXZQDM, number1, number2 } = this.form;
      // console.log(XMMC, XMXZQDM, number1, number2);
      if (XMMC) {
        str += `XMMC LIKE '%${XMMC}%';`;
      }
      if (XMXZQDM) {
        str += `XMXZQDM = '${XMXZQDM}';`;
      }
      if (number1 && number2) {
        str += `Shape_Area BETWEEN ${number1} AND ${number2};`;
      } else if (!number1 && number2) {
        str += `Shape_Area <= ${number2};`;
      } else if (number1 && !number2) {
        str += `Shape_Area >= ${number1};`;
      } else {
        str += "";
      }
      // let str = `XMMCXMXZQDM = '${XMXZQDM}';SJPFMJ BETWEEN '${number1}' AND '${number2}'`
      // console.log(str);
      this.where = str;
    },
    resetForm() {
      this.form = {};
      this.showDialog = false;
      removeLayerByAttr(this.$attrs.map, "layerName", "setTownLayer");
      removeLayerByAttr(this.$attrs.map, "layerName", "townLayer");
      this.drawGemo = null;
    },
    handleAreaChange(value) {
      let layer = null;
      removeLayerByAttr(this.$attrs.map, "layerName", "setTownLayer");
      removeLayerByAttr(this.$attrs.map, "layerName", "townLayer");
      if (value != "421121") layer = setTownLayer({ code: value });
      else layer = getTownVectorLayer();
      let layerArr = this.$attrs.map.getLayers();
      layerArr.insertAt(1, layer); // 插入到第二个
      this.$attrs.map.getView().fit(window.extent);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../css/dialog.less";
/deep/.map-dialog {
  height: 400px;
  overflow: auto;
  position: absolute;
  left: 24%;
  top: 10% !important;
}
.detail-form {
  /deep/.ant-form-item-control {
    text-align: left;
  }
  /deep/.ant-form-item {
    margin-bottom: 6px !important;
  }
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
