<!--  -->
<template>
  <div class="map-dialog">
    <div class="dialog-header">
      <div class="dialog-title">项目合规性检查结果</div>
      <div class="dialog-close" @click="closeDialog"></div>
    </div>
    <div class="dialog-content">
      <div class="explain-wrapper">
        <div class="item-wrapper">
          <div class="item" v-for="i in items" :key="i.id">
            <div :class="['circle', i.class]"></div>
            <div class="txt">{{ i.txt }}</div>
          </div>
        </div>
        <div class="desc-wrapper">
          <div class="item">
            <span class="item-label">本次检查面积：</span>
            <span class="item-value">{{ testArea.toFixed(2) }}</span>
            <span class="item-unit"> 平方米</span>
          </div>
          <div class="item">
            <span class="item-label">项目用地面积：</span>
            <span class="item-value">{{ landArea.toFixed(2) }}</span>
            <span class="item-unit"> 平方米</span>
          </div>
        </div>
      </div>
      <div class="container-wrapper">
        <div class="left-wrapper">
          <div
            :class="['btn', i.active ? 'activeBtn' : '']"
            v-for="(i,index) in showBtns1"
            :key="i.id"
            @click="btnClick(i,index)"
          >
            <div :class="['circle', i.class]"></div>
            <div class="txt">{{ i.txt }}</div>
          </div>
        </div>
        <div class="right-wrapper">
          <div class="top-wrapper">
            <div class="table-title">{{ tableTitle }}</div>
            <!-- <div class="select-wrapper">
              <a-select
                default-value="meter"
                style="width: 120px; height: 34px"
              >
                <a-icon type="caret-down" slot="suffixIcon" />
                <a-select-option value="meter"> 平方米 </a-select-option>
                <a-select-option value="kilometer"> 平方千米 </a-select-option>
              </a-select>
            </div> -->
          </div>
          <div class="table-wrapper">
            <a-table
              :columns="columns"
              :data-source="data"
              :pagination="false"
              :scroll="{ y: 270 }"
              bordered
              size="small"
            >
              <span slot="area" slot-scope="text, record">
                <span v-if="record.ZY == -1">{{ record.NotInractArea.toFixed(2) }}</span>
                <span v-else>{{ record.IntractArea.toFixed(2) }}</span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      items: [
        {
          id: 0,
          txt: "正常使用",
          class: "zcsy",
        },
        {
          id: 1,
          txt: "违规占用",
          class: "wgzy",
        },
        {
          id: 2,
          txt: "未占用",
          class: "wzy",
        },
        {
          id: 3,
          txt: "通过检测",
          class: "tgjc",
        },
        {
          id: 4,
          txt: "未通过检测",
          class: "wtgjc",
        },
      ],
      testArea: 0, //本次检测面积
      landArea: 0, // 项目用地面积
      btns: [
        {
          id: 'TDYTQ',
          txt: "土地用途区",
          class: "zcsy",
          active: false,
        },
        {
          id: 'TDGHDL',
          txt: "土地规划地类",
          class: "wgzy",
          active: false,
        },
        {
          id: 'JSYDGZQ',
          txt: "建设用地管制区",
          class: "wzy",
          active: false,
        },
        {
          id: 'JBNTBHQ',
          txt: "基本农田保护区",
          class: "tgjc",
          active: false,
        },
        {
          id: 4,
          txt: "合规审查报告",
          class: "wtgjc",
          active: false,
        },
      ],
      showBtns1: [],
      tableTitle: "总体情况",
      data: [],
      columns: [
        {
          title: "序号",
          dataIndex: "key",
          customRender: (text, record, index) => index + 1,
          width: 62,
        },
        // {
        //   title: "图层",
        //   dataIndex: "layer",
        //   width: 145,
        //   ellipsis: true,
        //   customRender: (value, row, index) => {
        //     const obj = {
        //       children: value,
        //       attrs: {},
        //     };
        //     if (index === 0) {
        //       obj.attrs.rowSpan = 4;
        //     }
        //     // These two are merged into above cell
        //     if (index === 4) {
        //       obj.attrs.rowSpan = 3;
        //     }
        //     return obj;
        //   },
        // },
        {
          title: "类型",
          dataIndex: "Type",
          width: 142,
          ellipsis: true,
        },
        {
          title: "重叠面积(平方米)",
          dataIndex: "area",
          width: 115,
          ellipsis: true,
          scopedSlots: { customRender: "area" },
        },
      ],
    };
  },

  props: {
    checkArea: Number, // 检测面积
    showBtns: Array, // 需要展示的按钮
    tableData: Array, // 表格数据
  },
  watch: {
    showBtns(val) {
      this.showBtns1 = this.filterShowBtns(val);
    },
    // tableData: {
    //   handler: function (val) {
    //     console.log(6666, val);
    //     this.data = this.tableData[0];
    //     console.log(this.data);
    //   },
    //   deep: true,
    // },
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
    // console.log(555, this.tableData, this.tableData[0]);
    // this.data = this.tableData[0].data;
    this.showBtns1 = this.filterShowBtns(this.showBtns);
    this.initData(this.tableData[0]);
  },

  methods: {
    initData(data) {
      if (!data) return;
      this.data = data.data;
      this.testArea = 0;
      this.landArea = 0;
      data.data.forEach(item => {
        this.testArea += item.IntractArea + item.NotInractArea;
        this.landArea += item.NotInractArea;
      })
    },
    // 关闭弹框
    closeDialog() {
      this.$emit("closeDialog");
    },
    // 按钮点击
    btnClick(i,index) {
      this.data = this.tableData[index];
      if (i.active) {
        return;
      }
      this.btns.forEach((i) => {
        i.active = false;
      });
      i.active = true;
      this.initData(this.data);
    },
    // 筛选需要展示的功能按钮
    filterShowBtns(data) {
      let arr = [];
      this.btns.filter((i) => {
        data.forEach((item) => {
          if (item == i.id) {
            arr.push(i);
          }
        });
      });
      arr[0].active = true;
      return arr;
    },
  },
};
</script>
<style lang='less' scoped>
.explain-wrapper {
  height: 88px;
  background: #f0f6fb;
  padding: 20px;
  .item-wrapper {
    display: flex;
    justify-content: flex-start;
    .item {
      position: relative;
      padding-left: 21px;
      margin-right: 21px;
      .circle {
        position: absolute;
        top: 5px;
        left: 0;
      }
      .txt {
        color: #454954;
        font-size: 14px;
      }
    }
  }
  .desc-wrapper {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    .item {
      margin-right: 32px;
      span {
        font-size: 14px;
        color: #6f7583;
      }
      .item-value {
        color: #1890ff;
      }
      .item-unit {
        color: #454954;
      }
    }
  }
}
.circle {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.zcsy {
  background: #5ec26d;
}
.wgzy {
  background: #f44b4b;
}
.wzy {
  background: #d5d5d5;
}
.tgjc {
  border: 1px solid #5ec26d;
}
.wtgjc {
  border: 1px solid #f44b4b;
}
.container-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
  .left-wrapper {
    width: 168px;
    margin-right: 25px;
    .btn {
      cursor: pointer;
      width: 100%;
      height: 40px;
      border: 1px solid #ddd;
      padding-left: 39px;
      margin-bottom: 20px;
      position: relative;
      .circle {
        position: absolute;
        top: 15px;
        left: 14px;
      }
      .txt {
        line-height: 40px;
        color: #454954;
        text-align: left;
      }
    }
    .btn:hover {
      border: 1px solid #1890ff;
      .txt {
        color: #1890ff;
      }
    }
    .activeBtn {
      border: 1px solid #1890ff;
      .txt {
        color: #1890ff;
      }
    }
  }
  .right-wrapper {
    width: calc(100% - 193px);
    .top-wrapper {
      display: flex;
      justify-content: space-between;
      .table-title {
        color: #6f7583;
        font-size: 16px;
        line-height: 40px;
      }
      .select-wrapper {
        width: 120px;
        height: 34px;
        margin-top: 2px;
        /deep/.anticon-caret-down {
          font-size: 16px;
          color: #cccccc;
          margin-top: -2px;
        }
      }
    }
    .table-wrapper {
      height: 329px;
      overflow: hidden;
      /deep/.ant-table-thead tr td {
        padding-top: 9px;
        padding-bottom: 9px;
      }
      /deep/.ant-table-tbody tr td {
        padding-top: 9px;
        padding-bottom: 9px;
      }
    }
  }
}
</style>

