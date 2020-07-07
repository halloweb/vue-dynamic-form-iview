<template>
  <div id="app">
    <div id="nav">
      <dynamic-form  v-model="formData" :model="formModel"/>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/dynamic-form'
export default {
  components: {
    DynamicForm
  },
  data () {
    return {
      formData: {},
      formModel: {
        fields: [
          {
            type: 'string',
            name: 'ceshi',
            code: 'cc'
          },
          {
            type: 'select',
            name: '选择框',
            code: 'select',
            hide: false,
            dataList: [
              { name: '11', value: '11' },
              { name: '2', value: '2' }
            ],
            rules: [
              { required: true }
            ],
            listeners: {
              'on-change': this.handler
            }
          },
          {
            type: 'list',
            code: 'rule',
            name: '得分规则',
            fields: [
              {
                code: 'rule_exp',
                name: '条件(次数x)',
                type: 'string',
                attrs: { placeholder: '例0<=x<=5' }
              },
              {
                code: 'score',
                name: '分值',
                type: 'number',
                attrs: { min: 0 }
              }
            ]
          }
        ]

      }
    }
  },
  methods: {
    handler (v) {
      console.log(v)
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
