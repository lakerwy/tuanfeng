<!--  -->
<template>
  <div class="theme-mapping">
    <div class="header">
      <div class="left">
        <!-- <div class="back" @click="back">返回上一级</div>
        <div class="line"></div>
        <div class="loca">一张图 > 专题制图</div> -->
        <a-breadcrumb class="back">
          <a-breadcrumb-item @click.native="back">
            <span>一张图</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <span>专题制图</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="right">共{{ total }}条</div>
    </div>
    <div class="top-wrapper">
      <div class="btn-wrapper">
        <a-button icon="plus" type="primary" @click="setNewMap"
          >新建地图</a-button
        >
      </div>
      <div class="search-wrapper">
        <div class="input-search">
          <a-input placeholder="请输入搜索内容" v-model="searchValue">
            <span slot="suffix" class="icon-search" @click="searchName"></span>
          </a-input>
        </div>
        <div class="view">
          <!-- <div
            :class="[downIcon ? 'down-icon' : '', 'icon']"
            @click="downIcon = !downIcon"
          >
            <div class="item-icon xl"></div>
          </div>
          <div class="down" v-show="downIcon">
            <div class="top">
              <div
                :class="[item.active ? 'active-item' : '', 'item']"
                v-for="item in drowItems"
                :key="item.value"
                @click="handleClick(item)"
              >
                <div class="check" v-show="item.active"></div>
                {{ item.label }}
              </div>
            </div>
          </div> -->
          <div
            :class="[activeIcon ? 'active-icon' : '', 'icon']"
            @click="clickList"
          >
            <div class="item-icon lbst"></div>
          </div>
          <div
            :class="[!activeIcon ? 'active-icon' : '', 'icon']"
            @click="clickBox"
          >
            <div class="item-icon wgst"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="table-wrapper" v-show="activeIcon">
        <a-table
          :scroll="{ y: 620 }"
          :columns="columns"
          :dataSource="tableData"
          :pagination="false"
          
          rowKey="Id"
        >
          <span slot="fileName" slot-scope="text, record">
            <div
              class="img-wrapper"
              :style="{ backgroundImage: `url(${record.url})` }"
            ></div>
            <div class="desc-wrapper">
              <div class="title">{{ record.name }}</div>
              <div class="desc">{{ record.desc }}</div>
            </div>
          </span>
          <span slot="action" slot-scope="text, record">
            <div class="btn-view btn" @click="viewMap(record)">查看</div>
            <div class="btn-view btn" @click="updateMap(record)">编辑</div>
            <div class="btn-del btn" @click="deleteMap(record)">删除</div>
          </span>
        </a-table>
        <a-pagination
          class="pagination"
          show-size-changer
          :page-size-options="pageSizeOptions"
          :current="current"
          :total="total"
          :pageSize="pageSize"
          @showSizeChange="onShowSizeChange"
          @change="onShowSizeChange"
          ><template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== '50'">{{ props.value }} 条/页</span>
            <span v-if="props.value === '50'">全部</span>
          </template></a-pagination
        >
      </div>
      <div class="box-content" v-show="!activeIcon">
        <div class="box-wrapper">
          <div class="box" v-for="item in tableData" :key="item.key">
            <div class="top">
              <div
                @click="viewMap(item)"
                class="img"
                :style="{ backgroundImage: `url(${item.url})` }"
              ></div>
              <div class="title" @click="viewMap(item)">{{ item.name }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
            <div class="bottom">
              <a-tooltip placement="top" title="编辑" trigger="hover">
                <div class="btn-view btn" @click="updateMap(item)"></div
              ></a-tooltip>
              <a-tooltip placement="top" title="删除" trigger="hover">
                <div class="btn-del btn" @click="deleteMap(item)"></div
              ></a-tooltip>
              <div class="btn time">{{ item.time }}</div>
            </div>
          </div>
        </div>
        <a-pagination
          class="pagination"
          show-size-changer
          :page-size-options="pageSizeOptions"
          :current="current"
          :total="total"
          :pageSize="pageSize"
          @showSizeChange="onShowSizeChange"
          @change="onShowSizeChange"
          ><template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== '50'">{{ props.value }} 条/页</span>
            <span v-if="props.value === '50'">全部</span>
          </template></a-pagination
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getZtztList, delZtztData } from "@/api/makeMap.js";
import { getUserInfo } from "@/api/oneMap.js";
import actions from "@/shared/actions";
import qs from "qs";
export default {
  name: "",
  data() {
    return {
      columns: [
        {
          title: "文件名称",
          align: "center",
          width: '800px',
          dataIndex: "name",
          key: "name",
          scopedSlots: { customRender: "fileName" },
          //width: '540px'
        },
        {
          title: "修改日期",
          dataIndex: "time",
          key: "time",
          align: "center",
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [
        // {
        //   key: "1",
        //   name: "John Brown",
        //   age: "2020年11月11日",
        //   desc: "London No. 2 Lake Park, London No. 2 Lake Park",
        //   title: "loser",
        //   url:
        //     "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        // },
      ],
      activeIcon: true,
      downIcon: false,
      clickItemKey: [1, 4],
      searchValue: '',
      drowItems: [
        { label: "文件名", value: 1, active: true },
        { label: "大小", value: 2, active: false },
        { label: "修改日期", value: 3, active: false },
        { label: "递增", value: 4, active: true },
        { label: "递减", value: 5, active: false },
      ],
      total: 0,
      pageSize: 6,
      current: 1,
      pageSizeOptions: ["6", "12", "18", "24"],
      userId: "111"
    };
  },

  props: {},

  components: {},

  created() {},

  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(
          //   `selectedRowKeys: ${selectedRowKeys}`,
          //   "selectedRows: ",
          //   selectedRows
          // );
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },

  mounted() {
    this.getUser();
  },

  methods: {
    // 获取地图文件列表
    async getDocList(a, b) {
      let params = {
        userId: this.userId,
        mapType: "Online",
        name: this.searchValue,
        pageNo: a,
        pageNum: b,
      };
      //let params = qs.stringify(obj)
      let res = await getZtztList(params);
      // console.log("axios", res);
      let { data, status } = res;
      if (data.code == 200 && data.data.length > 0) {
        data.data.forEach((i) => {
          //i.url = i.PicPath;
          i.url =
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
          i.name = i.Name;
          i.desc = i.Detail;
          i.time = i.UpdateTime;
        });
        this.total = data.total;
        this.tableData = data.data;
      }
    },
    // 获取当前用户信息
    async getUser() {
      let token = "";
      actions.onGlobalStateChange((state) => {
        const { accessToken } = state;
        //// console.log('123456789',accessToken)
        token = accessToken;
        // 未登录 - 返回主页
      }, true);
      let params = {
        code: "devOps",
        token,
      };
      let res = await getUserInfo(params);
      // console.log(555, res);
      if (res.success) {
        this.userId = res.data.userid;
        this.getDocList(this.current, this.pageSize);
      } else {
        this.userId = "111";
        this.getDocList(this.current, this.pageSize);
      }
    },
    // 页码改变或页数改变
    onShowSizeChange(a, b) {
      // console.log(a, b);
      this.pageSize = b;
      this.current = a;
      this.getDocList(a, b);
    },
    // 列表视图
    clickList() {
      this.activeIcon = true;
      this.pageSize = 6;
      this.current = 1;
      this.getDocList(this.current, this.pageSize);
    },
    // 网格视图
    clickBox() {
      this.activeIcon = false;
      this.pageSize = 12;
      this.current = 1;
      this.getDocList(this.current, this.pageSize);
    },
    // 查看地图模板
    viewMap(e) {
      // console.log(e)
      this.$router.push({
        path: "/oneMap/themeMapping/viewMap",
        query: {
          url: e.MapServerPath,
          name: e.Name
        }
      });
    },
    // 编辑地图模板
    updateMap(e) {
      this.$router.push({
        path:"/oneMap/themeMapping/updateMap",
        query: {
          userId: e.UserId,
          docId: e.Id,
          mxdPath: e.MxdPath,
          detail: e
        }
        });
    },
    // 删除地图模板
    deleteMap(e) {
      let that = this;
      this.$confirm({
        title: '确定要删除该条数据吗?',
        async onOk() {
          let params = {
            docId: e.Id,
            userId: e.UserId,
            name: "",
          };
          let res = await delZtztData(params);
          let {data} = res
          // console.log(res);
          if(data.code == 200) {
            that.$message.success("删除成功")
            that.getDocList(that.current, that.pageSize);
          }else {
            that.$message.success(data.msg)
          }
        },
        onCancel() {
          that.$message.info("已取消删除")
        },
      });
    },
    setNewMap() {
      this.$router.push("/oneMap/themeMapping/setNewMap");
    },
    back() {
      this.$router.push("/oneMap");
    },
    // 排序的点击
    handleClick(e) {
      if (e.active) {
        return;
      } else {
        if (e.value <= 3) {
          for (let i = 0; i < 3; i++) {
            this.drowItems[i].active = false;
          }
          e.active = true;
        } else {
          for (let i = 3; i < 5; i++) {
            this.drowItems[i].active = false;
          }
          e.active = true;
        }
      }
    },
    async searchName() {
      this.current = 1;
      let params = {
        userId: this.userId,
        mapType: "Online",
        name: this.searchValue,
        pageNo: this.current,
        pageNum: this.pageSize,
      };

      //let params = qs.stringify(obj)
      let res = await getZtztList(params);
      // console.log("axios", res);
      let { data, status } = res;
      if (data.code == 200 && data.data.length > 0) {
        data.data.forEach((i) => {
          //i.url = i.PicPath;
          i.url =
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
          i.name = i.Name;
          i.desc = i.Detail;
          i.time = i.UpdateTime;
        });
        this.total = data.total;
        this.tableData = data.data;
      }else {
        this.total = 0;
        this.tableData = [];
      }
    },
  },
};
</script>
<style lang='less' scoped>
.theme-mapping {
  width: 100%;
  height: calc(90vh);
  overflow-y: hidden;
  .header {
    height: 48px;
    border-bottom: 1px solid #e8e8e8;
    text-align: left;
    display: flex;
    justify-content: space-between;
    padding: 0px 24px;
    .left {
      text-align: left;
      display: flex;
      justify-content: flex-start;
    }
    .back {
      cursor: pointer;
      line-height: 48px;
    }
    .line {
      width: 1px;
      height: 14px;
      margin: 17px 8px;
      background: #cbcccf;
    }
    .loca {
      line-height: 48px;
      color: #888888;
    }
    .right {
      line-height: 48px;
      color: #888888;
    }
  }
  .top-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 13px;
    margin-bottom: 15px;
    padding: 0px 24px;
    .search-wrapper {
      display: flex;
      justify-content: flex-start;
      .input-search {
        position: relative;
      }
      /deep/.ant-input {
        width: 260px;
        height: 34px;
        border-radius: 18px;
        background: #f1f2f4;
      }
    }
    .icon-search {
      background: url("../../../assets/imgs/icon-search-big.png") no-repeat
        center;
      width: 18px;
      height: 16px;
      position: absolute;
      top: -8px;
      right: 0px;
    }
    .view {
      display: inline-block;
      //width: 150px;
      height: 34px;
      position: relative;
      .icon {
        display: inline-block;
        width: 34px;
        height: 34px;
        font-size: 20px;
        cursor: pointer;
      }
      .active-icon {
        background-color: #1890ff;
        color: #fff;
        .lbst {
          background: url("../../../assets/imgs/lbst-hover.png") no-repeat
            center;
        }
        .wgst {
          background: url("../../../assets/imgs/wgst-hover.png") no-repeat
            center;
        }
      }
      .icon:first-child {
        margin-right: 16px;
        margin-left: 24px;
      }
      .icon:first-child:hover {
        .xl {
          background: url("../../../assets/imgs/xl-hover.png") no-repeat center;
        }
      }
      .down-icon {
        .xl {
          background: url("../../../assets/imgs/xl-hover.png") no-repeat center;
        }
      }
      .down {
        position: absolute;
        top: 35px;
        right: 100px;
        width: 114px;
        height: 148px;
        border: 1px solid #e9e9e9;
        background: #fff;
        z-index: 3;
        .top {
          height: 84px;
          border-bottom: 1px solid #e9e9e9;
          padding-left: 40px;
          .item {
            cursor: pointer;
            position: relative;
            line-height: 28px;
            text-align: left;
            .check {
              background: url("../../../assets/imgs/Check.png") no-repeat center;
              height: 28px;
              width: 28px;
              position: absolute;
              top: 0;
              left: -25px;
            }
          }
          .active-item {
            color: #1890ff;
          }
        }
      }
      .icon:nth-child(2),
      .icon:last-child {
        border: 1px solid #eee;
        border-radius: 3px;
      }
      .item-icon {
        width: 32px;
        height: 32px;
      }
      .xl {
        background: url("../../../assets/imgs/xl.png") no-repeat center;
      }
      .lbst {
        background: url("../../../assets/imgs/lbst.png") no-repeat center;
      }
      .wgst {
        background: url("../../../assets/imgs/wgst.png") no-repeat center;
      }
    }
    .btn-wrapper {
      height: 34px;
      /deep/.ant-btn {
        height: 34px;
      }
    }
  }
  .content {
    margin-top: 16px;
    height: calc(100% - 50px);
    padding: 0 0 0 24px;
    .table-wrapper {
      max-height: calc(100% - 20px);
      overflow: auto;
      padding-right: 24px;
      .img-wrapper {
        display: inline-block;
        width: 119px;
        height: 68px;
        border: 1px solid #eee;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .desc-wrapper {
        display: inline-block;
        width: calc(100% - 130px);
        height: 68px;
        margin-left: 10px;
        position: relative;
        .title {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 16px;
          color: #424e67;
        }
        .desc {
          position: absolute;
          bottom: 0;
          left: 0;
          font-size: 12px;
          color: #a4a7ac;
          width: 300px;
          text-overflow: ellipsis;
          white-space: nowrap; /*强制不换行*/
          overflow: hidden; /* 溢出隐藏*/
        }
      }
      .btn {
        cursor: pointer;
        display: inline-block;
        width: 64px;
        height: 30px;
        text-align: center;
        padding-top: 3px;
        border-radius: 3px;
        margin-right: 10px;
      }
      .btn-view {
        border: 1px solid #bed3fb;
        background: #f2f7ff;
        color: #1890ff;
      }
      .btn-view:hover {
        border: 1px solid #1890ff;
        background: #1890ff;
        color: #fff;
      }
      .btn-del {
        border: 1px solid #ffd1d1;
        background: #fff2f2;
        color: #f25454;
      }
      .btn-del:hover {
        border: 1px solid #f25454;
        background: #f25454;
        color: #fff;
      }
    }
    .box-content {
      max-height: calc(100% - 20px);
      overflow: auto;
      padding: 10px 34px;
    }
    .box-wrapper {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .box {
        width: 280px;
        height: 285px;
        border: 1px solid #d9d9d9;
        margin: 0 24px 24px 0;
        .top {
          height: 229px;
          border-bottom: 1px dashed #e9e9e9;
          padding: 12px;
          .img {
            cursor: pointer;
            width: 100%;
            height: 146px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            margin-bottom: 14px;
          }
          .title {
            color: #424e67;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
          }
          .title:hover {
            color: #1890ff;
            text-decoration: underline;
          }
          .desc {
            text-align: left;
            font-size: 12px;
            color: #a4a7ac;
            text-overflow: ellipsis;
            white-space: nowrap; /*强制不换行*/
            overflow: hidden; /* 溢出隐藏*/
            line-height: 24px;
          }
        }
        .bottom {
          height: 55px;
          position: relative;
          .btn {
            cursor: pointer;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 18px;
          }
          .btn-del {
            background: url("../../../assets/imgs/del.png") no-repeat center;

            left: 44px;
          }
          .btn-del:hover {
            background: url("../../../assets/imgs/del-hover.png") no-repeat
              center;
          }
          .btn-view {
            background: url("../../../assets/imgs/icon-edit.png") no-repeat
              center;

            left: 13px;
          }
          .btn-view:hover {
            background: url("../../../assets/imgs/icon-edit-hover.png")
              no-repeat center;
          }
          .time {
            width: 50%;
            right: 13px;
            text-align: right;
            color: #a4a7ac;
          }
        }
      }
    }
  }
}
.pagination {
  margin: 20px;
  text-align: right;
}
</style>
