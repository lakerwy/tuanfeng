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
          <p>服务名称：{{ code.serviceName ? code.serviceName : "--" }}</p>
          <p>
            访问方式：{{
              code.method === 1
                ? "GET"
                : code.method === 2
                ? "POST"
                : "GET / POST"
            }}
          </p>
          <!-- <p>url真实地址：{{ code.url ? code.url : "--" }}</p> -->
          <p>
            服务地址：{{
              code.serviceUrlClassification1
                ? (urlApi+"/"+code.serviceUrlClassification1+"/"+code.serviceUrlClassification2)
                : "--"
            }}
          </p>
          <!-- <p>
            服务地址2级：{{
              code.serviceUrlClassification2
                ? code.serviceUrlClassification2
                : "--"
            }}
          </p> -->
          <p>是否需要授权：{{ code.isAuth === 0 ? "否" : "是" }}</p>
          <p>是否有服务：{{ code.isSelf === 0 ? "否" : "是" }}</p>
          <!-- <p>服务分组：{{ code.categoryCode ? code.categoryCode : "--" }}</p>
          <p>业务场景：{{ code.type ? code.type : "--" }}</p> -->
          <p>数据领域:：{{ code.dataDomainName ? code.dataDomainName : "--" }}</p>
          <p>来源单位：{{ code.resourceUnitName ? code.resourceUnitName : "--" }}</p>
          <p>源数据：{{ code.soureName ? code.soureName : "--" }}</p>
          <p>服务描述：{{ code.serviceDesc ? code.serviceDesc : "--" }}</p>
          <p>参数说明：{{ code.paramDesc ? code.paramDesc : "--" }}</p>
        </div>
        <div class="contenter-middle">
          <!-- <p>服务标准：{{ code.protocol ? code.protocol : "--" }}</p> -->
          <p>
            服务标准：{{
              code.protocol === 1
                ? "REST"
                : code.protocol === 2
                ? "SOAP"
                : "REST / SOAP"
            }}
          </p>
          
          <p>结果描述：{{ code.resultDesc ? code.resultDesc : "--" }}</p>
          <p>版本：{{ code.version ? code.version : "--" }}</p>
          <p>备注：{{ code.remark ? code.remark : "--" }}</p>
          <p>机构名称：{{ code.orgName ? code.orgName : "--" }}</p>
          <p>覆盖范围：{{ code.coverage ? code.coverage : "--" }}</p>
          <p>
            投影信息：{{ code.projectionInfo ? code.projectionInfo : "--" }}
          </p>
          <p>图层名称：{{ code.layerName ? code.layerName : "--" }}</p>
          <p>
            缩略图：
            <template v-if="thumbail"><img :src="thumbail" alt=""/></template>
            <template v-else>--</template>
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ["code"],
  data() {
    return {
      visible: false,
      thumbail: false,
      urlApi: window.globalUrl.API_PX
    };
  },
  mounted() {},
  methods: {
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
    width: 48%;
  }
}
</style>
