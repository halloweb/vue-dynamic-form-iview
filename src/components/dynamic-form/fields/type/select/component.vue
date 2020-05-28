<template>
  <Select
    v-model="val"
    :class="fieldClass"
    v-bind="{...model.attrs,...$attrs}"
    @on-change="changeValidator"
    @on-create="handleCreate"
  >
    <slot></slot>
    <template v-if="!$slots.default">
    <Option
      v-for="item in optList"
      :value="item.value"
      :key="item.value"
      >{{ item.name }}</Option
    >
    </template>
  </Select>
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
      initVal: undefined,
      optionList: []
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (v) {
        let item = (v === '' && this.model.attrs && this.model.attrs.type === 'selectMulti') ? [] : v
        if (this.form.value[this.model.code] === undefined && this.model.default) item = this.model.default
        this.form.inputValue(this.model.code, item)
      }
    },
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && (Array.isArray(v) ? v.length !== 0 : v !== '') && old === undefined) this.initVal = v
        if (v) {
          this.val = v
          if (!this.model.dataList.find(item => item.value === v)) {
             this.optionList = [{ value: v, name: v }, ...this.model.dataList]
          }
        }
      }
    }
  },
  computed: {
    optList () {
      return this.optionList.length ? this.optionList : this.model.dataList
    },
    status () {
      return this.form.fieldStatus[this.model.code]
    },
    fieldClass () {
      return {
        'field-status-unvalid': this.status && !this.status.valid
      }
    }
  },
  methods: {
    handleCreate (val) {
      this.$emit('on-create', val)
      this.optionList = [{ value: val, name: val }, ...this.model.dataList]
    }
  }
}
</script>
