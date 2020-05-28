<template>
  <div :class="classes">
    <div
      v-for="field of model.fields"
      :key="field.code"
      :class="fieldClass(field)"
      :style="formItemStyles(field.span)"
    >
      <template
        v-if="
          value !== undefined &&
            !['objStruct', 'arrStruct', 'form'].includes(field.type)
        "
      >
        <div v-show="field.name" ref='formLabel' :class="['form-label',{'form-label-group':field.type === 'group'}]" :style="labelStyles">
          {{ field.name }}
        </div>
        <div v-if="field.type !== 'group'" class="form-control">
          <component
            v-model="value[field.code]"
            ref="field"
            :model="field"
            :is="fieldControl(field)"
          ></component>
          <div v-if="field.tip" class="form-item-tip">{{ field.tip }}</div>
          <div
            v-if="fieldStatus[field.code] && !fieldStatus[field.code].valid"
            class="form-error-message"
          >
            {{ fieldStatus[field.code].errorMessage }}
          </div>
        </div>
      </template>
      <template
        v-if="
          value !== undefined &&
            (field.type === 'objStruct' || field.type === 'form')
        "
      >
        <div
          v-show="field.name"
          :class="['form-label', { close: !groupState[field.code] }]"
          ref='formLabel'
          :style="labelStyles"
        >
          {{ field.name
          }}<Icon
            @click="toggleState(field.code)"
            size="16"
            type="ios-arrow-down"
          />
        </div>
        <CollapseTransition>
          <div v-show="groupState[field.code]" class="dynamic-form-group">
            <dynamicForm
              :label-width="
                (field.attrs && field.attrs.labelWidth) || labelWidth
              "
              :label-position="
                (field.attrs && field.attrs.labelPosition) || labelPosition
              "
              v-bind="field.attrs"
              ref="field"
              v-model="value[field.code]"
              :model="field.children"
            ></dynamicForm>
          </div>
        </CollapseTransition>
      </template>
      <template
        v-if="
          value !== undefined &&
            field.type === 'arrStruct' &&
            setArr(field.code)
        "
      >
        <div
          v-show="field.name"
          :class="['form-label', { close: !groupState[field.code] }]"
          ref='formLabel'
          :style="labelStyles"
        >
          {{ field.name
          }}<Icon
            @click="toggleState(field.code)"
            size="16"
            type="ios-arrow-down"
          />
        </div>
        <CollapseTransition>
          <div v-show="groupState[field.code]" class="dynamic-form-group-list">
            <div
              v-for="(item, index) in Array.isArray(field.children)
                ? field.children
                : value[field.code]"
              :key="index"
              class="dynamic-form-group"
            >
              <div v-if="!Array.isArray(field.children)">
                <Icon
                  type="md-add"
                  size="16"
                  @click="addChild(index, field.code)"
                />
                <Icon
                  type="md-remove"
                  size="16"
                  v-show="value[field.code].length > 1"
                  @click="removeChild(index, field.code)"
                />
              </div>
              <dynamicForm
                :label-width="
                  (field.attrs && field.attrs.labelWidth) || labelWidth
                "
                :label-position="
                  (field.attrs && field.attrs.labelPosition) || labelPosition
                "
                v-bind="field.attrs"
                ref="field"
                type="arrStruct"
                v-model="value[field.code][index]"
                :model="arrStructModel(field.children, index)"
              ></dynamicForm>
            </div>
          </div>
        </CollapseTransition>
      </template>
    </div>
  </div>
</template>

<script>
import CollapseTransition from '../collapse-transition'
import Field from './fields/type'
export default {
  components: {
    CollapseTransition
  },
  provide () {
    return {
      form: this,
      root: this
    }
  },
  name: 'dynamicForm',
  props: {
    model: Object,
    value: {},
    labelWidth: {
      type: [Number, String]
    },
    labelPosition: {
      validator (value) {
        return ['left', 'right', 'top'].includes(value)
      },
      default: 'right'
    },
    inline: {
      type: [Number, String],
      validator (value) {
        return ['', '1', '2', '3', '4', 1, 2, 3, 4].includes(value)
      }
    }
  },
  data () {
    return {
      status: {
        view: false,
        valid: false
      },
      fieldStatus: {},
      valid: true,
      errorMessage: null,
      groupState: {},
      labelMaxWidth: 0
    }
  },
  computed: {
    fieldMap () {
      const map = {}
      for (const field of this.model.fields || []) {
        map[field.code] = field
      }
      return map
    },
    classes () {
      return [
        'dynamic-form',
        `form-label-${this.labelPosition}`,
        {
          'dynamic-form-inline': ['', '1', '2', '3', '4', 1, 2, 3, 4].includes(
            this.inline
          )
        }
      ]
    },
    labelStyles () {
      const style = {}
      if (this.labelWidth || this.labelMaxWidth) {
        style.width = `${this.labelWidth || this.labelMaxWidth}px`
      }
      return style
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (v) {
        if (v === undefined) {
          this.$emit('input', {})
        }
      }
    },
    model: {
      immediate: true,
      handler (v) {
        if (v.fields) {
          v.fields.forEach(val => {
            ['objStruct', 'arrStruct', 'form'].includes(val.type) &&
              this.$set(this.groupState, val.code, true)
          })
        }
      }
    }
  },
  methods: {
    // proxyField (field) {
    //     if (field.listeners) {
    //        Object.keys(field.listeners).forEach(v => { field.listeners[v] = this.aboutListeners(field.listeners[v], field.code) })
    //     }
    //     return field
    // },
    // aboutListeners (fn, code) {
    //    return (e) => {
    //      fn(e)
    //      this.$emit('eventTrigger', { code, e })
    //    }
    // },
    formItemStyles (span) {
      const style = {}
      if (this.inline !== undefined) {
        const fpx = span
          ? (1 / Number(this.inline)) * span * 100
          : (1 / Number(this.inline)) * 100
        style.flexBasis = `${fpx}%`
        style.margin = '11px 0'
        if (this.labelPosition === 'top') style.padding = '0 10px'
      }
      return style
    },
    fieldControl (field) {
      const type = field.type || 'string'
      if (Field[type]) return Field[type].component
      else {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            `没有${type}类型的表单控件,请换一个类型或检查type是否拼写错误`
          )
      }
    },
    fieldClass (field) {
      const res = {
        'form-item': true,
        ['field-type-' + field.type]: true,
        'form-item-required': field.rules && field.rules.find(v => v.required)
      }
      return res
    },
    fieldStyle (field) {
      const res = {}
      if (field.span) {
        res.flex = field.span
      }
      return res
    },
    validate (list) {
      return Promise.all(
        this.$refs.field
          .filter(field => {
            return list ? (field.model && list.includes(field.model.code) && field.validate) : field.validate
          })
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
      const oldValue = this.fieldStatus[code][statusCode]
      this.$set(this.fieldStatus[code], statusCode, value)
      this.$emit('fieldStatusChange', {
        code: code,
        status: statusCode,
        value: value,
        oldValue: oldValue,
        control: this
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
    patchData (value) {
      for (const code in value) {
        this.setValue(code, value[code])
      }
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
    setArr (code) {
      if (code && !this.value[code]) {
        this.$set(this.value, code, [{}])
        return true
      } else {
        return true
      }
    },
    arrStructModel (model, index) {
      return Array.isArray(model) ? model[index] : model
    },
    addChild (index, code) {
      const item = JSON.parse(JSON.stringify(this.value[code][index]))
      this.value[code].push(item)
    },
    removeChild (index, code) {
      this.value[code].splice(index, 1)
    },
    toggleState (code) {
      this.groupState[code] = !this.groupState[code]
    },
    reset () {
      this.$refs.field.forEach(field => {
        field.reset && field.reset()
      })
    },
    // dragValue组件触发数据配置调用
    confDataSource () {
      this.$emit('confDataSource', true)
    },
    updateLabelWidth () {
      if (this.$refs.formLabel) {
        this.labelMaxWidth = Math.max(...this.$refs.formLabel.map(v => v.offsetWidth)) + 6
      }
    }
  },
  mounted () {
    this.updateLabelWidth()
  }
}
</script>
<style lang="less">
@import './style/index.less';
</style>
