<template>
  <Input
    :class="fieldClass"
    :value="value"
    v-bind="model.attrs"
    v-on="model.listeners || {}"
    @input="input"
    @on-blur="blurValidator"
    :autosize="true"
    :type="model.type === 'text' ? 'textarea' : 'text'"
  />
</template>

<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  data () {
    return {
      initVal: undefined
    }
  },
  props: {
    value: {}
  },
  watch: {
    value: {
      immediate: true,
      handler: function (v, old) {
        if (v !== undefined && v !== '' && old === undefined) this.initVal = v
        if (this.form.value[this.model.code] === undefined) {
          this.model.default
            ? this.form.inputValue(this.code, this.model.default)
            : this.form.inputValue(this.code, '')
        }
      }
    }
  },
  computed: {
    fieldClass () {
      return {
        'field-status-valid': this.status.valid,
        'field-status-disabled': this.status.disabled,
        'field-status-unvalid': !this.status.valid,
        'field-status-empty': this.status.empty,
        'field-status-view': this.status.view
      }
    }
  },
  methods: {
    input (value) {
      this.form.inputValue(this.code, value)
    }
  },
  created () {
    this.form.setFieldStatus(this.model.code, 'control', this)
  }
}
</script>
