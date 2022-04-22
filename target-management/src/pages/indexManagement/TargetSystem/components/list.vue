<template>
  <div class="listBoxs">
    <div class="content">
      <div class="top">
        <p>
          <span class="icon"></span>当前选中:<span>
            {{ chooseData.name }}</span
          >
        </p>
        <p>
          指标级别:<span>
            {{ chooseData.level ? chooseData.level : "0" }}级指标</span
          >
        </p>
        <p>
          包含指标:<span> {{ total }}个指标项</span>
        </p>
        <!-- <div class="butBox">+ 新增指标项</div> -->
      </div>
      <div class="contentBox">
        <div class="listBox">
          <div class="listsBox" v-for="(item, index) in dataList" :key="index">
            <div class="titlesBox">
              <!-- <div class="titleIcon">{{ item.itemname.slice(0, 1) }}</div> -->
              <div class="titleText">{{ item.itemname }}</div>
            </div>
            <div class="infoBox">
              <div class="textBox">
                <p style="width: 345px;">
                  <span class="zbms"></span>
                  指标描述：{{ item.itemremark ? item.itemremark : "--" }}
                </p>
              </div>
              <div class="textBox">
                <p style="width: 345px;">
                  <span class="sjly"></span>
                  数据来源：{{ item.source ? item.source : "--" }}
                </p>
              </div>
              <div class="textBox">
                <p style="width: 345px;">
                  <span class="yyd"></span>
                  应用范围：
                  {{ item.rangetype ? item.rangetype : "--" }}
                </p>
              </div>
              <!-- <div class="textBox">
                <p style="width: 345px;">
                  <span class="sjzb"></span> 标签：{{
                    item.tag ? item.tag : "--"
                  }}
                </p>
              </div> -->
            </div>
            <div class="buttonBox">
              <div class="buttonCheck" @click="handleView(item)">查看</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pageBox">
        <a-pagination
          style="float: right;"
          :current="current"
          show-quick-jumper
          :pageSize="pageSize"
          :total="total"
          @change="onChange"
        />
      </div>
    </div>
    <div v-if="isShow">
      <dialog-one ref="dialogValue" :code="code"></dialog-one>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
export default {
  props: ["dataList", "total","chooseData","type"],
  components: {
    dialogOne
  },
  data() {
    return {
      isShow: false,
      code: "",
      current: 1,
      pageSize:9,
    };
  },
  watch:{
    chooseData(val){
      this.current=1
    }
  },
  mounted() {

    if(this.type==4){
      this.chooseData.name="评估指标体系"
    }else if(this.type==2){
      this.chooseData.name="监测指标体系"
    }
    if(this.type==3){
      this.chooseData.name="预警指标体系"
    }
  },
  methods: {
    handleView(e) {
      this.isShow = true;
      this.code = e.itemcode;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
      });
    },
    // onChangeSwitch(checked) {
    //   console.log(checked);
    // },
    onChange(pageNumber) {
      this.current=pageNumber
      this.$parent.query.page = pageNumber;
      this.$parent.meatData();
    },
    onShowSizeChange(current, pageSize) {
      this.$parent.query.page = current;
      this.$parent.query.size = pageSize;
      this.$parent.meatData();
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;
.listBoxs {
  width: 100%;
  height: 100%;
  .content {
    margin-left: 24 / @vw;
    height: 100%;
    .top {
      height: 54 / @vh;
      width: 100%;
      border-bottom: 1px solid #e8e8e8;
      line-height: 54 / @vh;
      p {
        margin: 0;
        float: left;
        color: #454954;
        font-size: 16 / @vh;
        margin-right: 30 / @vw;
        span {
          color: #1890ff;
        }
        .icon {
          padding: 0 2px;
          height: 11px;
          background-color: #3e6efa;
          margin-right: 12 / @vw;
        }
      }
      .butBox {
        color: #fff;
        width: 102 / @vw;
        height: 34 / @vh;
        line-height: 34 / @vh;
        text-align: center;
        border-radius: 6px;
        background-color: #397DC9;
        float: right;
        margin-top: 10 / @vh;
        cursor: pointer;
      }
    }
    .contentBox {
      width: 100%;
      height: 800 / @vh;
      overflow: auto;
      padding-right: 5px;
      .listBox {
        height: auto;
        padding-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 20px;
        grid-row-gap: 20px;
        overflow-y: auto;
        .listsBox {
          width: 380px;
          height: 288px;
          border: solid 1px #bbccff;
          position: relative;
          .titlesBox {
            width: 357px;
            height: 43px;
            background-color: #e3eaff;
            position: absolute;
            top: 11px;
            left: 11px;
            .titleIcon {
              width: 30 / @vh;
              height: 30 / @vh;
              border-radius: 50%;
              background-color: #8fbbe3;
              float: left;
              text-align: center;
              line-height: 30 / @vh;
              color: #fff;
              font-size: 14 / @vh;
            }
            .titleText {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 43px;
              padding-left: 24 / @vh;
              font-size: 20 / @vh;
              color: #162d7a;
            }
          }
          .infoBox {
            height: 108 / @vw;
            position: absolute;
            left: 10px;
            top: 70px;
            .textBox {
              height: 30 / @vh;
              line-height: 30 / @vh;
              display: flex;
              margin-top: 8px;
              p {
                margin: 0;
                color: #6f7583;
                font-size: 16 / @vh;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span {
                  display: inline-block;
                  width: 14 / @vh;
                  height: 14 / @vh;
                  margin-right: 10 / @vw;
                }
                .sjly {
                  background: url(../../../../assets/img/icon1-15.png) no-repeat;
                  background-size: 14 / @vh;
                }
                .sjzb {
                  background: url(../../../../assets/img/tixi.png) no-repeat;
                  background-size: 14 / @vh;
                }
                .zbms {
                  background: url(../../../../assets/img/miaoshu.png) no-repeat;
                  background-size: 14 / @vh;
                }
                .yyd {
                  background: url(../../../../assets/img/weijinrufanwei.png)
                    no-repeat;
                  background-size: 14 / @vh;
                }
              }
            }
          }
          .buttonBox {
            height: 32 / @vh;
            width: 66 / @vw;
            position: absolute;
            right: 20px;
            bottom: 14 / @vh;
            display: flex;
            justify-content: space-between;
            div {
              width: 66 / @vw;
              height: 32 / @vh;
              text-align: center;
              line-height: 32 / @vh;
              font-size: 14 / @vh;
              border-radius: 6 / @vh;
              box-sizing: border-box;
              cursor: pointer;
              &:nth-child(1) {
                background: #e5f3ff;
                border: solid 1px #91caff;
                color: #1890ff;
              }
            }
          }
        }
      }
    }
    .pageBox {
      width: 100%;
      height: 50 / @vh;
      margin-top: 20 / @vh;
      // padding-right: 30px;
    }
  }
}
</style>
