<template>
  <div class="listBoxs">
    <div class="content">
      <div class="top">
        <div>
          <span>请输入指标关键字：</span>
          <a-input style="width:300px" v-model="search" @change="onSearch" />
        </div>
        <div>
          <div class="butBox" @click="addItems">+ 新增指标项</div>
        </div>
        <p>
          <span class="icon"></span>当前选中:<span>
            {{ chooseData.name ? chooseData.name : "基础指标" }}</span
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
      </div>
      <div v-if="total !== 0">
        <div class="contentBox">
          <div class="listBox">
            <div class="listsBox" v-for="(item, key) in dataList" :key="key">
              <div class="titlesBox">
                <div class="titleText">{{ item.itemname }}</div>
              </div>
              <div class="infoBox">
                <div class="textBox">
                  <p style="width: 345px;">
                    <span class="zbms"></span>
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        指标描述：{{ item.itemremark ? item.itemremark : "--" }}
                      </template>
                      指标描述：{{ item.itemremark ? item.itemremark : "--" }}
                    </a-tooltip>
                    <!-- 指标描述：{{ item.itemremark ? item.itemremark : "--" }} -->
                  </p>
                </div>
                <div class="textBox">
                  <p style="width: 345px;">
                    <span class="sjly"></span>
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        数据来源：{{ item.source ? item.source : "--" }}
                      </template>
                      数据来源：{{ item.source ? item.source : "--" }}
                    </a-tooltip>
                  </p>
                </div>
                <div class="textBox">
                  <p style="width: 345px;">
                    <span class="yyd"></span>
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        应用范围：{{ item.rangetype }}
                      </template>
                      应用范围：{{ item.rangetype }}
                    </a-tooltip>
                  </p>
                </div>
                <div class="textBox">
                  <p style="width: 345px;">
                    <span class="yyd"></span>
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        上级指标：<span v-if="item.useType">{{
                          item.useType[0] == null ? "无" : item.useType[0]
                        }}</span>
                      </template>
                      上级指标：<span v-if="item.useType">{{
                        item.useType[0] == null ? "无" : item.useType[0]
                      }}</span>
                    </a-tooltip>
                  </p>
                </div>
                <div class="textBox">
                  <p style="width: 345px;">
                    <span class="yyd"></span>
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        所关联体系树：
                        <template v-if="item.useType">
                          <span style="width:30px" v-if="item.useType[0] != 0"
                            >基础</span
                          >
                          <span style="width:30px" v-if="item.useType[1] != 0"
                            >监测</span
                          >
                          <span style="width:30px" v-if="item.useType[2] != 0"
                            >预警</span
                          >
                          <span style="width:30px" v-if="item.useType[3] != 0"
                            >评估</span
                          >
                        </template>
                        <template v-else>基础</template>
                      </template>
                      所关联体系树：
                      <template v-if="item.useType">
                        <span style="width:30px" v-if="item.useType[0] != 0"
                          >基础</span
                        >
                        <span style="width:30px" v-if="item.useType[1] != 0"
                          >监测</span
                        >
                        <span style="width:30px" v-if="item.useType[2] != 0"
                          >预警</span
                        >
                        <span style="width:30px" v-if="item.useType[3] != 0"
                          >评估</span
                        >
                      </template>
                      <template v-else>基础</template>
                    </a-tooltip>
                  </p>
                </div>
              </div>
              <div class="buttonBox">
                <div @click="handleUpdTree(item)">更新关联体系树</div>
                <div class="buttonCheck" @click="handleView(item)">查看</div>
                <div class="buttonEdit" @click="handleEdit(item)">编辑</div>
                <a-popconfirm
                  title="确认需要删除吗?"
                  @confirm="() => handleDel(item)"
                >
                  <div class="buttonDel">删除</div>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
        <div class="pageBox">
          <a-pagination
            style="float: right;"
            show-quick-jumper
            @showSizeChange="onShowSizeChange"
            :default-current="page"
            v-model="current"
            :pageSize="pageSize"
            :total="total"
            @change="onChange"
          />
        </div>
      </div>

      <div class="empty" v-else><a-empty /></div>
    </div>
    <div>
      <dialog-zero
        v-if="isShowUpd"
        ref="dialogTree"
        :dataList="dataList"
        :rows="rows"
      ></dialog-zero>
    </div>
    <div v-if="isShow">
      <dialog-one ref="dialogValue" :code="code"></dialog-one>
    </div>
    <div>
      <dialog-two ref="dialogEdit" :form="form"></dialog-two>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
import dialogTwo from "./modalEdit";
import dialogZero from "./modalUpd";
import { getDelLists } from "@/api/management";
export default {
  inject: ["reload"],
  components: {
    dialogOne,
    dialogTwo,
    dialogZero
  },
  props: ["dataList", "total", "page", "chooseData", "value1"],
  data() {
    return {
      chooseOne: "",
      isShow: false,
      isShowUpd: false,
      code: "",
      form: {},
      rows: "",
      search: "",
      current: 1,
      pageSize: 9,
      id:0
    };
  },
  watch:{
    dataList(newValue,oldValue){
      // console.log(newValue);
      newValue.forEach(item=>{
        if(item.useType){
          if( item.useType[0]=='4' || item.useType[0]=='3' || item.useType[0]=='2'|| item.useType[0]=='0'){
             item.useType[0]="基础指标"
          }
        }else{
          item.useType=["基础指标",0,0,0]
        }
      })
    }
  },
  mounted() {
  },

  methods: {
    onSearch(e) {
      // if (e.target.value != "") {
      this.search = e.target.value;
      this.chooseData.name = "";
      this.chooseData.level = "";
      this.$parent.rightQuery.name = this.search;
      this.$parent.rightQuery.page = 1;
      this.current = 1;
      this.$parent.rightQuery.size = 9;
      this.$parent.getRightListData();
      this.$parent.getReset();
    },
    meatData() {
      this.$parent.query.id=this.query
      this.$parent.meatData();
    },
    // 更新关联体系树
    handleUpdTree(e) {
      // console.log(e)
      this.isShowUpd = true;
        this.rows = e;
      this.$nextTick(() => {
        this.$refs.dialogTree.visible = true;
      });
    },
    //   点击编辑按钮
    handleEdit(e) {
      // console.log(e)
      if(e.isbreak==1){
        e.isbreak = "是"
      }else{
        e.isbreak = "否"
      }
      this.form = e;
      if (this.form.rangetype === "其它") {
        this.$refs.dialogEdit.isShow = true;
      } else {
        this.$refs.dialogEdit.isShow = false;
      }
      this.$nextTick(() => {
        this.$refs.dialogEdit.visible = true;
      });
    },
    //   点击查看按钮
    handleView(e) {
      // console.log(e)
      this.isShow = true;
      this.code = e.itemcode;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
      });
    },
    // 点击删除按钮
    async handleDel(e) {
      let params = e.id;
      let res = await getDelLists(params);
      if (res.code === 200) {
        // this.$nextTick(()=>{
        //   this.$parent.meatData();
        // })
        // this.$router.go(0)
        this.reload();
        this.$notification.open({
          message: "数据删除成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$notification.open({
          message: "数据删除失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },
    onChange(pageNumber) {
      if (this.search !== "") {
        this.$parent.rightQuery.page = pageNumber;
        this.$parent.getRightListData();
      } else {
        this.$parent.query.page = pageNumber;
        this.$parent.meatData();
      }
    },
    onShowSizeChange(current, pageSize) {
      if (this.search !== "") {
        this.$parent.rightQuery.page = current;
        this.$parent.rightQuery.size = pageSize;
        this.$parent.getRightListData();
      } else {
        this.$parent.query.page = current;
        this.$parent.query.size = pageSize;
        this.$parent.meatData();
      }
    },
    // 点击新增指标项按钮
    addItems() {
      this.$parent.toAdd();
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
      width: 100%;
      line-height: 54 / @vh;
      padding-top: 10px;
      position: relative;
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
        width: 132 / @vw;
        height: 34 / @vh;
        line-height: 34 / @vh;
        text-align: center;
        border-radius: 6px;
        background-color: #397DC9;
        position: absolute;
        right: 10px;
        top: 20px;
        cursor: pointer;
      }
    }
    .contentBox {
      width: 100%;
      height: 700 / @vh;
      overflow: auto;
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
            top: 60px;
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
                  background: url(../../../../../assets/img/icon1-15.png)
                    no-repeat;
                  background-size: 14 / @vh;
                }
                .sjzb {
                  background: url(../../../../../assets/img/zhibiao.png)
                    no-repeat;
                  background-size: 14 / @vh;
                }
                .zbms {
                  background: url(../../../../../assets/img/miaoshu.png)
                    no-repeat;
                  background-size: 14 / @vh;
                }
                .yyd {
                  background: url(../../../../../assets/img/yingyong.png)
                    no-repeat;
                  background-size: 14 / @vh;
                }
              }
            }
          }
          .buttonBox {
            height: 32 / @vh;
            width: 360 / @vw;
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
                width: 126 / @vw;
                background: #e5f3ff;
                border: solid 1px #91caff;
                color: #0067c7;
              }
              &:nth-child(2) {
                background: #e5f3ff;
                border: solid 1px #91caff;
                color: #1890ff;
              }
              &:nth-child(3) {
                background: #e9fffe;
                border: solid 1px #7eede7;
                color: #01beb3;
              }
              &:nth-child(4) {
                background: #ffeded;
                border: solid 1px #ffb8b8;
                color: #fc5a5a;
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
    }
    .empty {
      margin-top: 100px;
    }
  }
}
</style>
