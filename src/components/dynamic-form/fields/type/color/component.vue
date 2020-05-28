<template>
 <ColorPicker v-model="val"
   :class="fieldClass"
    v-bind="model.attrs"
    @on-change="changeValidator"/>
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
  watch: {
    val: {
      immediate: true,
      handler (v) {
        if (this.form.value[this.model.code] === undefined && this.model.default) v = this.model.default
        this.form.inputValue(this.code, v)
      }
    },
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && v !== '' && old === undefined) this.initVal = v
        if (v !== undefined) this.val = v
      }
    }
  },
  computed: {
    code () {
      return this.model.code
    },
    status () {
      return this.form.fieldStatus[this.code]
    },
    fieldClass () {
      return {
        'field-status-unvalid': this.status && !this.status.valid
      }
    }
  }
}
</script>
