<!--
 * @Author: 任继民
 * @Date: 2021-01-28 14:17:14
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-28 14:24:02
 * @Description:服务器
-->
<template>
  <section>
    <Breadcrumb />
    <a-card :loading="loading" class="contentCard inspection">
      <div class="div-flex">
        <div class="content">
          <div class="title">CPU</div>
          <div class="flex">
            <div class="flex-1">属性</div>
            <div class="flex-1">值</div>
          </div>
          <div class="flex">
            <div class="flex-1">核心数</div>
            <div class="flex-1">{{cpuInfo.cpuNum}}个</div>
          </div>
          <div class="flex">
            <div class="flex-1">用户使用率</div>
            <div class="flex-1">{{cpuInfo.used}}%</div>
          </div>
          <div class="flex">
            <div class="flex-1">系统使用率</div>
            <div class="flex-1">{{cpuInfo.sys}}%</div>
          </div>
          <div class="flex">
            <div class="flex-1">当前空闲率</div>
            <div class="flex-1">{{cpuInfo.free}}%</div>
          </div>
        </div>
        <div class="content">
          <div class="title">内存</div>
          <div class="flex">
            <div class="flex-1">属性</div>
            <div class="flex-1">内存</div>
            <div class="flex-1">JVM</div>
          </div>
          <div class="flex">
            <div class="flex-1">总内存</div>
            <div class="flex-1">{{memInfo.total}}G</div>
            <div class="flex-1">{{jvmInfo.total}}M</div>
          </div>
          <div class="flex">
            <div class="flex-1">已用内存</div>
            <div class="flex-1">{{memInfo.used}}G</div>
            <div class="flex-1">{{jvmInfo.used}}M</div>
          </div>
          <div class="flex">
            <div class="flex-1">剩余内存</div>
            <div class="flex-1">{{memInfo.free}}G</div>
            <div class="flex-1">{{jvmInfo.free}}M</div>
          </div>
          <div class="flex">
            <div class="flex-1">使用率</div>
            <div class="flex-1">{{memInfo.usage}}%</div>
            <div class="flex-1">{{jvmInfo.usage}}%</div>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="title">服务器信息</div>
        <div class="flex">
          <div class="flex-1">服务名称</div>
          <div class="flex-2">{{sysInfo.computerName}}</div>
          <div class="flex-1">操作系统</div>
          <div class="flex-1">{{sysInfo.osName}}</div>
        </div>
        <div class="flex">
          <div class="flex-1">服务器IP</div>
          <div class="flex-2">{{sysInfo.computerIp}}</div>
          <div class="flex-1">系统构架</div>
          <div class="flex-1">{{sysInfo.osArch}}</div>
        </div>
      </div>
      <div class="info">
        <div class="title">Java虚拟机信息</div>
        <div class="flex">
          <div class="flex-1">Java名称</div>
          <div class="flex-2">{{jvmInfo.name}}</div>
          <div class="flex-1">Java版本</div>
          <div class="flex-1">{{jvmInfo.version}}</div>
        </div>
        <div class="flex">
          <div class="flex-1">启动时间</div>
          <div class="flex-2">{{jvmInfo.startTime}}</div>
          <div class="flex-1">运行时长</div>
          <div class="flex-1">{{jvmInfo.runTime}}</div>
        </div>
        <div class="flex">
          <div class="flex-1">安装路径</div>
          <div class="flex-2">{{jvmInfo.home}}</div>
          <div class="flex-1"></div>
          <div class="flex-1"></div>
        </div>
        <div class="flex">
          <div class="flex-1">项目路径</div>
          <div class="flex-2">{{sysInfo.userDir}}</div>
          <div class="flex-1"></div>
          <div class="flex-1"></div>
        </div>
      </div>
    </a-card>
  </section>
</template>
<script lang="ts">
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getServicesInfo } from '../../api/platformCheck/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
  },
  setup() {
    const state = reactive({
      loading: false,
      cpuInfo: '',
      jvmInfo: '',
      memInfo: '',
      sysInfo: '',
    });
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      const { success, body } = await getServicesInfo();
      if (success) {
        state.loading = false;
        state.cpuInfo = body.cpu;
        state.jvmInfo = body.jvm;
        state.memInfo = body.mem;
        state.sysInfo = body.sys;
      }
    }
    return {
      ...toRefs(state),
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
.inspection {
  .div-flex{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 20px 20px;
    .content {
      width: 50%;
      background-color: #ffffff;
      text-indent: 4em;
      box-shadow: 0px 0px 13px 0px
		rgba(0, 0, 0, 0.11);
      padding-bottom: 20px;
      div {
        height: 40px;
        line-height: 40px;
      }
    }
    .content:last-child {
      margin-left: 40px;
    }
    .title {
      text-indent: 2em;
      border-bottom: 1px solid #EEF0f1;
      color: #000000;
      font-size: 16px;
      font-weight: bold;
    }
    .flex {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EEF0f1;
      .flex-1{
        flex: 1;
      }
    }
  }
  .info {
    margin: 40px 20px;
    background-color: #ffffff;
    box-shadow: 0px 0px 13px 0px
		rgba(0, 0, 0, 0.11);
    padding-bottom: 20px;
    div {
      height: 40px;
      line-height: 40px;
    }
    .title {
      text-indent: 2em;
      border-bottom: 1px solid #EEF0f1;
      color: #000000;
      font-size: 16px;
      font-weight: bold;
    }
    .flex {
      display: flex;
      text-indent: 4em;
      border-bottom: 1px solid #EEF0f1;
      .flex-1 {
        flex: 1;
      }
      .flex-2 {
        flex: 2;
      }
    }
  }
}
</style>
