<template>
  <div>
    <global-modal
      title="编辑"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="40%"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        slot="modalBody"
      >
        <a-form-model-item ref="code" prop="itemcode" label="指标编号">
          <a-input
            v-model="form.itemcode"
            disabled
            placeholder="请输入指标编号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item ref="name" prop="itemname" label="指标名称">
          <a-input
            v-model="form.itemname"
            placeholder="请输入指标名称"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          ></a-input>
        </a-form-model-item>
        <a-form-model-item ref="unit" prop="itemunit" label="指标单位">
          <a-input
            v-model="form.itemunit"
            placeholder="请输入指标单位"
            @blur="
              () => {
                $refs.unit.onFieldBlur();
              }
            "
          ></a-input>
        </a-form-model-item>

        <a-form-model-item prop="rangetype" label="指标范围">
          <a-input
            v-model="form.rangetype"
            disabled
            placeholder="请输入指标范围"
          >
          </a-input>
          <template v-if="isShow">
            <a-input v-model="form.rangetypeOtherXzqhs" disabled> </a-input>
          </template>
        </a-form-model-item>
        <a-form-model-item prop="isbreak" label="是否分解">
          <a-input v-model="form.isbreak" disabled placeholder="请输入是否分解">
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="itemtype" label="指标属性">
          <a-select placeholder="请选择指标属性" v-model="form.itemtype">
            <a-select-option
              v-for="item in styleMeatData[6].valuetext"
              :key="item.value"
              v-model="item.value"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="overtype" label="突破类型">
          <a-select placeholder="请选择突破类型" v-model="form.overtype">
            <a-select-option
              v-for="item in styleMeatData[7].valuetext"
              :key="item.value"
              v-model="item.value"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="source" label="数据来源">
          <a-input v-model="form.source" placeholder="请输入数据来源"></a-input>
        </a-form-model-item>
        <a-form-model-item prop="formula" label="计算公式">
          <a-textarea v-model="form.formula"></a-textarea>
        </a-form-model-item>

        <a-form-model-item ref="itemremark" label="指标说明">
          <a-input
            v-model="form.itemremark"
            placeholder="请输入指标说明"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getTaskTreeUpdLists } from "@/api/management";
export default {
  inject: ["reload"],
  props: ["form"],
  components: {
    globalModal
  },
  data() {
    return {
      visible: false,
      isShow: false,
      confirmLoading: false,
      initDataList: [],
      meatDataList: [],
      styleMeatData: [
        {
          styleCode: 1,
          isNeed: 1,
          valuetext: ""
        },
        {
          styleName: 1,
          isNeed: 1,
          valuetext: ""
        },
        {
          styleUnit: 1,
          isNeed: 2,
          valuetext: ""
        },
        {
          styleRemark: 1,
          isNeed: 2,
          valuetext: ""
        },
        {
          styleRangetype: 3,
          isNeed: 2,
          valuetext: [
            {
              name: "全域",
              value: 0
            },
            {
              name: "城区",
              value: 1
            },
            {
              name: "市域",
              value: 2
            },
            {
              name: "其它",
              value: 3
            }
          ]
        },
        {
          styleIsbreak: 3,
          isNeed: 2,
          valuetext: [
            {
              name: "否",
              value: 0
            },
            {
              name: "是",
              value: 1
            }
          ]
        },
        {
          styleType: 3,
          isNeed: 2,
          valuetext: [
            {
              name: "约束性",
              value: 0
            },
            {
              name: "预期性",
              value: 1
            },
            {
              name: "建议性",
              value: 2
            }
          ]
        },
        {
          styleOvertype: 3,
          isNeed: 2,
          valuetext: [
            {
              name: "上值突破",
              value: 0
            },
            {
              name: "下值突破",
              value: 1
            }
          ]
        },
        {
          styleFormula: 1,
          isNeed: 2,
          valuetext: ""
        },
        {
          styleSource: 1,
          isNeed: 2,
          valuetext: ""
        }
      ],
      rules: {
        itemcode: [
          {
            required: true,
            message: "请输入指标编号",
            trigger: "blur"
          }
        ],
        itemname: [
          {
            required: true,
            message: "请输入指标名称",
            trigger: "blur"
          }
        ],
        itemunit: [
          {
            required: true,
            message: "请输入指标单位",
            trigger: "blur"
          }
        ],
        itemremark: "",
        rangetype: [
          {
            required: true,
            message: "请选择指标范围",
            trigger: "change"
          }
        ],
        itemtype: [
          {
            required: true,
            message: "请输入指标属性",
            trigger: "change"
          }
        ],
        isbreak: [
          {
            required: true,
            message: "请选择是否分解",
            trigger: "change"
          }
        ],
        overtype: [
          {
            required: true,
            message: "请选择突破类型",
            trigger: "change"
          }
        ],
        formula: [
          {
            required: true,
            message: "请输入计算公式",
            trigger: "blur"
          }
        ],
        source: [
          {
            required: true,
            message: "请输入数据来源",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    async meatData() {
      if (this.form.isbreak == "是") {
        this.form.isbreak = 1;
      } else {
        this.form.isbreak = 0;
      }
      // let newArr = []
      //         newArr = this.form.useType.split(",")
      let num = this.form.useType.length;
      for (var i = 1; i < num - i; i++) {
        this.form.useType.push("0");
      }
      // console.log(this.form.useType)
      this.form.useType = this.form.useType.toString();
      let params = this.form;
      let res = await getTaskTreeUpdLists(params);
      if (res.code == 200) {
        this.reload();
        this.$notification.open({
          message: "编辑成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$notification.open({
          message: "编辑失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.meatData();

          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
          }, 1000);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.visible = false;
    }
  }
};
</script>
