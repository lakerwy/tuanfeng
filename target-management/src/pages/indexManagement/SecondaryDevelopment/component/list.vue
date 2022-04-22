<template>
  <div class="listBoxs">
    <div class="content">
      <div class="top">
        <div>
          <span>请输入关键字：</span>
          <a-input-search style="width:300px" @change="onSearch" />
        </div>
        <div class="butBox">
          <a-button type="primary" icon="plus" @click="handleAdd" style="background: #397DC9">
            添加服务
          </a-button>
        </div>
      </div>
      <div class="contentBox">
        <div class="listBox" v-if="dataList">
          <div class="listsBox" v-for="(item, key) in dataList" :key="key">
            <div class="img-api">
              <img src="../../../../assets/img/img-api.png" alt="" />
            </div>

            <div class="infoBox">
              <div class="title-box">{{ item.serviceName }}</div>
              <div class="textBox">
                <p style="width: 200px;">
                  <span class="zbms"></span>
                  来源单位：{{
                    item.resourceUnitName ? item.resourceUnitName : "--"
                  }}
                </p>
              </div>
              <div class="textBox">
                <p style="width: 200px;">
                  <span class="sjly"></span>
                  更新时间：{{
                    item.updateDate ? item.updateDate.slice(0, 10) : "--"
                  }}
                </p>
              </div>
              <div class="textBox">
                <p style="width: 200px;">
                  <span class="yyd"></span>
                  访问方式：{{
                    item.method === 1
                      ? "GET"
                      : item.method === 2
                      ? "POST"
                      : "GET / POST"
                  }}
                </p>
              </div>
            </div>
            <div class="buttonBox">
              <div class="buttonCheck" @click="handleView(item)">查看</div>
            </div>
            <div class="buttonDelBox">
              <a-popconfirm
                title="是否删除关联的服务?"
                ok-text="是"
                cancel-text="否"
                @confirm="confirm(item)"
              >
                <a-button type="link" icon="close" />
              </a-popconfirm>
            </div>
          </div>
        </div>
        <div v-else>
          <a-empty />
        </div>
      </div>
      <div class="pageBox">
        <a-pagination
          style="float: right;"
          @showSizeChange="onShowSizeChange"
          :default-current="page"
          :pageSize="pageSize"
          :total="total"
          @change="onChange"
        />
      </div>
    </div>

    <div v-if="isShow">
      <dialog-one ref="dialogValue" :code="code"></dialog-one>
    </div>
    <div v-if="isShowAdd">
      <dialog-add ref="dialogValueAdd" :queryId="queryId"></dialog-add>
    </div>
  </div>
</template>

<script>
import { getDeleteLists } from "@/api/px-api";
import dialogOne from "./modal";
import dialogAdd from "./modalAdd";
export default {
  components: {
    dialogOne,
    dialogAdd
  },
  props: ["dataList", "queryId", "resultList", "total", "page", "chooseData"],
  data() {
    return {
      chooseOne: "",
      isShow: false,
      isShowAdd: false,
      code: "",
      form: {},
      rows: "",
      pageSize: 12
    };
  },
  mounted() {},
  methods: {
    // 删除服务
    confirm(e) {
      this.getDelete(e);
    },
    async getDelete(val) {
      let params = val.id;
      let res = await getDeleteLists(params);
      if(res==true){
        this.$message.success('成功删除该服务！');
        this.$parent.getDataList()
      }else{
        this.$message.error('删除服务失败！');
      }
    },
    // 添加服务
    handleAdd() {
      this.isShowAdd = true;
      this.$nextTick(() => {
        this.$refs.dialogValueAdd.visible = true;
      });
    },
    onSearch(e) {
      // console.log(e.target.value);
      this.$parent.searchText = e.target.value;
    },
    meatData() {
      this.$parent.meatData();
    },

    //   点击查看按钮
    handleView(e) {
      this.isShow = true;
      this.code = e;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
      });
    },

    onChange(pageNumber) {
      this.$parent.query.page = pageNumber;
      this.$parent.getDataList();
      console.log(pageNumber);
    },
    onShowSizeChange(current, pageSize) {
      this.$parent.query.page = current;
      this.$parent.query.size = pageSize;
      this.$parent.getDataList();
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
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
      }
    }
    .contentBox {
      overflow: auto;
      .listBox {
        // width: 100%;
        height: auto;
        padding-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 20px;
        grid-row-gap: 20px;
        overflow-y: auto;
        .listsBox {
          height: 176px;
          //border: solid 1px #bbccff;
          background: #DDE4EB;
          position: relative;
          .img-api {
            position: absolute;
            left: 30px;
            top: 17px;
          }
          .infoBox {
            height: 108 / @vw;
            // width: 450 / @vw;
            position: absolute;
            left: 150px;
            top: 22px;
            .title-box {
              font-size: 18px;
              color: #162d7a;
              font-weight: 600;
            }
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
                  margin-right: 5 / @vw;
                }
                .sjly {
                  background: url(../../../../assets/img/time-api.png) no-repeat;
                  background-size: 14 / @vh;
                }
                .zbms {
                  background: url(../../../../assets/img/from.png) no-repeat;
                  background-size: 14 / @vh;
                }
                .yyd {
                  background: url(../../../../assets/img/redu.png) no-repeat;
                  background-size: 14 / @vh;
                }
              }
            }
          }
          .buttonBox {
            height: 32 / @vh;
            width: 66 / @vw;
            position: absolute;
            left: 40px;
            bottom: 24px;
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
                background: #397DC9;
                border: solid 1px #397DC9;
                color: #fff;
              }
            }
          }
          .buttonDelBox {
            position: absolute;
            right: 0px;
          }
        }
      }
      .noneText {
        width: 100%;
        height: 200px;
        text-align: center;
        line-height: 200px;
      }
    }
    .pageBox {
      width: 100%;
      height: 54 / @vh;
      margin-top: 20 / @vh;
    }
  }
}
</style>
