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
            <span>编辑地图文档</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="steps">
      <a-steps :current="current" labelPlacement="vertical">
        <a-step title="设置专题数据" />
        <a-step title="打印预览及输出" />
      </a-steps>
    </div>
    <div class="content">
      <div class="form-wrapper" v-show="current === 0">
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
                v-model="item.value"
                :placeholder="'请选择' + item.label + '图层'"
                @change="selectLayer(item.value, item.layers, item.id)"
              >
                <a-select-option
                  v-for="layer in item.layers"
                  :key="layer.key"
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
      <div class="map-wrapper" v-if="current === 1">
        <map-template
          ref="mapTep"
          :show-layers="showLayers"
          :userId="userId"
          :docId="docId"
          :mxdPath="mxdPath"
          :detailInfo="detailInfo"
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        layout: "horizontal",
        selects: [],
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 8 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 16 },
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
      detailInfo: null
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
    this.getVal()
  },

  methods: {
    // 根据路由赋值
    getVal() {
      let { userId, docId, mxdPath, detail } = this.$route.query;
      console.log(this.$route.query)
      this.userId = userId;
      this.docId = docId;
      this.mxdPath = mxdPath;
      this.detailInfo = detail;
      this.getMapDoc()
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
      console.log(this.current)
      // 分两种情况处理 current为0的时候路由跳转  >0的时候
      if (this.current ==0) this.$router.go(-1);
      else this.current--;
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
    selectLayer(a, b, c) {
      // // console.log(a, b, c);
      // let layer = b.filter((i) => i.id == a)[0];
      // this.showLayers.push(layer);
      // this.sendLayers[c] = a;
    },
    // 分离要展示的数据和发送的数据
    dealLayerData(data) {
      this.sendLayers = [];
      data.forEach((i) => {
        let layer = i.layers.filter((e) => e.id == i.value)[0];
        this.showLayers.push(layer);
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
            layerData: this.sendLayers.join(";"),
          };
          let res = await setMapDocData(params);
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
    }
    .box-wrapper {
      height: calc(100% - 50px);
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
        width: 600px;
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
