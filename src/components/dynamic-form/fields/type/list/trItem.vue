<template>
      <tr>
        <!-- <td>
          <Checkbox
            :value="checkAllGroup.includes(value)"
            @click.prevent.native="$emit('handleCheck')"
          ></Checkbox>
        </td> -->
        <td ref="td" v-for="field in model.fields" :key="field.code">
          <span v-if="field.disabled">{{value[field.code]}}</span>
          <component
            v-else
            :value="value[field.code]"
            ref="field"
            :model="aboutSize(field)"
            :is="fieldControl(field)"
          ></component>
        </td>
        <td><Icon type="md-close"  @click="remove"/></td>
      </tr>
</template>

<script>
import Field from '@/components/dynamic-form/fields/type'
export default {
  props: {
    model: {},
    value: {},
    mergeWidth: Function,
    checkAllGroup: Array
  },
  provide () {
    return {
      form: this
    }
  },
  data () {
    return {
      fieldStatus: {},
      valid: true,
      errorMessage: null,
      tdWidth: []
    }
  },
  computed: {
    fieldMap () {
      const map = {}
      for (const field of this.model.fields || []) {
        map[field.code] = field
      }
      return map
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (v) {
        if (v === undefined) {
          this.$emit('input', {})
        } else {
          this.$nextTick(() => {
            this.getTdWidth()
          })
        }
      }
    }
  },
  methods: {
    fieldControl (field) {
      const type = field.type || 'string'
      if (Field[type]) return Field[type].component
      else console.warn(`没有${type}类型的表单控件,请换一个类型或检查type是否拼写错误`)
    },
    validate () {
      return Promise.all(
        this.$refs.field
          .filter(field => field.validate)
          .map(field => field.validate())
      ).then(res => {
        this.valid = true
        this.errorMessage = null
        res.forEach(({ valid, message }) => {
          if (!valid) {
            this.valid = false
            if (message && !this.errorMessage) {
              this.errorMessage = message
            }
          }
        })
        return {
          valid: this.valid,
          message: this.errorMessage,
          data: this.value
        }
      })
    },
    inputValue (code, value) {
      const oldValue = this.value[code]
      this.$emit('fieldInput', {
        code,
        value,
        oldValue
      })
      this.setValue(code, value)
      // this.valid(code);
    },
    setValue (code, value) {
      if (code) {
        const oldValue = this.value[code]
        if (value !== oldValue) {
          this.$set(this.value, code, value)
          this.$emit('fieldChange', {
            code,
            value: this.value[code],
            oldValue
          })
        }
      } else if (code === undefined) {
        const oldValue = this.value
        if (value !== oldValue) {
          this.$emit('input', value)
        }
      }
    },
    setFieldStatus (code, statusCode, value) {
      if (!this.fieldStatus[code]) {
        this.initFiedStatus(code)
      }
      this.$set(this.fieldStatus[code], statusCode, value)
      if (statusCode === 'errorMessage' && !this.fieldStatus[code].valid) {
        this.errorMessage = value
      }
      this.$emit('fieldStatusChange', {
        code: code,
        status: statusCode,
        value: value
      })
    },
    initFiedStatus (code) {
      const field = this.fieldMap[code]
      let status = {}
      if (field) {
        status = {
          disbaled: field.disbaled === true,
          enable: field.disbaled !== true,
          show: field.show !== false,
          pure: true,
          dirty: false,
          valid: true,
          error: [],
          errorMessage: null,
          tip: field.tip,
          tooltip: field.tooltip,
          placeholder: field.placeholder,
          validators: []
        }
      }
      this.$set(this.fieldStatus, code, status)
    },
    setData (value = {}) {
      for (const code in value) {
        this.setValue(code, value[code])
      }
      for (const code in this.value) {
        if (value[code] === undefined) {
          this.setValue(code, null)
          delete this.value[code]
        }
      }
    },
    reset () {
      this.$refs.field.forEach(field => {
        field.reset && field.reset()
      })
    },
    remove () {
      this.$emit('remove')
    },
    getTdWidth () {
      this.$refs.td && this.$refs.td.forEach((v, index) => {
        if (v.offsetWidth) this.tdWidth[index] = v.offsetWidth
      })
      this.tdWidth.length && this.mergeWidth(this.tdWidth)
    },
    aboutSize (field) {
      if (this.model.attrs && this.model.attrs.size !== undefined) {
        if (field.attrs) {
          field.attrs.size = this.model.attrs.size
        } else {
          field.attrs = { size: this.model.attrs.size }
        }
      }
      return field
    }
  },
  mounted () {
    this.getTdWidth()
    window.addEventListener('resize', () => { this.mergeWidth(this.tdWidth, true) })
  }
}
</script>

<style lang="less" scoped>
table {
  width:100%;
}
td {
   text-align:center;
   line-height:1;
   padding:1px;
   height:32px;
   i {
     cursor: pointer;
   }
}
</style>
