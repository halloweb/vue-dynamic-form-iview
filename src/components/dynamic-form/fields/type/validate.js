/**
 *
 * @class RuleValidator
 */
class RuleValidator {
  // range required pattern
  regList = {
    phone: /^1[3456789]\d{9}$/,
    email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  }

  constructor (rules, vm) {
    this.vm = vm
    this.rules = rules
    this.blurRules = []
    this.changeRules = []
    // console.log(this.rules)
    this.rules.forEach(v => {
      v.trigger === 'blur' && this.blurRules.push(v)
      v.trigger === 'change' && this.changeRules.push(v)
    })
  }

  static empty (value) {
    return value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)
  }

  commonValidator (value, model) {
    if (this.rules.length === 0) return
    this.validator(value, this.rules, model)
  }

  blurValidator (value) {
    if (this.blurRules.length === 0) return
    this.validator(value, this.blurRules)
  }

  changeValidator (value) {
    if (this.changeRules.length === 0) return
    this.validator(value, this.changeRules)
  }

  validator (value, rules, model) {
    rules.forEach(v => {
      if (v.required) {
        if (RuleValidator.empty(value)) throw new Error(`${v.message || (model.name + '不能为空')}`)
      }
      // 如果值为空下面几个规则不作校验
      if (RuleValidator.empty(value)) return
      if (v.type === 'range') {
        const size = typeof value === 'number' ? value : value.length
        if (v.max && size > v.max) throw new Error(`${v.message || ''}`)
        if (v.min && size < v.min) throw new Error(`${v.message || ''}`)
        return
      }
      if (this.regList[v.type]) {
        console.log(typeof this.regList[v.type])
        if (!this.regList[v.type].test(value)) throw new Error(`${v.message || ''}`)
        return
      }
      if (v.pattern) {
        const reg = Object.prototype.toString.call(v.pattern).includes('RegExp') ? v.pattern : new RegExp(v.pattern)
        if (!reg.test(value)) throw new Error(`${v.message || ''}`)
        return
      }
      if (v.validator) {
        if (typeof v.validator !== 'function') return
        const callback = function (res) {
          if (Object.prototype.toString.call(res).includes('Error')) throw new Error(`${res.message || v.message || ''}`)
        }
        /**
         * 自定义的validator包含参数
         * formData:此表单所有字段数据、vm:当前control组件实例、value:当前字段值、
         * rule:本条校验规则对象、callback:回调函数
         * callback(new Error('错误信息'))
         */
        const obj = { formData: this.vm.form.value, vm: this.vm, value: value, rule: v, callback: callback }
        v.validator(obj)
      }
    })
  }
}
export default {
  inject: ['form'],
  props: {
    model: { type: Object, default: () => {} }
  },
  data () {
    return {
      validInstance: null,
      initVal: undefined

    }
  },
  computed: {
    code () {
      return this.model.code
    },
    status () {
      return this.form.fieldStatus[this.code]
    }
  },
  watch: {
    model: {
      handler (v) {
        if (v && v.rules && v.rules.length > 0) this.validInstance = new RuleValidator(v.rules, this)
      },
      immediate: true
    }
  },
  methods: {
    validate () {
      return new Promise(resolve => {
        if (this.validInstance === null) {
          resolve({ valid: true })
          return
        }
        try {
          this.validInstance.commonValidator(this.value, this.model)
          this.status && !this.status.valid && this.form.setFieldStatus(this.model.code, 'valid', true)
          resolve({ valid: true })
        } catch (err) {
          this.form.setFieldStatus(this.model.code, 'valid', false)
          this.form.setFieldStatus(this.model.code, 'errorMessage', `${err.message}`)
          resolve({ valid: false, message: `${err.message}` })
        }
      })
    },
    blurValidator () {
      this.$emit('on-blur')
      if (this.validInstance === null) return
      try {
        this.validInstance.blurValidator(this.value, this.model)
        this.status && !this.status.valid && this.form.setFieldStatus(this.model.code, 'valid', true)
      } catch (err) {
        this.form.setFieldStatus(this.model.code, 'valid', false)
        this.form.setFieldStatus(this.model.code, 'errorMessage', `${err.message}`)
      }
    },
    changeValidator (value) {
      this.$emit('on-change', value)
      if (this.validInstance === null) return
      try {
        this.validInstance.changeValidator(value)
        this.status && !this.status.valid && this.form.setFieldStatus(this.model.code, 'valid', true)
      } catch (err) {
        this.form.setFieldStatus(this.model.code, 'valid', false)
        this.form.setFieldStatus(this.model.code, 'errorMessage', `${err.message}`)
      }
    },
    reset () {
      const dictionary = { Number: null, String: '', Boolean: null, Array: [], Undefined: undefined, Null: null }
      const type = Object.prototype.toString.call(this.form.value[this.model.code])
      let value = dictionary[type.substring(8, type.length - 1)]
      if (this.model.default) value = this.model.default
      if (this.initVal !== undefined) value = this.initVal
      this.status && !this.status.valid && this.form.setFieldStatus(this.model.code, 'valid', true)
      this.form.inputValue(this.model.code, value)
      // if(this.$options.name === 'fileUpload') {
      //   this.$refs.upload.clearFiles()
      // }
    }
  }
}
