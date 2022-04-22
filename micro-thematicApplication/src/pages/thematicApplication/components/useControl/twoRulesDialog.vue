<!--  -->
<template>
  <div class="map-dialog">
    <div class="dialog-header">
      <div class="dialog-title">两规冲突检测结果</div>
      <div class="dialog-close" @click="closeDialog"></div>
      <div class="dialog-content">
        <div class="explain-wrapper">
          <div class="left-wrapper">
            <div class="item" v-for="i in items" :key="i.id">
              <div :class="['block', i.class]"></div>
              <div class="txt">
                {{ i.txt }}（地块数：{{ dialogData.TGCGCheckResult[i.num] }}）
              </div>
            </div>
          </div>
          <!-- <div class="right-wrapper">
            <a-select v-model="selectUnit" style="width: 120px; height: 34px" @change="handleUnitChange">
              <a-icon type="caret-down" slot="suffixIcon" />
              <a-select-option value="meter"> 平方米 </a-select-option>
              <a-select-option value="kilometer"> 平方千米 </a-select-option>
            </a-select>
          </div> -->
        </div>
        <div class="tab-wrapper">
          <div
            :class="['tab', i.active ? 'active-tab' : '']"
            v-for="i in tabs"
            :key="i.id"
            @click="tabClick(i)"
          >
            {{ i.txt }}
          </div>
        </div>
        <div class="table-wrapper">
          <a-table
            :columns="columns"
            :data-source="data"
            :pagination="false"
            bordered
            size="middle"
          >
          </a-table>
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
          txt: "两规均为建设用地",
          class: "jsyd",
          num: "JSYDNum",
        },
        {
          id: 1,
          txt: "土规建设用地/城规非建设用地",
          class: "tgjs",
          num: "TGJSCGFJSNum",
        },
        {
          id: 2,
          txt: "两规均为非建设用地",
          class: "fjsyd",
          num: "FJSYDNum",
        },
        {
          id: 3,
          txt: "土规非建设用地/城规建设用地",
          class: "tgfjs",
          num: "TGFJSCGJSNum",
        },
      ],
      tabs: [
        {
          id: 0,
          txt: "冲突分析总体评价",
          active: true,
        },
        {
          id: 1,
          txt: "两规均为建设用地",
          eng: "JSYDArea",
          active: false,
        },
        {
          id: 2,
          txt: "土规建设用地/城规非建设用地",
          eng: "TGJSCGFJSArea",
          active: false,
        },
        {
          id: 3,
          txt: "两规均为非建设用地",
          eng: "FJSYDArea",
          active: false,
        },
        {
          id: 4,
          txt: "土规非建设用地/城规建设用地",
          eng: "TGFJSCGJSArea",
          active: false,
        },
      ],
      data: [
        // {
        //   key: "1",
        //   type: "John Brown",
        //   area: 18889898989,
        //   layer: "New York No. 1 Lake Park",
        // },
      ],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          ellipsis: true,
        },
        {
          title: "面积(平方米)",
          dataIndex: "area",
          ellipsis: true,
        },
      ],
      landType: [
        {
          id: 1,
          txt: "两规均为建设用地",
          eng: "JSYDArea"
        },
        {
          id: 2,
          txt: "土规建设用地/城规非建设用地",
          eng: "TGJSCGFJSArea"
        },
        {
          id: 3,
          txt: "两规均为非建设用地",
          eng: "FJSYDArea"
        },
        {
          id: 4,
          txt: "土规非建设用地/城规建设用地",
          eng: "TGFJSCGJSArea"
        },
      ],
      baseData: null,
      selectUnit: 'meter',
      currentData: null
    };
  },

  props: ["dialogData", "checkArea"],
  watch: {
    dialogData(val) {
      this.currentData = val;
      // 组装数据
      this.buildTableData(val);
    },
    checkArea(val) {
      // 组装数据
      this.checkArea = val;
    },
  },
  components: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    // tab切换
    tabClick(i) {
      if (i.active) {
        return;
      }
      this.tabs.forEach((i) => {
        i.active = false;
      });
      if (i.eng) this.data = this.baseData.filter(item => item.eng == i.eng)
      else this.data = this.baseData;
      i.active = true;
    },
    // 关闭弹框
    closeDialog() {
      this.$emit("closeDialog");
    },
    // 生成表格数据
    buildTableData(data) {
      let checkArea = this.checkArea;
      let arr = [{
        key: "total",
        name: "检测面积",
        area: (this.selectUnit == 'meter'?checkArea: checkArea/1000000).toFixed(2),
      }];
      this.landType.forEach(i => {
        let tempData = data.TGCGCheckResult[i.eng]
        arr.push({
          key: i.id,
          name: i.txt,
          eng: i.eng,
          area: this.selectUnit == 'meter'?tempData: tempData/1000000,
        })
      })
      this.baseData = arr;
      this.data = arr
    },
    handleUnitChange(value) {
      this.selectUnit = value;
      this.tabClick({id: 0,txt: "冲突分析总体评价",active: false});
      this.buildTableData(this.currentData);
    }
  },
};
</script>
<style lang='less' scoped>
.map-dialog {
  width: 884px !important;
  left: 20%;
}
.dialog-content {
  width: 100%;
  margin-top: 20px;
}
.explain-wrapper {
  width: 100%;
  height: 79px;
  padding-bottom: 35px;
  display: flex;
  justify-content: space-between;
  .left-wrapper {
    width: calc(100% - 204px);
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .item {
      position: relative;
      padding-left: 35px;
      line-height: 24px;
      .block {
        width: 26px;
        height: 13px;
        position: absolute;
        left: 0;
        top: 6px;
      }
      .jsyd {
        background: #eaa72b;
      }
      .tgjs {
        background: #54bdf2;
      }
      .fjsyd {
        background: #28e083;
      }
      .tgfjs {
        background: #e4d81c;
      }
      .txt {
        font-size: 14px;
        color: #454954;
      }
    }
  }
  .right-wrapper {
    width: 204px;
    height: 34px;
    margin-top: 12px;
    text-align: right;
    /deep/.anticon-caret-down {
      font-size: 16px;
      color: #cccccc;
      margin-top: -2px;
    }
  }
}
.tab-wrapper {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  .tab {
    cursor: pointer;
    font-size: 14px;
    color: #6f7583;
    padding-bottom: 10px;
  }
  .active-tab {
    color: #1890ff;
    border-bottom: 1px solid #1890ff;
  }
}
.table-wrapper {
  margin-top: 20px;
}
</style>

