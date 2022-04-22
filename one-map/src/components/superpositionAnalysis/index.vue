<!--  -->
<template>
  <div class="djfx" v-show="showDjfx">
    <Dialog title="叠加分析" @handleOk="handleOk" @handleCancel="handleCancel">
      <template v-slot:content>
        <a-form-model
          ref="dynamicValidateForm"
          :model="dynamicValidateForm"
          v-bind="formItemLayoutWithOutLabel"
          labelAlign="left"
          style="margin-bottom: 30px"
        >
          <a-form-model-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :key="domain.key"
            v-bind="index === 0 ? formItemLayout : {}"
            :label="domain.label"
            :prop="'domains.' + index + '.value'"
            :rules="{
              required: true,
              message: '图层不能为空',
              trigger: 'blur',
            }"
          >
            <a-select
              show-search
              placeholder="请选择图层"
              option-filter-prop="children"
              v-model="domain.value"
              @change="change"
              ><a-select-option
                v-for="item in options"
                :key="item.resourceid"
                :value="item.resourceid"
              >
                {{ item.title }}
              </a-select-option>
            </a-select>
            <a-icon
              v-if="index != 0 && index != 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              style="position: absolute; top: -2px; right: -30px"
              @click="removeDomain(domain)"
            />
          </a-form-model-item>
          <!-- <a-form-model-item v-bind="formItemLayoutWithOutLabel" v-show="dynamicValidateForm.domains.length < 4">
            <a-button type="dashed" style="width: 70%" @click="addDomain">
              <a-icon type="plus" /> 添加图层
            </a-button>
          </a-form-model-item> -->
        </a-form-model>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "../dialog";
import { superpositionAnalysis } from "@/mapjs/GPService/superposition";
import { removeLayerByAttr } from "../../pages/oneMap/function";
export default {
  name: "",
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
      },
      formItemLayoutWithOutLabel: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
      },
      dynamicValidateForm: {
        domains: [
          {
            label: "图层1",
            key: 0,
            value: ''
          },
          {
            label: "图层2",
            key: 1,
            value: ''
          },
        ],
      },
      showDjfx: false,
    };
  },

  props: ["map", "options"],

  components: { Dialog },

  created() {},

  computed: {},

  mounted() {
    console.log('options',this.options)
  },

  methods: {
    handleOk(e) {
      this.$refs.dynamicValidateForm.validate(async valid => {
        if (valid) {
          this.$message.warning("正在分析，请稍后！");
          let url =
            window.globalUrl.API_ONEMAP_STATISTICS +
            "/TFGTKJGH/GPService/IntersectAnalysis";
          let res = await superpositionAnalysis(url, this.dynamicValidateForm.domains[0].value, this.dynamicValidateForm.domains[1].value);

          if (res.layer) {
            res.layer.set("layerType", "superLayer");
            this.map.addLayer(res.layer);
            this.map.getView().fit(res.extent);
          }else {
            this.$message.warning(res.msg);
          }
        }
      })
    },
    handleCancel(e) {
      this.showDjfx = false;
      // 关闭清空已选择
      this.$refs.dynamicValidateForm.resetFields();
      this.$refs.dynamicValidateForm.clearValidate();
      removeLayerByAttr(this.map, "layerType", "superLayer");
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        label: "图层" + (this.dynamicValidateForm.domains.length + 1),
        key: this.dynamicValidateForm.domains.length,
      });
    },
    change(a, b) {
      // // console.log(a, b);
    },
  },
};
</script>
<style lang='less' scoped>
.djfx {
  position: absolute;
  top: 100px;
  left: 20px;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
/deep/.ant-form-item {
  position: relative;
  height: 32px;
  margin-bottom: 20px;
}
/deep/.ant-form-item-control {
  text-align: left;
  /deep/.ant-select {
    margin-left: 8px;
  }
  /deep/.ant-btn-dashed {
    margin-left: 40%;
  }
}
/deep/.ant-card-body {
  max-height: 350px;
  overflow: auto;
}
</style>
