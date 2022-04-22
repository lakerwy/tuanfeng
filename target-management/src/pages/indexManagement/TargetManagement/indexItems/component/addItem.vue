<template>
  <div>
    <global-modal
      class="modal-box"
      title="新增指标项"
      :visible="addVisible"
      v-if="addVisible"
      @ok="addHandleOk"
      @cancel="addHandleCancel"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        slot="modalBody"
      >
        <a-form-model-item label="当前选中">
          <a-input
            v-model="chooseDataName"
            disabled
          ></a-input>
        </a-form-model-item>
        <a-form-model-item ref="code" prop="itemcode" label="指标编号">
          <a-input
            v-model="code"
            disabled
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
          <a-select placeholder="选择指标单位" v-model="form.itemunit">
            <a-select-option
              v-for="(item, index) in ListYear"
              :key="index"
              v-model="item.key"
            >
              {{ item.key }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item prop="rangetype" label="指标范围">
          <a-select
            placeholder="请选择指标范围"
            v-model="form.rangetype"
            @change="handleChange"
          >
            <a-select-option
              v-for="item in styleMeatData[4].valuetext"
              :key="item.value"
              v-model="item.value"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <template v-if="isShow">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择指标范围"
              @change="handleChanges"
            >
              <a-select-option v-for="i in fwOtherList" :key="i.value">
                {{ i.name }}
              </a-select-option>
            </a-select>
          </template>
        </a-form-model-item>
        <a-form-model-item prop="isbreak" label="是否分解">
          <a-select placeholder="请选择是否分解" v-model="form.isbreak">
            <a-select-option
              v-for="item in styleMeatData[5].valuetext"
              :key="item.value"
              v-model="item.value"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
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
import { getAddLists } from "@/api/management";
import globalModal from "@/components/globalModal/globalModal";
export default {
  inject:['reload'],
  props: ["chooseData", "code"],
  components: {
    globalModal
  },
  data() {
    return {
      chooseDataName:"基础指标",
      addVisible: false,
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },
      form: {},
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
            message: "请选择指标单位",
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
            message: "请选择指标属性",
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
      },
      query: {
        item: {},
        treeItem: {
          code: "",
          id: "",
          type: 1
        }
      },
      yearData: JSON.parse(sessionStorage.getItem("latitudeData")),
      yearList: [],
      ListYear: [],
      isShow:false,
      fwList:JSON.parse(sessionStorage.getItem("otherFwList")),
      fwOtherList:[],
      fwOther:[],
    };
  },
  mounted() {
    // console.log(this.chooseData)
    if(this.chooseData.name){
      this.chooseDataName=this.chooseData.pName
    }
    this.getYear();
    this.getOtherType();
  },
  methods: {
    // 指标范围
    handleChange(value){
      if(value==3){
        this.isShow=true
      }else{
        this.isShow=false
      }
    },
    handleChanges(value){
      this.form.rangetypeOtherXzqhs=value.toString()
    },
    // 获取单位信息参数
    getYear() {
      for (var i in this.yearData) {
        if (this.yearData[i].name === "单位") {
          let list123 = this.yearData[i].valuess;
          this.yearList = list123.split(",");
        }
      }
      for (var k in this.yearList) {
        this.ListYear.push({ key: this.yearList[k] });
      }
    },
    getOtherType() {
      for (var i in this.yearData) {
        if (this.yearData[i].name === "行政区") {
          let list123 = this.yearData[i].names;
          this.fwOther = list123.split(",");
        }
      }
      // console.log(this.fwOther)
      this.fwOther.forEach(item=>{
        this.fwOtherList.push({name:item,value:item});
      })
    },
    // 新增数据
    async getAddData() {
      if(this.chooseData.code){
        this.query.treeItem.code = this.chooseData.code;
      }else{
        this.query.treeItem.code="1"
      }
      this.form.useType=this.chooseData.pName+",0,0,0"
      this.query.treeItem.id = this.chooseData.id;
      this.form.itemcode = this.code;
      this.query.item = this.form;
      let params = this.query;
      let res = await getAddLists(params);
      if (res.code === 200) {
          // this.$router.go(0)
          this.reload();
        this.$notification.open({
          message: "新建指标项成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.addVisible = false;
        this.$parent.isShow = false;
      } else {
        this.$notification.open({
          message: "新增数据失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
        this.$parent.isShow = false;
      }
    },
    addHandleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.getAddData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addHandleCancel() {
      this.addVisible = false;
      this.$parent.isShow = false;
    },
    initShow() {
      this.addVisible = true;
    },
    onChange() {}
  }
};
</script>

<style lang="less" scoped></style>
