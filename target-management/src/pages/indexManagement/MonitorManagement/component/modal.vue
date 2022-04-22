<template>
  <div>
    <global-modal
      title="监测值管理"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="40%"
    >
      <a-form-model
        ref="form"
        :model="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        slot="modalBody"
      >
        <a-form-model-item label="行政区" prop="nation">
          <a-input placeholder="请输入行政区" v-model="form.nation" />
        </a-form-model-item>
        <a-form-model-item label="指标名称" prop="name">
          <a-input placeholder="请输入指标名称" v-model="form.name" disabled />
        </a-form-model-item>
        <a-form-model-item label="周期" prop="cycle">
          <a-input placeholder="请输入周期" v-model="form.cycle" />
        </a-form-model-item>
        <a-form-model-item label="监测时间段" prop="period">
          <a-input
            placeholder="请输入监测时间段"
            v-model="form.period"
          />
        </a-form-model-item>
        <a-form-model-item label="定期监测时间" prop="time">
          <a-input
            placeholder="请输入定期监测时间"
            v-model="form.time"
          />
        </a-form-model-item>
        <a-form-model-item label="监测时间段" prop="period">
          <a-input
            placeholder="请输入监测时间段"
            v-model="form.period"
          />
        </a-form-model-item>
        <a-form-model-item label="监测值" prop="value">
          <a-input
            placeholder="请输入监测值"
            v-model="form.value"
          />
        </a-form-model-item>
        <a-form-model-item label="单位" prop="unit">
          <a-input
            placeholder="请输入单位"
            v-model="form.unit"
          />
        </a-form-model-item>
        <a-form-model-item label="更新时间" prop="date">
          <a-input
            placeholder="请输入更新时间"
            v-model="form.date"
          />
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal"
export default {
  components: {
			globalModal
		},
  props:['form'],
  data() {
    return {
      visible: false,
      confirmLoading: false
    };
  },
  methods: {
    handleOk() {
      
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel() {
      this.$refs.form.resetFields()
      this.visible = false;
    }
  }
};
</script>