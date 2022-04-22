<template>
  <div class="content">
    <a-modal
      title="编辑指标计算方法"
      :visible="visible"
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
      >
        <!-- <a-form-model-item label="行政区划编码" prop="arcode">
          <a-input
            placeholder="请输入行政区划编码"
            v-model="form.arcode"
            disabled
          />
        </a-form-model-item>
        <a-form-model-item label="行政区划名称" prop="arcname">
          <a-input
            placeholder="请输入行政区划名称"
            v-model="form.arcname"
            disabled
          />
        </a-form-model-item> -->
        <a-form-model-item label="指标名称" prop="kpiname">
          <a-input
            placeholder="请输入指标名称"
            v-model="form.kpiname"
            disabled
          />
        </a-form-model-item>
        <a-form-model-item label="指标编号" prop="kpiid">
          <a-input v-model="form.kpiid" disabled></a-input>
        </a-form-model-item>
        <a-form-model-item label="计算名称" prop="calname">
          <a-input v-model="form.calname"></a-input>
        </a-form-model-item>
        <a-form-model-item label="计算类型" prop="caltype" ref="caltype">
          <a-select v-model="form.caltype" @change="handleChange">
            <a-select-option value="SQL">
              SQL
            </a-select-option>
            <a-select-option value="URL接口">
              URL接口
            </a-select-option>
            <a-select-option value="接口url自定义">
              接口url自定义
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <template v-if="form.caltype === 'SQL'">
          <a-form-model-item
            label="数据源节点名称"
            ref="resourceId"
            prop="resourceId"
          >
            <a-select
              v-model="form.resourceId"
              @change="handleNodename(form.resourceId)"
            >
              <a-select-option
                v-for="(item, index) in list"
                :key="index"
                :value="item.id"
              >
                {{ item.nodename }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="计算方法" prop="calinterText">
            <div class="last">
              <span class="icon">
                <a-icon
                  title="例: select name from  table  where year = ?  and region =? 。相应的参数均用问号表示"
                  style="color: #409eff"
                  type="question-circle"
                />
              </span>
              <a-textarea
                placeholder="请输入计算方法"
                v-model="form.calinterText"
                :auto-size="{ minRows: 6, maxRows: 50 }"
              />
              <a-button
                type="link"
                class="last-validationbtn"
                @click="handleRemove"
                ><img src="../../../../assets/img/qc.png" alt="" />
                清除</a-button
              >
              <!-- <a-button type="link" class="last-removebtn" @click="handleRemove"
                ><img src="../../../../assets/img/qc.png" alt="" />
                清除</a-button
              > -->
              <!-- <a-button type="link" class="last-validationbtn"
                ><img src="../../../../assets/img/yanzheng.png" alt="" />
                验证</a-button
              > -->
            </div>
          </a-form-model-item>
          <template v-if="isShow">
            <div class="parameter">
              <span class="icons">
                <a-icon
                  title="请输入对应计算方法中sql语句的?代表的参数类型, y代表年份 a代表行政区划。例: select name from  table  where year = ?  and region =? 。第一个问号代表年份输入y 第二个代表行政区划输入a 结果是: ya"
                  style="color: #409eff"
                  type="question-circle"
                />
              </span>
            </div>
            <a-form-model-item label="参数" prop="calinterParams">
              <a-input
                @change="onsearch"
                v-model="form.calinterParams"
              ></a-input>
            </a-form-model-item>
          </template>
        </template>
        <template v-if="form.caltype === 'URL接口'">
          <a-form-model-item label="接口类型" prop="type" ref="type">
            <a-select v-model="form.calinterPort" @change="handleChangeType">
              <a-select-option value="zsjs">
                指标计算
              </a-select-option>
              <a-select-option value="mxjs">
                模型计算
              </a-select-option>
            </a-select></a-form-model-item
          >
          <template v-if="isActive">
            <a-table
              ref="multipleTable"
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="data"
            >
            </a-table>
          </template>
          <template v-else>
            <a-table
              ref="multipleTable"
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="data1"
            >
            </a-table>
          </template>
        </template>
        <template v-if="form.caltype === '接口url自定义'">
          <a-form-model-item
            label="指标计算接口地址"
            ref="calinterText"
            prop="calinterTexts"
          >
            <a-textarea
              placeholder="请输入指标计算接口地址"
              v-model="form.calinterText"
              :auto-size="{ minRows: 2, maxRows: 10 }"
            />
          </a-form-model-item>
          <a-form-model-item
            label="指标计算端口号"
            ref="calinterPort"
            prop="calinterPort"
          >
            <a-input
              placeholder="请输入指标计算端口号"
              v-model="form.calinterPort"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="接口路径"
            ref="calinterPath"
            prop="calinterPath"
          >
            <a-input
              placeholder="请输入指标计算接口路径"
              v-model="form.calinterPath"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="接口请求方式"
            ref="calinterStyle"
            prop="calinterStyle"
          >
            <a-select v-model="form.calinterStyle" @change="handleChangeStyle">
              <a-select-option value="get">
                get
              </a-select-option>
              <a-select-option value="post">
                post
              </a-select-option>
              <a-select-option value="post/json">
                post/json
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="接口参数列表" prop="calinterParams">
            <a-textarea
              placeholder="请输入接口参数列表"
              v-model="form.calinterParams"
              :auto-size="{ minRows: 6, maxRows: 50 }"
            />
          </a-form-model-item>
        </template>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  getCalculatUpdateLists,
  getCalculatURLLists,
  getdataSourceLists,
  getCalculatURLmxjsLists
} from "@/api/management";

export default {
  props: ["form"],
  data() {
    return {
      selectedRowKeys: [],
      visible: false,
      isShow: false,
      confirmLoading: false,
      columns: [
        {
          title: "名称",
          dataIndex: "name"
        },
        {
          title: "url",
          dataIndex: "url"
        }
      ],
      data: [],
      data1: [],
      rules: {
        calname: [
          { required: true, message: "指标计算方法名称", trigger: "blur" }
        ],
        calinterParams: [
          { required: true, message: "请输入指标参数", trigger: "blur" },
          {
            pattern: /^[a|y|a]+$/,
            message: "非法的参数",
            trigger: "blur"
          }
        ],
        calinterText: [
          { required: true, message: "指标计算方法", trigger: "blur" }
        ],
        calinterTexts: [
          { required: true, message: "请输入指标计算接口地址", trigger: "blur" }
        ],
        calinterPort: [
          { required: true, message: "请输入端口号", trigger: "blur" }
        ],
        calinterPath: [
          { required: true, message: "请输入接口路径", trigger: "blur" }
        ],
        caltype: [
          {
            required: true,
            message: "选择数据源",
            trigger: "change"
          }
        ],
        // type: [
        //   {
        //     required: true,
        //     message: "选择接口类型",
        //     trigger: "change"
        //   }
        // ],
        calinterStyle: [
          {
            required: true,
            message: "选择请求方式",
            trigger: "change"
          }
        ],
        resourceId: [
          {
            required: true,
            message: "选择数据源节点名称",
            trigger: "change"
          }
        ]
      },
      list: [],
      meatDataList: [],
      isActive: true
    };
  },
  mounted() {
    this.meatData1();
    this.getUrlTable();
    this.getUrlmxjsTable();
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          if (selectedRows.length === 1) {
            this.form.calinterStyle = selectedRowKeys.toString();
            this.form.calname = selectedRows[0].name;
            this.form.calinterPath = selectedRows[0].url;
            this.form.pubversion = selectedRows[0].version;
            this.form.calinterParams = JSON.stringify({
              modelId: selectedRows[0].version
            });
          } else {
            this.$notification.open({
              message: "只能选择一条数据",
              icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
            });
          }
        },
        getCheckboxProps: record => {
          return {
            props: {
              defaultChecked: this.form.calinterStyle
                .split("")
                .join("")
                .includes(record.id)
            }
          };
        }
      };
    }
  },
  watch: {
    "form.calinterText": {
      handler(newVal) {
        // console.log(newVal,oldVal)
        let str = newVal;
        let arr = str.split("?");
        console.log(arr.length)
        if (arr.length >1) {
          this.isShow=true
          // this.rules.calinterParams.push({
          //   min: arr.length - 1,
          //   max: arr.length - 1,
          //   message: `长度必须为${arr.length - 1}位`,
          //   trigger: "blur"
          // });
        }
      }
    }
  },
  methods: {
    async meatData1() {
      let params = {};
      let res = await getdataSourceLists(params);
      this.list = res.data.records;
    },
    handleNodename(val) {
      this.form.resourceId = val;
    },
    async meatData() {
      if (this.form.caltype === "SQL") {
        this.form.caltype = 0;
      } else if (this.form.caltype === "URL接口") {
        this.form.caltype = 1;
      } else if (this.form.caltype === "接口url自定义") {
        this.form.caltype = 2;
      }
      let params = this.form;
      let res = await getCalculatUpdateLists(params);
      if (res.code == 200) {
        this.$parent.meatData();
        this.$notification.open({
          message: "编辑成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$refs.form.resetFields();
        this.$parent.meatData();
        this.$notification.open({
          message: "编辑失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
        this.$parent.meatData();
        this.$parent.isShow = false;
      }
    },
    // 指数计算
    async getUrlTable() {
      let res = await getCalculatURLLists();
      if (res.rows != null) {
        for (var i in res.rows) {
          res.rows[i].key = res.rows[i].id;
        }
        this.data = res.rows;
      }
    },
    // 模型计算
    async getUrlmxjsTable() {
      let res = await getCalculatURLmxjsLists();
      for (var i in res.rows) {
        res.rows[i].key = res.rows[i].id;
      }
      this.data1 = res.rows;
      console.log(this.data1);
    },
    // 获取计算类型为sql的时候的参数
    onsearch() {
      let str = this.form.calinterText;
      let arr = str.split("?");
      this.rules.calinterParams.push({
        min: arr.length - 1,
        max: arr.length - 1,
        message: `长度必须为${arr.length - 1}位`,
        trigger: "blur"
      });
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
      this.$parent.isShow=false;
      this.visible = false;
      this.$parent.meatData();
    },
    //  点击清除按钮
    handleRemove() {
      this.form.calinterText = "";
      this.form.calinterParams = "";
    },
    // 下拉选择框选择相应的值
    handleChange(value) {
      this.form.caltype = value;
    },
    handleChangeType(value) {
      console.log(value);
      this.form.calinterPort = value;
      if (value === "zsjs") {
        this.isActive = true;
        this.$nextTick(() => {
          this.getUrlTable();
        });
      } else {
        this.isActive = false;
        this.$nextTick(() => {
          this.getUrlmxjsTable();
        });
        // this.getUrlmxjsTable();
      }
    },

    handleChangeStyle(value) {
      this.form.calinterStyle = value;
    }
  }
};
</script>

<style lang="less" scoped>
.parameter {
  z-index: 1000;
  position: relative;
  .icons {
    position: absolute;
    left: 50px;
    top: 10px;
  }
}
.last {
  position: relative;
  .icon {
    position: absolute;
    left: -110px;
  }
  &-removebtn {
    position: absolute;
    bottom: 10px;
    right: 100px;
  }
  &-validationbtn {
    position: absolute;
    bottom: 10px;
    right: 30px;
  }
}
</style>
