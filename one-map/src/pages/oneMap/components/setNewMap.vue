<!--  -->
<template>
  <div class="set-new-map">
    <div class="header">
      <div class="back">
        <a-breadcrumb>
          <a-breadcrumb-item @click.native="backOne">
            <span>一张图</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item @click.native="backTwo">
            <span>专题制图</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item href="">
            <span>新建地图</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="steps">
      <a-steps :current="current" labelPlacement="vertical">
        <a-step title="选择专题模板" />
        <a-step title="设置专题数据" />
        <a-step title="打印预览及输出" />
      </a-steps>
    </div>
    <div class="content">
      <div class="box-content" v-show="current === 0">
        <div class="box-wrapper">
          <div class="box" v-for="item in boxs" :key="item.id">
            <div class="box-title">{{ item.boxTitle }}</div>
            <div
              :class="['box-container', item.clickStyle ? 'select-box' : '']"
              @click="selectTemplate(item, $event)"
            >
              <div
                class="map-img"
                :style="{ backgroundImage: `url(${item.mapImg})` }"
              ></div>
              <div class="map-img-check" v-show="item.clickStyle"></div>
              <div class="map-img-mask" v-show="!item.clickStyle"></div>
              <div class="map-title">{{ item.mapTitle }}</div>
              <div class="map-desc">
                {{ item.mapDesc }}
              </div>
            </div>
          </div>
        </div>
        <a-pagination
          size="small"
          class="pagination"
          :page-size-options="pageSizeOptions"
          :current="page"
          :total="total"
          :pageSize="pageSize"
          @showSizeChange="onShowSizeChange"
          @change="onShowSizeChange"
          ><template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== '50'">{{ props.value }} 条/页</span>
            <span v-if="props.value === '50'">全部</span>
          </template></a-pagination
        >
        <div class="bottom-btn">
          <a-button type="primary" @click="createTemplate">下一步</a-button>
        </div>
      </div>
      <div class="form-wrapper" v-show="current === 1">
        <div class="form-content">
          <a-form-model
            :layout="form.layout"
            ref="ruleForm"
            :model="form"
            v-bind="formItemLayoutWithOutLabel"
          >
            <a-form-model-item
              v-for="(item, index) in form.selects"
              :key="item.value"
              v-bind="formItemLayout"
              :label="item.label"
              :prop="'selects.' + index + '.value'"
              :rules="{
                required: true,
                message: `请选择${item.label}图层`,
                trigger: 'blur',
              }"
            >
              <a-select
                allowClear
                labelInValue
                v-model="item.value"
                :placeholder="'请选择' + item.label + '图层'"
                @change="selectLayer(item.value)"
              >
                <a-select-option
                  v-for="(layer,index) in item.layers"
                  :key="index"
                  :value="layer.id"
                >
                  {{ layer.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="bottom-btn">
          <a-button type="primary" @click="prev">上一步</a-button>
          <a-button type="primary" @click="onSubmit">下一步</a-button>
        </div>
      </div>
      <div class="map-wrapper" v-if="current === 2">
        <map-template
          ref="mapTep"
          :show-layers="showLayers"
          :userId="userId"
          :docId="docId"
          :mxdPath="mxdPath"
          :layerIndex="layerIndex"
          :dataType="dataType"
        ></map-template>
        <div class="bottom-btn">
          <a-button type="primary" @click="prev">上一步</a-button>
          <a-button type="primary" @click="save">保存</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getZtztList,
  createNewMap,
  getMapDocInfo,
  setMapDocData,
} from "@/api/makeMap.js";
import { getUserInfo } from "@/api/oneMap.js";
import actions from "@/shared/actions";
import MapTemplate from "@/components/mapTemplate";
import { TreeData1 } from "@/components/tree/mockTreeData";
export default {
  name: "",
  data() {
    return {
      current: 0,
      labelCol: { span: 12 },
      wrapperCol: { span: 14 },
      form: {
        layout: "horizontal",
        selects: [],
      },
      selectLayers: null,
      formItemLayout: {
        labelCol: {
          xs: { span: 8 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 18 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      showLayers: [], // 选择之后的图层,第三步展示
      sendLayers: [], // 选择之后的图层,第三步传递给后台
      boxsData: [
        // {
        //   id: 0,
        //   boxTitle: "土地利用现状图",
        //   mapImg:
        //     "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        //   mapTitle: "土地利用现状图",
        //   hoverShow: true,
        //   mapDesc:
        //     "土地利用现状图是土地利用现状图是土地利用现状图是土地利用现状图是土地利用现状图是",
        // },
      ],
      boxs: [],
      map2: null,
      total: 0,
      pageSize: 8,
      page: 1,
      pageSizeOptions: ["8", "16", "24"],
      pagination: {
        page: 1, // 当前页
        size: 8, // 每页条数
        total: 0, // 总条数
        pages: 0, // 总页数
      },
      tempId: "", // 模板id
      userId: "111", // 当前用户id
      docId: "", // 创建的地图文档id
      mxdPath: "", // 文档路径
      layerIndex: '',
      dataType: '',
    };
  },
  watch: {
    // current(val) {
    //   if (val == 2) {
    //     this.loadMap();
    //   }
    // },
  },
  props: {},

  components: { MapTemplate },

  created() {},

  computed: {},

  mounted() {
    this.getUser();
    this.getDocList(this.page, this.pageSize);
  },

  methods: {
    // 获取地图模板列表
    async getDocList(a, b) {
      let params = {
        pageNo: a,
        pageNum: b,
        mapType: "Template",
      };
      let res = await getZtztList(params);
      let { data } = res;
      if (data.code == 200 && data.data.length > 0) {
        data.data.forEach((i) => {
          //i.url = i.PicPath;
          i.mapImg =
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
          i.boxTitle = i.Name;
          i.mapTitle = i.Name2;
          i.mapDesc = i.Detail;
          i.time = i.UpdateTime;
          i.hoverShow = true;
          i.clickStyle = false;
        });
        this.pagination.pages = Math.ceil(data.total / this.pagination.size);
        this.total = data.total;
        this.boxs = data.data;
      }
    },
    // 页码改变或页数改变
    onShowSizeChange(a, b) {
      // console.log(a, b);
      this.pageSize = b;
      this.page = a;
      this.getDocList(a, b);
    },
    // 选择模板
    selectTemplate(i, e) {
      var selectedBedDom = e; //dom元素
      // console.log(222, i);
      this.boxs.forEach((item) => {
        item.clickStyle = false;
      });
      i.clickStyle = true;
      this.tempId = i.Id;
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
      } else {
        this.userId = "111";
      }
    },
    // 创建新的地图
    async createTemplate() {
      if (!this.tempId) {
        this.$message.error("请选择模板");
        return;
      }
      let params = {
        userid: this.userId,
        docid: this.tempId,
      };
      // console.log(params);
      let res = await createNewMap(params);
      // console.log(res);
      let { data } = res;
      if (data.code == 200) {
        this.docId = data.data.Id;
        this.mxdPath = data.data.MxdPath;
        this.getMapDoc();
      }
      this.current++;
    },
    // 获取文档详细信息
    async getMapDoc() {
      let params = {
        userId: this.userId,
        docId: this.docId,
        mxdPath: this.mxdPath,
      };
      let doc = await getMapDocInfo(params);
      // console.log(doc);
      let { data } = doc;
      if (data.code == 200) {
        let arr = [];
        let temparr = []
        data.data.layers.forEach((i) => {
          arr.push({
            label: i.name,
            id: i.id,
            value: undefined,
            layers: JSON.parse(sessionStorage.selectNodes) || [],
          });
          temparr.push(i.id)
        });
        // console.log(arr, this.sendLayers);
        this.layerIndex = temparr;
        this.form.selects = arr;
      }
    },
    // 下一步
    next() {
      this.current++;
    },
    // 上一步
    prev() {
      this.current--;
    },

    // 下一页
    nextPage() {
      if (this.pagination.pages == this.pagination.page) {
        return;
      } else {
        // console.log(this.pagination);
        this.pagination.page++;
        this.getDocList();
      }
    },
    // 上一页
    prevPage() {
      if (this.pagination.page == 1) {
        return;
      } else {
        this.pagination.page--;
        // console.log(this.pagination);
        this.getDocList();
      }
    },
    // 选择图层
    selectLayer(a) {
      if (JSON.parse(sessionStorage.selectNodes)) {
        let temp = JSON.parse(sessionStorage.selectNodes).filter(item => item.id == a.key);
        this.showLayers = temp[0]
        this.dataType = this.showLayers.resourcetype === 'vector'?0:1;
      }
      let temp = '';
      this.layerIndex.forEach(item => {
        temp += `${item},${this.showLayers.resourceid};`
      })
      this.layerIndex = temp;
      // this.showLayers = a;
      // let layer = b.filter((i) => i.id == a)[0];
      // this.showLayers.push(layer);
      // this.sendLayers[c] = a;
    },
    // 分离要展示的数据和发送的数据
    dealLayerData(data) {
      this.sendLayers = [];
      // this.showLayers = data[0].value
      data.forEach((i) => {
        // let layer = i.layers.filter((e) => e.id == i.value)[0];
        // console.log(layer)
        // this.showLayers.push(layer);
        let temp = `${i.id},${i.value.key}`
        this.sendLayers.push(temp);
      });
    },
    // 提交图层信息
    onSubmit() {
      // console.log(this.form);
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dealLayerData(this.form.selects);
          let params = {
            userId: this.userId,
            docId: this.docId,
            mxdPath: this.mxdPath,
            dataType: 0,
            isGHDataPackage: 0,
            layerData: this.sendLayers.join(";"),
          };
          let res = await setMapDocData(params);
          // console.log(res)
          if (res.status !=200) {
            this.$message.info("保存相关地图数据失败，请重试！");
            return;
          }
          // console.log(res);
          this.current++;
        } else {
          return false;
        }
      });
    },
    // 保存地图
    save() {
      this.$refs.mapTep.visible = true;
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    backOne() {
      this.$router.push("/oneMap");
    },
    backTwo() {
      this.$router.push("/oneMap/themeMapping");
    },
  },
};
</script>
<style lang='less' scoped>
.set-new-map {
  width: 100%;
  height: calc(85vh);
  background: #ffffff;
  padding: 6px 20px 0 20px;
  overflow-y: hidden;
  .header {
    height: 30px;
    // background: #eee;
    .back {
      text-align: left;
      cursor: pointer;
      margin-left: 30px;
      /deep/.ant-breadcrumb-link:hover {
        color: #1890ff;
      }
    }
  }
  .steps {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #eee;
    padding: 0 10%;
    /deep/.ant-steps-item-icon {
      position: absolute;
      top: 0;
      left: 0;
    }
    /deep/.ant-steps-item-content {
      margin-top: 40px;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 80px);
    .box-content {
      height: calc(100% - 80px);
      margin-top: 20px;
      position: relative;

      padding: 20px 0;
    }
    .box-wrapper {
      height: calc(100% - 100px);
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0 180px;
      position: relative;
      .left-btn {
        position: absolute;
        bottom: 50%;
        left: 50px;
      }
      .right-btn {
        position: absolute;
        bottom: 50%;
        right: 50px;
      }
      .anticon {
        font-size: 50px;
        color: rgb(233, 233, 233);
        cursor: pointer;
      }
      .disabled-btn {
        .anticon:hover {
          cursor: not-allowed;
          transform: scale(1);
          color: rgb(233, 233, 233);
        }
      }
      .anticon:hover {
        transform: scale(1.2);
        color: #1890ff;
      }
      .box {
        width: 25%;
        height: 300px;
        background: #fff;
        // margin-right: 100px;
        .box-title {
          width: 230px;
          font-size: 16px;
          font-weight: 800;
          text-align: left;
          height: 40px;
          line-height: 40px;
          margin: 0 auto;
        }
        .box-container {
          cursor: pointer;
          margin: 0 auto;
          width: 230px;
          height: 260px;
          box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
          border-radius: 3px;
          position: relative;
          .map-img {
            width: 100%;
            height: 150px;
            // background: url("https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg")
            //   no-repeat center;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            margin-bottom: 10px;
          }
          .map-img-mask {
            width: 100%;
            height: 150px;
            background: rgba(0, 0, 0, 0.4);
            position: absolute;
            z-index: 5;
            top: 0;
            left: 0;
          }
          .map-img-check {
            width: 24px;
            height: 24px;
            background: url("../../../assets/imgs/checkIn.png") no-repeat center;
            position: absolute;
            z-index: 5;
            top: 2px;
            right: 2px;
          }
          .map-title {
            font-size: 14px;
            line-height: 28px;
          }
          .map-desc {
            font-size: 12px;
            text-align: left;
            color: darkgrey;
            line-height: 20px;
            padding: 0 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
        .box-container:hover {
          transform: scale(1.01);
        }
        .select-box {
          transform: scale(1.01);
          transform: scale(1.01);
          border: 2px solid #1890ff;
        }
      }
    }
    .form-wrapper {
      height: calc(100% - 80px);
      .form-content {
        padding-top: 50px;
        text-align: left;
        width: 700px;
        height: 100%;
        margin: 0 auto;
      }
    }
    .map-wrapper {
      height: calc(100% - 80px);
      /deep/.map-content {
        display: flex;
        justify-content: flex-start;
        height: 100%;
        padding-top: 10px;
        text-align: left;
        margin: 0 auto;
        position: relative;
      }
      /deep/.list {
        width: 200px;
        margin-right: 10px;
        border: 1px solid #eee;
        .list_title {
          height: 50px;
          padding-left: 20px;
          font-size: 16px;
          line-height: 50px;
          border-bottom: 1px solid #eee;
        }
      }
      /deep/#map2 {
        width: calc(100% - 0px);
        height: 100%;
        background: #eee;
      }
      /deep/.btns {
        position: absolute;
        top: 50px;
        right: 50px;
        .ant-btn:first-child {
          margin-right: 20px;
        }
      }
    }
    .bottom-btn {
      //height: 40px;
      .ant-btn {
        margin-top: 10px;
      }
      .ant-btn:first-child {
        margin-right: 20px;
      }
    }
  }
}
.pagination {
  //margin-top: 20px;
  margin-right: 100px;
  text-align: right;
}
</style>
