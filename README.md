[github](https://github.com/halloweb/vue-dynamic-form-iview)
## type
```
  string,
  number,
  text
  percent,
  select,
  radioGroup,
  checkbox,
  checkList
  switch
  date,
  time,
  selectStep,
  color,
  stringList,
  keyValue,
  list,
  dragValue
```
## example
```javascript
 <dynamic-form
        v-model="formData"
        :model="formModel"
        ref="form"
      ></dynamic-form>
 export default {
   data() {
     return {
        formData: {},
      formModel: {
        fields: [
          {
            code: 'emp',
            type: 'select',
            name: '评价人',
            dataList: [],
            attrs: { filterable: true, placeholder: '请选择评价人' },
            rules: [{ required: true }]
          },
          {
            code: 'appraisal_objs',
            type: 'select',
            name: '评价对象',
            dataList: [],
            attrs: { filterable: true, multiple: true, placeholder: '请选择被评价人或组织' },
            rules: [{ required: true }]
          }
        ]
      }
     }
   }
 }
```
