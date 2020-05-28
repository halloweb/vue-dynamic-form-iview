<template>
  <div class="list">
    <div class="action-box">
      <!-- <button class="btn-dark" @click="add">
        <Icon type="md-add" /> 新建
      </button>
      <button class="btn-dark" @click="batchDel">
        <Icon type="md-remove" /> 删除
      </button> -->
      <!-- <button class="btn-dark" @click="batchSave">保存</button> -->
    </div>
    <div class="table-wrap" :style="{width: model.width + 'px'}">
    <div :style="wrapStyle()">
    <table :class="{ 'no-border': value && value.length }">
      <colgroup>
        <!-- <col width="50" /> -->
        <col
          v-for="(field, index) in model.fields"
          :key="index"
          :width="field.width || colWidth[index] || 'auto'"
        />
        <col width="50" />
      </colgroup>
      <thead>
        <!-- <th>
          <Checkbox
            :indeterminate="checkAllGroup.length > 0 && !checkAll"
            :value="checkAll"
            :disabled="!value || value.length === 0"
            @click.prevent.native="handleCheckAll"
          ></Checkbox>
        </th> -->
        <th ref="th" v-for="(field, index) in model.fields" :key="index">
          <span
            style="color: #ed4014"
            v-if="field.rules && field.rules.find(v => v.required)"
            >* </span
          >{{ field.name }}
        </th>
        <th>
           <Icon type="md-add" @click="add"/>
        </th>
      </thead>
      <tbody v-if="value && value.length === 0">
        <tr>
          <td :colspan="model.fields.length + 1">暂无数据</td>
        </tr>
      </tbody>
    </table>
    <div
      class="content-wrap"
      :style="{ maxHeight: height || 300 + 'px'}"
      v-show="value && value.length"
    >
      <table>
        <colgroup>
          <!-- <col width="50" /> -->
          <col
            v-for="(field, index) in model.fields"
            :key="index"
            :width="field.width || colWidth[index] || 'auto'"
          />
          <col width="50" />
        </colgroup>
        <tbody>
          <TrItem
            ref="tr"
            v-for="(item, index) in value"
            @remove="remove(item, index)"
            :mergeWidth="mergeWidth"
            :value="item"
            :model="model"
            :key="index"
            @fieldStatusChange="fieldStatusChange"
            :checkAllGroup="checkAllGroup"
            @handleCheck="handleCheck(item, index)"
          />
        </tbody>
      </table>
    </div>
    </div>
    </div>
    <div class="error-tip" v-show="errorMessage">{{this.errorMessage}}</div>
  </div>
</template>

<script>
import TrItem from './trItem.vue'
export default {
  components: {
    TrItem
  },
  props: {
    value: Array,
    model: {},
    height: Number || String
  },
  inject: ['form'],
  data () {
    return {
      fieldStatus: {},
      thWidth: [],
      colWidth: [],
      checkAllGroup: [],
      valid: true,
      errorMessage: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (v, old) {
        if (v !== undefined && (Array.isArray(v) ? v.length !== 0 : v !== '') && old === undefined) this.initVal = v
        !v && this.form.inputValue(this.model.code, [])
      }
    }
  },
  computed: {
    checkAll () {
      return Boolean(this.value) && this.value.length !== 0 && this.checkAllGroup.length === this.value.length
    }
  },
  methods: {
    wrapStyle () {
      let sum = this.model.fields.reduce((t, v) => {
         t += (v.width || 0)
         return t
      }, 0)
      let width = sum < (this.model.fields.length + 1) * 80 ? (this.model.fields.length + 1) * 80 : sum
      let sumWidth = this.colWidth.reduce((t, v) => {
        t += v
        return t
      }, 0)
      return { minWidth: (sumWidth + 50) > width ? sumWidth + 50 : width + 'px' }
    },
    add () {
      let item = this.model.fields.reduce((t, v) => {
        t[v.code] = v.type === 'number' ? 0 : undefined
        return t
      }, {})
      this.form.inputValue(this.model.code, [...this.value, JSON.parse(JSON.stringify(item))])
    },
    remove (item, index) {
      this.value.splice(index, 1)
      this.form.inputValue(this.model.code, this.value)
    },
    setWidth (index) {
      return this.colWidth[index] || 'auto'
    },
    getThWidth () {
      this.$refs.th && this.$refs.th.forEach((v, index) => {
        this.thWidth[index] = v.offsetWidth
      })
    },
    mergeWidth (tdWidth, resize = false) {
      if (resize) this.colWidth = []
      for (var i = 0; i < tdWidth.length; i++) {
        this.colWidth[i] ? this.colWidth.splice(i, 1, Math.max(tdWidth[i], this.colWidth[i], this.thWidth[i]) || 0) : this.colWidth.push(Math.max(tdWidth[i], this.thWidth[i] || 0))
      }
    },
    handleCheckAll () {
      if (!this.checkAll) {
        this.checkAllGroup = this.value.slice(0)
      } else {
        this.checkAllGroup = []
      }
    },
    handleCheck (item, index) {
      index = this.checkAllGroup.findIndex(v => v === item) === -1 ? index : this.checkAllGroup.findIndex(v => v === item)
      this.checkAllGroup.includes(item) ? this.checkAllGroup.splice(index, 1) : this.checkAllGroup.splice(index, 0, item)
    },
    batchDel () {
      if (this.checkAllGroup.length === 0) {
        this.$Message.error('请先选择数据')
        return
      }
      this.checkAllGroup.forEach(v => {
        let index = this.value.findIndex(item => item === v)
        this.value.splice(index, 1)
      })
      this.checkAllGroup = []
      this.indeterminate = false
    },
    batchSave () {
      if (this.checkAllGroup.length === 0) {
        this.$Message.error('请先选择数据')
        return
      }
      let valiatorArr = []
      this.checkAllGroup.forEach(v => {
        let index = this.value.findIndex(item => item === v)
        valiatorArr.push(this.$refs.tr[index].validate())
      })
      this.validate(valiatorArr)
    },
    validate () {
      let valiatorArr = this.value.length ? this.$refs.tr.map(v => v.validate()) : []
      return Promise.all(valiatorArr).then(res => {
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
    fieldStatusChange ({ code, status, value }) {
       if (status === 'errorMessage' && value) {
         this.fieldStatus[code] = value
         this.errorMessage = value
       } else if (status === 'valid' && true) {
         if (this.errorMessage === this.fieldStatus[code]) {
           this.errorMessage = this.fieldStatus[code] = ''
         }
       }
    }
  },
  mounted () {
    this.getThWidth()
  }
}
</script>
<style lang="less" scoped>
.table-wrap {
  width:100%;
  overflow:auto;
}
.error-tip {
  margin-top:6px;
  color:#ed4014;
  height:12px;
  font-size:12px;
  line-height:1;
}
table {
  width: 100%;
  border-spacing: 0;
  border: 1px solid #dcdee2;
  &.no-border {
    border-bottom: 0;
  }
  th {
    height: 32px;
    line-height: 1;
    i {
     cursor: pointer;
    }
  }
  td {
    text-align: center;
    line-height: 1;
    height: 32px;
  }
  .action {
    cursor: pointer;
  }
}
.content-wrap {
  overflow: auto;
  table {
    border-top: 0px;
  }
}
</style>
