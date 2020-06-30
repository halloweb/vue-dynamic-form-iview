<template>
  <Input
    :class="fieldClass"
    :value="val"
    v-bind="model.attrs"
    v-on="model.listeners || {}"
    @input="input"
    @on-blur="blurValidator"
  />
</template>

<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  data () {
    return {
      val: ''
    }
  },
  props: {
    value: Array
  },
  watch: {
    value: {
      immediate: true,
      handler: function (v, old) {
        if (v !== undefined && v !== '' && old === undefined) this.initVal = v
        if (this.form.value[this.model.code] === undefined) {
          this.model.default ? this.form.inputValue(this.code, this.model.default) : this.form.inputValue(this.code, [])
        } else {
          this.val = this.value.join(`${this.model.splitter || ','}`)
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
    input (v) {
      if (v) {
        const item = v.split(`${this.model.splitter || ','}`).filter(Boolean)
        this.form.inputValue(this.code, item)
      } else {
        this.form.inputValue(this.code, [])
      }
    }
  },
  created () {
    this.form.setFieldStatus(this.model.code, 'control', this)
  }
}
</script>
