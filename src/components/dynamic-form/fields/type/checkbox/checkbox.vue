<template>
  <div>
    <template v-if="model.type === 'checkbox'">
      <Checkbox v-model="val"
                v-bind="model.attrs"></Checkbox>
    </template>
    <template v-else>
      <CheckboxGroup v-model="val"
                     v-on="model.listeners || {}"
                     v-bind="model.attrs">
        <Checkbox v-for="(item,index) in model.dataList"
                  v-bind="item.attrs"
                  :key="index"
                  :label="item.value">{{item.name}}</Checkbox>
      </CheckboxGroup>
    </template>
  </div>
</template>
<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  props: {
    value: {},
    model: {}
  },
  data () {
    return {
      val: [],
      initVal: undefined
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (v) {
        let item = v === '' && this.model.type === 'checkList' ? [] : v
        if (this.form.value[this.model.code] === undefined && this.model.default) item = this.model.default
        this.form.inputValue(this.model.code, item)
      }
    },
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && (Array.isArray(v) ? v.length !== 0 : v !== '') && old === undefined) this.initVal = v
        if (v !== undefined) this.val = v
      }
    },
    model: {
      immediate: true,
      handler (v) {
        this.val = v.type === 'checkList' ? [] : ''
      }
    }
  }
}
</script>
