<!--  -->
<template>
  <div class="hgxjc">
    <Left
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
          <a-form-model-item label="选择项目" ref="projLand" prop="projLand">
            <a-select v-model="form.projLand" placeholder="请选择项目用地">
              <a-select-option
                v-for="(i, index) in landType"
                :key="index"
                :value="i.value"
                >{{ i.label }}</a-select-option
              >
              <a-icon type="caret-down" slot="suffixIcon" />
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="缓冲距离" ref="distance" prop="distance">
            <a-input
              v-model="form.distance"
              placeholder="请输入缓冲距离"
            >
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
          <a-form-model-item
            label="用地性质"
            ref="landNature"
            prop="landNature"
          >
            <a-select v-model="form.landNature" placeholder="请选择用地性质">
              <a-select-option
                v-for="(i, index) in landType"
                :key="index"
                :value="i.value"
                >{{ i.label }}</a-select-option
              >
              <a-icon type="caret-down" slot="suffixIcon" />
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            ref="programme"
            label="规划图层"
            prop="programme"
            class="programme"
          >
            <a-checkbox-group v-model="form.programme">
              <a-checkbox
                v-for="item in checkboxs"
                :key="item.value"
                :value="item.value"
                name="type"
              >
                {{ item.label }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <!-- <a-form-model-item label="控制线图层" prop="control">
            <a-checkbox-group v-model="form.control">
              <a-checkbox value="1" name="type"> 主体功能区规划 </a-checkbox>
            </a-checkbox-group>
          </a-form-model-item> -->
        </a-form-model>
      </template>
    </Left>
    <conformity-dialog
      v-if="showDialog"
      :checkArea="checkArea"
      :showBtns="showBtns"
      :tableData="tableData"
      @closeDialog="closeDialog"
    ></conformity-dialog>
  </div>
</template>

<script>
import Left from "@/components/left/index";
import { HGAnalysisInfo } from "@/api/statistics";
import GeoJSON from "ol/format/GeoJSON";
import ConformityDialog from "./conformityDialog.vue";
import { getArea, getLength } from "ol/sphere.js";
export default {
  name: "conformity",
  data() {
    return {
      title: "合规性检查",
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
      form: {
        projLand: "",
        distance: "",
        unit: "kilometer",
        landNature: "",
        programme: [],
        control: []
      },
      rules: {
        projLand: [
          { required: true, message: "选择项目用地", trigger: "change" }
        ],
        landNature: [
          { required: true, message: "选择用地性质", trigger: "change" }
        ],
        distance: [
          { required: true, message: "输入缓冲距离", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
        ],
        programme: [
          {
            type: "array",
            required: true,
            message: "选择规划图层",
            trigger: "change"
          }
        ]
      },
      units: [
        {
          label: "米",
          value: "meter"
        },
        {
          label: "千米",
          value: "kilometer"
        },
        {
          label: "度",
          value: "degree"
        }
      ], //单位
      landType: [
        // 用地性质
        {
          label: "建设用地",
          value: "buildLand"
        },
        {
          label: "非建设用地",
          value: "noBuildLand"
        }
      ],
      checkboxs: [
        {
          label: "土地用途区",
          value: "TDYTQ"
        },
        {
          label: "土地规划地类",
          value: "TDGHDL"
        },
        {
          label: "建设用地管制区",
          value: "JSYDGZQ"
        },
        {
          label: "基本农田保护区",
          value: "JBNTBHQ"
        }
      ],
      othercheckboxs: [
        {
          label: "林地",
          value: "LD"
        },
        {
          label: "疏林地",
          value: "SLD"
        },
        {
          label: "灌木林地",
          value: "GMLD"
        },
        {
          label: "未成林地",
          value: "WCLD"
        },
        {
          label: "苗圃地",
          value: "MPD"
        },
        {
          label: "无立木林地",
          value: "WLMLD"
        },
        {
          label: "宜林地",
          value: "YLD"
        },
        {
          label: "林业辅助生产用地",
          value: "LYFZSCYD"
        }
      ],
      showDialog: false,
      geojson: "", // 绘制范围geojson
      checkArea: 0, // 检测的面积
      showBtns: [], // 需展示的按钮
      tableData: []
    };
  },

  props: {},

  components: {
    Left,
    ConformityDialog
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {
    // 开始分析
    startAnalysis() {
        this.$refs.form.validate(valid => {
        if (valid) {
          this.getAnalysisInfo();
          // alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    // 选择单位
    changeUnit(e) {
      this.form.unit = e;
      // console.log(this.$store);
      this.$store.commit("fullScreenToTrue");
      // console.log(this.$store.state.fullScreen);
    },
    // 重置表单
    resetForm() {
      this.geojson = null;
      this.showDialog=false
      this.$refs.form.resetFields();
    },
    // 绘制得到的范围
    drawFeature(e) {
      let data = new GeoJSON().writeGeometry(e.getGeometry());
      console.log(data);
      this.geojson = data;
      // 获取绘制的面的面积
      let proj = this.$attrs.map
        .getView()
        .getProjection()
        .getCode();
      let area = getArea(e.getGeometry(), {
        projection: proj
      });
      // console.log(area);
      this.checkArea = area;
    },
    uploadData(value) {
      this.geojson = value;
    },
    // 获取分析信息
    async getAnalysisInfo() {
      if (!this.geojson) {
        this.$message.warn("请绘制范围！");
        return;
      }
      this.$message.info("任务开始，请稍等！");
      let params = {
        // hglayerID: this.form.programme,
        buffer: this.form.distance,
        unit: this.form.unit,
        ydlx: this.form.landNature,
        geoJson: this.geojson
      };
      let promiseArr = [];
      this.form.programme.forEach(async i => {
        params.hglayer = i;
        let res = HGAnalysisInfo(params);
        promiseArr.push(res);
      });
      let that = this;
      Promise.all(promiseArr).then(
        values => {
          // console.log(values);
          that.tableData = values;
          that.showBtns = that.form.programme;
          // console.log(that.tableData);
          that.showDialog = true;
        },
        reason => {
          that.tableData = [];
        }
      );
    },
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../css/dialog.less";
.hgxjc {
  width: 100%;
}
/deep/.ant-checkbox-group {
  width: 100%;
  text-align: left;
}
/deep/.ant-checkbox-wrapper {
  display: block;
  margin-left: 30px;
  margin-bottom: 6px;
}
/deep/.ant-form-item {
  height: 34px;
  margin-bottom: 26px;
}
/deep/.ant-form-item-label > label {
  color: #6f7583;
}
/deep/.programme {
  height: 83px;
  margin-bottom: 0;
  .ant-form-item-label {
    height: 20px;
    line-height: 20px;
  }
}
/deep/.anticon-caret-down {
  font-size: 16px;
  color: #cccccc;
  margin-top: -2px;
}
</style>
