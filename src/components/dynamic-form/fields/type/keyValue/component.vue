<template>
  <div>
    <Icon type="md-add" size="16" @click="add"/>
    <div v-for="(v,key,index) in val" :key="index" class="keyValue-item">
      <Input placeholder="请输入key" @input="setKey($event,key,index)" :value="key"/>
      <div class="splitter">:</div>
      <Input placeholder="请输入value" :value="v" @input="setValue(key,$event)"/>
      <Icon type="md-remove" size="16" @click="remove(key)"/>
  </div>
  </div>
</template>
<script>
import validate from '../validate.js'
export default {
  extends: validate,
  inject: ['form'],
  props: {
    value: Object
  },
  data () {
    return {
      val: {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (v, old) {
        if (v !== undefined && v !== {} && old === undefined) this.initVal = v
        if (this.form.value[this.model.code] === undefined) {
          this.model.default ? this.form.inputValue(this.code, this.model.default) : this.form.inputValue(this.code, {})
        } else {
          this.val = { ...this.val, ...v }
        }
      }
    }
  },
  methods: {
    add () {
      this.val = { ...this.val, '': '' }
    },
    setKey (newKey, key, index) {
      const keys = Object.keys(this.val)
      if (!keys.includes(newKey)) keys[index] = newKey
      const newVal = {}
      keys.forEach(v => {
        newVal[v] = this.val[v] === undefined ? this.val[key] : this.val[v]
      })
      this.val = newVal
      this.updateVal()
    },
    updateVal () {
      const validVal = {}
      Object.keys(this.val).forEach(v => {
        if (v) validVal[v] = this.val[v]
      })
      this.form.inputValue(this.code, validVal)
    },
    setValue (key, v) {
      this.val[key] = v
      key && this.form.inputValue(this.code, this.val)
    },
    remove (key) {
      this.$delete(this.val, key)
      this.updateVal()
    }
  }
}
</script>

<style lang="less" scoped>
 i {
   cursor: pointer;
 }
 .keyValue-item {
   display:flex;
   margin:10px 0;
   align-items: center;
   .splitter {
     padding:0 10px;
   }
 }
</style>
