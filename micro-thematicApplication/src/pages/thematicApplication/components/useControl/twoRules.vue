<template>
  <div class="lgctjc">
    <Left
      ref="left"
      :title="title"
      v-bind="$attrs"
      v-on="$listeners"
      @resetForm="resetForm"
      @drawFeature="drawFeature"
      @inputGemo="drawFeature"
      @uploadData="uploadData"
      @startAnalysis="startAnalysis"
    >
      <template v-slot:formContent>
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="缓冲距离" ref="distance" prop="distance">
            <a-input v-model="form.distance" placeholder="请输入缓冲距离">
              <a-select
                slot="addonAfter"
                :value="form.unit"
                @change="changeUnit"
                style="width: 80px"
              >
                <a-select-option
                  v-for="(i, index) in units"
                  :key="index"
                  :value="i.value"
                  >{{ i.label }}</a-select-option
                >
                <a-icon type="caret-down" slot="suffixIcon" />
              </a-select>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="城规图层" ref="cityLayer" prop="cityLayer">
            <a-select v-model="form.cityLayer" placeholder="请选择城规图层">
              <a-select-option
                v-for="(i, index) in landType"
                :key="index"
                :value="i.value"
                >{{ i.label }}</a-select-option
              >
              <a-icon type="caret-down" slot="suffixIcon" />
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="土规图层" ref="landLayer" prop="landLayer">
            <a-select v-model="form.landLayer" placeholder="请选择土规图层">
              <a-select-option
                v-for="(i, index) in landType"
                :key="index"
                :value="i.value"
                >{{ i.label }}</a-select-option
              >
              <a-icon type="caret-down" slot="suffixIcon" />
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </template>
    </Left>
    <two-rules-dialog
      v-show="showDialog"
      :dialogData="dialogData"
      :checkArea="checkArea"
      @closeDialog="closeDialog"
    ></two-rules-dialog>
  </div>
</template>

<script>
import Left from "@/components/left/index";
import { TGCGCheckInfo } from "@/api/statistics";
import GeoJSON from "ol/format/GeoJSON";
import TwoRulesDialog from "./twoRulesDialog.vue";
import { getArea, getLength } from "ol/sphere.js";
import { getBufferFeature } from "@/mapjs/tool/buffer.js";
export default {
  name: "twoRules",
  data() {
    return {
      title: "两规冲突检测",
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
      form: {
        distance: undefined,
        unit: "km",
        cityLayer: undefined,
        landLayer: undefined,
      },
      rules: {
         distance: [
          { required: true, message: "输入缓冲距离", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
        ],
                cityLayer: [
          { required: true, message: "城规图层", trigger: "change" }
        ],
        landLayer: [
          { required: true, message: "土规图层", trigger: "change" }
        ],
      },

      units: [
        {
          label: "米",
          value: "m",
        },
        {
          label: "千米",
          value: "km",
        },
      ], //单位
      landType: [
        // 用地性质
        {
          label: "建设用地",
          value: "1",
        },
        {
          label: "非建设用地",
          value: "11",
        },
      ],
      activeBtn3: false,
      geojson: "", // 绘制范围geojson
      showDialog: false,
      dialogData: null, // 需要展示的数据
      checkArea: 0, // 绘制的面积
      drawFe: null, // 绘制得到的要素
      drawLayer: null, // 绘制得到的面
    };
  },

  props: {},

  components: {
    Left,
    TwoRulesDialog,
  },
  watch: {
    activeBtn3: {
      handler: function (val) {
        // console.log(val);
      },
      // 深度观察监听
      deep: true,
      // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  created() {},

  computed: {},

  mounted() {
    this.activeBtn3 = this.$refs.left.activeBtn3;
  },

  methods: {
    // 开始分析
    startAnalysis() {
              this.$refs.form.validate(valid => {
        if (valid) {
           // 将缓冲区加载出来
      this.$message.info('任务开始，请稍等！')
      if (this.drawFe) {
        const unitEnum = {
          m: "miles",
          km: "kilometers",
          degrees: "degrees",
        };
        let res = getBufferFeature(
          this.drawFe,
          this.form.distance,
          unitEnum[this.form.unit]
        );
        this.drawLayer.getSource().addFeature(res);
      }
      this.getCheckInfo();
      this.showDialog = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
     
    },
    // 选择单位
    changeUnit(e) {
      this.form.unit = e;
    },
    // 重置表单
    resetForm() {
      this.drawFe = null;
      this.showDialog = false;
      this.$refs.form.resetFields();
    },
    // 绘制得到的要素和图层
    drawFeature(e, layer) {
      this.drawFe = e;
      this.drawLayer = layer;
      let data = new GeoJSON().writeGeometry(e.getGeometry());
      // console.log(data);
      this.geojson = data;
      // 获取绘制的面的面积
      let proj = this.$attrs.map.getView().getProjection().getCode();
      let area = getArea(e.getGeometry(), {
        projection: proj,
      });
      // console.log(area);
      this.checkArea = area;
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
    uploadData(value) {
      this.geojson = value;
    },
    // 获取检测信息
    async getCheckInfo() {
      let params = {
        layerTGID: this.form.landLayer,
        layerCGID: this.form.cityLayer,
        buffer: this.form.distance,
        unit: this.form.unit,
        geoJson: this.geojson,
      };
      let res = await TGCGCheckInfo(params);
      // console.log(res);
      if (res.code == 200) {
        this.dialogData = res.data;
      }
    },
    // 关闭弹框
    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
<style lang='less' scoped>
@import "../../css/dialog.less";
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
/deep/.ant-form-item-label > label {
  color: #6f7583;
}
/deep/.anticon-caret-down {
  font-size: 16px;
  color: #cccccc;
  margin-top: -2px;
}
</style>
