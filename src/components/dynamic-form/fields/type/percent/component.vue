<template>
  <div class="slider-wrap">
    <Slider
      v-model="val"
      v-bind="model.attrs"
      v-on="model.listeners || {}"
      @on-change="changeValidator"
    ></Slider>
  </div>
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
      val: Number(),
      initVal: undefined
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (v) {
        if (
          this.form.value[this.model.code] === undefined &&
          this.model.default
        ) { v = this.model.default }
        this.form.inputValue(this.code, v)
      }
    },
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && v !== 0 && old === undefined) this.initVal = v
        if (v !== undefined) this.val = v
      }
    }
  }
}
</script>

<style lang="less">
.slider-wrap {
  padding: 0 10px;
}
</style>
