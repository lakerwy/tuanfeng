<template>
  <div>
    <global-modal
      title="规划年份配置"
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
        <a-form-model-item label="基期年" prop="year">
          <a-input placeholder="请输入基期年" v-model="form.year" />
        </a-form-model-item>
        <a-form-model-item label="近期目标年" prop="recent">
          <a-input placeholder="请输入近期目标年" v-model="form.recent" />
        </a-form-model-item>
        <a-form-model-item label="规划目标年" prop="plan">
          <a-input placeholder="请输入规划目标年" v-model="form.plan"></a-input>
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
  props: ["form"],
  data() {
    return {
      visible: false,
      confirmLoading: false
    };
  },
  methods: {
    handleOk(e) {
      
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel(e) {
      this.$refs.form.resetFields();
      this.visible = false;
    }
  }
};
</script>
