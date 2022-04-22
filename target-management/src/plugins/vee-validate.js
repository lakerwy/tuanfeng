/*
 * @Author: 任继民
 * @Date: 2020-10-12 11:22:18
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-13 19:04:18
 * @Description: 校验暂时无用
 */
import Vue from 'vue'
import zh_CN from 'vee-validate/dist/locale/zh_CN.json'
import {
  localize,
  extend,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate'
import {
  email,
  max,
  min,
  numeric,
  required,
} from 'vee-validate/dist/rules'

// 默认是en，这里添加中文的lang包
localize('zh_CN', zh_CN);

extend('email', email)
extend('max', max)
extend('min', min)
extend('numeric', numeric)
extend('required', required)


/**
 * 添加规则
 */
extend('awsAccountId', (value) => {
  return /^[0-9]{12}$/.test(value) || '{_field_} 12位字符';
});

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
