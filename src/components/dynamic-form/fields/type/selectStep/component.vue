<template>
  <Cascader v-bind="model.attrs" :data="model.dataList" v-on="model.listeners || {}" v-model="val" @on-change="changeValidator"></Cascader>
</template>
<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  props: {
    value: Array
  },
  data () {
    return {
      val: [],
      initVal: undefined
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && v.length > 0 && old === undefined) this.initVal = v
        v === undefined && this.form.inputValue(this.model.code, [])
      }
    },
    val: {
      immediate: true,
      handler (v) {
        if (this.form.value[this.model.code] === undefined && this.model.default) v = this.model.default
        this.form.inputValue(this.model.code, v)
      }
    }
  }
}
</script>
