<template>
  <DatePicker v-bind="model.attrs" :value="value" @on-change="handleChange"></DatePicker>
</template>
<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  props: {
    value: {}
  },
  watch: {
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && v !== '' && old === undefined) this.initVal = v
        if (this.form.value[this.model.code] === undefined) {
          this.model.default ? this.form.inputValue(this.code, this.model.default) : this.form.inputValue(this.code, '')
        }
      }
    }
  },
  methods: {
    handleChange (date) {
      this.form.inputValue(this.model.code, date)
      this.changeValidator(date)
    }
  }
}
</script>
