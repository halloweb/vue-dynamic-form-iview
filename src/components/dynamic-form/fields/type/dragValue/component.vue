<template>
  <div>
  <button v-show="!val && !setting" @click="setData" class="btn-dark">配置数据</button>
  <div
    v-show="val || setting"
    :class="fieldClass"
    @dragenter="dragenter = true"
    @dragleave="dragleave = false"
    @dragover.prevent
    @drop="drop"
  >
    <div :class="['drag-value-content',{'fill': value}]">
      {{val || placeholder}}
    </div>
    <span v-show="val" @click="remove"><Icon type="md-close" /></span>
  </div>
  </div>
</template>

<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form', 'root'],
  props: {
    value: {}
  },
  data () {
    return {
      val: '',
      initVal: undefined,
      dragenter: false,
      setting: false
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (v) {
        if (this.form.value[this.model.code] === undefined && this.model.default) v = this.model.default
        v && this.form.inputValue(this.code, v)
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
    placeholder () {
      return (this.model.attrs && this.model.attrs.placeholder) || ''
    },
    code () {
      return this.model.code
    },
    status () {
      return this.form.fieldStatus[this.code]
    },
    fieldClass () {
      return {
        'field-status-unvalid': this.status && !this.status.valid,
        'drag-value': true,
        'dragenter': this.dragenter
      }
    }
  },
  methods: {
    drop (e) {
      console.log(e)
      let value = e.dataTransfer.getData('text')
      try {
        let val = JSON.parse(value).key
        val && this.form.inputValue(this.code, val)
      } catch (error) {
        console.log(error)
        this.dragenter = false
      }
      e.preventDefault()
      e.stopPropagation()
    },
    setData () {
      console.log('aa')
      this.setting = true
      this.root.confDataSource()
    },
    remove () {
      this.form.inputValue(this.code, '')
      this.setting = false
    }
  }
}
</script>
<style lang="less" scoped>
.drag-value {
  min-height: 32px;
  border: 1px dashed #333;
  background: transparent;
  display: flex;
  align-items: center;
  padding:5px;
  line-height:1;
  &.field-status-unvalid {
    border-color:#ed4014;
  }
  .drag-value-content {
    flex:1;
    text-align: center;
    padding:5px;
    &.fill {
      background-color: #19a7ff;
      color: #fff;
    }
  }
  i {
    font-size:14px;
  }
  &.dragenter {
    border-color: #19a7ff;
  }
}
</style>
