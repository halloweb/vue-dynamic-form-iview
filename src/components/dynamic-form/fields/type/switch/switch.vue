<template>
  <i-switch v-on="model.listeners || {}" v-model="val" />
</template>
<script>
export default {
  inject: ['form'],
  props: {
    value: Boolean,
    model: {}
  },
  data () {
    return {
      val: false,
      initVal: undefined
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (v) {
        if (this.form.value[this.model.code] === undefined && this.model.default) v = this.model.default
        this.form.inputValue(this.model.code, v)
      }
    },
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && v && old === undefined) this.initVal = v
        if (v !== undefined) this.val = v
      }
    }
  }
}
</script>
