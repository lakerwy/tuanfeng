<!--  -->
<template>
  <div class="map-content">
    <!-- <div class="list">
      <div class="list_title">图层列表</div>
      <div class="list_tree">
        <a-tree checkable :tree-data="treeData" @check="onCheck"> </a-tree>
      </div>
    </div>
    <div class="list">
      <div class="list_title">已添加图层列表</div>
      <div class="list_tree">
        <a-tree :tree-data="treeData1" @select="onSelect"> </a-tree>
      </div>
    </div> -->
    <div id="map2" ref="showMap"></div>
    <div class="btns">
      <!-- <a-button type="primary" @click="showModal">查看地图属性</a-button> -->
      <a-button type="primary" @click="showModal">查看地图属性</a-button>
    </div>
    <a-modal
      title="保存地图"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="地图名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入地图名称" />
        </a-form-model-item>
        <a-form-model-item label="地图别名" prop="name2">
          <a-input v-model="form.name2" placeholder="请输入地图别名" />
        </a-form-model-item>
        <a-form-model-item label="地图描述" prop="detail">
          <a-input v-model="form.detail" placeholder="请输入地图描述" />
        </a-form-model-item>
        <a-form-model-item label="详细描述" prop="detail2">
          <a-input v-model="form.detail2" placeholder="请输入详细描述" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="查看地图属性"
      :visible="visible1"
      @ok="handleOk1"
      @cancel="handleCancel1"
      okText="确定"
      cancelText="取消"
    >
      <a-form-model
        :model="form1"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
      <a-form-model-item label="地图地址">
          {{form1.url}}
        </a-form-model-item>
        <a-form-model-item label="地图名称">
          {{form1.name}}
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { saveMapDoc, getMapDocInfo } from "@/api/makeMap.js";
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { getBaseLayers } from "@/pages/oneMap/function";
import { registerProj } from "@/mapjs/projections.js";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
export default {
  name: "",
  data() {
    return {
      treeData: [
        {
          title: "parent 1",
          selectable: false,
          key: "1",
        },
        {
          title: "parent 2",
          selectable: false,
          key: "2",
        },
        {
          title: "parent 3",
          selectable: false,
          key: "3",
        },
      ],
      treeData1: [
        {
          title: "parent 4",
          selectable: true,
          key: "4",
        },
      ],
      visible: false,
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {},
      rules: {
        name: [
          {
            required: true,
            whitespace: true,
            message: "请输入地图名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "地图名称限制1-20个字符",
            trigger: "blur",
          },
        ],
      },
      form1: {
        url: '',
        name: ''
      },
      visible1: false
    };
  },

  props: {
    showLayers: {
      type: Object,
      required: false,
    },
    userId: {
      type: String,
      required: false,
    },
    docId: {
      type: String,
      required: false,
    },
    mxdPath: {
      type: String,
      required: false,
    },
    detailInfo: {
      type: Object,
      required: false
    },
    layerIndex: {
      type: String,
      required: false,
    },
    dataType: {
      type: String,
      required: false,
    },
    // 查查界面的地图图层
    layer: {
      type: Object,
      required: false
    },
  },
  watch: {
    showLayers: {
      handler: function (val) {
        console.log('watch',val)
        if (val) {
          this.addLayer(val);
        }
      },
      immediate: true,
    },
    layer: {
      handler: function (val) {
        if (val) {
          this.map2.addLayer(val);
          this.map2.getView().fit(val.extent)
        }
      },
      immediate: true,
    },
    // visible(val, oldval) {
    //   // console.log(val);
    //   if (val) {
    //     this.getDocInfo();
    //   }
    // },
  },
  components: {},

  created() {},

  computed: {},

  mounted() {
    registerProj();
    this.loadMap();
  },

  methods: {
    // 加载地图
    async loadMap() {
      // 初始化地图
      this.map2 = initMap("map2", {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom,
      });
      // console.log(this.map2);
      // 获取底图
      this.changeLayer(1);
      if (this.detailInfo) {
        this.form.name = this.detailInfo.Name;
        this.form.name2 = this.detailInfo.Name2;
        this.form.detail = this.detailInfo.Detail;
        this.form.detail2 = this.detailInfo.Detail2;
      }
    },
    // 切换底图
    async changeLayer(e) {
      // remove
      removeBaseLayers(this.map2);
      // add
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map2, layers);
    },
    // 给地图循环添加图层
    async addLayer(arr) {
      if (!arr) {
        return;
      }
      const  MAPDOC_API = window.globalUrl.API_ONEMAP_STATISTICS
      let contWidth = 1920;
      let contHeight = 750;
      let tempType = arr.resourcetype==='vector'?1:0;
      let params = {
        type: 'geoserver',
        layers: arr.layerName || 'layerType',
        url: `${MAPDOC_API}/TFGTKJGH/WMS/GetMapOutImg?layerid=${arr.resourceid}&imgHeight=${contHeight}&imgWidth=${contWidth}&vector=${tempType}`
      }
      let layer = await createImageLayer(params);
      if (layer) {
        // 给点击的图层设置统一的标识字段
        layer.set("treeLayerId", arr.id);
        layer.set("layerType", "TreeCheckedLayer");
        this.map2.addLayer(layer);
        if (Array.isArray(params.extent)) {
          this.map2.getView().fit(params.extent);
        }
      }
      // arr.forEach(async (item) => {
      //   let { type, url, layers, extent } = item;
      //   let params = {
      //     type,
      //     url, //必参
      //     layers, // "show:0,1,2,3",
      //     extent,
      //   };
      //   let layer = await createImageLayer(params);
      //   if (layer) {
      //     this.map2.addLayer(layer);
      //     this.map2.getView().fit(params.extent);
      //   }
      // });
    },
    // 服务列表选择
    onCheck(a, b) {
      // console.log(a, b);
      let obj = b.node.dataRef;
      // 选择
      if (b.checked) {
        this.treeData1.push(obj);
      } else {
        // 取消选择
        this.treeData1.some((item, i) => {
          if (item.key == obj.key) {
            this.treeData1.splice(i, 1); //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
            return true;
          }
        });
      }
    },
    // 图层列表点击
    onSelect(a, b) {
      // console.log(a, b);
    },
    // 展示对话框
    showModal() {
      if (this.form1.name) {
        this.visible1 = true;
      }else {
        this.$message.warn('请保存后查看地图属性！')
      }
    },
    // 取消按钮
    handleOk1(e) {
      this.visible1 = false;
    },
    // 取消按钮
    handleCancel1(e) {
      this.visible1 = false;
    },
    // 获取地图文档详细信息
    // async getDocInfo() {
    //   let params = {
    //     userId: this.userId,
    //     docId: this.docId,
    //     mxdPath: this.mxdPath,
    //   };
    //   let res = await getMapDocInfo(params);
    //   // console.log(res);
    // },
    // 确定按钮-- 保存地图信息
    handleOk() {
      this.confirmLoading = true;
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let params = {
            userId: this.userId,
            docId: this.docId,
            mxdPath: this.mxdPath,
            layerIndex: this.layerIndex,
            dataType: this.dataType,
            isGHDataPackage: 0,
            ...this.form,
          };
          let res = await saveMapDoc(params);
          // console.log(res);
          let { data } = res;
          if (data.code == 200) {
            debugger
            this.$message.success(data.msg);
            this.form1.url = data.data.MapServerPath//: "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer"
            this.form1.name = data.data.Name
            this.visible = false;
            this.confirmLoading = false;
            this.form = {};
          } else {
            this.$message.error(data.msg);
            this.confirmLoading = false;
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 取消按钮
    handleCancel(e) {
      this.visible = false;
      this.form = {};
    },
  },
};
</script>
<style lang='less' scoped>
</style>
