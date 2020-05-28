<template>
    <span v-if="model.attrs && model.attrs.disabled">{{selected ? selected['name'] : value}}</span>
    <RadioGroup v-else v-model="val" v-bind="model.attrs">
      <Radio v-for="(item,index) in model.dataList" v-bind="item.attrs" :key="index" :label=" typeof item.value === 'boolean'? item.value.toString():item.value">{{item.name}}</Radio>
    </RadioGroup>
</template>
<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  props: {
    value: {}
  },
  data () {
    return {
      val: '',
      initVal: undefined
    }
  },
  computed: {
    selected () {
      return this.model.dataList.find(v => v.value === this.value)
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (v) {
        v = ['true', 'false'].includes(v) ? v === 'true' : v
        if (this.form.value[this.model.code] === undefined && this.model.default !== undefined) v = this.model.default
        this.form.inputValue(this.code, v)
      }
    },
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && v !== '' && old === undefined) this.initVal = v
        if (v !== undefined) this.val = typeof v === 'boolean' ? v.toString() : v
      }
    }
  }
}
</script>
