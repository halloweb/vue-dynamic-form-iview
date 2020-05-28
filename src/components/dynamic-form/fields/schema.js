export default {
  props: [{
    code: 'code'
  }, {
    code: 'name'
  }, {
    code: 'type',
    default: 'code'
  }, {
    code: 'placeholder'
  }, {
    code: 'tip'
  }, {
    code: 'show',
    default: true
  }, {
    code: 'disabled',
    default: false
  }, {
    code: 'required',
    default: false
  }, {
    code: 'validators',
    type: 'array|#validator'
  }, {
    code: 'span',
    default: 1
  }, {
    code: 'options',
    type: 'object'
  }]
}
