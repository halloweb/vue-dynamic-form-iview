import component from './component'
import schema from './schema'
export default {
  // 类型名称
  code: 'string',
  // 名称
  name: '文字',
  // 配置项描述
  schema,
  // 表单控件
  component,
  // 渲染器,支持异步方法
  render () { },
  // 设值处理器,用于格式化数据
  setter () { },
  // 类型验证器
  // {value,oldValue,data,field}
  validator () { }
}
