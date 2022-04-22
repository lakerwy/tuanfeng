<template>
  <div>
    <a-modal
      v-model="visible"
      title="详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
      width="60%"
    >
      <div class="contenter">
        <div class="contenter-left">
          <p>指标编号：{{ kpiData.itemcode ? kpiData.itemcode : "--" }}</p>
          <p>指标名称：{{ kpiData.itemname ? kpiData.itemname : "--" }}</p>
          <p>指标单位：{{ kpiData.itemunit ? kpiData.itemunit : "--" }}</p>
          <p>指标说明：{{ kpiData.itemremark ? kpiData.itemremark : "--" }}</p>
          <p>
            指标构成：{{ kpiData.constructtype ? kpiData.constructtype : "--" }}
          </p>
          <p>指标属性：{{ kpiData.itemtype ? kpiData.itemtype : "--" }}</p>
          <p>指标范围：{{ kpiData.rangetype ? kpiData.rangetype : "--" }}</p>
          <p>是否分解：{{ kpiData.isbreak === 0 ? "否" : "是" }}</p>
        </div>
        <div class="contenter-middle">
          <p>
            突破方式：{{ kpiData.overtype === 0 ? "上值突破" : "下值突破" }}
          </p>
          <p v-if="calcu">
            计算方法：{{ calcu.calinterText ? calcu.calinterText : "--" }}
          </p>
          <p>数据来源：{{ kpiData.source ? kpiData.source : "--" }}</p>
          <p v-if="calcu">
            计算访问类型：{{ calcu.caltype ? calcu.caltype : "--" }}
          </p>
          <p v-if="calcu">
            计算方法名称：{{ calcu.calname ? calcu.calname : "--" }}
          </p>

          <p>指标所属应用到的体系树：{{ kpiData.useType }}</p>
          <!-- <p>指标标签：{{ kpiData.tag ? kpiData.tag : "--" }}</p> -->
          <p v-if="update">
            更新方式：{{ update.updatetype==0 ? "手动更新" : "定期监测" }}
          </p>
          <p v-if="update">
            创建时间：{{ update.createtime ? update.createtime : "--" }}
          </p>
          <p v-if="update">
            更新时间：{{ update.updatetime ? update.updatetime : "--" }}
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getTaskTreeDetalisLists } from "@/api/management";
export default {
  props: ["code"],
  data() {
    return {
      visible: false,
      calcu: {},
      kpiData: {},
      update: {},
      monitorNumList: [
        {
          name: "年",
          value: 1
        },
        {
          name: "月",
          value: 2
        },
        {
          name: "日",
          value: 3
        },
        {
          name: "实时",
          value: 4
        }
      ],
      glTree: [],
      txlList: [
        {
          name: "基础",
          value: "1"
        },
        {
          name: "监测",
          value: "2"
        },
        {
          name: "预警",
          value: "3"
        },
        {
          name: "评估",
          value: "4"
        }
      ]
    };
  },
  mounted() {
    this.meatData();
  },
  methods: {
    async meatData() {
      let params = this.code;
      let res = await getTaskTreeDetalisLists(params);
      this.calcu = res.data.calcu;
      this.kpiData = res.data.kpi;
      this.update = res.data.update;
      if (this.calcu != null) {
        if (this.calcu.caltype === 0) {
          this.calcu.caltype = "SQL";
        } else if (this.calcu.caltype === 1) {
          this.calcu.caltype = "URL接口";
        } else if (this.calcu.caltype === 2) {
          this.calcu.caltype = "自定义接口URL";
        }
      }
      if (this.kpiData.useType == null) {
        this.kpiData.useType = "基础";
      } else {
        this.glTree = this.kpiData.useType.split(",").sort();
        // console.log(this.glTree)
        for (var i in this.glTree) {
          for (var j in this.txlList) {
            if (this.glTree[i] == this.txlList[j].value) {
              this.glTree[i] = this.txlList[j].name;
            }
          }
        }
       this.glTree = this.glTree.filter(function(value){
         return value!= 0;

       })
        this.kpiData.useType = this.glTree.join(",");
      }
      if (this.kpiData.constructtype === "0") {
        this.kpiData.constructtype = "基础指标";
      } else if (this.kpiData.constructtype === "1") {
        this.kpiData.constructtype = "其它指标";
      } else if (this.kpiData.constructtype === "2") {
        this.kpiData.constructtype = "国务院附加";
      }
      if (this.kpiData.itemtype === 0) {
        this.kpiData.itemtype = "约束性";
      } else if (this.kpiData.itemtype === 1) {
        this.kpiData.itemtype = "预期性";
      } else if (this.kpiData.itemtype === 2) {
        this.kpiData.itemtype = "建议性";
      }
      if (this.kpiData.rangetype === "0") {
        this.kpiData.rangetype = "全域";
      } else if (this.kpiData.rangetype === "1") {
        this.kpiData.rangetype = "城区";
      } else if (this.kpiData.rangetype === "2") {
        this.kpiData.rangetype = "市域";
      } else if (this.kpiData.rangetype === "3") {
        this.kpiData.rangetype = "其它";
      }
      if (this.update != null) {
        if (this.update.createtime === null) {
          this.update.createtime = "--";
        } else {
          this.update.createtime = this.update.createtime.substr(
            0,
            this.update.createtime.indexOf("T")
          );
        }
        if (this.update.updatetime === null) {
          this.update.updatetime = "--";
        } else {
          this.update.updatetime = this.update.updatetime.substr(
            0,
            this.update.updatetime.indexOf("T")
          );
        }
        this.monitorNumList.forEach(item => {
          if (item.value === this.update.monitorNum) {
            this.update.monitorNum = item.name;
          }
        });
      }
    },
    handleOk() {
      this.$parent.isShow = false;
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
      this.$parent.isShow = false;
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;
* {
  box-sizing: border-box;
}
.contenter {
  width: 100%;
  display: flex;
  // justify-content: space-between;
  p {
    margin-top: 0;
    margin-bottom: 1em;
  }
  &-left {
    margin-left: 20px;
    width: 50%;
  }
  &-middle {
    margin-left: 20px;
    width: 50%;
  }
  // &-right {
  //   margin-left: 30px;
  //   width: 33.3%;
  // }
}
</style>
